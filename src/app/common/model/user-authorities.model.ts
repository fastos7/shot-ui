import { Role } from "./role.mode";
import { Customer } from "./customer.model";

export class UserAuthorities {
    id: number;
    customerKey: string;
    customerName: string; 
    customerLocations : string[];
    roles: string[] = [];
    roleDescriptions: string[] = [];
    roleDTOs: Role[] = [];
    billTos: Customer[] = [];
    isDefaultSite: boolean;
   
    constructor(id: number, 
                customerKey: string = null, 
                customerName : string  =null, 
                roles: string[],
                roleDTOs: Role[]= null,
                billTos: Customer[] = null,
                isDefault: boolean = false) {
        this.id = id;
        this.customerKey = customerKey; 
        this.roles = roles; 
        this.roleDTOs = roleDTOs;
        this.billTos = billTos;
        this.customerName = customerName;
        this.isDefaultSite = isDefault;
    }
}