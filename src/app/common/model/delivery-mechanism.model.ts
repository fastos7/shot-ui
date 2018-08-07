import { Diluent } from "./diluent.model";
import { Container } from "./container.model";

export class DeliveryMechanism {
    active      :string;
    key         :string;
    diluent     :Diluent;
    container   :Container;

    constructor(active:string,key:string,diluent:Diluent,container:Container) {
        this.active      = active;
        this.key         = key;        
        this.diluent     = diluent;
        this.container   = container;
    }
}
