import { Component, OnInit, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CustomerPreference } from '../../common/model/customer-preference.model';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs';
import { AlertService } from '../../core/services/alert.service';
import { CustomerPreferencesService } from '../../common/services/customer-preferences.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/model/user.model';
import { Constants } from '../../common/app.constants';
import { MaterialDataSource } from '../../common/material-datasource';

/**
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-remove-customer-preferences',
  templateUrl: './remove-customer-preferences.component.html',
  styleUrls: ['./remove-customer-preferences.component.scss']
})
export class RemoveCustomerPreferencesComponent extends MaterialDataSource implements OnInit {

  //private showWheel = false;

  /* List of customer preferences to be deleted */
  @Input() customerPreferencesToBeDeleted?:CustomerPreference[];
  
  private customerPreferencesSubscription:Subscription;

  private user:User;

  /*
   * This is a reference to the cancel button so that the
   * modal dialog can be cancelled programmatically.
   */  
  @ViewChild('noBtn') noBtn: ElementRef;

  private displayedColumns = ['rank',
                              'doseRange',
                              'diluentContainer',
                              'route',
                              'volume',
                              'exact',
                              'quantity',
                              'infusionDuration'];
  
  constructor(private alertService:AlertService,
              private userService: UserService,
              private customerPreferencesService:CustomerPreferencesService,
              private eventBusService:EventBusService) { 
    super();            
  }

  ngOnInit() {

    /* Get the current user from storage */
    this.user = this.userService.getCurrentUser();

  }

  OnCancel() {

  }

  /**
   * The delete operation
   */
  onSubmit() {

    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    //this.showWheel = true;
    
    /* Cancel any pending call the API if there are any. */                                                      
    if (this.customerPreferencesSubscription) {
      this.customerPreferencesSubscription.unsubscribe();
    }

    /* Call the API to delete the customer preferences */
    this.customerPreferencesSubscription = this.customerPreferencesService.deleteCustomerPreferences(this.user.selectedUserAuthority.customerKey,this.customerPreferencesToBeDeleted).subscribe(

        /* When successful */
        data => {

                  //this.showWheel = false;
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
                  /* Inform grand parent component to refresh the customer preferences list. */
                  this.eventBusService.broadcast(Constants.REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT);

                  /* Close this modal dialog */
                  this.noBtn.nativeElement.click();

                  /* Alert the user of the successfull creation of the preference. */
                  this.alertService.success("Customer Preference successfully deleted.",true,'listCustomerPreferenceAlert');   
        },
        /* When there is an error. */
        error => {

                  /* Show generic error message for any backend errors. */          
                  this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'deleteCustomerPreferenceAlert');              

                  //this.showWheel = false;
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
        },
        () => {
            // Do nothing
            //this.showWheel = false;            
            this.eventBusService.broadcast(Constants.HIDE_LOADING);
        }
    );  
  }

}
