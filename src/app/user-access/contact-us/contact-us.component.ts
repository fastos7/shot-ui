import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { Constants } from '../../common/app.constants';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ContactUsService } from '../../common/services/contact-us.service';
import { ContactUsDetails } from '../../common/model/contact-us-details.model';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  constructor( private formBuilder: FormBuilder,
               private contactUsService: ContactUsService,
               private alertService: AlertService,
               private eventBusService: EventBusService ) { }

  googleSiteKey: string = environment.GOOGLE_RECAPTCHA_KEY;

  contactUsForm: FormGroup;

  captchaSelected: string = '';

  @ViewChild('recaptcha') recaptcha: any;

  recaptchaError: boolean = false;

  recaptchaSuccess: boolean = false;

    /*
	 * Form errors container
	 */
  formErrors = {
    'cuName' : '',
    'cuEmail' : '',
    'cuPhoneNumber' : '',
    'cuReason' : '',
    'captcha' : ''
  };

  isValid = true;

  contactUsDetails: ContactUsDetails;

/*
* Validation error messages
*/
validationMessages = {
          'cuName': {
            'required'  : 'Name is required.',
            'pattern'   : 'Invalid value for Name, alphabets and/or numbers only.'
          },
          'cuEmail': {
            'required'  : 'Email is required.',
            'email'   : 'Invalid value for Email format: abc@xyz.com.'
          },
          'cuPhoneNumber': {
            'required'  : 'Phone number is required.',
            'pattern'   : 'Invalid value for Phone number, numbers only.'
          },
          'cuReason': {
            'required'  : 'Reason is required. Please select a value.',
          },
          'captcha': {
            'required'  : 'Please check the box to verify your identity.',
          },
        };


  ngOnInit() {
    this.buildForm();
    this.contactUsForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  handleCorrectCaptcha(captchaResponse: string) {
    this.captchaSelected = captchaResponse;
    this.recaptchaError = false;
  }

  buildForm() {
    this.contactUsForm = this.formBuilder.group({
      'cuName': [{value : '', disabled: false},
                  [Validators.required, Validators.pattern(Constants.REG_EX_NAMES)]],
      'cuEmail': [{value : '', disabled: false},
      [Validators.required, Validators.email]],
      'cuPhoneNumber': [{value : '', disabled: false},
      [Validators.required, Validators.pattern(Constants.REG_EX_NUMERIC)]],
      'cuReason': [{value : '', disabled: false},
    [Validators.required]],
      'cuDetailedDesc': [{value : '', disabled: false}]
    });
  }

  onValueChanged(data?: any) {

    if (!this.contactUsForm) { return; }

    const form = this.contactUsForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {

    if (this.contactUsForm.valid && this.captchaSelected !== null && this.captchaSelected !== '') {
      this.eventBusService.broadcast(Constants.SHOW_LOADING);
      this.contactUsDetails = new ContactUsDetails(this.contactUsForm.controls['cuName'].value,
                                                    this.contactUsForm.controls['cuEmail'].value,
                                                    this.contactUsForm.controls['cuPhoneNumber'].value,
                                                    this.contactUsForm.controls['cuReason'].value,
                                                    this.contactUsForm.controls['cuDetailedDesc'].value,
                                                    this.captchaSelected);
      this.contactUsService.sendContactUsEmail(this.contactUsDetails).subscribe(
        /* When successful */
        data => {
          this.contactUsDetails = Object.assign(this.contactUsDetails, data);
          if (this.contactUsDetails.captchaVerifyCode === Constants.RECAPTCHA_VERIFY_ERROR_CODE) {
            this.recaptcha.reset();
            this.recaptchaError = true;
            this.recaptchaSuccess = false;
            this.alertService.error(Constants.CONTACT_US_FORM_ERRORS,
                                      'contactUsErrors');
          } else if (this.contactUsDetails.captchaVerifyCode === Constants.RECAPTCHA_VERIFY_SUCCESS) {
            if (this.contactUsDetails.emailConfirmation === Constants.EMAIL_SEND_SUCCESS) {
              this.recaptchaError = false;
              this.recaptchaSuccess = true;
              /* Alert the user of the successfull creation of the preference. */
              this.alertService.success(Constants.CONTACT_US_EMAIL_SENT_SUCCESS,
                                        false, 'emailSentAlert');
            } else if (this.contactUsDetails.emailConfirmation === Constants.EMAIL_SEND_ERROR) {
              this.recaptcha.reset();
              this.recaptchaError = true;
              this.recaptchaSuccess = false;
                this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,
                'contactUsErrors');
            }
        }
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
      },
      /* When there is an error. */
      error => {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,
                                    'contactUsErrors');
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
      },
      () => {
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
      });
    } else {
      /*
       * If the form is still invalid after pressing the submit button,
       * then display all the validation errors.
       */
      Object.keys(this.contactUsForm.controls).forEach(key => {
        this.contactUsForm.get(key).markAsDirty();
        this.contactUsForm.get(key).markAsTouched();
      });
      this.onValueChanged();
      if (this.captchaSelected === null || this.captchaSelected === '') {
        this.recaptchaError = true;
      }
    }
  }

  onCaptchaExpired() {
    this.captchaSelected = '';
  }

}
