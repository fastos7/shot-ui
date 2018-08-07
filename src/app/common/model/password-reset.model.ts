export class PasswordReset {
    userId: number;
    email: string;
    resetToken: string;
    password: string;

    constructor(email: string) {
        this.email = email;
    }
}