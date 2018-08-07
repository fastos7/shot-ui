//import { LocalStoreManager } from '../local-store-manager';
import { LocalStoreManager } from '../../common/local-store-manager';
import{ Injectable }from'@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }from '@angular/router';
import { UserPermissionsService } from '../services/user-permissions.service';

/**
 * URLGuard Guard that guards private URLs from being accessed by users who do not have the appropriate.
 */
@Injectable()
export class URLGuard implements CanActivate {

    constructor(private router: Router,
                private localStoreManager: LocalStoreManager,
                private userPermission: UserPermissionsService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let mainURL = route.routeConfig.path;
        if (this.userPermission.hasURLPermission(mainURL)) {
            return true;
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}
