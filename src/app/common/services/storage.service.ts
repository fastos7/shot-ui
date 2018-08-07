import { Injectable } from '@angular/core';
import { HttpResponse } from 'selenium-webdriver/http';
import { Response } from '@angular/http';
import { User } from '../model/user.model';
import { environment } from '../../../environments/environment';
import { Constants } from '../app.constants';


@Injectable()
export class StorageService {

  constructor() { }

  // save the JWT in session storage
  saveJwtToSessionStorage(jwt: string) {
    sessionStorage.setItem(environment.AUTHORIZATION_HEADER_NAME, jwt);
  }

  saveJwtExpiryTimeToSessionStorage(expiresIn: string) {
    const currentTime = new Date();
    const expiresAt = new Date(currentTime.getTime() + +expiresIn);
    sessionStorage.setItem(environment.AUTHORIZATION_EXPIRY_HEADER_NAME, expiresAt.toString());
  }

  saveUserToSessionStorage(user: User) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  // save the user details in local storage
  saveUserToLocalStorage(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  saveUserEmailToLocalStorage(email: string) {
    localStorage.setItem(Constants.USER_EMAIL, email);
  }

  getUserEmailFromLocalStorage(): string {
    return localStorage.getItem(Constants.USER_EMAIL);
  }
}
