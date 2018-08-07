import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { UserAuthorities } from '../model/user-authorities.model';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { UserPermissionsService } from '../services/user-permissions.service';
import { Router } from '@angular/router';
import { LocalStoreManager } from '../../common/local-store-manager';
import { FileManagerService } from '../services/file-mgmt.service';
import { Constants } from '../app.constants';
import * as FileSaver from 'file-saver';
import { EventBusService } from '../services/event-bus.service';
import { Role } from '../model/role.mode';

declare var $: any;

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent {


    userAuthorities: UserAuthorities[] = [];
    loggedInUser: string;
    /*currentSiteKey: string;
    currentSiteName: string;    
    currentSiteRoles: string[];*/
    selectedAuthority: UserAuthorities;
    newSiteKey: string;
    newSiteRoles: string[];
    today: Date = new Date();

    dayOrWeek: string = 'day';
    deliveryOrTreatment: string = 'delivery';
    user: User;

    constructor(
        private userService: UserService,
        private userPermissionsService: UserPermissionsService,
        private fileService: FileManagerService,
        private localStoreManager: LocalStoreManager,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private eventBusService: EventBusService) { }

    ngOnInit() {
        this.getApplicationAccesses();
        this.getFromUserService();
        this.getUpdatesFromUserPreferences();
        this.eventBusService.on(Constants.USER_PREFERENCES_UPDATED, () => {
            this.getUpdatesFromUserPreferences();
          });
    }

    getUpdatesFromUserPreferences() {
        const user = this.userService.getCurrentUser();
        if (user.defaultOrderView === Constants.MY_ORDERS_DEFAULT_VIEW_DAY_VIEW_DELIVERY_TIMES) {
            this.dayOrWeek = 'day';
            this.deliveryOrTreatment = 'delivery';
        } else if (user.defaultOrderView === Constants.MY_ORDERS_DEFAULT_VIEW_WEEK_VIEW_DELIVERY_TIMES) {
            this.dayOrWeek = 'week';
            this.deliveryOrTreatment = 'delivery';
        } else if (user.defaultOrderView === Constants.MY_ORDERS_DEFAULT_VIEW_DAY_VIEW_TREATMENT_TIMES) {
            this.dayOrWeek = 'day';
            this.deliveryOrTreatment = 'treatment';
        } else if (user.defaultOrderView === Constants.MY_ORDERS_DEFAULT_VIEW_WEEK_VIEW_TREATMENT_TIMES) {
            this.dayOrWeek = 'week';
            this.deliveryOrTreatment = 'treatment';
        }
    }

    isuserLoggedIn() {
        return this.userService.isLoggedIn();
    }

    hasAccesstoMultipleSites(): boolean {
        return this.getUserSites().length > 1
    }

    siteChanged() {

        this.userService.updateCurrentSite(this.newSiteKey);
        this.getFromUserService();
        this.clearNewRole();

        if (this.hasPermisson(this.router.url.substring(1))) {
            this.router.navigateByUrl(this.router.url);
        } else {
            this.router.navigate(['/home']);
        }

        this.displayStartHere();

    }

    getcurrentSiteName() {
        if (!this.selectedAuthority)
            this.getFromUserService();
        return this.selectedAuthority.customerName;
    }

    getUserSites() {
        if (!this.userAuthorities)
            this.getFromUserService();
        return this.userAuthorities;
    }

    displayNewRole() {
        this.newSiteRoles = this.userService.getSiteDetails(this.newSiteKey).roleDescriptions;
    }

    getFromUserService() {

        var user: User = this.userService.getCurrentUser();
        this.selectedAuthority = user.selectedUserAuthority;
        this.userAuthorities = user.userAuthorities;

        this.loggedInUser = user.firstName + " " + user.lastName;

        // this.cdr.detectChanges();
    }

    getApplicationAccesses() {
        this.userPermissionsService.getAllWebPageAndURLAccesses();
    }

    isPermissionsInitialized(): boolean {
        return this.userPermissionsService.isPermissionsInitialized();
    }

    hasPermisson(navigation: string) {
        return this.userPermissionsService.hasPermisson(navigation);
    }

    clearNewRole() {
        this.newSiteKey = this.newSiteRoles = null;
    }

    displayStartHere() {
        setTimeout(function () {
            if ($('.landing-item').is(":visible"))
                $('#starthere').show();
            else
                $('#starthere').hide();
        }, 100);
    }

    downloadUserManual() {
        this.downloadFile(Constants.USER_FILE_API_BASE_URL + Constants.USER_FILE_MANUAL_REL_URL, 'user_manual.pdf');
    }

    downloadStabilityMatrix() {
        this.downloadFile(Constants.USER_FILE_API_BASE_URL + Constants.USER_FILE_MATRIX_REL_URL, 'stability_matrix.pdf');
    }

    downloadFile(url, filename) {
        this.fileService.downloadFile(url)
            .subscribe(
            blob => {
                FileSaver.saveAs(blob, filename);
            });
    }
}