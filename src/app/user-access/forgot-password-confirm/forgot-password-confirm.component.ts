import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router/';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { PasswordResetService } from '../../common/services/password-reset.service';
import { Constants } from '../../common/app.constants';
import { APIError } from '../../common/model/apiError.model';

@Component({
  selector: 'app-forgot-password-confirm',
  templateUrl: './forgot-password-confirm.component.html',
  styleUrls: ['./forgot-password-confirm.component.css']
})
export class ForgotPasswordConfirmComponent implements OnInit {
  @Input() email: string;
  private encodedEmail: string;

  constructor(private router: Router,
    private passwordResetService: PasswordResetService,
    private alertService: AlertService,
    private eventBusService: EventBusService,
  ) { }

  ngOnInit() {
    this.encodeEmail(this.email);
  }

  /**
   * Navigate back to Login page.
   */
  onLogin() {
    this.router.navigate(["/login"]);
  }

  /**
   * Submit the form for Password Reset email generation.
   */
  onResendEmail() {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.passwordResetService.generateTokenAndMail(this.email).subscribe(
      () => {
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.alertService.success('An email was resent successfully.', true);
      },
      error => {
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

  /**
   * Transform the user's email by encoding the in between email character to *
   * @param email user's email to transform
   */
  encodeEmail(email: string) {
    // Split the email by @
    let tokens: string[] = email.split('@');

    // transform 1st part of email
    this.encodedEmail = this.encodeEmailPart(tokens[0]) + '@' + this.encodeEmailPart(tokens[1]);
  }

  private encodeEmailPart(emailPart: string): string {
    if (emailPart.length < 2) {
      return '*';
    }
    if (emailPart.length < 3) {
      return emailPart[0] + '*';
    }
    let length: number = emailPart.length;
    let newPart: string = emailPart[0];
    for (var i=0; i < length-2; i++) {
      newPart += '*';
    }
    newPart += emailPart[length-1];
    return newPart;
  }
}
