import { DeliveryMechanism } from "./delivery-mechanism.model";
import { AdministrationRoute } from "./administration-route.model";

export class CustomerPreference {

    prefId              :number;
    customerKey         :string;
    customerName        :string;	
    productDescription  :string;	
    productType         :string;	
    batDrugKey          :string;	
    batDSUKey           :string;	
    triKey              :string;	
    msoIngStkKey        :string;	
    batFormulation      :string;	
    doseFrom            :number;
    doseTo              :number;
    unitOfMeasure       :string;
    deliveryMechanism   :DeliveryMechanism;	
    volume              :number;
    exact               :string;
    quantity            :number;
    administrationRoute :AdministrationRoute;
    infusionDuration    :number;
    rank                :number;
    comments            :string;
    createdBy           :number;
    updatedBy           :number;

    constructor(prefId:number,
        customerKey:string,
        customerName:string,	
        productDescription:string,	
        productType:string,	
        batDrugKey:string,	
        batDSUKey:string,	
        triKey:string,	
        msoIngStkKey:string,	
        batFormulation:string,	
        doseFrom:number,
        doseTo:number,
        unitOfMeasure:string,
        deliveryMechanism:DeliveryMechanism,	
        volume:number,
        exact:string,
        quantity:number,
        administrationRoute:AdministrationRoute,
        infusionDuration:number,
        rank:number,
        comments:string,
        createdBy:number,
        updatedBy:number){

            this.prefId               = prefId;    
            this.customerKey          = customerKey;        
            this.customerName         = customerName;       
            this.productDescription   = productDescription; 
            this.productType          = productType;        
            this.batDrugKey           = batDrugKey;         
            this.batDSUKey            = batDSUKey;          
            this.triKey               = triKey;             
            this.msoIngStkKey         = msoIngStkKey;       
            this.batFormulation       = batFormulation;     
            this.doseFrom             = doseFrom;           
            this.doseTo               = doseTo;             
            this.unitOfMeasure        = unitOfMeasure;      
            this.deliveryMechanism    = deliveryMechanism;  
            this.volume               = volume;             
            this.exact                = exact;              
            this.quantity             = quantity;           
            this.administrationRoute  = administrationRoute;
            this.infusionDuration     = infusionDuration;   
            this.rank                 = rank;               
            this.comments             = comments; 
            this.createdBy            = createdBy;
            this.updatedBy            = updatedBy;
    }
}
