import { User } from '../../../common/model/user.model';
import { UserService } from '../../../common/services/user.service';
import { Batch } from '../../../common/model/batch.model';
import { Patient } from '../../../common/model/patient.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CompleterCmp, CompleterData, CompleterItem, CompleterService, RemoteData } from 'ng2-completer';

@Component({
  selector: 'patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
    @Input('poNumber') poNumber;
    @Input('batchOrder') batchOrder: Batch;

    /*@Input('customerKey')*/ private customerKey: string;
    private showPatientSearch: boolean;
    private searchPatientStr: string;
    private selectedPatient: Patient;
    private isNoPatient: boolean;
    private showAddEditProduct: boolean;

    // Service for calling Patient search API
    protected remoteDataService: RemoteData;

    constructor(private completerService: CompleterService,
                private userService: UserService) {
    }

    ngOnInit() {
        let user: User = this.userService.getCurrentUser()
        this.customerKey = user.selectedUserAuthority.customerKey;

        // Initialize remote call to Patient Search API
        this.remoteDataService = this.completerService.remote(null, 'fullNameMrn', 'fullName').descriptionField("mrnDob");
        this.remoteDataService.urlFormater(term => {
            if (this.selectedPatient) {
                if (term === this.selectedPatient.fullName) {
                    return term = '';
                }
            }
            return '/shot/api/customers/' + this.customerKey + '/patients/searches/?searchStr=' + term.trim();
        });
        this.showPatientSearch = true;

        // If batch already exists
        if (this.batchOrder) {
            if (this.batchOrder.patient) {
                this.selectedPatient = this.batchOrder.patient;
                this.showPatientSearch = false;
                this.isNoPatient = false;
            } else {
                this.isNoPatient = true;
            }
        } else {
            // Create an empty batch
            this.batchOrder = new Batch();
            this.batchOrder.customerKey = this.customerKey;
        }
    }

    onPatientSelected(selected: CompleterItem) {
        if (selected) {
            if (selected.originalObject != '') {
                console.log(selected.originalObject);
                if (!this.selectedPatient) {
                    this.selectedPatient = <Patient>selected.originalObject;
                } else {
                    let patient: Patient = <Patient>selected.originalObject;
                    this.selectedPatient.dob = patient.dob;
                    this.selectedPatient.fullName = patient.fullName;
                    this.selectedPatient.fullNameMrn = patient.fullNameMrn;
                    this.selectedPatient.isPatient = true;
                    this.selectedPatient.mrnDob = patient.mrnDob;
                    this.selectedPatient.ur = patient.ur;
                    this.selectedPatient.patientId = patient.patientId;
                }
                this.showPatientSearch = false;
                this.isNoPatient = false;
            }
        }
    }

    onEditPatient() {
        console.log(this.selectedPatient);
        this.searchPatientStr = this.selectedPatient.fullName;
        this.showPatientSearch = true;
    }

    onNoPatient() {
        if (!this.selectedPatient) {
            this.selectedPatient = new Patient(null, 'No Patient', null, null, false);
        } else {
            this.resetPatient(this.selectedPatient);
        }
        this.searchPatientStr = '';
        this.showPatientSearch = false;
        this.isNoPatient = true;
    }

    resetPatient(patient: Patient) {
        patient.patientId = null;
        patient.fullNameMrn = null;
        patient.mrnDob = null;
        patient.ur = null;
        patient.dob = null;
        patient.isPatient = false;
        patient.fullName = 'No Patient';
    }

    onShowPatient() {
        if (this.selectedPatient) {
            this.selectedPatient.isPatient = true;
            this.selectedPatient.fullName = '';
        }
        this.showPatientSearch = true;
        this.searchPatientStr = '';
        this.isNoPatient = false;
    }

    onCancel() {

    }

    onAddtoOrder() {
        if (this.isNoPatient) {
            this.batchOrder.patient = null;
            this.batchOrder.isNonPatient = true;
        } else {
            this.batchOrder.patient = this.selectedPatient
            this.batchOrder.isNonPatient = false;
        }
    }

    onAddProduct() {
        this.showAddEditProduct = true;
    }
}