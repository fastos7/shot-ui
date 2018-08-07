import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { Patient } from '../../common/model/patient.model';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/model/user.model';
import * as moment from 'moment';
import { PatientManagementService } from '../../common/services/patient-management.service';
import { AlertService } from '../../core/services/alert.service';
import { Subscription } from 'rxjs';
import { APIError } from '../../common/model/apiError.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
  /*
   * These providers are used by the datepicker input to
   * display the date in DD/MM/YYYY format. This is just local to
   * this component and will not affect others.
   */
  providers : [{provide: MAT_DATE_LOCALE, useValue: 'en-AU'},
               {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
               {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})
export class AddPatientComponent implements OnInit {

  addView: any;
  displayMessage: string;

  addPatientForm: FormGroup;

  patientToAdd: Patient;

  private addPatientSubscription: Subscription;

  addedPatients: Array<Patient> = [];

  private maximumDate: Date = new Date();

  private isAddModeModal: boolean = false;

    /*
   * Output event to inform the  add patient modal that the
   * patient has been added successfully.
   */
  @Output('onAddSuccessForParent') onAddSuccessForParent = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private eventBusService: EventBusService,
              private userService: UserService,
              private patientManagementService: PatientManagementService,
              private alertService: AlertService ) { }

  /*
	 * Form errors container
	 */
  formErrors = {
    'addPatSurName' : '',
    'addPatFirstName' : '',
    'addPatUr' : '',
    'addPatDob' : '',
    'addPatStatus' : '',
    'addPatTrialID' : ''
  };

  isValid = true;

/*
* Validation error messages
*/
validationMessages = {
          'addPatSurName': {
            'pattern'   : 'Invalid value for Surname, Surname can only be alphabets and/or numbers.'
          },
          'addPatFirstName': {
            'pattern'   : 'Invalid value for first name, first name can only be alphabets and/or numbers.'
          },
          'addPatUr': {
            'pattern'   : 'Invalid value for MRN / UR number, MRN / UR number can only be alphabets and/or numbers.'
          },
          'addPatDob': {
            'pattern'   : 'Invalid value for date of birth, date of birth should be before today.'
          },
          'addPatStatus': {
            'required'  : 'Status is required. Please select a value.'
          },
          'addPatTrialID': {
            'pattern'   : 'Invalid value for trail Id, trail Id can only be aplabets and/or numbers.'
          },
        };

  ngOnInit() {
    this.buildForm();
    this.displayMessage = Constants.PM_ADD_PATIENT_MESSAGE;
    this.addView = Constants.PM_ADD_VIEW;
    /* Register Event Listener */
    this.eventBusService.on(Constants.PM_PATIENT_UPDATE_SUCCESS_ADD, (args) => {
      this.onEditSuccess(args);
    });

    this.eventBusService.on(Constants.PM_TABS_TAB_CHANGED_ADD_PATIENT, () => {
      this.resetAddPatient();
    });
  }

  inputKeyUpHandler(evt) {
    if (null !== this.addPatientForm.controls['addPatFirstName'].value
          && this.addPatientForm.controls['addPatFirstName'].value.trim() === '') {
      this.addPatientForm.controls['addPatFirstName'].setValue(this.addPatientForm.controls['addPatFirstName'].value.trim());
    }
    if (null !== this.addPatientForm.controls['addPatSurName'].value
          && this.addPatientForm.controls['addPatSurName'].value.trim() === '') {
      this.addPatientForm.controls['addPatSurName'].setValue(this.addPatientForm.controls['addPatSurName'].value.trim());
    }
    if (null !== this.addPatientForm.controls['addPatUr'].value
          && this.addPatientForm.controls['addPatUr'].value.trim() === '') {
      this.addPatientForm.controls['addPatUr'].setValue(this.addPatientForm.controls['addPatUr'].value.trim());
    }
    if ((null ===  this.addPatientForm.controls['addPatFirstName'].value
          || this.addPatientForm.controls['addPatFirstName'].value === '')
        && (null ===  this.addPatientForm.controls['addPatSurName'].value
        || this.addPatientForm.controls['addPatSurName'].value === '')
        && (null ===  this.addPatientForm.controls['addPatUr'].value
        || this.addPatientForm.controls['addPatUr'].value === '')) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  onSubmit() {
    if ((this.addPatientForm.controls['addPatSurName'].value === ''
        || this.addPatientForm.controls['addPatSurName'].value === null)
      && (this.addPatientForm.controls['addPatFirstName'].value === ''
        || this.addPatientForm.controls['addPatFirstName'].value === null)
      && (this.addPatientForm.controls['addPatUr'].value === ''
        || this.addPatientForm.controls['addPatUr'].value === null)) {

      this.isValid = false;
    } else {
      this.isValid = true;
    }
    if (this.isValid && this.addPatientForm.valid) {
      // Show loading
      this.eventBusService.broadcast(Constants.SHOW_LOADING);

      const datePipe: DatePipe = new DatePipe('en_AU');
      const user: User = this.userService.getCurrentUser();
      const customerKey = user.selectedUserAuthority.customerKey;

      this.patientToAdd = new Patient( '' , '' , '' , '' );

      this.patientToAdd.customerKey = customerKey;
      if (null != this.addPatientForm.controls['addPatSurName'].value) {
        this.patientToAdd.surName = this.addPatientForm.controls['addPatSurName'].value.trim();
      }
      if (null != this.addPatientForm.controls['addPatFirstName'].value) {
        this.patientToAdd.firstName = this.addPatientForm.controls['addPatFirstName'].value.trim();
      }
      if (null != this.addPatientForm.controls['addPatUr'].value) {
        this.patientToAdd.ur = this.addPatientForm.controls['addPatUr'].value.trim();
      }
      this.patientToAdd.dob = datePipe.transform(this.addPatientForm.controls['addPatDob'].value, 'dd/MM/yyyy');
      this.patientToAdd.active = this.addPatientForm.controls['addPatStatus'].value === 'active' ? true : false;
      if (null != this.addPatientForm.controls['addPatTrialID'].value) {
        this.patientToAdd.trialId = this.addPatientForm.controls['addPatTrialID'].value.trim();
      }
      
//      this.patientToAdd.updatedDate = datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.patientToAdd.createdBy = user.userId;

      console.log(this.patientToAdd);

      let patients: Array<Patient> = [];
      patients.push(this.patientToAdd);
      /* Call the API to create the add patient */
      this.addPatientSubscription = this.patientManagementService.addPatient(customerKey, patients).subscribe(
        /* When successful */
        data => {
          Object.assign(this.addedPatients, data);
          //this.showWheel = false;
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
          this.onAddSuccess();

          /* Alert the user of the successfull creation of the preference. */
          this.alertService.success('Patient successfully Added.', true, 'addPatientAlert');
        },
        /* When there is an error. */
        error => {
          /* Show generic error message for any backend errors. */
          let errors: APIError = error.error;
          if (errors.errorCode === Constants.PATIENT_MANAGEMENT_PATIENT_SAVE_DUPLICATE_MRN) {
            this.alertService.error(Constants.PATIENT_MANAGEMENT_PATIENT_SAVE_DUPLICATE_MRN_MESSAGE, 'addPatientAlert');
          } else {
            this.alertService.error(Constants.GENERIC_ERROR_MESSAGE, 'addPatientAlert');
          }
          //this.showWheel = false;
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
        },
        () => {
          // Do nothing
          //this.showWheel = false;
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
        }
      );
    } else {
      /*
       * If the form is still invalid after pressing the submit button,
       * then display all the validation errors.
       */
      Object.keys(this.addPatientForm.controls).forEach(key => {
        this.addPatientForm.get(key).markAsDirty();
        this.addPatientForm.get(key).markAsTouched();
      });
      this.onValueChanged();
    }
  }

  onAddSuccess() {
    console.log('In add success : ' + this.addedPatients);
    this.displayMessage = Constants.PM_ADD_PATIENT_SUCCESS_MESSAGE;
    this.addView = Constants.PM_ADD_SUCCESS_VIEW;
    this.onAddSuccessForParent.emit(this.addedPatients);
  }

  buildForm() {
    this.addPatientForm = this.formBuilder.group({
      'addPatSurName': [{value : '', disabled: false},
                  [Validators.pattern(Constants.REG_EX_NAMES)]],
      'addPatFirstName': [{value : '', disabled: false},
      [Validators.pattern(Constants.REG_EX_NAMES)]],
      'addPatUr': [{value : '', disabled: false},
      [Validators.pattern(Constants.REG_EX_APLHA_NUMERIC)]],
      'addPatDob': [{value : '', disabled: true}],
      'addPatStatus': [{value : '', disabled: false},
                  [Validators.required]],
      'addPatTrialID': [{value : '', disabled: false},
      [Validators.pattern(Constants.REG_EX_APLHA_NUMERIC)]]
    });
       /* Listen to any changes in the form constrols */
       this.addPatientForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  /**
  * This method will be called if any of the controls were modified and
  * will add error messages in the form errors container.
  * @param any
  */
  onValueChanged(data?: any) {

    if (!this.addPatientForm) { return; }

    const form = this.addPatientForm;

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

  onEditAfterAdd() {
    this.eventBusService.broadcast(Constants.PM_EDIT_PATIENT_CLICKED_EVENT, Constants.PM_CURR_VIEW_ADD, this.addedPatients[0]);
  }

  onAddAnother() {
    this.addView = Constants.PM_ADD_VIEW;
    this.displayMessage = Constants.PM_ADD_PATIENT_MESSAGE;
    this.addPatientForm.reset();
  }

  onEditSuccess(patientList) {
    /* Alert the user of the successfull creation of the preference. */
    this.alertService.success('Patient successfully updated.', true, 'addPatientAlert');
    this.displayMessage = Constants.PM_EDIT_PATIENT_SUCCESS_MESSAGE;
    Object.assign(this.addedPatients, patientList);
  }

  gotoSearch() {
    this.resetAddPatient();
    this.eventBusService.broadcast(Constants.PM_TABS_GO_TO_SEARCH);
  }

  resetAddPatient() {
    this.alertService.reset();
    this.addedPatients = [];
    this.patientToAdd = null;
    this.isValid = true;
    this.onAddAnother();
  }

  setAddPatientModeModal() {
    this.isAddModeModal = true;
  }
}
