import { Product } from "./product.model";
import { Constants } from "../app.constants";

export class DeliveryRunRequest {
    customerKey: string;
    orderType: number;
    quantity: number;
    entityKey: string;
    deliveryRunQuantites: DeliveryRunQuantity[];

    constructor(customerKey: string, product: Product, quantity: number, deliveryRunQuantites?: DeliveryRunQuantity[]) {
        this.customerKey = customerKey;
        this.quantity = quantity;
        this.entityKey = product.targetSite;
        this.deliveryRunQuantites = deliveryRunQuantites;

        /*
         * Need to map the product type to either Formulation (0) or 
         * Non-formulation (1). 
         */
        switch (product.entryType) {
            case Constants.PRODUCT_ENTRY_TYPE_STANDARD:
            case Constants.PRODUCT_ENTRY_TYPE_CONSIGNMENT:
            case Constants.PRODUCT_ENTRY_TYPE_CLINICAL_TRIAL:
            case Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG:
                this.orderType = 0; // Set to Non-Formulation
                break;
            case Constants.PRODUCT_ENTRY_TYPE_FORMULATION:
            case Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION:
                this.orderType = 1; // Set to Non-Formulation
                break;
        }
    }
}

export class DeliveryRunQuantity {
    dispatchDateTime: string;
    totalQuantity: number;

    constructor(dispatchDateTime: string, totalQuantity: number) {
        this.dispatchDateTime = dispatchDateTime;
        this.totalQuantity = totalQuantity;
    }
}