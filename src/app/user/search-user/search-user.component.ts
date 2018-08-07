import { Component, Input, Output, OnDestroy, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { Role } from '../../common/model/role.mode';
import { AbstractControl } from '@angular/forms/src/model';
import { AlertService } from '../../core/services/alert.service';
import { User } from '../../common/model/user.model';
import { UserService } from '../../common/services/user.service';
import { UserAccountService } from '../user-account.service';
import { Constants } from '../../common/app.constants';
import { Subscription } from 'rxjs/Subscription';
import { EventBusService } from '../../common/services/event-bus.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit, OnDestroy {
  private deleteUserSubscription: Subscription;
  private resetUserSubscription: Subscription;
  private saveUserSubscription: Subscription;

  @Input() private sites: UserAuthorities[];
  @Input() private roles: Role[];

  // Booleab flags for the UI
  private loading = false;
  private emailValid = true;

  // Loggedin User
  private loginUser: User;
  private isLoginUserSladeAdmin: boolean = false;

  // Search User Form
  searchForm: FormGroup;

  // Search Results
  private users: User[];

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private eventBusService: EventBusService,
    private userAccountService: UserAccountService) { }

  ngOnInit() {
    this.createForm();

    // Get the Login User
    this.loginUser = this.userService.getCurrentUser();
    this.isLoginUserSladeAdmin = this.isLoginUserHasRole(Constants.ROLE_SLADE_ADMIN);

    this.deleteUserSubscription = this.userAccountService.subscribeToDeleteUser().subscribe(
      (deletedUser: User) => {
        this.users = this.users.filter(user => user.userId != deletedUser.userId);
        //this.alertService.success('The User was successfully deleted from the Site(s)');
      }
    );

    this.resetUserSubscription = this.userAccountService.subscribeToResetUser().subscribe(
      () => {
        this.resetComponent();
      }
    );

    this.saveUserSubscription = this.userAccountService.subscribeToSavedUser().subscribe(
      () => {
        this.resetComponent();
      }
    );
  }

  /**
   * Check if Login User has role
   */
  isLoginUserHasRole(roleName: string) {
    return this.userService.hasRoleInSelectedSite(this.loginUser, roleName);
  }

  resetComponent() {
    this.searchForm.reset();
    this.loading = false;
    this.emailValid = true;
    this.users = null;
  }

  /**
   * Creates the addEditUserForm instance.
   */
  private createForm() {
    this.searchForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      status: [''],
      site: [''],
      role: ['']
    });
  }

  validateEmail() {
    let formControl: FormControl = <FormControl>this.searchForm.get('email');
    let errors = null;
    if (formControl.touched) {
      if (formControl.value != '') {
        errors = Validators.email(formControl);
        this.emailValid = errors ? false : true;
      }
    }
    return !errors;
  }

  onSiteSelected() {
    let formControl: FormControl = <FormControl>this.searchForm.get('site');
    let userSite: UserAuthorities = formControl.value;
  }

  getValue(field): string {
    let val: string = this.searchForm.get(field).value;
    if (val) {
      return val.trim();
    }
    return '';
  }

  validateMandatoryFields() {
    if (this.getValue('firstName') != '') {
      return true;
    }
    if (this.getValue('lastName') != '') {
      return true;
    }
    if (this.getValue('email') != '') {
      return true;
    }
    if (this.getValue('site') != '') {
      return true;
    }
    // Object.keys(this.searchForm.controls).forEach(key => {
    //   let value = this.searchForm.get(key).value;
    //   if (value != '') {
    //     canSearch = true;
    //   }
    // });
    return false;
  }

  onSubmit() {
//    if (this.validateEmail()) {
      if (this.validateMandatoryFields()) {
        this.alertService.reset();
        console.log(this.searchForm);
        this.eventBusService.broadcast(Constants.SHOW_LOADING);

        this.userAccountService.searchUsers(
          this.getValue('firstName'), this.getValue('lastName'),
          this.getValue('email'), this.getValue('status'),
          this.getValue('site'), this.getValue('role'),
          this.loginUser.userId, this.isLoginUserSladeAdmin? Constants.ROLE_SLADE_ADMIN : Constants.ROLE_CUSTOMER_SUPER_USER).subscribe(
          data => {
            this.users = data.users;
            this.eventBusService.broadcast(Constants.HIDE_LOADING);
          },
          error => {
            this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
            this.eventBusService.broadcast(Constants.HIDE_LOADING);
          }
          );

      } else {
        this.alertService.error('Please enter atleast: First Name, Last Name, Email or Site');
      }
    // } else {
    //   this.alertService.error('Email must be a valid Email Address');
    // }
  }

  ngOnDestroy() {
    this.deleteUserSubscription.unsubscribe();
    this.resetUserSubscription.unsubscribe();
    this.saveUserSubscription.unsubscribe();
  }
}

