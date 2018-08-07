import { LocalStoreManager } from '../local-store-manager';
import{ Injectable }from'@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }from '@angular/router';

/**
 * Authentication Guard that guards private URLs from being accessed by non-authenticated users.
 */
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router,
                private localStoreManager: LocalStoreManager) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let currentUser = this.localStoreManager.getData('currentUser');
        if (currentUser) {
            this.localStoreManager.saveSessionData(currentUser, 'currentUser');
            //if (this.localStoreManager.getData('currentUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this._router.navigate(['/login']);
        return false;
    }
}
