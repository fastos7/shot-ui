import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/model/user.model';
import { PatientManagementService } from '../../common/services/patient-management.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../../core/services/alert.service';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';

@Component({
  selector: 'app-search-patient-multiple',
  templateUrl: './search-patient-multiple.component.html',
  styleUrls: ['./search-patient-multiple.component.css']
})
export class SearchPatientMultipleComponent implements OnInit, OnDestroy {
  private loading = false;

  private customerKey: string;
  private patientCount: number;
  private patientList: any;
  private showPatientListTable: boolean = false;

  private isValid = true;

  // Search Patient Multiple Form
  searchPatientMultipleForm: FormGroup;

  private patientListSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private patientManagementService: PatientManagementService,
    private alertService: AlertService,
    private eventBusService: EventBusService) { }

  ngOnInit() {
    const user: User = this.userService.getCurrentUser();
    this.customerKey = user.selectedUserAuthority.customerKey;
    this.createForm();
//    this.status = '';

    /* Register Event Listener */
    this.eventBusService.on(Constants.PM_PATIENT_UPDATE_SUCCESS_SEARCH, () => {

      this.alertService.success('Patient successfully updated.', true, 'listPatientsAlert');

      this.patientList = [];
      this.patientCount = 0;
      this.showPatientListTable = false;
      this.searchPatientMultiple();
    });

    this.eventBusService.on(Constants.PM_TABS_TAB_CHANGED_SEARCH, () => {
      this.resetSearch();
    });
  }

  /**
   * Creates the searchPatientMultipleForm instance.
   */
  private createForm() {
    this.searchPatientMultipleForm = this.formBuilder.group({
        'firstName': [''],
        'surName': [''],
        'ur': [''],
        'status': ['']
    });
  }

  /**
   * Search Patient Multiple Form submit event method.
   */
  onSubmit() {
    this.showPatientListTable = false;
    if (null != this.searchPatientMultipleForm.controls['firstName'].value) {
      this.searchPatientMultipleForm.controls['firstName'].setValue(this.searchPatientMultipleForm.controls['firstName'].value.trim());
    }
    if (null != this.searchPatientMultipleForm.controls['surName'].value) {
      this.searchPatientMultipleForm.controls['surName'].setValue(this.searchPatientMultipleForm.controls['surName'].value.trim());
    }
    if (null != this.searchPatientMultipleForm.controls['ur'].value) {
      this.searchPatientMultipleForm.controls['ur'].setValue(this.searchPatientMultipleForm.controls['ur'].value.trim());
    }

    if ((this.searchPatientMultipleForm.controls['firstName'].value === ''
          || this.searchPatientMultipleForm.controls['firstName'].value === null)
        && (this.searchPatientMultipleForm.controls['surName'].value === ''
          || this.searchPatientMultipleForm.controls['surName'].value === null)
        && (this.searchPatientMultipleForm.controls['ur'].value === ''
          || this.searchPatientMultipleForm.controls['ur'].value === null)) {
      this.isValid = false;
    } else {
      this.isValid = true;
      this.searchPatientMultiple();
    }
  }

      /**
     * Search the patient by calling the SHOT-patient API. Display the list of patient
     * returned by the API to the user.
     * In case no patients are returned display appropriate message to the user.
     */
    searchPatientMultiple() {
      this.eventBusService.broadcast(Constants.SHOW_LOADING);
      this.loading = true;
      this.patientListSubscription = this.patientManagementService.getPatients(
          this.customerKey,
          this.searchPatientMultipleForm.controls['firstName'].value,
          this.searchPatientMultipleForm.controls['surName'].value,
          this.searchPatientMultipleForm.controls['ur'].value,
          this.searchPatientMultipleForm.controls['status'].value).subscribe(
              data => {
                  this.patientList = data.patientList;
                  this.patientCount = data.count;

                  this.loading = false;
                  this.showPatientListTable = true;
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                },
              error => {
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE, 'searchPatientMultipleAlert');
                    this.loading = false;
                    this.showPatientListTable = false;
                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  });
    }

    inputKeyUpHandler(evt) {
      if (null !== this.searchPatientMultipleForm.controls['firstName'].value
            && this.searchPatientMultipleForm.controls['firstName'].value.trim() === '') {
        this.searchPatientMultipleForm.controls['firstName'].setValue(this.searchPatientMultipleForm.controls['firstName'].value.trim());
      }
      if (null !== this.searchPatientMultipleForm.controls['surName'].value
            && this.searchPatientMultipleForm.controls['surName'].value.trim() === '') {
        this.searchPatientMultipleForm.controls['surName'].setValue(this.searchPatientMultipleForm.controls['surName'].value.trim());
      }
      if (null !== this.searchPatientMultipleForm.controls['ur'].value
            && this.searchPatientMultipleForm.controls['ur'].value.trim() === '') {
        this.searchPatientMultipleForm.controls['ur'].setValue(this.searchPatientMultipleForm.controls['ur'].value.trim());
      }
      if ((null ===  this.searchPatientMultipleForm.controls['firstName'].value
            || this.searchPatientMultipleForm.controls['firstName'].value === '')
          && (null ===  this.searchPatientMultipleForm.controls['surName'].value
          || this.searchPatientMultipleForm.controls['surName'].value === '')
          && (null ===  this.searchPatientMultipleForm.controls['ur'].value
          || this.searchPatientMultipleForm.controls['ur'].value === '')) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    }

    ngOnDestroy(): void {
      if (this.patientListSubscription) {
        this.patientListSubscription.unsubscribe();
      }
    }

    resetSearch() {
      this.alertService.reset();
      this.patientList = [];
      this.patientCount = 0;
      this.showPatientListTable = false;
      this.searchPatientMultipleForm.reset();
      this.isValid = true;
      this.searchPatientMultipleForm.controls['status'].setValue('');
    }
}
