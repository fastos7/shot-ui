import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


import { Patient } from '../../common/model/patient.model';
import { RemoteData, CompleterService, CompleterItem } from 'ng2-completer';


/**
 * Generic component for Searching Patient by First Name/Last Name/MRN
 */
@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit {

  // Component Inputs
  @Input('customerKey') customerKey: string;

  // Text search string
  @Input('searchText') searchPatientStr: string = '';

  // Component Output events
  @Output('select') select: EventEmitter<Patient> = new EventEmitter<Patient>();

  // Selected patient
  private selectedPatient: Patient;

  // Service for calling Patient search API
  protected remoteDataService: RemoteData;

  constructor(private completerService: CompleterService) { }

  /**
   * Initialize search component by setting up service instance for Remote API calls.
   */
  ngOnInit() {
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
  }

  /**
   * Event method called when a Patient is selected from the list of search results.
   * This component emits the 'select' event with selected Patient as the event type.
   * @param selected 
   */
  onPatientSelected(selected: CompleterItem) {
    if (selected) {
      if (selected.originalObject != '') {        
        this.selectedPatient = selected.originalObject;
        let patient: Patient = new Patient(null, null, null, null);
        this.select.emit(<Patient>Object.assign(patient, this.selectedPatient));
      }
    }
  }
}
