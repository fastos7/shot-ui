import { Component, OnInit } from '@angular/core';
import { SearchProductComponent } from '../common/search-product/search-product.component'
import { UserService } from '../common/services/user.service';
import { User } from '../common/model/user.model';
import { CustomerPreferencesService } from '../common/services/customer-preferences.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Util } from '../common/util';
import { FormGroup } from '@angular/forms';
import { UserAuthorities } from '../common/model/user-authorities.model';
import { EventBusService } from '../common/services/event-bus.service';
import { Constants } from '../common/app.constants';
import { Product } from '../common/model/product.model';

/**
 * This component is the parent of component of Listing, Adding, Editing and Removing
 * of Customer Preferences components.
 */
@Component({
  selector: 'app-customer-preferences',
  templateUrl: './customer-preferences.component.html',
  styleUrls: ['./customer-preferences.component.css']
})
export class CustomerPreferencesComponent implements OnInit,OnDestroy {

  private currentlySelectedProduct:Product;
  private userAuthorities:UserAuthorities;

  private showPreferencesTable:boolean;

  private customerPreferences:any;
  private customerPreferencesSubscription:Subscription;

  private searchProductForm:FormGroup;
  
  constructor(private userService: UserService,
              private customerPreferencesService:CustomerPreferencesService,
              private eventBusService:EventBusService) { }

  ngOnInit() {

    /* Get the currently selected customer site from local storage */
    let user: User = this.userService.getCurrentUser()
    this.userAuthorities = user.selectedUserAuthority;

    /* Initialize flags */    
    this.showPreferencesTable = false;

    /* Register Event Listener */
    this.eventBusService.on(Constants.REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT,() => {
			this.findPreferences();
		});
    
  }

  handleSelectedProduct(product:Product) { 

    this.currentlySelectedProduct = product;    
    if (product != null) {
      this.findPreferences();  
    } else {
      this.customerPreferences = null;
      this.showPreferencesTable = false;
    }
  }

  findPreferences() {

    /*
     * If there was a previous request to get the preferences, cancel it.
     */
    if (this.customerPreferencesSubscription) {
      this.customerPreferencesSubscription.unsubscribe();
    }

    /* Fetch the customer preferences */
    this.customerPreferencesSubscription = this.customerPreferencesService.getAllCustomerPreferences(this.userAuthorities.customerKey,
                                                                                                     this.currentlySelectedProduct).subscribe(
      data => {

        this.customerPreferences = data;    

        /* 
         * Show the preferences table when data arrives.
         */        
        this.showPreferencesTable = true;
      },
      error => {
        // TODO : Show system error for errors other than 404

        /* No customer preferences for the selected product */
        if (error.status === 404) {
          this.customerPreferences = null;          
        }
        
        /* No matter what is the error show the preferences table.
         */        
        this.showPreferencesTable = true;

      },
      () => {
        /* Do nothing */
        
      }
    );  
  }

  ngOnDestroy(): void {
    if (this.customerPreferencesSubscription) {
      this.customerPreferencesSubscription.unsubscribe();
    }
  }
}
