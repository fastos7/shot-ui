export class ContactUsDetails {
    name: string;
    email: string;
    phone: string;
    reason: string;
    detailedDescription: string;
    captcha: string;
    captchaVerifyCode: string;
    emailConfirmation: string;

    constructor(name, email, phone, reason, detailedDescription, captcha, captchaVerifyCode?, emailConfirmation?) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.reason = reason;
        this.detailedDescription = detailedDescription;
        this.captcha = captcha;
        this.captchaVerifyCode = captchaVerifyCode;
        this.emailConfirmation = emailConfirmation;
    }
}
