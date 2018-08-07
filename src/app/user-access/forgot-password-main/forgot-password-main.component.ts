import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password-main',
  templateUrl: './forgot-password-main.component.html',
  styleUrls: ['./forgot-password-main.component.css']
})
export class ForgotPasswordMainComponent implements OnInit {
  private editForgotPassword: boolean = true;
  private email: string;

  constructor() { }

  ngOnInit() {
  }

  confirmForgotPassword(email) {
    console.log(email);
    this.editForgotPassword = false;
    this.email = email;
  }
}
