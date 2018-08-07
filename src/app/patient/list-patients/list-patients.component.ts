import { Component, OnInit, AfterViewInit, Input, SimpleChanges, ViewChild, Output, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnDestroy, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Patient } from '../../common/model/patient.model';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css']
})
export class ListPatientsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() patientList: any;

  @Input() patientCount: number = null;

  private displaySearchMessage: string;

  private showPatientListTable: boolean = false;

  private patientListSubscription: Subscription;

  @Input() showActionsColumn: boolean = true;

  displayedColumns = ['surName', 'firstName', 'ur', 'dob', 'active', 'trialId', 'Actions'];
  dataSource = new MatTableDataSource<Patient>(this.patientList);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( private eventBusService: EventBusService,
               private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.displaySearchMessage = '';
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
  }

  onEdit(patient: Patient) {
    console.log('on edit : ' + patient.patientId);
    this.eventBusService.broadcast(Constants.PM_EDIT_PATIENT_CLICKED_EVENT, Constants.PM_CURR_VIEW_SEARCH, patient);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.showActionsColumn) {
      this.displayedColumns = ['surName', 'firstName', 'ur', 'dob', 'active', 'trialId'];
    }
    this.cdr.detectChanges();
    if (this.patientCount !== null && this.patientCount === 0) {
      this.displaySearchMessage = Constants.PM_PS_NO_RESULTS_FOUND_MESSAGE;
      this.showPatientListTable = false;
    } else if (this.patientCount !== null && this.patientCount <= 100) {
      this.displaySearchMessage = Constants.PM_PS_RESULTS_FOUND_MESSAGE;
      this.showPatientListTable = true;
    } else {
      this.displaySearchMessage = Constants.PM_PS_TOO_MANY_RESULTS_FOUND_MESSAGE;
      this.showPatientListTable = true;
    }
    this.dataSource = null;
    this.dataSource = new MatTableDataSource<Patient>(this.patientList);
    this.dataSource.paginator = this.paginator;
  }
}


