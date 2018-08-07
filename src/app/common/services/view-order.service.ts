import { Injectable } from '@angular/core';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';

@Injectable()
export class ViewOrderService {

  constructor(private http: HttpClientService) {
  }

  /**
   * Get the the customer product preferences. When there is no preferences for 
   * a given customer and product it will return 404 NOT_FOUND.
   * 
   * @param customerKey
   * @param dayOrWeek
   * @param deliveryOrTreatment
   * @param startDate
   */
  getOrders(customerKey: string , startDate: string, dayOrWeek: string, deliveryOrTreatment: string): Observable<any> {

    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.MY_ORDERS_API_URL);
    builder.setNamedParameter('customerKey', customerKey);
    builder.setQueryParameter('date', startDate);
    builder.setQueryParameter('view', dayOrWeek);
    builder.setQueryParameter('orderBy', deliveryOrTreatment);
    const uri = builder.get();

    return this.http.get( uri );
  }

}
