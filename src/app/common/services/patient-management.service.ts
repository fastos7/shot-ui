import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../app.constants';
import { Patient } from '../model/patient.model';
import { HttpRequest, HttpClient } from '@angular/common/http';

/**
 * This service is used to call Patient Management related APIs.
 */
@Injectable()
export class PatientManagementService {

  constructor(private http: HttpClientService) { }

  /**
   * Get the the List of patients matching the search criteria. When there is no patients found show relevant message to users.
   * The maximum number of patients shown to the user is never more than 100.
   * @param customerKey
   * @param firstName
   * @param surName
   * @param ur
   * @param status
   */
  getPatients(customerKey: string , firstName: string, surName: string, ur: string, status: string): Observable<any> {

    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.PM_SEARCH_PATIENT_MULTIPLE_API_URL);
    builder.setNamedParameter('customerKey', customerKey);
    builder.setQueryParameter('firstName', firstName);
    builder.setQueryParameter('surName', surName);
    builder.setQueryParameter('ur', ur);
    builder.setQueryParameter('status', status);
    const uri = builder.get();

    return this.http.get( uri );
  }

  /**
   * Update the details of the supplied patient into the system.
   * The service will return a success response or an error response, take necessary action for each kind of response.
   * @param customerKey
   * @param patients - List of Patients
   */
  editPatient(customerKey: string , patients: Array<Patient>): Observable<any> {

    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.PM_ADD_EDIT_PATIENT_API_URL);
    builder.setNamedParameter('customerKey', customerKey);
    const uri = builder.get();

    return this.http.put( uri, patients );
  }

  /**
   * Add the details of the supplied patient into the system.
   * The service will return a success response or an error response, take necessary action for each kind of response.
   * @param customerKey
   * @param patients -List of Patients
   */
  addPatient(customerKey: string , patients: Array<Patient>): Observable<any> {

    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.PM_ADD_EDIT_PATIENT_API_URL);
    builder.setNamedParameter('customerKey', customerKey);
    const uri = builder.get();

    return this.http.post( uri, patients );
  }

  validateUploadPatients(customerKey: string, uploadPatientsFile: File) {
    const urlBuilder = new RestURLBuilder();
    const builder = urlBuilder.buildRestURL(Constants.PM_VALIDATE_UPLOAD_PATIENTS_API_URL);
    builder.setNamedParameter('customerKey', customerKey);
    const uri = builder.get();

    let formdata: FormData = new FormData();
    formdata.append('file', uploadPatientsFile);

/*    const req = new HttpRequest('POST', uri, formdata, {
        reportProgress: true,
        responseType: 'text'
    });
*/
    return this.http.post( uri, formdata );

    //return this.httpClient.request(req).map(( res: Response ) => res.json() );
  }

  uploadPatients(customerKey: string, patients: Array<Patient>) {
    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.PM_UPLOAD_PATIENTS_API_URL);
    builder.setNamedParameter('customerKey', customerKey);
    const uri = builder.get();

    return this.http.post( uri, patients );
  }
}
