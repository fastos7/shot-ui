import { Component, OnInit, Input, SimpleChanges, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnDestroy, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { AlertService } from '../../core/services/alert.service';
import { ViewChildren } from '@angular/core';
import { CustomerPreference } from '../../common/model/customer-preference.model';
import { DisplayCustomerPreferenceComponent } from '../display-customer-preference/display-customer-preference.component';
import { CustomerPreferencesService } from '../../common/services/customer-preferences.service';
import { User } from '../../common/model/user.model';
import { UserService } from '../../common/services/user.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { Product } from '../../common/model/product.model';
import { MaterialDataSource } from '../../common/material-datasource';

/**
 * Component for listing the `Customer Preferences` and holds the action buttons
 * for Move-up Rank, Move-down Rank, Edit and Delete.
 * 
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-list-customer-preferences',
  templateUrl: './list-customer-preferences.component.html',
  styleUrls: ['./list-customer-preferences.component.css']
})
export class ListCustomerPreferencesComponent extends MaterialDataSource implements OnInit,OnDestroy,OnChanges {
  
  @Input() product: Product;
  @Input() customerPreferences:any;

  private displaySearchMessage:string;

  private customerPreferencesSubscription:Subscription;

  private addEditMode:string;

  private isArrowUpBtnDisabled:boolean   = true;
  private isArrowDownBtnDisabled:boolean = true;
  private isEditBtnDisabled:boolean      = true;
  private isDeleteBtnDisabled:boolean    = true;

  private currentlySelectedCustomerPreference:CustomerPreference = null;
  private customerPreferencesToBeDeleted:CustomerPreference[] = null;

  private user:User;

  /* Holds all the checkboxes */
  @ViewChildren("checkbox") checkboxes:QueryList<any>;
  
  private displayedColumns = ['select',
                              'rank',
                              'doseRange',
                              'diluentContainer',
                              'route',
                              'volume',
                              'exact',
                              'quantity',
                              'infusionDuration',
                              'comments' ];

  constructor(private alertService:AlertService,
              private userService: UserService, 
              private customerPreferencesService:CustomerPreferencesService,
              private eventBusService:EventBusService) { 
    super();            
  }

  ngOnInit() {

    /* Get the current user from storage */
    this.user = this.userService.getCurrentUser();

    this.displaySearchMessage = "";  
    this.addEditMode = "ADD";
  }

  ngOnDestroy(): void {
    if (this.customerPreferencesSubscription) {
      this.customerPreferencesSubscription.unsubscribe();
    }
  }

  /**
   * Listen for any changes on the input parameters.
   * 
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];

      if (propName === "product") {
        var newProduct = change.currentValue;
        this.displaySearchMessage =(newProduct) ? newProduct.productDescription : "";

        /* Force reset of the buttons when product changes. */
        this.onClickCustomerPrefences();
      }

      if (propName === "customerPreferences") {        

        /* Force disable the buttons when list of customer preferences changes. */
        this.disableButtons();
      }
      
    }
  }

  onClickAddPreference() {    
    this.addEditMode = "ADD";
    // Clear Error Message
    this.alertService.error("",'displayCustomerPreferenceAlert');
  }

  disableButtons() {
    this.isArrowUpBtnDisabled = true;
    this.isArrowDownBtnDisabled = true;
    this.isEditBtnDisabled = true;
    this.isDeleteBtnDisabled = true;
  }

  onClickCustomerPrefences() {    
    this.toggleButtons();
  }

  toggleButtons() {
    
    /* Count how many checkboxes are currently checked */
    var currentlySelectedPreferences =  this.getCurrentlySelectedPreferences();
    
    /*
     * Only enable these buttons if there are only 1 selected preference
     * in the list and there are more than one preferences.
     */
    this.isArrowUpBtnDisabled = !(currentlySelectedPreferences.length == 1 && this.customerPreferences.length > 1);
    this.isArrowDownBtnDisabled = !(currentlySelectedPreferences.length == 1 && this.customerPreferences.length > 1);

    /*
     * Only enable the edit button if there are only 1 selected preference
     * in the list.
     */
    this.isEditBtnDisabled = !(currentlySelectedPreferences.length == 1);

    /*
     * Enable this button if there is/are selected preference in the list.
     */
    this.isDeleteBtnDisabled = !(currentlySelectedPreferences.length > 0);
  }

  /**
   * This method will return the list of currently selected preferences in the 
   * list.
   */
  getCurrentlySelectedPreferences(): ElementRef[]{  
    if (this.checkboxes) {
      return this.checkboxes.filter(checkbox => checkbox.nativeElement.checked == true);
    }  else {
      return [];
    }
    
  }

  /**
   * Move up the rank of the currently selected `Customer Preference`. This is done
   * by swapping the ranks of the currently selected CP and the higher CP. Then it 
   * will be sent to the API to update the CPs. Once the update is successful then
   * refresh the list of `Customer Preferences`.
   */
  OnArrowUp() {
    
    let currentlySelectedPreferences = this.getCurrentlySelectedPreferences();
    if (currentlySelectedPreferences.length == 1) {
      let prefId = currentlySelectedPreferences[0].nativeElement.attributes["prefId"].value;
      
      /*
       * Find the Customer Preference object from the list using the prefId
       * obtained from the checkbox input.       
       */
      let selectedCP = this.customerPreferences.find(cp => cp.prefId == prefId);

      /*
       * Move up only the customer preference if the rank is greater than one.
       * Otherwise do nothing.
       */
      if (selectedCP && selectedCP.rank > 1) {

        this.eventBusService.broadcast(Constants.SHOW_LOADING);

        /*
         * Disable the buttons to prevent user from clicking anything 
         * while the swapping is still on going.
         */
        this.disableButtons();

        /*
         * Get the Customer Preference higher than the currently selected 
         * customer preference.
         */
        let higherCP = this.customerPreferences.find(cp => cp.rank == (selectedCP.rank - 1));

        /* Temporarily store the rank of the currently selected Customer Preference. */
        let tempRank = selectedCP.rank;

        /*
         * Clone the selected CP and higher CP and this will be used to send
         * to the API. This is needed so that when the rank are swap between
         * this 2 cp, the customer preference table will not be updated right 
         * away. The update of the ranks will happened once the call to the 
         * API is completed and successful.
         * 
         */
        let selectedCPClone = Object.assign({},selectedCP);
        let higherCPClone = Object.assign({},higherCP);
        
        selectedCPClone.updatedBy = this.user.userId;
        higherCPClone.updatedBy = this.user.userId;

        /*
         * Now swap the ranks.
         */
        selectedCPClone.rank = higherCPClone.rank;
        higherCPClone.rank = tempRank;

        /*
         * Cancel any pending call to the API if there is any.
         */
        if (this.customerPreferencesSubscription) {
          this.customerPreferencesSubscription.unsubscribe();
        }

        this.customerPreferencesSubscription = this.customerPreferencesService.updateCustomerPreferences(this.user.selectedUserAuthority.customerKey,[selectedCPClone,higherCPClone]).subscribe(

          /* When successful */
          data => {

              /*
               * Now update the ranks of the actual customer preferences.
               */
              selectedCP.rank = selectedCPClone.rank;
              higherCP.rank = higherCPClone.rank; 

              /*
               * Sort the list of customer preferences based on ranks
               * and assigned it back to the Material table.
               */              
              this.customerPreferences = this.customerPreferences.sort(
                (a,b) => {
                          if (a.rank > b.rank) {
                            return 1;
                          }
                      
                          if (a.rank < b.rank ) {
                              return -1;
                          }            
                          return 0;
                }
              ); 
              
              /*
               * Enable or Disable the buttons.
               */
              this.toggleButtons();

              this.eventBusService.broadcast(Constants.HIDE_LOADING);
          },
          /* When there is an error. */
          error => {

              /* Alert the user of the successfull creation of the preference. */
              //this.alertService.error("Customer Preference successfully created.",true,'listCustomerPreferenceAlert');   

              /*
               * Enable or Disable the buttons.
               */          
              this.toggleButtons();

              this.eventBusService.broadcast(Constants.HIDE_LOADING);
          },
          () => {
              // Do nothing
              this.eventBusService.broadcast(Constants.HIDE_LOADING);
          }
        );  

      }
    }
  }

  /**
   * Move down the rank of the currently selected `Customer Preference`. This is done
   * by swapping the ranks of the currently selected CP and the lower CP. Then it 
   * will be sent to the API to update the CPs. Once the update is successful then
   * refresh the list of `Customer Preferences`.
   */
  OnArrowDown() {
    
    let currentlySelectedPreferences = this.getCurrentlySelectedPreferences();
    if (currentlySelectedPreferences.length == 1) {
      let prefId = currentlySelectedPreferences[0].nativeElement.attributes["prefId"].value;
      
      /*
       * Find the Customer Preference object from the list using the prefId
       * obtained from the checkbox input.       
       */
      let selectedCP = this.customerPreferences.find(cp => cp.prefId == prefId);

      /*
       * Move down only the customer preference if the rank is less than the
       * size of the customer preference list. Otherwise do nothing.
       */
      if (selectedCP && selectedCP.rank < this.customerPreferences.length) {

        this.eventBusService.broadcast(Constants.SHOW_LOADING);

        /*
         * Disable the buttons to prevent user from clicking anything 
         * while the swapping is still on going.
         */
        this.disableButtons();

        /*
         * Get the Customer Preference lower than the currently selected 
         * customer preference.
         */
        let lowerCP = this.customerPreferences.find(cp => cp.rank == (selectedCP.rank + 1));

        /* Temporarily store the rank of the currently selected Customer Preference. */
        let tempRank = selectedCP.rank;

        /*
         * Clone the selected CP and lower CP and this will be used to send
         * to the API. This is needed so that when the rank are swap between
         * this 2 cp, the customer preference table will not be updated right 
         * away. The update of the ranks will happened once the call to the 
         * API is completed and successful.
         * 
         */
        let selectedCPClone = Object.assign({},selectedCP);
        let lowerCPClone = Object.assign({},lowerCP);

        selectedCPClone.updatedBy = this.user.userId;
        lowerCPClone.updatedBy = this.user.userId;

        /*
         * Now swap the ranks.
         */
        selectedCPClone.rank = lowerCPClone.rank;
        lowerCPClone.rank = tempRank;
        
        /*
         * Cancel any pending call to the API if there is any.
         */
        if (this.customerPreferencesSubscription) {
          this.customerPreferencesSubscription.unsubscribe();
        }

        this.customerPreferencesSubscription = this.customerPreferencesService.updateCustomerPreferences(this.user.selectedUserAuthority.customerKey,[selectedCPClone,lowerCPClone]).subscribe(

          /* When successful */
          data => {

              /*
               * Now update the ranks of the actual customer preferences.
               */
              selectedCP.rank = selectedCPClone.rank;
              lowerCP.rank = lowerCPClone.rank; 

              /*
               * Sort the list of customer preferences based on ranks
               * and assigned it back to the Material table.
               */
              this.customerPreferences = this.customerPreferences.sort(
                (a,b) => {
                          if (a.rank > b.rank) {
                            return 1;
                          }
                      
                          if (a.rank < b.rank ) {
                              return -1;
                          }            
                          return 0;
                }
              );  
              
              /*
               * Enable or Disable the buttons.
               */
              this.toggleButtons();

              this.eventBusService.broadcast(Constants.HIDE_LOADING);
          },
          /* When there is an error. */
          error => {

              /*
               * Enable or Disable the buttons.
               */
              this.toggleButtons();

              this.eventBusService.broadcast(Constants.HIDE_LOADING);
          },
          () => {
              // Do nothing
              this.eventBusService.broadcast(Constants.HIDE_LOADING);
          }
        );  

      }
    }
  }

  /**
   * Edit a customer preference
   */
  OnEdit() {

    /* Get the currently selected preference */
    let currentlySelectedPreferences = this.getCurrentlySelectedPreferences();
    if (currentlySelectedPreferences.length == 1) {
      let prefId = currentlySelectedPreferences[0].nativeElement.attributes["prefId"].value;
      
      /**
       * Get the data from customer preference list and assign it as a new
       * object. The Object.assign is required so that the ngOnChanges on 
       * DisplayCustomerPreference will fire even if the selected customer
       * preference is the same as the previous one.
       */
      this.currentlySelectedCustomerPreference = Object.assign({}, this.customerPreferences.find(cf => cf.prefId == prefId));      
      this.addEditMode = "EDIT";
    }
    
  }

  /**
   * Determine the customer preferences to be deleted.
   */
  OnDelete() {
    /* Get the currently selected preference */
    let currentlySelectedPreferences = this.getCurrentlySelectedPreferences();
    if (currentlySelectedPreferences.length > 0) {

        var tempArray:CustomerPreference[] = new Array();
        currentlySelectedPreferences.forEach(
          cscf => {
            tempArray.push(this.customerPreferences.find(cf => cf.prefId == cscf.nativeElement.attributes["prefId"].value));
          }
        );
        
        this.customerPreferencesToBeDeleted = tempArray;    
        
    }
  }
}
