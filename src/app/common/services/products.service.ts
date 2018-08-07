import { Injectable } from '@angular/core';
import { RestURLBuilder } from 'rest-url-builder';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../app.constants';
import { HttpClientService } from './http-client.service';
import { Product } from '../model/product.model';
import { Util } from '../util';

/**
 * This service provides methods for retrieving product related information.
 * 
 * @author Marlon Cenita
 */
@Injectable()
export class ProductsService {

  constructor(private http: HttpClientService) { }

  /**
   * Thid method will retrieve the attributes of a product. As of now it will 
   * only contain Administration Routes.
   * 
   * @param productKey 
   */
  getProductAttributes(customerKey:string,product:Product) : Observable<any> {
    
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.PRODUCT_ATTRIBUTES_API_URL);    
    builder.setNamedParameter("customerKey",customerKey);    
    builder.setQueryParameter("drugKey1",Util.toNullString(product.batDrugKey));
    builder.setQueryParameter("drugKey2",Util.toNullString(product.batDrugKey2));
    builder.setQueryParameter("drugKey3",Util.toNullString(product.batDrugKey3));
    let uri = builder.get(); 
    
    return this.http.get( uri );
  }

  /**
   * This method will retrieve products that matched the `productDescription` 
   * parameter.   
   * @param productKey 
   */
  getProducts(customerKey:string,productDescription:string,resultSet:string) : Observable<any> {
    
    /* Build the URI */
    let builder = new RestURLBuilder().buildRestURL(Constants.CUSTOMER_PRODUCT_SEARCH_API_URL);    
    builder.setNamedParameter("customerKey",customerKey);
    builder.setQueryParameter("searchStr",productDescription);
    builder.setQueryParameter("resultSet",resultSet);    
    let uri = builder.get(); 
    
    return this.http.get( uri );
  }
}
