import { LocalStoreManager } from '../../common/local-store-manager';
import { User } from '../../common/model/user.model';
import { APIError } from '../../common/model/apiError.model';
import { AlertService } from '../../core/services/alert.service';
import { AuthenticationService } from './authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';
import { environment } from '../../../environments/environment';
import { StorageService } from './../../common/services/storage.service';

@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    loading = false;
    returnUrl: string;
    loginError: string;
    passwordError: string;
    private USER_NAME = 'userName';
    private PASSWORD = 'password';
    private REMEMBER_ME = 'rememberMe';

    // Login Form
    loginForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private eventBusService: EventBusService,
        private formBuilder: FormBuilder,
        private localStoreManager: LocalStoreManager,
        private storageService: StorageService) {
    }

    /**
     * Initializes the Login component with its Login Form.
     */
    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // create the login form
        this.createForm();
    }

    /**
     * Creates the loginForm instance.
     */
    private createForm() {
        let email = this.storageService.getUserEmailFromLocalStorage();
        this.loginForm = this.formBuilder.group({
            userName: [email? email : '', Validators.email],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }

    /**
     * Login Form submit event method.
     */
    onSubmit() {
        this.login();
    }

    /**
     * Login the User by calling the SHOT-login API. On successful login save the User instance
     * in session storage. In case the User clicked on rememberMe checkbox, then save the User instance
     * in local storage.
     * In case of any error trigger the alertService to display error messages.
     */
    login() {
        this.eventBusService.broadcast(Constants.SHOW_LOADING);
        const username = this.loginForm.get(this.USER_NAME).value;
        const password = this.loginForm.get(this.PASSWORD).value;
        this.authenticationService.login(username, password)
            .subscribe(
            response => {

                this.eventBusService.broadcast(Constants.HIDE_LOADING);

                // get the user details from response and store it in session storage
                const user: User = <User> response.body;
                this.storageService.saveUserToSessionStorage(user);

                // get the jwt token from response header and store it in session storage
                const jwt: string = response.headers.get(environment.AUTHORIZATION_HEADER_NAME);
                this.storageService.saveJwtToSessionStorage(jwt);

                // get the jwt expiry time from response header and store it in session storage
                const expiresIn: string = response.headers.get(environment.AUTHORIZATION_EXPIRY_HEADER_NAME);
                this.storageService.saveJwtExpiryTimeToSessionStorage(expiresIn);

                // if "remember me", then keep the details in local storage
                if (this.loginForm.get(this.REMEMBER_ME).value === true) {
                    // Save logged in User data in local storage
                    //this.storageService.saveUserToLocalStorage(user);
                    this.storageService.saveUserEmailToLocalStorage(username);
                }

                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
                if (error.status < 500) {
                    this.alertService.error(error.error.message);
                } else {
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
                }
            });
    }

    onForgotPassword() {
        this.router.navigate(['/forgot-password']);
    }

    /**
     * Validation method for User Name. If email is invalie then the loginError is set with the error message.
     */
    validateEmail(): boolean {
        const loginControl: FormControl = <FormControl>this.loginForm.get(this.USER_NAME);
        if (!this.loginForm.get(this.USER_NAME).valid && this.loginForm.get(this.USER_NAME).touched) {
            if (loginControl.value === '') {
                this.loginError = 'Email is required';
            } else {
                this.loginError = 'Email must be a valid Email Address';
            }
            return false;
        }
        return true;
    }

    validatePassword(): boolean {
        const pwdControl: FormControl = <FormControl>this.loginForm.get(this.PASSWORD);
        if (!pwdControl.valid && pwdControl.touched) {
            if (pwdControl.errors['required']) {
                this.passwordError = 'Password is required';
            } else if (pwdControl.errors['minlength']) {
                this.passwordError = 'Password should have min. 8 characters';
            } else if (pwdControl.errors['maxlength']) {
                this.passwordError = 'Password should have max. 64 characters';
            }
            return false;
        }
        return true;
    }
}