import { Injectable } from '@angular/core';
import { HttpClientService } from '../../common/services/http-client.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { UserService } from '../../common/services/user.service';

@Injectable()
export class AuthenticationService {

    private _loginURL = '/shot/login';
    constructor(private _http: HttpClientService,
                private userService:UserService) { }

    login(username: string, password: string): Observable<HttpResponse<any>> {
        const options = { observe: 'response' };
        const credentials = { 'username': username, 'password': password };
        return this._http.post(this._loginURL, credentials, options);
    }

    logout() {
        /*
         * Clear the current user information in the memory so that when the 
         * User logs in, it will get the user updated user information from data
         * storage. 
         */
        this.userService.clearCurrentUser();

        // Delete the session
        sessionStorage.removeItem(environment.AUTHORIZATION_EXPIRY_HEADER_NAME);
        sessionStorage.removeItem(environment.AUTHORIZATION_HEADER_NAME);
        sessionStorage.removeItem(environment.CURRENT_USER_KEY);
    }
}

