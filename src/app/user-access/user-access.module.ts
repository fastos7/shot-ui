import { LoginGuard } from './login/login.guard';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './login/authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SHOTCommonModule } from '../common/common.module';
import { ForgotPasswordMainComponent } from './forgot-password-main/forgot-password-main.component';
import { ForgotPasswordConfirmComponent } from './forgot-password-confirm/forgot-password-confirm.component';
import { ForgotPasswordEditComponent } from './forgot-password-edit/forgot-password-edit.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordResetService } from '../common/services/password-reset.service';
import { LogoutGuard } from './login/logout.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ReCaptchaModule } from 'angular2-recaptcha';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordMainComponent,
    ForgotPasswordEditComponent,
    ForgotPasswordConfirmComponent,
    ResetPasswordComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SHOTCommonModule,
    ReCaptchaModule
  ],
  providers: [
    AuthenticationService,
    LoginGuard,
    LogoutGuard,
    PasswordResetService
  ],
  exports: [
    LoginComponent
  ]
})
export class UserAccessModule {}