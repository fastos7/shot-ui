import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { User } from "../model/user.model";
import { Observable } from "rxjs/Observable";
import { RestURLBuilder } from "rest-url-builder";
import { Constants } from "../app.constants";
import { Subject } from "rxjs/Subject";
import { PasswordReset } from "../model/password-reset.model";
import { HttpClientService } from "./http-client.service";

/**
 * Service class for handling User Account related operations such as Create/Update/Delete
 */
@Injectable()
export class PasswordResetService {
    private resetUserSubject: Subject<User> = new Subject<User>();

    constructor(private http: HttpClientService) { }

    /**
     * Calls API to generate a Password reset token and send mail.
     * @param email 
     */
    generateTokenAndMail(email: string) {
        let builder = new RestURLBuilder().buildRestURL(Constants.PASSWORD_RESET_API_URL);
        let url: string = builder.get();

        let passwordReset: PasswordReset = new PasswordReset(email);
        return this.http.post(url, passwordReset);
    }

    /**
     * Reset password based on the password reset token and the new password.
     * @param resetPasswordData 
     */
   resetPassword(resetPasswordData: PasswordReset): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.PASSWORD_RESET_TOKEN_API_URL);
        builder.setNamedParameter('resetToken', resetPasswordData.resetToken);
        let url: string = builder.get();

        return this.http.put(url, resetPasswordData);
    }
}