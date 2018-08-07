import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Batch } from '../common/model/batch.model';
import { Patient } from '../common/model/patient.model';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../common/app.constants';
import { SubmitOrderRequestPayload } from '../common/model/submit-order-request-payload.model';
import { HttpClientService } from '../common/services/http-client.service';
import { utils } from 'protractor';
import { Util } from '../common/util';

@Injectable()
export class CreateOrderService {
    constructor(private httpService:HttpClientService) { }

    /**
     * Get Patient History list from API for the given Customer's Patient.
     * @param customerKey 
     * @param patient
     */
    getOrderHistory(customerKey: string, patient: Patient) {
         /* Build the URI */
        let builder = new RestURLBuilder().buildRestURL(Constants.GET_ORDER_HISTORY_API_URL);    
        builder.setNamedParameter("customerKey",customerKey)    
        builder.setQueryParameter("patientId",Util.toNullString(""+patient.patientId));
        let uri = builder.get(); 

        return this.httpService.get(uri);
    }

    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

  /**
   * This method calls the Create Order API a.k.a "Calc Ingredients"
   * 
   * @param productKey 
   * 
   * @author Marlon Cenita
   */
  createOrder(customerKey:string,orderPayload:any) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.CREATE_ORDER_API_URL);    
    builder.setNamedParameter("customerKey",customerKey)    
    let uri = builder.get(); 

    return this.httpService.post(uri,orderPayload);

  }

  /**
   * This method calls updates the batch comment's only.
   * 
   * @param productKey 
   * 
   * @author Marlon Cenita
   */
  updateBatchComments(customerKey:string,batchPayload:any) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.UPDATE_BATCH_API_URL);    
    builder.setNamedParameter("customerKey",customerKey)    
    builder.setNamedParameter("batchId",batchPayload.shotBatchId);    
    let uri = builder.get(); 

    return this.httpService.put(uri,batchPayload);

  }

  /**
   * This method calls updates the batch.
   * 
   * @param productKey 
   * 
   * @author Marlon Cenita
   */
  updateBatch(customerKey:string,batchPayload:any) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.UPDATE_BATCH_API_URL);    
    builder.setNamedParameter("customerKey",customerKey)    
    builder.setNamedParameter("batchId",batchPayload.shotBatchId);    
    let uri = builder.get(); 

    return this.httpService.put(uri,batchPayload);

  }

  /**
   * This method calls updates the batch.
   * 
   * @param productKey 
   * 
   * @author Marlon Cenita
   */
  cancelBatch(customerKey:string,batchPayload:any) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.CANCEL_BATCH_API_URL);    
    builder.setNamedParameter("customerKey",customerKey)    
    builder.setNamedParameter("batchId",batchPayload.shotBatchId);    
    let uri = builder.get(); 

    return this.httpService.post(uri,batchPayload);

  }

  offHoldBatch(customerKey:string,batchPayload:any) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.OFF_HOLD_BATCH_API_URL);    
    builder.setNamedParameter("customerKey",customerKey)    
    builder.setNamedParameter("batchId",batchPayload.shotBatchId);    
    let uri = builder.get(); 

    return this.httpService.post(uri,batchPayload);

  }

  /**
   * This method calls the Create Order API a.k.a "Calc Ingredients"
   * 
   * @param productKey 
   * 
   * @author Marlon Cenita
   */
  submitOrder(customerKey: string,submitOrderRequestPayload:SubmitOrderRequestPayload[]) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.SUBMIT_ORDERS_API_URL);    
    builder.setNamedParameter("customerKey",customerKey)    
    let uri = builder.get(); 

    return this.httpService.post(uri,submitOrderRequestPayload);

  }
}
