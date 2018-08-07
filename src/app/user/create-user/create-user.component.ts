import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../common/model/user.model';
import { AlertService } from '../../core/services/alert.service';
import { UserService } from '../../common/services/user.service';
import { UserAccountService } from '../user-account.service';
import { Constants } from '../../common/app.constants';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { AddUserSiteComponent } from '../add-user-site/add-user-site.component';
import { FormArray } from '@angular/forms/src/model';
import { Role } from '../../common/model/role.mode';
import { Subscription } from 'rxjs/Subscription';
import { EventBusService } from '../../common/services/event-bus.service';
import { APIError } from '../../common/model/apiError.model';

@Component({
    selector: 'app-create-user',
    styleUrls: ['create-user.component.css'],
    templateUrl: 'create-user.component.html'
})
export class CreateUserComponent implements OnInit, OnDestroy {
    private editUserSubscription: Subscription;
    private resetUserSubscription: Subscription;

    // Component Input(s)

    // SHOT User to edit
    @Input() user: User;
    @Input() private sites: UserAuthorities[];
    @Input() private roles: Role[];

    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    // Form fields
    private userSites: UserAuthorities[] = [];
    private userSiteKeys: string[] = [];
    // private userSitesArray: FormArray;

    // Loggedin User
    private loginUser: User;
    private isLoginUserSladeAdmin: boolean = false;


    // Booleab flags for the UI
    private isSladeAdmin = false;
    private isActive = true;
    private editingSladeAdmin = false;

    private defaultSite: string;
    private pwdErrMsg: string;

    // Add Edit User Form
    addEditUserForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private alertService: AlertService,
        private userService: UserService,
        private eventBusService: EventBusService,
        private userAccService: UserAccountService) {
    }

    /**
     * Initializes this Component
     */
    ngOnInit() {
        this.initializeComponentForm();

        // Subscribe to Edit User action
        this.editUserSubscription = this.userAccService.subscribeToEditUser().subscribe(
            (selectedUser: User) => {
                this.user = selectedUser;
                this.isSladeAdmin = selectedUser.isShotAdmin;
                this.userSites = [];
                this.editingSladeAdmin = this.isSladeAdmin;
                this.initializeComponentForm();
            }
        );

        // Subscribe to Reset User action
        this.resetUserSubscription = this.userAccService.subscribeToResetUser().subscribe(
            () => {
                this.resetComponent();
            }
        );
    }

    initializeComponentForm() {
        // Create User Form
        this.createForm();
        // this.userSitesArray = this.addEditUserForm.get("userSitesArray") as FormArray;

        // Get the Login User
        this.loginUser = this.userService.getCurrentUser();
        this.isLoginUserSladeAdmin = this.isLoginUserHasRole(Constants.ROLE_SLADE_ADMIN);

        // If User to save is NEW
        if (!this.user) {
            this.addUserSite(true);
            this.isActive = true;
        } else {
            // If User to save already exists
            this.isSladeAdmin = this.user.isShotAdmin;
            this.userSites = [];
            this.userSiteKeys = [];
            this.editingSladeAdmin = this.isSladeAdmin;
            this.isActive = this.user.isActive;
            this.addUserSites();
        }
        this.alertService.reset();
    }

    /**
     * Creates the addEditUserForm instance.
     */
    private createForm() {
        if (!this.user) {
            this.addEditUserForm = this.formBuilder.group({
                firstName: [this.user ? this.user.firstName : '', Validators.required],
                lastName: [this.user ? this.user.lastName : '', Validators.required],
                email: [this.user ? this.user.email : '', Validators.email],
                password: ['', Validators.required/*, Validators.minLength(8)*/],
                confirmPassword: ['', Validators.required],
                status: [this.user ? this.user.isActive : 'true', Validators.required],
                isSladeAdmin: [this.user ? this.user.isShotAdmin : false]
                // ,userSitesArray: this.formBuilder.array([], Validators.required)
            });
        } else {
            this.addEditUserForm = this.formBuilder.group({
                firstName: [this.user ? this.user.firstName : '', Validators.required],
                lastName: [this.user ? this.user.lastName : '', Validators.required],
                email: [this.user ? this.user.email : '', Validators.email],
                status: [this.user ? this.user.isActive : '', Validators.required],
                isSladeAdmin: [this.user ? this.user.isShotAdmin : false]
                // ,userSitesArray: this.formBuilder.array([], Validators.required)
            });
        }
    }

    /**
     * Validates the form control based on the validator configured with the control.
     * @param fieldName 
     * @param touched Boolean flag that indicates if touched is also required during validation.
     */
    validateRequiredFields(fieldName, touched = true) {
        let formControl: FormControl = <FormControl>this.addEditUserForm.get(fieldName);
        if (touched) {
            if (!formControl.valid && formControl.touched) {
                return false;
            }
        } else {
            return formControl.valid;
        }
        return true;
    }

    /**
     * Validation method for Email.
     */
    getEmailValidationMessage(): string {
        let formControl: FormControl = <FormControl>this.addEditUserForm.get('email');
        if (!formControl.valid && formControl.touched) {
            if (formControl.value === '') {
                return 'Email is required';
            } else {
                return 'Email must be a valid Email Address';
            }
        }
        return '';
    }

    /**
     * Validate if both Passwords match
     */
    validateEqualPasswords() {
        // Check if both passwords are the same
        let pwd = this.addEditUserForm.get('password').value
        let cpwd = this.addEditUserForm.get('confirmPassword').value;
        let val = pwd == cpwd;
        return val;
    }

    validatePassword(): boolean {
        let pwdControl: FormControl = this.addEditUserForm.get('password') as FormControl;
        let pwdVal = pwdControl.value;

        if (pwdControl.touched) {
            if (Validators.required(pwdControl)) {
                this.pwdErrMsg = 'Password is required';
                return false;
            } else if (pwdVal.length < 8) {
                this.pwdErrMsg = 'Password cannot be less 8 characters'
                return false;
            }
        }
        this.pwdErrMsg = null;
        return true;
    }

    validateForm() {
        var valid = true;
        var errMessage = null;

        if (!this.addEditUserForm.valid) {//
            valid = false;
            errMessage = 'Please enter all fields';
        } else if (this.user == null && !this.validateRequiredFields('email', false)) {
            valid = false;
            errMessage = 'Please provide correct Email Address';
        } else if (this.user == null && !this.validatePassword()) {
            valid = false;
        } else if (this.user == null && !this.validateEqualPasswords()) {
            valid = false;
            errMessage = 'Passwords do not match';
        } else {
            this.userSites.forEach(userSite => {
                if (!userSite.customerKey) {
                    valid = false;
                    errMessage = 'Please select a Site';
                } else if (!this.isSladeAdmin) {
                    if (!userSite.roleDTOs || userSite.roleDTOs.length == 0) {
                        valid = false;
                        errMessage = 'Please select atleast one Role';
                    } else {
                        userSite.roleDTOs.forEach(role => {
                            if (role.hasBillingRight) {
                                if (!userSite.billTos || userSite.billTos.length == 0) {
                                    valid = false;
                                    errMessage = 'Please select atleast one Bill To Site';
                                }
                            }
                        })
                    }
                }
            });
            if (!this.validateDuplicateUserSites()) {
                valid = false;
                errMessage = 'Please do not select duplicate Sites';
            }
        }
        if (valid) {
            this.alertService.reset();
        } else {
            this.alertService.error(errMessage);
        }
        return valid;
    }

    /**
     * Check if Login User has role
     */
    isLoginUserHasRole(roleName: string) {
        return this.userService.hasRoleInSelectedSite(this.loginUser, roleName);
    }

    /**
     * Event method called when the Slade Admin checkbox is clicked. This method sets/resets the 
     * boolean flag: isSladeAdmin
     * @param event 
     */
    sladeAdminChecked() {
        this.userSites = [];
        this.addUserSite(true);
    }

    addUserSite(isDefault: boolean) {
        let userSite: UserAuthorities = new UserAuthorities(null, null, null, [], [], [], isDefault);
        this.userSites.push(userSite);
        // this.userSitesArray.push(AddUserSiteComponent.buildUserSiteFormGroup(userSite));
    }

    addUserSites() {
        this.user.userAuthorities.forEach(userSite => {
            this.userSites.push(userSite);
            this.userSiteKeys.push(userSite.customerKey);
        });
    }

    changeDefaultSite(userSite: UserAuthorities) {
        this.userSites.forEach((site: UserAuthorities) => {
            if (site.isDefaultSite) {
                site.isDefaultSite = false;
            }
        });
        userSite.isDefaultSite = true;
    }

    removeSite(userSite: UserAuthorities) {
        this.userSites = this.userSites.filter(site => site !== userSite);
    }

    canAddMoreSites(): boolean {
        return this.userSites.length < this.sites.length;
    }

    onCancel() {
        this.resetComponent();
        this.cancel.emit();
    }

    resetComponent() {
        this.user = null;
        this.alertService.reset();
        this.createForm();

        this.userSites = [];
        this.userSiteKeys = [];
        this.addUserSite(true);
    }

    onSubmit() {
        // If Form is valid then save the User
        if (this.validateForm()) {
            this.submitForm();
        }
    }

    validateDuplicateUserSites(): boolean {
        if (this.userSites != null) {
            for (var i = 0; i < this.userSites.length; i++) {
                let userSite: UserAuthorities = this.userSites[i];
                let countCheck: number = 0;
                for (var j = 0; j < this.userSites.length; j++) {
                    if (userSite.customerKey === this.userSites[j].customerKey) {
                        if (++countCheck > 1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    createUser(newUser: User) {
        // Call API
        newUser.loginUserId = this.loginUser.userId;
        if (this.isLoginUserSladeAdmin) {
            newUser.loginRole = Constants.ROLE_SLADE_ADMIN;
        } else {
            newUser.loginRole = Constants.ROLE_CUSTOMER_SUPER_USER;
        }
        this.userAccService.createUser(newUser).subscribe(
            (user: User) => {
                newUser.userId = user.userId;
                this.eventBusService.broadcast(Constants.HIDE_LOADING);

                if (this.isSladeAdmin) {
                    this.createSladeAdminRole(newUser);
                }
                // Generate Saved User Event
                this.userAccService.triggerSavedUser(newUser)
            },
            error => {
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
                let apiError: APIError = error.error;
                if (apiError.errorCode === Constants.USER_SITE_NOTIN_LOGIN_USER_SITES) {
                    this.alertService.error(apiError.errorMessages[0]);
                } else if (apiError.status == 'FORBIDDEN') {
                    this.alertService.error(apiError.errorMessages[0]);
                }
            }
        );
    }

    updateUser(updatedUser: User) {
        updatedUser.loginUserId = this.loginUser.userId;
        if (this.isLoginUserSladeAdmin) {
            updatedUser.loginRole = Constants.ROLE_SLADE_ADMIN;
        } else {
            updatedUser.loginRole = Constants.ROLE_CUSTOMER_SUPER_USER;
        }
        // Call API
        this.userAccService.updateUser(updatedUser).subscribe(
            success => {
                this.eventBusService.broadcast(Constants.HIDE_LOADING);

                // Generate Saved User Event
                this.userAccService.triggerSavedUser(updatedUser);
            },
            error => {
                // Display Error messages
                let errors: APIError = error.error;
                if (errors.errorCode === Constants.USER_UPDATE_DUPLICATE_SITE) {
                    this.alertService.error(errors.errorMessages[0]);
                } else if (errors.errorCode === Constants.USER_SITE_NOTIN_LOGIN_USER_SITES) {
                    this.alertService.error(errors.errorMessages[0]);
                } else {
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
                }
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
            }
        );
    }

    getValue(field): string {
        let val: string = this.addEditUserForm.get(field).value;
        if (val) {
            return val.trim();
        }
        return '';
    }

    submitForm() {
        this.eventBusService.broadcast(Constants.SHOW_LOADING);

        let newUser: User =
            new User(
                this.getValue('email'),
                this.user ? null : this.getValue('password'),
                this.getValue('email'),
                this.user ? this.user.userId : null,
                this.getValue('firstName'),
                this.getValue('lastName'),
                null,
                this.addEditUserForm.get('status').value);

        if (this.isSladeAdmin) {
            newUser.isShotAdmin = true;
        } else {
            newUser.isShotAdmin = false;
        }
        newUser.userAuthorities = this.userSites;
        newUser.userSiteKeys = this.userSiteKeys;

        // If User being Added
        if (!this.user) {
            this.createUser(newUser);
        } else {
            // If existing User being updated
            this.updateUser(newUser);
        }
    }

    private createSladeAdminRole(user: User) {
        let sladeAdminRole: Role =
            this.roles.find(role => role.role == Constants.ROLE_SLADE_ADMIN);

        if (sladeAdminRole) {
            let roles: Role[] = [];
            roles.push(sladeAdminRole);
            user.userAuthorities[0].roleDTOs = roles;
        }
    }

    ngOnDestroy() {
        this.editUserSubscription.unsubscribe();
        this.resetUserSubscription.unsubscribe();
    }
}