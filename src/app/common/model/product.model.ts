import { DeliveryMechanism } from "./delivery-mechanism.model";

export class Product {
    
    productDescription      :string;
    entryType               :string;
    processType             :string;
    targetSite              :string;
    schedule                :string;
    batDrugKey              :string;
    batDSUKey               :string;
    triKey                  :string;
    msoIngStkKey            :string;
    batFormulation          :string;
    unitOfMeasure           :string;
    genericDrugDescription  :string;
    batDrugKey2             :string;
	batDSUKey2              :string;
	unitOfMeasure2          :string;
	genericDrugDescription2 :string;	
	batDrugKey3             :string;
	batDSUKey3              :string;
	unitOfMeasure3          :string;
    genericDrugDescription3 :string;
    
    deliveryMechanisms  :DeliveryMechanism[];

    constructor(productDescription:string,
                entryType:string,
                processType:string,
                targetSite:string,
                schedule:string,
                batDrugKey:string,
                batDSUKey:string,
                triKey:string,
                msoIngStkKey:string,
                batFormulation:string,
                unitOfMeasure:string,
                genericDrugDescription:string,
                batDrugKey2:string,
                batDSUKey2:string,
                unitOfMeasure2:string,
                genericDrugDescription2:string,                
                batDrugKey3:string,
                batDSUKey3:string,
                unitOfMeasure3:string,
                genericDrugDescription3:string){

        this.productDescription      = productDescription;
        this.entryType               = entryType;
        this.processType             = processType;
        this.targetSite              = targetSite;
        this.schedule                = schedule;
        this.batDrugKey              = batDrugKey;
        this.batDSUKey               = batDSUKey;
        this.triKey                  = triKey;
        this.msoIngStkKey            = msoIngStkKey;
        this.batFormulation          = batFormulation;                
        this.unitOfMeasure           = unitOfMeasure;
        this.genericDrugDescription  = genericDrugDescription;
        this.batDrugKey2             = batDrugKey2;
	    this.batDSUKey2              = batDSUKey2;
	    this.unitOfMeasure2          = unitOfMeasure2;
	    this.genericDrugDescription2 = genericDrugDescription2;	
	    this.batDrugKey3             = batDrugKey3;
	    this.batDSUKey3              = batDSUKey3;
	    this.unitOfMeasure3          = unitOfMeasure3;
        this.genericDrugDescription3 = genericDrugDescription3;
    }
    
}