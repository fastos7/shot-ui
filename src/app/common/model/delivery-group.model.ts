import { DeliveryDateTime } from './delivery-datetime.model';
export class DeliveryGroup {
    facilityName: string;
    facilityContactNo: string;
    displayIsRestrictedFlag: boolean;

    deliveryDateTimes: DeliveryDateTime[];
}