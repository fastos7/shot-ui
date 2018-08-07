import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { UserService } from '../../common/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { UserAccountService } from '../../user/user-account.service';
import { User } from '../../common/model/user.model';
import { Constants } from '../../common/app.constants';
import { Subscription } from 'rxjs/Subscription';
import { UserPermissionsService } from '../../common/services/user-permissions.service';

@Component({
  selector: 'app-account-preferences',
  templateUrl: './account-preferences.component.html',
  styleUrls: ['./account-preferences.component.css']
})
export class AccountPreferencesComponent implements OnInit, OnDestroy {
  private user: User;
  private accPrefForm: FormGroup;
  private resetSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private userPermissionService: UserPermissionsService,
    private eventBusService: EventBusService,
    private userAccService: UserAccountService) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.createForm();
    this.resetSubscription = this.userAccService.subscribeToResetUser().subscribe(
      () => {
        this.reset();
      }
    );
  }

  createForm() {
    this.accPrefForm = this.formBuilder.group({
      defaultSite: [ this.user.defaultSite ],
      defaultOrderView: [ this.user.defaultOrderView ]
    });
  }

  hasOrdersPermission() {
    return this.userPermissionService.hasPermisson('orders');
  }

  reset() {
    this.accPrefForm.setValue({
      defaultSite: this.user.defaultSite,
      defaultOrderView: this.user.defaultOrderView
    });
  }

  onSubmit() {
    this.alertService.reset();
    this.eventBusService.broadcast(Constants.SHOW_LOADING);

    // Create User copy and assign new Preferences to it
    let updatedUser: User = new User(null, null);
    updatedUser.userId = this.user.userId;
    updatedUser.defaultSite = this.accPrefForm.get('defaultSite').value;
    updatedUser.defaultOrderView = this.accPrefForm.get('defaultOrderView').value;

    // Save the new Preferences using the User copy
    this.userAccService.updateAccPreferences(updatedUser).subscribe(
      success => {
          this.eventBusService.broadcast(Constants.HIDE_LOADING);

          // Assign the saved preferences into the main User object.
          this.user.defaultSite = updatedUser.defaultSite;
          this.user.defaultOrderView = updatedUser.defaultOrderView;
          this.userService.updateUser(this.user);

          this.alertService.success('Site Preferences have been successfully updated.')
          this.eventBusService.broadcast(Constants.USER_PREFERENCES_UPDATED);
      },
      error => {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
          this.eventBusService.broadcast(Constants.HIDE_LOADING);
      });
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }
}
