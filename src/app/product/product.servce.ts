import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Product } from '../common/model/product.model';

@Injectable()
export class ProductService {
    constructor(private http: Http) { }


    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
}