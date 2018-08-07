import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Product } from "../common/model/product.model";
import { BatchOrder } from "../common/model/batch-order.model";
import { DeliveryDateTime } from "../common/model/delivery-datetime.model";
import { DeliveryLocation } from "../common/model/delivery-location.model";
import { BatchProduct } from "../common/model/batch-product.model";

/**
 * Service related to an Order's Batch during Order creation
 */
@Injectable()
export class BatchCreationService {

    private productQtyChangeSubj = new Subject<any>();
    private deliveryDttChangedSubj = new Subject<any>();
    private deliveryLocChangedSubj = new Subject<any>();

    constructor(private http: Http) { }


    /**
     * This method is used to subscribe to Product and/or Quantity changes.
     */
    productQtyChanged(): Observable<any> {
        return this.productQtyChangeSubj.asObservable();
    }

    /**
     * Emits event using Subject: productChangeSubj 
     * whenever Product selection changes
     * @param batchProduct 
     */
    public changeProductQty(batchProduct: BatchProduct) {
        this.productQtyChangeSubj.next(batchProduct);
    }

    /**
     * This method is used to subscribe to Delivery Date Time changes.
     */
    deliveryDttChanged(): Observable<any> {
        return this.deliveryDttChangedSubj.asObservable();
    }

    /**
     * Emits event using Subject: deliveryDttChangedSubj 
     * whenever Delivery Date Time selection changes
     * @param product 
     */
    public changedeliveryDtt(deliveryDateTime: DeliveryDateTime) {
        this.deliveryDttChangedSubj.next(deliveryDateTime);
    }
    
    /**
     * This method is used to subscribe to Delivery Location changes.
     */
    deliveryLocationChanged(): Observable<any> {
        return this.deliveryLocChangedSubj.asObservable();
    }

    /**
     * Emits event using Subject: deliveryLocChangedSubj 
     * whenever Delivery Location selection changes
     * @param batchOrder 
     */
    public changeDeliveryLocation(deliveryLocation: DeliveryLocation) {
        //this.deliveryLocChangedSubj.next(deliveryLocation);
    }

}