import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CompleterCmp, CompleterData, CompleterItem, CompleterService, RemoteData } from 'ng2-completer';
import { Batch } from '../../common/model/batch.model';
import { Patient } from '../../common/model/patient.model';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/model/user.model';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { AddBatchAddPatientComponent } from '../add-batch-add-patient/add-batch-add-patient.component';

@Component({
    selector: 'add-batch-patient',
    templateUrl: './add-batch-patient.component.html',
    styleUrls: ['./add-batch-patient.component.css']
})
export class AddBatchPatientComponent implements OnInit {
    @Input('patient') batchPatient: Patient;
    @Input('customerKey') customerKey: string;

    // Component Output events
    @Output('select') select: EventEmitter<Patient> = new EventEmitter<Patient>();

    private showPatientSearch: boolean;
    private selectedPatient: Patient = new Patient(null, '', null, null);
    private isNoPatient: boolean;

    @ViewChild('app_add_batch_add_patient') addBatchAddPatient: AddBatchAddPatientComponent;

    constructor(private userService: UserService,
                private eventBusService: EventBusService) {
    }

    ngOnInit() {
        let user: User = this.userService.getCurrentUser()
        this.customerKey = user.selectedUserAuthority.customerKey;
        this.showPatientSearch = true;

        // If batch already exists
        if (this.batchPatient) {
            this.selectedPatient = Object.assign(this.selectedPatient, this.batchPatient);
            this.showPatientSearch = false;
            this.isNoPatient = false;
        } else {
            this.isNoPatient = true;
        }

    }

    /**
     * Event method fired when patient is selected in the Search Patient component.
     * @param patient 
     */
    onPatientSelected(patient: Patient) {
        if (patient) {
            this.selectedPatient = patient;
            this.select.emit(<Patient>Object.assign(new Patient(null, null, null, null), this.selectedPatient));
            this.showPatientSearch = false;
            this.isNoPatient = false;
        }
    }

    onChangePatient() {
        console.log(this.selectedPatient);
        this.showPatientSearch = true;
    }

    onNoPatient() {
        if (!this.selectedPatient) {
            this.selectedPatient = new Patient(null, 'No Patient', null, null, false);
            this.select.emit(<Patient>Object.assign(new Patient(null, null, null, null), this.selectedPatient));
        } else {
            this.resetPatient(this.selectedPatient);
            this.select.emit(<Patient>Object.assign(new Patient(null, null, null, null), this.selectedPatient));
        }
        this.showPatientSearch = false;
        this.isNoPatient = true;
    }

    resetPatient(patient: Patient) {
        patient.patientId = null;
        patient.fullNameMrn = null;
        patient.firstName = null;
        patient.surName = null;
        patient.mrnDob = null;
        patient.mrnNo = null;
        patient.ur = null;
        patient.dob = null;
        patient.isPatient = false;
        patient.fullName = 'No Patient';

    }

    onSelectPatient() {
        if (this.selectedPatient) {
            this.selectedPatient.isPatient = true;
            this.selectedPatient.fullName = '';
        }
        this.showPatientSearch = true;
        this.isNoPatient = false;
    }

    clear() {
        this.batchPatient = null;
        this.showPatientSearch = true;
        this.selectedPatient = new Patient(null, '', null, null);
    }

    onAddPatient() {
        this.addBatchAddPatient.resetAddPatient();
    }

}