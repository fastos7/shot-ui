export class DisplayBatch {
    batchId: string;
    orderId: string;
    productDescription: string;
    dose: number;
    doseUnit: string;
    productDescription2: string;
    dose2: number;
    doseUnit2: string;
    productDescription3: string;
    dose3: number;
    doseUnit3: string;
    deliveryMechanismDescription: string;
    closedSystem: boolean;
    specifiedVolume: number;
    exact: string;
    routeName: string;
    infusionDuration: string;
    quantity: number;
    expiryDate: string;
    price: number;
    status: string;
    ordNo: string;

    constructor(batchId, orderId, productDescription, dose, doseUnit,
                productDescription2 = null, dose2 = null, doseUnit2 = null,
                productDescription3 = null, dose3 = null, doseUnit3 = null,
                deliveryMechanismDescription, closedSystem, specifiedVolume, exact,
                routeName, infusionDuration, quantity, expiryDate, price = null, status, ordNo) {
        this.batchId = batchId;
        this.orderId = orderId;
        this.productDescription = productDescription;
        this.dose = dose;
        this.doseUnit = doseUnit;
        this.productDescription2 = productDescription2;
        this.dose2 = dose2;
        this.doseUnit2 = doseUnit2;
        this.productDescription3 = productDescription3;
        this.dose3 = dose3;
        this.doseUnit3 = doseUnit3;
        this.deliveryMechanismDescription = deliveryMechanismDescription;
        this.closedSystem = closedSystem;
        this.specifiedVolume = specifiedVolume;
        this.exact = exact;
        this.routeName = routeName;
        this.infusionDuration = infusionDuration;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.price = price;
        this.status = status;
        this.ordNo = ordNo;
    }
}
