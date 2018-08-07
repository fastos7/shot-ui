import { Product } from './product.model';
import { DeliveryLocation } from './delivery-location.model';
import { DeliveryDateTime } from './delivery-datetime.model';
import { DeliveryRunQuantity } from './logistics-req.model';

export class BatchProduct {
    batchProductId: number;
    product: Product;

    quantity: number;
    deliveryDateTime: DeliveryDateTime;
    deliveryLocation: DeliveryLocation;

    deliveryRunQuantities: DeliveryRunQuantity[];
}