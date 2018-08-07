import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileManagerService } from '../../common/services/file-mgmt.service';
import { Constants } from '../../common/app.constants';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AlertService } from '../../core/services/alert.service';
import * as FileSaver from 'file-saver';
import { EventBusService } from '../../common/services/event-bus.service';

@Component({
  selector: 'app-site-uploads',
  templateUrl: './site-uploads.component.html',
  styleUrls: ['./site-uploads.component.css']
})
export class SiteUploadsComponent implements OnInit {
  private progress: { percentage: number } = { percentage: 0 };
  private userManualFile: File;
  private userMatrixFile: File;
  private uploadInProgress: boolean = false;

  // Add Edit User Form
  uploadForm: FormGroup;

  constructor(private fileService: FileManagerService,
              private formBuilder: FormBuilder,
              private eventBusService: EventBusService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      matrix: null,
      manual: null
    });
}

  selectUserManual(event) {
    this.userManualFile = event.target.files[0];
  }

  selectUserMatrix(event) {
    this.userMatrixFile = event.target.files[0];
  }

  uploadUserManual() {
    this.uploadFile(this.userManualFile, Constants.USER_FILE_API_BASE_URL + Constants.USER_FILE_MANUAL_REL_URL);
    this.userManualFile = null;
    this.uploadForm.patchValue({manual: null});
  }

  uploadUserMatrix() {
    this.uploadFile(this.userMatrixFile, Constants.USER_FILE_API_BASE_URL + Constants.USER_FILE_MATRIX_REL_URL);
    this.userMatrixFile = null;
    this.uploadForm.patchValue({matrix: null});
  }

  downloadUserManual() {
    this.downloadFile(Constants.USER_FILE_API_BASE_URL + Constants.USER_FILE_MANUAL_REL_URL, 'user_manual.pdf');
  }

  downloadStabilityMatrix() {
    this.downloadFile(Constants.USER_FILE_API_BASE_URL + Constants.USER_FILE_MATRIX_REL_URL, 'stability_matrix.pdf');
  }

  downloadFile(url, filename) {
    this.alertService.reset();
    if (!this.uploadInProgress) {
      this.fileService.downloadFile(url)
        .subscribe(
        blob => {
          FileSaver.saveAs(blob, filename);
        },
        error => {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        });
    } else {
      this.alertService.error('File upload in progress');
    }
  }

  uploadFile(file: File, url) {
    if (file == null) {
      this.alertService.error('Please select a File to upload');
      return;
    }

    this.alertService.reset();
    if (!this.uploadInProgress) {
      if (file.type == 'application/pdf') {
        if (file.size < 51200000) {
          this.progress.percentage = 0;
          this.uploadInProgress = true;
          this.eventBusService.broadcast(Constants.SHOW_LOADING);
          this.fileService.uploadFile(file, url)
            .subscribe(event => {

              if (event.type === HttpEventType.UploadProgress) {
                this.progress.percentage = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                this.uploadInProgress = false;
                this.alertService.success('File uploaded')
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
              }
            },
            (error) => {
              this.uploadInProgress = false;
              this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
              this.eventBusService.broadcast(Constants.HIDE_LOADING);
            });
        } else {
          this.alertService.error('Please select a file less than 50 MB in size')
        }
      } else {
        this.alertService.error('Please select a file of PDF type.')
      }
    } else {
      this.alertService.error('File upload in progress');
    }
  }
}
