import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { RestURLBuilder } from 'rest-url-builder';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../app.constants';
import { ContactUsDetails } from '../model/contact-us-details.model';
import { JsonpModule } from '@angular/http';

@Injectable()
export class ContactUsService {

  constructor(private http: HttpClientService) { }

  /**
   * Send the information entered in the contact-us form to the slade admin.
   * @param contactUsDetails
   */
  sendContactUsEmail(contactUsDetails: ContactUsDetails): Observable<any> {

    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.CONTACT_US_EMAIL_API_URL);
    const uri = builder.get();

    return this.http.post( uri, contactUsDetails );
  }

}
