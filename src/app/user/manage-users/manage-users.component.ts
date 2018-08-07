import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../common/model/user.model';
import { UserService } from '../../common/services/user.service';
import { Role } from '../../common/model/role.mode';
import { Customer } from '../../common/model/customer.model';
import { Constants } from '../../common/app.constants';
import { UserAccountService } from '../user-account.service';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { Subscription } from 'rxjs/Subscription';
import { MatTabChangeEvent } from '@angular/material';
import { AlertService } from '../../core/services/alert.service';

@Component({
    selector: 'app-manage-users',
    styleUrls: ['manage-users.component.css'],
    templateUrl: 'manage-users.component.html'
})
export class ManageUsersComponent implements OnDestroy {
    private selectedTab: number = 0;
    private editUserSubscription: Subscription;
    private searchUserSubscription: Subscription;

    //Edit User
    private user: User = null;

    // Loggedin User
    private loginUser: User;
    private resetAllowed: boolean = false;

    private sites: UserAuthorities[];
    private roles: Role[];

    constructor(private userService: UserService,
        private userAccService: UserAccountService,
        private alertService: AlertService) {
        // Get the Login User
        this.loginUser = this.userService.getCurrentUser();

        // Load login User's sites and roles
        this.loadCustomerSitesAndRoles();

        this.editUserSubscription = this.userAccService.subscribeToEditUser().subscribe(
            (selectedUser: User) => {
                this.user = selectedUser;
                this.changeTab(1, selectedUser);
            }
        );

        this.searchUserSubscription = this.userAccService.subscribeToSearchUser().subscribe(
            () => {
                this.user = null;
                this.changeTab(0);
            }
        );
    }

    /**
     * Loads Roles and Customer sites based on the Login User's role.
     */
    loadCustomerSitesAndRoles() {
        let roleName: string = null
        let isLoginUserSladeAdmin: boolean = false;
        if (this.isLoginUserHasRole(Constants.ROLE_SLADE_ADMIN)) {
            roleName = Constants.ROLE_SLADE_ADMIN;
            isLoginUserSladeAdmin = true;
        } else if (this.isLoginUserHasRole(Constants.ROLE_CUSTOMER_SUPER_USER)) {
            roleName = Constants.ROLE_CUSTOMER_SUPER_USER;
        }
        this.userAccService.getUserSitesAndRoles(this.loginUser, roleName).subscribe(
            (dataMap: any) => {
                this.sites = dataMap.userSites;
                this.roles = dataMap.roles;
                if (!isLoginUserSladeAdmin) {
                    this.roles = this.roles.filter(role => role.roleId != 8);
                }
            }
        );
    }

    /**
     * Check if Login User has role
     */
    isLoginUserHasRole(roleName: string) {
        return this.userService.hasRoleInSelectedSite(this.loginUser, roleName);
    }

    changeTab(index, data?) {
        if (data) {
            this.resetAllowed = false;
        }
        this.selectedTab = index;
    }

    tabChanged(event: MatTabChangeEvent) {
        this.alertService.reset();

        if (this.resetAllowed) {
            this.userAccService.triggerResetUser();
        }
        this.resetAllowed = true;
    }

    ngOnDestroy() {
        this.editUserSubscription.unsubscribe();
        this.searchUserSubscription.unsubscribe();
    }
}