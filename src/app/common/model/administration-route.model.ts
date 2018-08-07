export class AdministrationRoute{
    code        : string;
    codeType    : string;
    description : string;
    
    constructor(code:string, codeType:string,description:string) {
        this.code        = code;
        this.codeType    = codeType;
        this.description = description;
    }
}
