import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/**
 * Interface that a component can implement to be a guard deciding if a route 
 * can be deactivated.
 */
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

/**
 * A Guard that can be used to determine whether a component can deactivate or 
 * not depending on a certain situation e.g. there are unsave work.
 * 
 * This guard will only kick-off if moving away within the application. To guard
 * against moving away from different website or closing the tab or browser the 
 * component should decorate the method `canDeactivate` with 
 * `@HostListener('window:beforeunload')` in the implementation.
 * 
 * ### How to use:
 * ```
 * const appRoutes: Routes = [
 *  .
 *  .
 *  .
 *  { path: 'order/new', component: NewOrderComponent , 
 *                       canDeactivate: [PendingChangesGuard]},
 *  .
 *  .
 *  . 
 * ];
 * ```
 * 
 * @author Marlon Cenita
 */
@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
     
    /*
     * Component implementing this guard should implement their own confirmation
     * dialogs.
     */  
    return component.canDeactivate();
  }
}