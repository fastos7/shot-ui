import { HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpResponse, HttpUserEvent, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgModule } from '@angular/core/src/metadata/ng_module';
import { ProviderAst } from '@angular/compiler';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { AppRoutingModule } from './../../app-routing.module';
import { StorageService } from '../services/storage.service';
import { EventBusService } from '../services/event-bus.service';
import { Constants } from '../app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                private storageService: StorageService,
                private eventBusService: EventBusService) {}

    // tslint:disable-next-line:max-line-length
    intercept(originalRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        // some requests dont need Authorization header; e.g. login, logout or signup - which other requests dont need the authorization?
        if (originalRequest.url.includes('/login')
            || originalRequest.url.includes('/logout')
            || originalRequest.url.includes('/password/token')
            || originalRequest.url.includes('/contactus/email')) {
            return next.handle(originalRequest);
        } else {
            let jwt = this.getJwtToken();
            // if no token found, that is if the user is not logged-in, then redirect to login page
            if (!jwt || this.jwtExpired()) {
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
                this.router.navigateByUrl('/logout');
            } else {
                const headers = new HttpHeaders().set(environment.AUTHORIZATION_HEADER_NAME, jwt);
                // append Authorization header to the original request.
                const updatedRequest = originalRequest.clone({ headers });
                return next.handle(updatedRequest)._do(
                    event => {
                        if (event instanceof HttpResponse) {
                            jwt = event.headers.get(environment.AUTHORIZATION_HEADER_NAME);
                            const jwtExpiresIn = event.headers.get(environment.AUTHORIZATION_EXPIRY_HEADER_NAME);
                            // reset the JWT and its expiry
                            this.storageService.saveJwtToSessionStorage(jwt);
                            this.storageService.saveJwtExpiryTimeToSessionStorage(jwtExpiresIn);
                        }
                    }
                );
            }
        }
    }

    // get the token from session storage
    // this token was originally set after successful login
    getJwtToken(): string {
        return sessionStorage.getItem(environment.AUTHORIZATION_HEADER_NAME);
    }

    // return true if the token is expired
    jwtExpired(): boolean {
        const jwtExpiry = sessionStorage.getItem(environment.AUTHORIZATION_EXPIRY_HEADER_NAME);
        const current = new Date();
        const expiry = new Date(jwtExpiry);
        return (expiry < current);
    }
}
