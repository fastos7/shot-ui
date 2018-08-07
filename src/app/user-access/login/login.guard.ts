//import { LocalStoreManager } from '../local-store-manager';
import { AuthenticationService } from './authentication.service';
import { LocalStoreManager } from '../../common/local-store-manager';
import{ Injectable }from'@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }from '@angular/router';

/**
 * Authentication Guard that guards private URLs from being accessed by non-authenticated users.
 */
@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router,
                private localStoreManager: LocalStoreManager,
                private authenticationService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let currentUser = this.localStoreManager.getData('currentUser');
        if (currentUser) {
            this.localStoreManager.saveSessionData(currentUser, 'currentUser');
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}
