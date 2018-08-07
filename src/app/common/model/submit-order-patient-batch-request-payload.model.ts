export class SubmitOrderPatientBatchRequestPayload {

    batchId                         : number;
    productDescription              : string;
    productDescription2             : string;
    productDescription3             : string;    
    closedSystem                    : boolean;
    infusionDuration                : string;
	deliveryMechanismDescription    : string;
	comments                        : string;
	routeName                       : string;
    treatmentDateTime               : string;
    status                          : string;
    productType                     : string;    
    quantity                        : number;
    isDeliveryRunRestricted         : boolean;
    hasDeliveryRunIncentive         : boolean;    

    constructor(){}
}
