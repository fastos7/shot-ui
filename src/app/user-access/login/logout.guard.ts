//import { LocalStoreManager } from '../local-store-manager';
import { AuthenticationService } from './authentication.service';
import { LocalStoreManager } from '../../common/local-store-manager';
import{ Injectable }from'@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }from '@angular/router';

/**
 * LogoutGuard Guard that enables logging out a User.
 */
@Injectable()
export class LogoutGuard implements CanActivate {

    constructor(private router: Router,
                private localStoreManager: LocalStoreManager,
                private authenticationService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Logout any logged in User.
        this.authenticationService.logout();
        return true;
    }
}
