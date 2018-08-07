import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileManagerService } from '../../common/services/file-mgmt.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { AlertService } from '../../core/services/alert.service';
import { PatientManagementService } from '../../common/services/patient-management.service';
import { User } from '../../common/model/user.model';
import { UserService } from '../../common/services/user.service';
import { APIError } from '../../common/model/apiError.model';
import { Patient } from '../../common/model/patient.model';
import { Constants } from '../../common/app.constants';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-upload-patients',
  templateUrl: './upload-patients.component.html',
  styleUrls: ['./upload-patients.component.css']
})
export class UploadPatientsComponent implements OnInit {

  private uploadPatientsFile: File;

  private errors: APIError;

  private patientsFromFile: any;

  private patientsAdded: any;

  private showPatientToBeAdded: boolean = false;

  private showErrorsFromValidateFile: boolean = false;

  private arePatientsAdded: boolean = false;

  private showPatientAdded: boolean = false;

  private displaySearchMessage: String = '';

  private user: User;

  @ViewChild('uploadPatientFile')
  uploadPatientInput: any;

  // Add Edit User Form
  uploadPatientsForm: FormGroup;
  customerKey: string;

  constructor(private fileService: FileManagerService,
    private formBuilder: FormBuilder,
    private eventBusService: EventBusService,
    private alertService: AlertService,
    private userService: UserService,
    private patientManagementService: PatientManagementService) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.customerKey = this.user.selectedUserAuthority.customerKey;
    this.uploadPatientsForm = this.formBuilder.group({
      uploadPatientFile: null,
    });
    this.eventBusService.on(Constants.PM_TABS_TAB_CHANGED_BULK_ADD_PATIENTS, () => {
      this.resetUploadScreen();
    });
  }

  selectUploadPatientFile(event) {
    if (null != event.target.files && event.target.files.length > 0) {
      this.uploadPatientsFile = event.target.files[0];
    }
  }

  validateFile() {
    this.patientManagementService.validateUploadPatients(this.customerKey, this.uploadPatientsFile).subscribe(
      data => {
        this.patientsFromFile = data;
        this.showPatientToBeAdded = true;
        this.showErrorsFromValidateFile = false;
        this.displaySearchMessage = Constants.PM_PU_PATIENTS_FROM_FILE_TO_BE_ADDED;
      },
      error => {
        this.errors = error.error;
        this.showErrorsFromValidateFile = true;
        this.showPatientToBeAdded = false;
        this.displaySearchMessage = Constants.PM_PU_PATIENTS_FROM_FILE_ERRORS;
      });
  }

  uploadPatients() {
    const datePipe: DatePipe = new DatePipe('en_AU');
    for (let i = 0 ; i < this.patientsFromFile.length; i++) {
      if (moment(this.patientsFromFile[i].dob, 'YYYY-MM-DD').isValid()) {
        this.patientsFromFile[i].dob = datePipe.transform(this.patientsFromFile[i].dob, 'dd/MM/yyyy');
      }
      this.patientsFromFile[i].createdBy = this.user.userId;
    }

    this.patientManagementService.uploadPatients(this.customerKey, this.patientsFromFile).subscribe(
      data => {
        this.patientsAdded = data;
        this.arePatientsAdded = true;
        this.showPatientAdded = true;
        this.displaySearchMessage = '';
        this.alertService.success(Constants.PM_PU_PATIENTS_FROM_FILE_ADDED, false, 'uploadPatientAlert');
      },
      error => {
        this.errors = error.error;
        this.arePatientsAdded = true;
        this.showPatientAdded = false;
        this.displaySearchMessage = '';
        this.alertService.error(Constants.GENERIC_ERROR_MESSAGE, 'uploadPatientAlert');
      });
  }

  resetUploadScreen() {
    this.arePatientsAdded = false;
    this.showPatientToBeAdded = false;
    this.showErrorsFromValidateFile = false;
    this.patientsFromFile = null;
    this.patientsAdded = null;
    this.uploadPatientsForm.controls['uploadPatientFile'].setValue('');
    this.uploadPatientsFile = null;
    this.uploadPatientsForm.reset();
    this.alertService.reset();
  }

  gotoSearch() {
    this.resetUploadScreen();
    this.eventBusService.broadcast(Constants.PM_TABS_GO_TO_SEARCH);
  }
}
