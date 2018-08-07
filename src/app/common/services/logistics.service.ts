import { DeliveryGroup } from '../model/delivery-group.model';
import { BatchOrder } from '../model/batch-order.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { DeliveryLocation } from '../model/delivery-location.model';
import { Product } from '../model/product.model';
import { HttpClientService } from './http-client.service';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../app.constants';
import { DeliveryRunRequest, DeliveryRunQuantity } from '../model/logistics-req.model';

@Injectable()
export class LogisticsService {
    constructor(private http: HttpClientService) { }
    
    getDeliveryDateTimes(customerKey: string, product: Product, quantity: number, deliveryRunQuantities?:DeliveryRunQuantity[]) {
        let logisticsReq: DeliveryRunRequest = new DeliveryRunRequest(customerKey, product, quantity, deliveryRunQuantities);

        const urlBuilder = new RestURLBuilder();
        const builder = urlBuilder.buildRestURL(Constants.DELIVERY_RUN_API_URL);
        builder.setNamedParameter('customerKey', customerKey);
        
        const uri = builder.get();
        
        // Call the SHOT API
        return this.http.post(uri, logisticsReq);
            //.catch(this.handleError);
    }

    getDeliveryLocations(customerKey: string) {
        const urlBuilder = new RestURLBuilder();
        const builder = urlBuilder.buildRestURL(Constants.DELIVERY_LOCATIONS_API_URL);
        builder.setNamedParameter('customerKey', customerKey);

        const uri = builder.get();
        // Call the SHOT API
        return this.http.get(uri);
}

    private handleError (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
}
