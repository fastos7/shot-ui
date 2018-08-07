import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../app.constants';
import { CustomerPreference } from '../model/customer-preference.model';
import { Product } from '../model/product.model';
import { Util } from '../util';
import { HttpClientService } from './http-client.service';

/**
 * This service is used to call Customer Preference related APIs.
 * 
 * @author Marlon Cenita
 * 
 */
@Injectable()
export class CustomerPreferencesService {
  
  constructor(private http: HttpClientService) { }

  /**
   * Get the the customer product preferences. When there is no preferences for 
   * a given customer and product it will return 404 NOT_FOUND. 
   * 
   * @param customerKey 
   * @param product 
   */
  getAllCustomerPreferences(customerKey:string,customerProduct:Product) : Observable<any> {

    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.CUSTOMER_PREFERENCES_API_URL);
    builder.setNamedParameter("customerKey",customerKey)
    builder.setQueryParameter("productDescription",customerProduct.productDescription);
    builder.setQueryParameter("productType",customerProduct.entryType);    
    builder.setQueryParameter("batDrugKey",customerProduct.batDrugKey ? customerProduct.batDrugKey : "null");
    builder.setQueryParameter("batDSUKey",customerProduct.batDSUKey ? customerProduct.batDSUKey : "null");
    builder.setQueryParameter("triKey",customerProduct.triKey ? customerProduct.triKey : "null");
    builder.setQueryParameter("msoIngStkKey",customerProduct.msoIngStkKey ? customerProduct.msoIngStkKey : "null");
    builder.setQueryParameter("batFormulation",customerProduct.batFormulation ? customerProduct.batFormulation : "null");

    let uri = builder.get(); 
    
    return this.http.get( uri );
  }

  /**
   * Create a customer preference. When successful, the API will return 201 
   * CREATED.
   *  
   * @param customerKey 
   * @param customerPrefence 
   */
  createCustomerPreferences(customerKey:string,customerPrefence:CustomerPreference) : Observable<any> {
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.CREATE_CUSTOMER_PREFERENCES_API_URL);
    builder.setNamedParameter("customerKey",customerKey)
    
    let uri = builder.get(); 
    
    return this.http.post( uri,customerPrefence );
  }

  /**
   * Saves a customer preference. When successful, the API will return 200 OK.
   * 
   * @param customerKey 
   * @param customerPrefence 
   */
  updateCustomerPreference(customerKey:string,customerPrefence:CustomerPreference) : Observable<any> {
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.UPDATE_CUSTOMER_PREFERENCE_API_URL);
    builder.setNamedParameter("customerKey",customerKey)
    builder.setNamedParameter("prefId",""+customerPrefence.prefId)
    
    let uri = builder.get(); 
    
    return this.http.put( uri,customerPrefence );
  }

  /**
   * Saves a customer preference. When successful, the API will return 200 OK.
   * 
   * @param customerKey 
   * @param customerPrefence 
   */
  updateCustomerPreferences(customerKey:string,customerPrefence:CustomerPreference[]) : Observable<any> {
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.UPDATE_CUSTOMER_PREFERENCES_API_URL);
    builder.setNamedParameter("customerKey",customerKey)
    
    
    let uri = builder.get(); 
    
    return this.http.put( uri,customerPrefence );
  }
  
  /**
   * Deletes an array of Customer Preferences. When successful, the API will 
   * return 204 NO_CONTENT. 
   * 
   * @param customerKey 
   * @param customerPrefences 
   */
  deleteCustomerPreferences(customerKey:string,customerPrefences:CustomerPreference[]) : Observable<any> {
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.DELETE_CUSTOMER_PREFERENCES_API_URL);
    builder.setNamedParameter("customerKey",customerKey)
    
    let uri = builder.get(); 
    
    return this.http.delete( uri,customerPrefences );
  }

  /**
   * Try to find a matching preference. When successful, the API will return 200
   * SUCCESS and the data payload will contain a JSON object representing a 
   * `CustomerPreference` object. If there are no preference found it will 
   * return 404 NOT_FOUND.
   * 
   * @param customerKey 
   * @param product 
   * @param dose 
   * @param deliveryMechanismKey 
   * @param routeKey 
   * @param volume 
   * @param exact 
   * @param infusionDuration 
   */
  getMatchingPreference(customerKey:string,
                        product:Product,
                        dose:string,
                        deliveryMechanismKey:string,
                        routeKey:string,
                        volume:string,
                        exact:string,
                        infusionDuration:string): Observable<any> {
    
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.GET_MATCHING_PREFERENCE_API_URL);
    builder.setNamedParameter("customerKey",customerKey)
    builder.setQueryParameter("productDescription",product.productDescription);
    builder.setQueryParameter("productType",product.entryType);    
    builder.setQueryParameter("batDrugKey",Util.toNullString(product.batDrugKey));
    builder.setQueryParameter("batDSUKey",Util.toNullString(product.batDSUKey));
    builder.setQueryParameter("triKey",Util.toNullString(product.triKey));
    builder.setQueryParameter("msoIngStkKey",Util.toNullString(product.msoIngStkKey));
    builder.setQueryParameter("batFormulation",Util.toNullString(product.batFormulation));
    builder.setQueryParameter("dose",Util.toNullString(String(dose)));
    builder.setQueryParameter("deliveryMechanism",Util.toNullString(deliveryMechanismKey));
    builder.setQueryParameter("route",Util.toNullString(routeKey));
    builder.setQueryParameter("volume",Util.toNullString(String(volume)));
    builder.setQueryParameter("exact",Util.toNullString(exact));                               
    builder.setQueryParameter("infusionDuration",Util.toNullString(String(infusionDuration)));

    let uri = builder.get(); 
    
    return this.http.get( uri );
  }
}