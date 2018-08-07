import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PasswordResetService } from '../../common/services/password-reset.service';
import { PasswordReset } from '../../common/model/password-reset.model';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { APIError } from '../../common/model/apiError.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private pwdForm: FormGroup;
  private resetToken: string = null;
  private resetPasswordData: PasswordReset = new PasswordReset(null);
  private resetSuccess: boolean = false;

  /*
  * Form errors container
  */
  formErrors = {
    'password': '',
    'confirmPassword': ''
  };

  /*
  * Validation error messages
  */
  validationMessages = {
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
    private router: Router,
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService,
    private alertService: AlertService,
    private eventBusService: EventBusService) { }

  ngOnInit() {
    this.route.paramMap.switchMap(
      (params: ParamMap) => {
        this.resetToken = params.get('token');
        return this.resetToken;
      }
    ).subscribe(token => {
      console.log(this.resetToken);
    });

    this.createForm();
  }

  /**
   * Creates the Password form initialized with empty values. Each field has the following validators applied:
   * 1. Required,
   * 2. Allows only Alphanumeric,
   * 3. Minimum length allowed is 8.
   */
  createForm() {
    this.pwdForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
    /* Listen to any changes in the form constrols */
    this.pwdForm.valueChanges.subscribe(data => this.onValueChanged(data));
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
      if (this.pwdForm.get('password').value == this.pwdForm.get('confirmPassword').value) {
        this.resetPasswordData.resetToken = this.resetToken;
        this.resetPasswordData.password = this.pwdForm.get('password').value;
        this.submit();
      } else {
        this.alertService.error('Passwords do not match');
      }
    }

  }

  /**
   * Navigate back to Login page
   */
  onCancel() {
    this.router.navigate(['/login']);
  }

  /**
   * Submits the Password form to update passwords to the API.
   */
  submit() {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);

    // Save the new Preferences using the User copy
    this.passwordResetService.resetPassword(this.resetPasswordData).subscribe(
      success => {
        this.resetSuccess = true;
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        //this.alertService.success('User password has been updated successfully.')
      },
      error => {
        // Display Error messages
        let errors: APIError = error.error;
        if (errors.errorCode === Constants.PWD_RESET_TOKEN_EXPIRED || errors.errorCode === Constants.USER_EMAIL_DOES_NOT_EXIST) {
          this.alertService.error(errors.errorMessages[0]);
        } else {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        }
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      });

  }
}
