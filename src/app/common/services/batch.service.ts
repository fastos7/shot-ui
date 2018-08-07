import { Injectable } from '@angular/core';
import { Constants } from '../app.constants';
import { RestURLBuilder } from 'rest-url-builder';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';

/** 
 * This service provides methods for retrieving batch related information.
 * 
 * @author Marlon Cenita
 */
@Injectable()
export class BatchService {
  
  constructor(private http:HttpClientService) { }

  /**
   * Get the batch details based on the batch id provided.
   * 
   * @param customerKey 
   * @param batchId 
   */
  getBatchDetails(customerKey:string,batchId:string) : Observable<any> {
    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.GET_BATCH_DETAILS);
    builder.setNamedParameter('customerKey', customerKey);
    builder.setNamedParameter('batchId', batchId);    
    const uri = builder.get();

    return this.http.get( uri );
  }

  /**
   * Get the history ( a.k.a Audit ) of a batch based on the batch id provided.
   * 
   * @param customerKey 
   * @param batchId 
   */
  getBatchHistory(customerKey:string,batchId:string) : Observable<any> {
    const urlBuilder = new RestURLBuilder();
    /* Build the URI */
    const builder = urlBuilder.buildRestURL(Constants.GET_BATCH_HISTORY);
    builder.setNamedParameter('customerKey', customerKey);
    builder.setNamedParameter('batchId', batchId);    
    const uri = builder.get();

    return this.http.get( uri );
  } 

  
}
