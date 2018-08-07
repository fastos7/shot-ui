import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { PasswordResetService } from '../../common/services/password-reset.service';
import { Constants } from '../../common/app.constants';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router/';
import { APIError } from '../../common/model/apiError.model';

@Component({
  selector: 'app-forgot-password-edit',
  templateUrl: './forgot-password-edit.component.html',
  styleUrls: ['./forgot-password-edit.component.css']
})
export class ForgotPasswordEditComponent implements OnInit {
  private email: string;
  private emailError: string;
  private passwordForm: FormGroup;

  @Output('token-generated') tokenGenerated: EventEmitter<string> = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
    private passwordResetService: PasswordResetService,
    private alertService: AlertService,
    private eventBusService: EventBusService,
    private router: Router) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      email: ['', Validators.email]
    });
  }

  /**
   * Validate if the email field input is valid.
   */
  validateEmail() {
    this.emailError = null;
    if ((this.passwordForm.dirty || this.passwordForm.touched) && !this.passwordForm.valid) {
      if (this.passwordForm.get('email').value == '') {
        this.emailError = 'Email is required';
      } else {
        this.emailError = 'Email must be a valid Email Address';
      }
      return false;
    }
    return true;
  }

  /**
   * Submit the form for Password Reset email generation.
   */
  onSubmit() {
    this.alertService.reset();
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.passwordResetService.generateTokenAndMail(this.email).subscribe(
      (success) => {
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.tokenGenerated.emit(this.email);
      },
      (error) => {
        // Display Errors
        let errors: APIError = error.error;
        if (errors.errorCode === Constants.USER_EMAIL_DOES_NOT_EXIST) {
          this.alertService.error(errors.errorMessages[0]);
        } else {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        }
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
