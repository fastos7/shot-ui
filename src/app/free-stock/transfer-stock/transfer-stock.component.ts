import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../common/app.constants';
import { UserService } from '../../common/services/user.service';
import { Patient } from '../../common/model/patient.model';

@Component({
  selector: 'app-transfer-stock',
  templateUrl: './transfer-stock.component.html',
  styleUrls: ['./transfer-stock.component.scss']
})
export class TransferStockComponent implements OnInit {
  
  private transferForm: FormGroup;

  private customerKey:string;

  private headerTitle:string;

  /* Possible values : TRANSFER_IN or TRANSFER_OUT */
  private mode:string;

  private patientFrom:String;
  private qtyFrom:number;

  private patientTo:String;
  private qtyTo:number;

  private selectedPatientFrom:Patient =  new Patient(null, '', null, null);
  private selectedPatientTo:Patient  = new Patient(null, '', null, null);

  private fromPoolOrPatient:string = "Pool";
  /*
	 * Form errors container
	 */
	formErrors = {                
    "patientFrom"   : "",
    "quantityFrom"  : "",
    "patientTo"     : "",
    "quantityTo"    : "",
    "comments"      : ""  
  };

  /*
  * Validation error messages
  */
  validationMessages = {                                                      
          'patientFrom'   : {},
          'quantityFrom'  : {},
          'patientTo'     : {},
          'quantityTo'    : {},
          'comments'      : {}
  };

  constructor(private bsModalRef: BsModalRef,
              private formBuilder: FormBuilder,
              private userService: UserService) { }

  ngOnInit() {

    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;

    this.buildForm();
    this.initFields();
  }

  buildForm() {
    this.transferForm = this.formBuilder.group({      
      'patientFrom'         : [{value : '',disabled: (this.mode == Constants.FREE_STOCK_TRASFER_OUT)},
                               [Validators.required]],               
      'quantityFrom'        : [{value : '',disabled: (this.mode == Constants.FREE_STOCK_TRASFER_OUT)},
                               [Validators.required]],                                            
      'patientTo'           : [{value : '',disabled: (this.mode == Constants.FREE_STOCK_TRASFER_IN)},
                               [Validators.required]],
      'quantityTo'          : [{value : '',disabled: (this.mode == Constants.FREE_STOCK_TRASFER_IN)},
                               [Validators.required]],                                                                                        
      'comments'            : [{value : '',disabled: false},
                               [Validators.required]],                                                                                                                                    
    });

    /* Listen to any changes in the form constrols */
    this.transferForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

   /**
	 * This method will be called if any of the controls were modified and will 
   * add error messages in the form errors container.
	 * @param any 
	 */
	onValueChanged(data?: any) {
	
		if (!this.transferForm) { return; }

		const form = this.transferForm;

		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
				}
			}
		}			
  }

  initFields() {

    if (this.mode == Constants.FREE_STOCK_TRASFER_IN) {

      this.headerTitle = "Transfer In";

      this.transferForm.get("patientFrom").setValue("");
      this.transferForm.get("quantityFrom").setValue("");

      this.transferForm.get("patientTo").setValue(this.patientTo);
      this.transferForm.get("quantityTo").setValue(this.qtyTo);

    } else {
      
      this.headerTitle = "Transfer Out";

      this.transferForm.get("patientFrom").setValue(this.patientFrom);
      this.transferForm.get("quantityFrom").setValue(this.qtyFrom);

      this.transferForm.get("patientTo").setValue("");
      this.transferForm.get("quantityTo").setValue("");

    }
  }

  cancel() {
    this.bsModalRef.hide();
  }

  transfer() {
    this.bsModalRef.hide();
  }

  onPatientFromSelected(patient: Patient) {

  }

  onPatientToSelected(patient: Patient) {

  }

  onPoolOrPatientSwitchClicked(value:string) {
    this.fromPoolOrPatient = value;
  }
}
