import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../app.constants';

@Injectable()
export class HttpClientService {

  constructor(private http: HttpClient) { }

  post(url: string, body: any, options: any = null): Observable<any> {
    if (options) {
      return this.http.post(url, body, options);
    } else {
      return this.http.post(url, body);
    }    
  }

  put(url: string, body: any, options: any = null): Observable<any> {
    if (options) {
      return this.http.put(url, body, options);
    } else {
      return this.http.put(url, body);      
    }    
  }

  get(url: string, options: any = null): Observable<any> {
    if (options) {
      return this.http.get(url, options);
    } else {
      return this.http.get(url);
    }    
  }

  delete(url: string, body: any=null): Observable<any> {
    if (body) {
      /*
       * Use the `request` method of `HttpClient` for delete requests that contains 
       * body because `delete` method does not accept body.
       */
      return this.http.request(Constants.HTTP_REQUEST_DELETE_METHOD,url,{body:body});
    } else {
      return this.http.delete(url);
    }    
  }
}
