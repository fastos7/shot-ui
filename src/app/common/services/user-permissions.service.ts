import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClientService } from './http-client.service';
import { Constants } from '../app.constants';
import { LocalStoreManager } from '../../common/local-store-manager';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class UserPermissionsService {

  constructor(private userService: UserService,
    private http: HttpClientService,
    private localStoreManager: LocalStoreManager) { }

  webpageAccesses: String[];
  urlRoleAccesses: String[];
  intialized = false;

  hasPermisson(navigation: string) {
    if (!this.webpageAccesses) {
      this.webpageAccesses = JSON.parse(localStorage.getItem('webpageAccesses'));
    }

    const navPermissions: string[] = this.webpageAccesses[navigation];
    if (navPermissions) {
      return navPermissions.find(permission => this.userService.getCurrentUser().selectedUserAuthority.roles.findIndex(rol => rol === permission) >= 0);
    } else {
      return false;
    }
  }

  hasURLPermission(url: string) {
    try {
      if (!this.urlRoleAccesses) {
        this.urlRoleAccesses = JSON.parse(localStorage.getItem('urlRoleAccesses'));
      }
      if (this.urlRoleAccesses) {
        const roles: string[] = this.getRolesByURL(url);
        if (roles) {
          if (roles.find(role => this.userService.getCurrentUser().selectedUserAuthority.roles.findIndex(rol => rol === role) >= 0)) {
            return true;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  getRolesByURL(url: string) {
    if (url.endsWith('/')) {
      url = url.slice(0, url.length - 2);
    }
    const urlParts: string[] = url.split('/');
    const parts: number = urlParts.length;
    for (let i = parts; i > 0; i--) {

      // Create new URL
      let newUrl = '';
      for (let j = 0; j < i; j++) {
        if (j > 0) {
          newUrl += '/';
        }
        newUrl += urlParts[j];
      }

      // Check if new URL matches any URL Role Mapping
      const roleMap = this.urlRoleAccesses[newUrl];
      if (roleMap) {
        return roleMap;
      }
    }
    return null;
  }

  getAllWebPageAndURLAccesses() {
    this.http.get(Constants.WEBPAGE_ACCESSES_API_URL).subscribe(
      (response) => {
        const dataMap = response;
        const webpageAccessesMap = dataMap.webpageAccesses;
        const urlRoleAccessesMap = dataMap.urlRoleAccesses;
        this.localStoreManager.savePermanentData(JSON.stringify(webpageAccessesMap), 'webpageAccesses');
        this.localStoreManager.savePermanentData(JSON.stringify(urlRoleAccessesMap), 'urlRoleAccesses');
      },
      error => { },
      () => { this.intialized = true; });
  }

  isPermissionsInitialized(): boolean {
    return this.intialized;
  }

  hasRole(role: string): boolean {
    return this.userService.getCurrentUser().selectedUserAuthority.roles.findIndex(rol => rol === role) >= 0;
  }
}
