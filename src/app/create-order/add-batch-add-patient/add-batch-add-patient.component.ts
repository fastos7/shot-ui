import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { EventBusService } from '../../common/services/event-bus.service';
import { AddPatientComponent } from '../../patient/add-patient/add-patient.component';
import { Patient } from '../../common/model/patient.model';

@Component({
  selector: 'app-add-batch-add-patient',
  templateUrl: './add-batch-add-patient.component.html',
  styleUrls: ['./add-batch-add-patient.component.css']
})
export class AddBatchAddPatientComponent implements OnInit {

  @ViewChild ('app_add_patient') addPatient: AddPatientComponent;

  @ViewChild('cancelBtn') cancelBtn: ElementRef;

  @Output('onPatientSelected') onPatientSelected: EventEmitter<Patient> = new EventEmitter<Patient>();

  showAddButtons: boolean = true;

  addedPatient: Patient = new Patient(null, null, null, null);

  constructor() { }

  ngOnInit() {
    this.addPatient.setAddPatientModeModal();
  }

  onSubmit() {
    this.addPatient.onSubmit();
  }


  onCancel() {
    this.resetAddPatient();
    this.cancelBtn.nativeElement.click();
  }

  onDismiss() {
    this.resetAddPatient();
  }

  onOrderForThisPatient() {
    if (this.addedPatient.firstName !== null && this.addedPatient.firstName !== '') {
      if (this.addedPatient.surName !== null && this.addedPatient.surName !== '') {
        this.addedPatient.fullName = this.addedPatient.firstName + ' ' + this.addedPatient.surName;
      } else {
        this.addedPatient.fullName = this.addedPatient.firstName;
      }
    } else {
      if (this.addedPatient.surName !== null && this.addedPatient.surName !== '') {
        this.addedPatient.fullName = this.addedPatient.surName;
      } else {
        this.addedPatient.fullName = '-';
      }
    }
    this.addedPatient.mrnNo = this.addedPatient.ur;
    let patient: Patient = new Patient(null, null, null, null);
    this.onPatientSelected.emit(<Patient>Object.assign(patient, this.addedPatient));
    this.cancelBtn.nativeElement.click();
  }

  resetAddPatient() {
    this.addPatient.resetAddPatient();
    this.addPatient.setAddPatientModeModal();
    this.addedPatient = new Patient(null, null, null, null);
    this.showAddButtons = true;
  }

  handleOnAddSuccess(patients: Array<Patient>) {
    this.showAddButtons = false;
    Object.assign(this.addedPatient, patients[0]);
  }
}
