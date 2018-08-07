import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { UserService } from '../../common/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { UserAccountService } from '../../user/user-account.service';
import { User } from '../../common/model/user.model';
import { Constants } from '../../common/app.constants';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../user-access/login/authentication.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [
    SimpleTimer
  ]
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private user: User;
  private pwdForm: FormGroup;
  private resetSubscription: Subscription;
  private timerCount: number = 3;

  /*
 * Form errors container
 */
  formErrors = {
    'currentPassword': '',
    'password': '',
    'confirmPassword': ''
  };

  /*
  * Validation error messages
  */
  validationMessages = {
    'currentPassword': {
      'name': 'Password',
      'required': 'is required',
      //'minlength': 'cannot be less than 8 characters'
    },
    'password': {
      'name': 'Password',
      'required': 'is required',
      'minlength': 'cannot be less than 8 characters'
    },
    'confirmPassword': {
      'name': 'Confirm Password',
      'required': 'is required',
      'minlength': 'cannot be less than 8 characters'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private userService: UserService,
    private eventBusService: EventBusService,
    private userAccService: UserAccountService,
    private simpleTimer: SimpleTimer,
    private router: Router) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.createForm();

    this.resetSubscription = this.userAccService.subscribeToResetUser().subscribe(
      () => {
        this.resetForm();
      }
    );
  }

  /**
   * Creates the Password form initialized with empty values. Each field has the following validators applied:
   * 1. Required,
   * 2. Allows only Alphanumeric,
   * 3. Minimum length allowed is 8.
   */
  createForm() {
    this.pwdForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
    /* Listen to any changes in the form constrols */
    this.pwdForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  /**
   * Resets the password form to empty values.
   */
  resetForm() {
    this.pwdForm.setValue({
      currentPassword: '',
      password: '',
      confirmPassword: ''
    });
    this.pwdForm.reset();
  }

  /**
  * This method will be called if any of the controls were modified and
  * will add error messages in the form errors container.
  * @param any
  */
  onValueChanged(data?: any) {

    const form = this.pwdForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (this.formErrors[field] != '') {
            this.formErrors[field] += ', '
          } else {
            this.formErrors[field] += messages['name'] + ' ';
          }
          this.formErrors[field] += messages[key];
        }
      }
    }
  }

  /**
   * Validates the password form and then submits it. On successful submission, it resets the form to empty values.
   */
  onSubmit() {
    this.alertService.reset();
    if (this.pwdForm.valid) {
      this.eventBusService.broadcast(Constants.SHOW_LOADING);

      // Compare Old and New Passwords
      this.authenticationService.login(this.user.email, this.pwdForm.get('currentPassword').value).subscribe(
        response => {
          if (this.pwdForm.get('password').value != this.pwdForm.get('currentPassword').value) {
            if (this.pwdForm.get('password').value == this.pwdForm.get('confirmPassword').value) {
              this.submit();
              this.resetForm();
            } else {
              this.eventBusService.broadcast(Constants.HIDE_LOADING);
              this.alertService.error('Passwords do not match');
            }
          } else {
            this.eventBusService.broadcast(Constants.HIDE_LOADING);
            this.alertService.error('Current and New Passwords cannot be the same');
          }
        },
        error => {
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
          this.alertService.error('Current Password is incorrect');
        });
    }
  }

  /**
   * Submits the Password form to update passwords to the API.
   */
  submit() {
    // Create User copy and assign new Preferences to it
    let updatedUser: User = new User(this.user.email, this.pwdForm.get('password').value, this.user.email, this.user.userId);

    // Save the new Preferences using the User copy
    this.userAccService.updateUserPassword(updatedUser).subscribe(
      success => {
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.authenticationService.logout();
        this.alertService.success('Your password has been updated successfully. You will be now be logged out of the website.');
        this.timerCount = 5;
        this.simpleTimer.newTimer('passwordLogoutTimer', 5);
        this.simpleTimer.subscribe('passwordLogoutTimer', 
          () => {
            this.timerCount--;
            if (this.timerCount == 4) {
              this.eventBusService.broadcast(Constants.SHOW_LOADING);

            } else if (this.timerCount == 3) {
              this.timerCount = 5;
              this.simpleTimer.unsubscribe('passwordLogoutTimer');
              this.simpleTimer.delTimer('passwordLogoutTimer')
              this.eventBusService.broadcast(Constants.HIDE_LOADING);
              this.router.navigate(['/login']);
            }
          });
      },
      error => {
        this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      });

  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }
}
