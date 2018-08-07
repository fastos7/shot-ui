import { Injectable } from "@angular/core";
import { User } from "../common/model/user.model";
import { Observable } from "rxjs/Observable";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { RestURLBuilder } from "rest-url-builder";
import { Constants } from "../common/app.constants";
import { Subject } from "rxjs/Subject";
import { first } from "rxjs/operator/first";
import { HttpClientService } from "../common/services/http-client.service";

/**
 * Service class for handling User Account related operations such as Create/Update/Delete
 */
@Injectable()
export class UserAccountService {
    private editUserSubject: Subject<User> = new Subject<User>();
    private deleteUserSubject: Subject<User> = new Subject<User>();
    private resetUserSubject: Subject<User> = new Subject<User>();
    private addUserSubject: Subject<User> = new Subject<User>();
    private searchUserSubject: Subject<User> = new Subject<User>();
    private savedUserSubject: Subject<User> = new Subject<User>();

    constructor(private http: HttpClientService) { }

    /**
     * Creates the User Account for the provided user.
     * @param user User whose account is to be created.
     */
    createUser(user: User): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USERS_API_BASE_URL);
        let url: string = builder.get();

        return this.http.post(url, user);
    }

    /**
     * Updates the User Account for the provided user.
     * @param user User whose account is to be updated.
     */
    updateUser(user: User): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USER_API_URL);
        builder.setNamedParameter("userId", String(user.userId));
        let url: string = builder.get();

        return this.http.put(url, user);
    }

    /**
     * Delete the User Account for the provided user.
     * @param user User whose account is to be updated.
     */
    deleteUser(user: User): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USER_API_URL);
        builder.setNamedParameter("userId", String(user.userId));
        let url: string = builder.get();

        // TODO : Remove the json call
        return this.http.delete(url, user);
        // return this.http.delete(url, user)
        //     .map((res: Response) => {
        //         if (res.json()) {
        //             return res.json();
        //         } else {
        //             return 'success';
        //         }
        //     });
    }

    /**
     * Get User sites based on User's role
     * @param user User instance.
     * @param roleName User's role name. 
     */
    getUserSitesAndRoles(user: User, roleName: string): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USER_SITES_AND_ROLES_API_URL);
        builder.setNamedParameter("userId",""+user.userId)
        builder.setQueryParameter("roleName",roleName);

        let uri = builder.get(); 

        return this.http.get(uri);
    }

    searchUsers(firstName: string, lastName: string, email: string, isActive: string, siteKey: string, roleId: string, loginUserId?: number, loginRole?: string): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USERS_SEARCH_API_URL);
        let params: URLSearchParams = new URLSearchParams();
        if (firstName != null && firstName != '') {
            builder.setQueryParameter("firstName",firstName);
        }
        if (lastName != null && lastName != '') {
            builder.setQueryParameter('lastName', lastName);
        }
        if (email != null && email != '') {
            builder.setQueryParameter('email', email);
        }
        if (isActive != null && isActive != '') {
            builder.setQueryParameter('isActive', isActive);
        }
        if (siteKey != null && siteKey != '') {
            builder.setQueryParameter('siteKey', siteKey);
        }
        if (roleId != null && roleId != '') {
            builder.setQueryParameter('roleId', roleId);
        }
        if (loginUserId) {
            builder.setQueryParameter('loginUserId', String(loginUserId));
        }
        if (loginRole) {
            builder.setQueryParameter('loginRole', loginRole);
        }
        let url = builder.get(); 

        return this.http.get(url);
    }

    /**
     * Updates User Account Preferences: Default Site and Default Order View.
     * @param user User instance.
     */
    updateAccPreferences(user: User): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USER_ACC_PREF_API_URL);
        builder.setNamedParameter("userId", String(user.userId));
        let url: string = builder.get();

        return this.http.put(url, user);
    }

    updateUserPassword(user: User): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.USER_PASSWORD_API_URL);
        builder.setNamedParameter("userId", String(user.userId));
        let url: string = builder.get();

        return this.http.put(url, user);
    }

    subscribeToEditUser(): Observable<User> {
        return this.editUserSubject.asObservable();
    }

    triggerEditUser(user: User) {
        this.editUserSubject.next(user);
    }

    subscribeToDeleteUser(): Observable<User> {
        return this.deleteUserSubject.asObservable();
    }

    triggerDeleteUser(user: User) {
        this.deleteUserSubject.next(user);
    }

    subscribeToResetUser(): Observable<User> {
        return this.resetUserSubject.asObservable();
    }

    triggerResetUser() {
        this.resetUserSubject.next();
    }

    subscribeToAddUser(): Observable<User> {
        return this.addUserSubject.asObservable();
    }

    triggerAddUser() {
        this.addUserSubject.next();
    }

    subscribeToSearchUser(): Observable<User> {
        return this.searchUserSubject.asObservable();
    }

    triggerSearchUser() {
        this.searchUserSubject.next();
    }
    
    subscribeToSavedUser(): Observable<User> {
        return this.savedUserSubject.asObservable();
    }

    triggerSavedUser(user: User) {
        this.savedUserSubject.next(user);
    }

}