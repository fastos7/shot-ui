import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css'],
  /*
   * These providers are used by the datepicker input to
   * display the date in DD/MM/YYYY format. This is just local to
   * this component and will not affect others.
   */
  providers : [{provide: MAT_DATE_LOCALE, useValue: 'en-AU'},
               {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
               {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})
export class EditPatientComponent implements OnInit {

  editPatientForm: FormGroup;

  editedPatient: Patient = null;

  private editPatientSubscription: Subscription;

  currentView: string;

  private maximumDate: Date = new Date();

  isValid = true;

  /*
   * This is a reference to the cancel button so that the
   * modal dialog can be cancelled programmatically.
   */
  @ViewChild('cancelBtn') cancelBtn: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private eventBusService: EventBusService,
              private userService: UserService,
              private patientManagementService: PatientManagementService,
              private alertService: AlertService ) { }

  /*
	 * Form errors container
	 */
  formErrors = {
    'epSurName' : '',
    'epFirstName' : '',
    'epUr' : '',
    'epDob' : '',
    'epStatus' : '',
    'epTrialID' : ''
  };

/*
* Validation error messages
*/
validationMessages = {
          'epSurName': {
            'pattern'   : 'Invalid value for Surname, Surname can only be alphabets and/or numbers.'
          },
          'epFirstName': {
            'pattern'   : 'Invalid value for first name, first name can only be alphabets and/or numbers.'
          },
          'epUr': {
            'required'  : 'MRN / UR number is required',
            'pattern'   : 'Invalid value for MRN / UR number, MRN / UR number can only be alphabets and/or numbers.'
          },
          'epDob': {
            'pattern'   : 'Invalid value for date of birth, date of birth should be before today.'
          },
          'epStatus': {
            'required'  : 'Status is required. Please select a value.'
          },
          'epTrialID': {
            'pattern'   : 'Invalid value for trail Id, trail Id can only be aplabets and/or numbers.'
          },
        };

  ngOnInit() {
    this.buildForm();
    this.alertService.reset();
    this.eventBusService.on(Constants.PM_EDIT_PATIENT_CLICKED_EVENT, (...args) => {
      this.onEdit(args[0], args[1]);
    });
  }

  inputKeyUpHandler(evt) {
    if (null !== this.editPatientForm.controls['epFirstName'].value
          && this.editPatientForm.controls['epFirstName'].value.trim() === '') {
      this.editPatientForm.controls['epFirstName'].setValue(this.editPatientForm.controls['epFirstName'].value.trim());
    }
    if (null !== this.editPatientForm.controls['epSurName'].value
          && this.editPatientForm.controls['epSurName'].value.trim() === '') {
      this.editPatientForm.controls['epSurName'].setValue(this.editPatientForm.controls['epSurName'].value.trim());
    }
    if (null !== this.editPatientForm.controls['epUr'].value
          && this.editPatientForm.controls['epUr'].value.trim() === '') {
      this.editPatientForm.controls['epUr'].setValue(this.editPatientForm.controls['epUr'].value.trim());
    }
    if ((null ===  this.editPatientForm.controls['epFirstName'].value
          || this.editPatientForm.controls['epFirstName'].value === '')
        && (null ===  this.editPatientForm.controls['epSurName'].value
        || this.editPatientForm.controls['epSurName'].value === '')
        && (null ===  this.editPatientForm.controls['epUr'].value
        || this.editPatientForm.controls['epUr'].value === '')) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }


  onSubmit() {
    if ((this.editPatientForm.controls['epSurName'].value === ''
          || this.editPatientForm.controls['epSurName'].value === null)
        && (this.editPatientForm.controls['epFirstName'].value === ''
          || this.editPatientForm.controls['epFirstName'].value === null)
        && (this.editPatientForm.controls['epUr'].value === ''
          || this.editPatientForm.controls['epUr'].value === null)) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }

    if (this.isValid && this.editPatientForm.valid) {
      // Show loading
      this.eventBusService.broadcast(Constants.SHOW_LOADING);

      const datePipe: DatePipe = new DatePipe('en_AU');
      const user: User = this.userService.getCurrentUser();
      const customerKey = user.selectedUserAuthority.customerKey;

      if (null != this.editPatientForm.controls['epSurName'].value) {
        this.editedPatient.surName = this.editPatientForm.controls['epSurName'].value.trim();
      }
      if (null != this.editPatientForm.controls['epFirstName'].value) {
        this.editedPatient.firstName = this.editPatientForm.controls['epFirstName'].value.trim();
      }
      if (null != this.editPatientForm.controls['epUr'].value) {
        this.editedPatient.ur = this.editPatientForm.controls['epUr'].value.trim();
      }
      if (moment(this.editPatientForm.controls['epDob'].value, 'YYYY-MM-DD').isValid()) {
        this.editedPatient.dob = datePipe.transform(this.editPatientForm.controls['epDob'].value, 'dd/MM/yyyy');
      }
      this.editedPatient.active = this.editPatientForm.controls['epStatus'].value === 'active' ? true : false;
      if (null != this.editPatientForm.controls['epTrialID'].value) {
        this.editedPatient.trialId = this.editPatientForm.controls['epTrialID'].value;
      }
//      this.editedPatient.updatedDate = datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.editedPatient.updatedBy = user.userId;

      console.log(this.editedPatient);

      let patients: Array<Patient> = [];
      patients.push(this.editedPatient);
      /* Call the API to create the edit patient */
      this.editPatientSubscription = this.patientManagementService.editPatient(customerKey, patients).subscribe(
        /* When successful */
        data => {
          //this.showWheel = false;
          this.eventBusService.broadcast(Constants.HIDE_LOADING);

          if (this.currentView === Constants.PM_CURR_VIEW_SEARCH) {
            this.eventBusService.broadcast(Constants.PM_PATIENT_UPDATE_SUCCESS_SEARCH, data);
          } else {
            this.eventBusService.broadcast(Constants.PM_PATIENT_UPDATE_SUCCESS_ADD, data);
          }

          /* Close this modal dialog */
          this.cancelBtn.nativeElement.click();
        },
        /* When there is an error. */
        error => {
          /* Show generic error message for any backend errors. */
          let errors: APIError = error.error;
          if (errors.errorCode === Constants.PATIENT_MANAGEMENT_PATIENT_SAVE_DUPLICATE_MRN) {
            this.alertService.error(Constants.PATIENT_MANAGEMENT_PATIENT_SAVE_DUPLICATE_MRN_MESSAGE, 'editPatientAlert');
          } else {
            this.alertService.error(Constants.GENERIC_ERROR_MESSAGE, 'editPatientAlert');
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
      Object.keys(this.editPatientForm.controls).forEach(key => {
        this.editPatientForm.get(key).markAsDirty();
        this.editPatientForm.get(key).markAsTouched();
      });
      this.onValueChanged();
    }
  }

  buildForm() {
    this.editPatientForm = this.formBuilder.group({
      'epSurName': [{value : '', disabled: false},
                  [Validators.pattern(Constants.REG_EX_NAMES)]],
      'epFirstName': [{value : '', disabled: false},
      [Validators.pattern(Constants.REG_EX_NAMES)]],
      'epUr': [{value : '', disabled: false},
      [Validators.pattern(Constants.REG_EX_APLHA_NUMERIC)]],
      'epDob': [{value : '', disabled: true}],
      'epStatus': [{value : '', disabled: false},
                  [Validators.required]],
      'epTrialID': [{value : '', disabled: false},
      [Validators.pattern(Constants.REG_EX_APLHA_NUMERIC)]]
    });
       /* Listen to any changes in the form constrols */
       this.editPatientForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  /**
  * This method will be called if any of the controls were modified and
  * will add error messages in the form errors container.
  * @param any
  */
  onValueChanged(data?: any) {

    if (!this.editPatientForm) { return; }

    const form = this.editPatientForm;

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

  onEdit(currView: string, patient: Patient) {
    this.currentView = currView;
    this.editedPatient = Object.assign({}, patient);
    this.editPatientForm.controls['epSurName'].setValue(patient.surName);
    this.editPatientForm.controls['epFirstName'].setValue(patient.firstName);
    this.editPatientForm.controls['epUr'].setValue(patient.ur);
    this.editPatientForm.controls['epDob'].setValue(moment(patient.dob, 'YYYY-MM-DD').toDate());
    this.editPatientForm.controls['epStatus'].setValue(patient.active ? 'active' : 'inactive');
    this.editPatientForm.controls['epTrialID'].setValue(patient.trialId);
  }

  onEditCancel() {
    this.alertService.reset();
    this.isValid = true;
  }
}
