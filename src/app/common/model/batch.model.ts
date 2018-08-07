import { BatchProduct } from './batch-product.model';
import { Patient } from './patient.model';
import { Product } from './product.model';
import { DeliveryMechanism } from './delivery-mechanism.model';
import { AdministrationRoute } from './administration-route.model';
import { DeliveryLocation } from './delivery-location.model';
import { DeliveryDateTime } from './delivery-datetime.model';
export class Batch {
    
    batchId             : number;
    customerKey         : string;
    isNonPatient        : boolean;
    patient             : Patient;
    batchProduct        : BatchProduct[];
    product             : Product;
    productDesc         : string;
    productDesc2        : string;
    productDesc3        : string;
    dose                : number;
    dose2               : number;
    dose3               : number;
    doseUnit            : string;
    doseUnit2           : string;
    doseUnit3           : string;
    deliveryMechanism   : DeliveryMechanism;
    closedSystem        : boolean;    
    volume              : number;
    exact               : string;
    infusionDuration    : string;
    route               : AdministrationRoute;    
    quantity            : number;
    comments            : string;
    createdDate         : string;
    deliveryLocation    : DeliveryLocation;
    deliveryDateTime    : DeliveryDateTime;
    treatmentDateTime   : string;
    status              : string;

    constructor() {}
}