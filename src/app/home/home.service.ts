import { Injectable } from "@angular/core";
import { User } from "../common/model/user.model";
import { Observable } from "rxjs/Observable";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { RestURLBuilder } from "rest-url-builder";
import { Constants } from "../common/app.constants";
import { Subject } from "rxjs/Subject";
import { HttpClientService } from "../common/services/http-client.service";

@Injectable()
export class HomeService {
    constructor(private http: HttpClientService) { }

    getHomePageActions(): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.HOMEPAGE_ACTIONS_API_URL);
        let uri = builder.get();

        return this.http.get(uri);
    }

}
