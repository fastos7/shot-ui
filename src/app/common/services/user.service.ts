import { LocalStoreManager } from '../local-store-manager';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../app.constants';
import 'rxjs/add/operator/map';
import { User } from '../model/user.model';
import { UserAuthorities } from '../model/user-authorities.model';


@Injectable()
export class UserService {

  private user:User;

  constructor(private localStoreManager: LocalStoreManager) { }

  getUserSites(): UserAuthorities[] {
    if (this.getCurrentUser()) {
      return this.getCurrentUser().userAuthorities;
    }
  }

  isLoggedIn() {
    return this.localStoreManager.getData('currentUser');
  }

  updateCurrentSite(siteKey: string) {
    const selectedSite = this.getSiteDetails(siteKey);
    const currentUser = this.getCurrentUser();
    currentUser.selectedUserAuthority = selectedSite;
    this.updateUser(currentUser);
  }

  getCurrentUser(): User {
    
    if (!this.user) {
      this.user = <User>this.localStoreManager.getSessionDataObject('currentUser');
    }

    if (this.user && !this.user.selectedUserAuthority) {
      this.user.selectedUserAuthority = this.user.userAuthorities.find(site => site.customerKey === this.user.defaultSite);      
      this.updateUser(this.user, this.user != null);
    }
    return this.user;
  }

  getSiteDetails(siteKey: string): UserAuthorities {
    return this.getUserSites().find(site => site.customerKey === siteKey);
  }

  hasRoleInSelectedSite(user: User, roleName: string): boolean {
    let hasRole = false;

    const selectedSite: UserAuthorities = user.selectedUserAuthority;
    selectedSite.roles.forEach((role: string) => {
      if (role === roleName) {
        hasRole = true;
      }
    });

    return hasRole;
  }

  updateUser(user: User, isPermUser: boolean = true) {    
    const userJson: string = JSON.stringify(user);    
    this.localStoreManager.saveSessionData(userJson, 'currentUser');
  }

  clearCurrentUser() {
    this.user = null;
  }
}
