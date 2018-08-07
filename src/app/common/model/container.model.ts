export class Container {
    
    stockCode           :string;
    stockDescription    :string;
    stockKey            :string;

    constructor(stockCode:string,stockDescription:string,stockKey:string) {
        this.stockCode          = stockCode;
        this.stockDescription   = stockDescription;
        this.stockKey           = stockKey;
    }
}
