import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { DeliveryMechanism } from '../../common/model/delivery-mechanism.model';
import { AdministrationRoute } from '../../common/model/administration-route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../common/app.constants';
import { CustomerPreferencesService } from '../../common/services/customer-preferences.service';
import { CustomerPreference } from '../../common/model/customer-preference.model';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/model/user.model';
import { EventBusService } from '../../common/services/event-bus.service';
import { Product } from '../../common/model/product.model';

/**
 * This component handles the Adding and Editing of Customer Preferences.
 * 
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-display-customer-preference',
  templateUrl: './display-customer-preference.component.html',
  styleUrls: ['./display-customer-preference.component.css']
})
export class DisplayCustomerPreferenceComponent implements OnInit,OnChanges,OnDestroy {

  
  /* This input controls whether this component will be used to add or to edit
   * customer preference. Possible values are 'ADD' or 'EDIT'
   */
  @Input() mode:string;  

  /*
   * The current product this component is working on.
   */
  @Input() product: Product;

  @Input() currentlySelectedCustomerPreference?:CustomerPreference;
  /*
   * This is a reference to the cancel button so that the
   * modal dialog can be cancelled programmatically.
   */  
  @ViewChild('cancelBtn') cancelBtn: ElementRef;


  /* Various variables to control display in the UI.*/
  private title:string;
  private submitButtonTitle:string;
  private headerMessage:string;
  private productName:string;
  private unitOfMeasure:string;

  private addEditCustomerPreferenceForm:FormGroup;
  
  //private showWheel = false;

  private selectedDeliveryMechanism:DeliveryMechanism;
  private selectedAdministrationRoute:AdministrationRoute;

  private customerPreferencesSubscription:Subscription;

  private user:User;
  
  /*
	 * Form errors container
	 */
	formErrors = {
                  'doseFrom'            : '',
                  'doseTo'              : '',
                  'comments'            : '',
                  'quantity'            : '',
                  'diluentContainer'    : '',
                  'administrationRoute' : '',
                  'volume'              : '',
                  'infusionDuration'    : ''
                };
  
  /*
	 * Validation error messages
	 */
	validationMessages = {
                        'doseFrom': {   
                          'required'  : 'Dose From is required',
                          'max'       : "Dose From should not be greater than Dose To",
                          'pattern'   : 'Invalid value for Dose From'
                        },
                        'doseTo': {                        
                          'pattern'   : 'Invalid value for Dose To',
                          'valueGreaterThan' : 'Dose To should be greater than Dose From.'
                        },
                        'comments'    : {
                          'maxlength' : "Max. number of comments reached."
                        },
                        'quantity' : {
                          'pattern'   : 'Invalid value for Quantity.'
                        },
                        'diluentContainer' : {
                          'required'  : 'Diluent Container is required.'
                        },
                        'administrationRoute' : {
                          'required'  : 'Route is required.'
                        },
                        'volume' : {
                          'pattern'   : 'Invalid value for volume',
                          'required'  : 'Volume is required.'
                        },
                        'infusionDuration' : {
                          'pattern'   : 'Invalid value Infusion Duration',
                          'required'  : 'Infusion Duration is required.'
                        }
                      };		                

  constructor(private alertService:AlertService,
              private userService: UserService,
              private formBuilder:FormBuilder,
              private customerPreferencesService:CustomerPreferencesService,
              private eventBusService:EventBusService) { 

  }

  ngOnInit() {
    
    /* Get the current user from storage */
    this.user = this.userService.getCurrentUser();

    this.buildForm();   
    this.modeChange();

  }

  /**
	 * Build the form controls and setup form data value changes listener.
	 */
	buildForm() : void {
    
    if (this.mode == "ADD") {
      this.addEditCustomerPreferenceForm = this.formBuilder.group({
        'doseFrom'            : [{value : '',disabled: false},                     
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],
        'doseTo'              : [{value : '',disabled: false},
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],  
        'comments'            : [{value: '',disabled : false},
                                 [Validators.maxLength(100)]],
        'quantity'            : [{value: '',disabled : false},
                                 [Validators.pattern(Constants.REG_EX_NUMBER_9_PATTERN)]],
        'diluentContainer'    : [{value: '',disabled : false}],
        'administrationRoute' : [{value: '',disabled : false}],
        'volume'              : [{value: '',disabled : false},
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]],
        'exact'               : [{value: '',disabled : false}],             
        'infusionDuration'    : [{value: '',disabled : false},
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_1_PATTERN)]]
      });
    } else if (this.mode == "EDIT") {
      this.addEditCustomerPreferenceForm = this.formBuilder.group({
        'doseFrom'            : [{value : this.currentlySelectedCustomerPreference.doseFrom,disabled: false},                     
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],
        'doseTo'              : [{value : this.currentlySelectedCustomerPreference.doseTo,disabled: false},
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],  
        'comments'            : [{value: this.currentlySelectedCustomerPreference.comments,disabled : false},
                                 [Validators.maxLength(100)]],
        'quantity'            : [{value: this.currentlySelectedCustomerPreference.quantity,disabled : false},
                                 [Validators.pattern(Constants.REG_EX_NUMBER_9_PATTERN)]],
        'diluentContainer'    : [{value: this.currentlySelectedCustomerPreference.deliveryMechanism,disabled : false}],
        'administrationRoute' : [{value: this.currentlySelectedCustomerPreference.administrationRoute,disabled : false}],
        'volume'              : [{value: this.currentlySelectedCustomerPreference.volume,disabled : false},
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]],
        'exact'               : [{value: this.currentlySelectedCustomerPreference.exact == Constants.TRUE ? true : false,disabled : false}],             
        'infusionDuration'    : [{value: this.currentlySelectedCustomerPreference.infusionDuration,disabled : false},
                                 [Validators.pattern(Constants.REG_EX_DECIMAL_9_1_PATTERN)]]
      });

      this.handleSelectedDeliveryMechanism(this.currentlySelectedCustomerPreference.deliveryMechanism);

      let diluentContainerControl = this.addEditCustomerPreferenceForm.get("diluentContainer");
      if (diluentContainerControl) {              
        if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
            this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) {
              diluentContainerControl.setValidators([]);    
        } else {                
          diluentContainerControl.setValidators([Validators.required]);  
        }              
        diluentContainerControl.updateValueAndValidity();  
        
      }

      let administrationRoute = this.addEditCustomerPreferenceForm.get("administrationRoute");
      if (administrationRoute) {
        
        if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
            this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) {
              administrationRoute.setValidators([]);    
        } else {                
          administrationRoute.setValidators([Validators.required]);  
        }
        
        administrationRoute.updateValueAndValidity();  
        
      }
    }
		

    /* Listen to any changes in the form constrols */
    this.addEditCustomerPreferenceForm.valueChanges.subscribe(data => this.onValueChanged(data));
    
    /*
     * The validation of the field "doseFrom" is dependent on the "doseTo". 
     * Normally "doseFrom" is not mandatory but once there is a value in
     * "doseTo", the field "doseFrom" will be mandatory and it should not
     * be greater than "doseTo".
     */
    this.addEditCustomerPreferenceForm.get("doseTo").valueChanges.subscribe(
      (doseTo:number) => {           
        if (doseTo != null ) {          
          this.addEditCustomerPreferenceForm.get("doseFrom").setValidators([Validators.required,
                                                                            Validators.max(doseTo),
                                                                            Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
        } else {
          this.addEditCustomerPreferenceForm.get("doseFrom").setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
        }
        this.addEditCustomerPreferenceForm.get("doseFrom").markAsDirty();        
        this.addEditCustomerPreferenceForm.get("doseFrom").updateValueAndValidity();        
      }
    );

		this.onValueChanged();
	}  
  
  /**
	 * This method will be called if any of the controls were modified and
	 * will add error messages in the form errors container.
	 * @param any 
	 */
	onValueChanged(data?: any) {
	
		if (!this.addEditCustomerPreferenceForm) { return; }

		const form = this.addEditCustomerPreferenceForm;

		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
				}
			}
		}			
  }
  
  /**
   * Listen for any changes in input parameters.
   * 
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];      
      
      if (propName === "mode") {          
        this.modeChange();
      }      

      if (propName === "currentlySelectedCustomerPreference") {
        this.buildForm();
      }

      if (propName === "product") {

        this.product = change.currentValue;
        this.productName =(this.product) ? this.product.productDescription : "";
        this.unitOfMeasure = (this.product) ? this.product.unitOfMeasure : "";

        if (this.addEditCustomerPreferenceForm) {
          this.addEditCustomerPreferenceForm.reset();          

          this.alertService.error("",'displayCustomerPreferenceAlert');
        }

        /*
         * The fields "diluentContainer" and "administrationRoute" validation
         * is dependent on the current product. If the product's type is
         * either "Formulation" or "CNF Formulation" then these controls mentioned
         * above are required.
         * 
         */
        if (this.product) {
          if (this.addEditCustomerPreferenceForm) {
            let diluentContainerControl = this.addEditCustomerPreferenceForm.get("diluentContainer");
            if (diluentContainerControl) {              
              if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
                  this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) {
                    diluentContainerControl.setValidators([]);    
              } else {                
                diluentContainerControl.setValidators([Validators.required]);  
              }              
              diluentContainerControl.updateValueAndValidity();  
              
            }

            let administrationRoute = this.addEditCustomerPreferenceForm.get("administrationRoute");
            if (administrationRoute) {
              
              if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
                  this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) {
                    administrationRoute.setValidators([]);    
              } else {                
                administrationRoute.setValidators([Validators.required]);  
              }
              
              administrationRoute.updateValueAndValidity();  
              
            }
          } 
        }
      }

    }
  }

  /**
   * Change the display texts based on the mode.
   */
  modeChange() {
    if (this.mode === "ADD") {
      this.title = "Add Customer Preference";
      this.submitButtonTitle = "ADD PREFERENCE";
      this.headerMessage = "Please add values to the below fields to add a new preference";
    } else {
      this.title = "Edit Customer Preference";
      this.submitButtonTitle = "SAVE";
      this.headerMessage = "Please edit the preference values below. Click save to update, cancel to discard changes.";
    }
  }

  /**
   * This method will be called everytime the Delivery Mechanism field has
   * been selected.
   * 
   * @param deliveryMechanism 
   */
  handleSelectedDeliveryMechanism(deliveryMechanism:DeliveryMechanism) {

    this.selectedDeliveryMechanism = deliveryMechanism;

    if (this.selectedDeliveryMechanism) {

        /*
         * If the selected Diluent is not "Neat" then the "volume" field is 
         * required. otherwise its not required.
         */
        let volume = this.addEditCustomerPreferenceForm.get("volume");  
        if (this.selectedDeliveryMechanism.diluent.stockDescription != 'Neat') {                
            if (volume) {
              volume.setValidators([Validators.required,Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);  
            }            
        } else {
          volume.setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);  
        }
        volume.markAsDirty();
        volume.updateValueAndValidity();  

        /*
         * If the selected Container is Elastomerics (stock code starts with 22) then the 
         * "infusionDuration" field is required. otherwise its not required.
         */
        let infusionDuration = this.addEditCustomerPreferenceForm.get("infusionDuration");  
        if (this.selectedDeliveryMechanism.container.stockCode.startsWith("22")) {        
          if (infusionDuration) {
            infusionDuration.setValidators([Validators.required,Validators.pattern(Constants.REG_EX_DECIMAL_9_1_PATTERN)]);  
          } 
        } else {
          infusionDuration.setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_1_PATTERN)]);    
        }
        infusionDuration.markAsDirty();
        infusionDuration.updateValueAndValidity();  
    } else {

		let volume = this.addEditCustomerPreferenceForm.get("volume");        
		volume.setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);        
		volume.markAsDirty();
		volume.updateValueAndValidity();  

		// update validation rules for infusion duration
		let infusionDuration = this.addEditCustomerPreferenceForm.get("infusionDuration");        
		infusionDuration.setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_1_PATTERN)]);          
		infusionDuration.markAsDirty();
		infusionDuration.updateValueAndValidity();  
	}

  }

  /**
   * This method will be called everytime the Administration Routes field has
   * been selected.
   * 
   * @param administrationRoute 
   */
  handleSelectedAdministrationRoute(administrationRoute:AdministrationRoute) {
    this.selectedAdministrationRoute = administrationRoute;
  }

  onSubmit() {
    
    /* When all the fields have been validated then the customer preference
     * can be created
     */
    if (this.addEditCustomerPreferenceForm.valid) {			      
      
      //this.showWheel = true;
      this.disableControls(true);

      this.eventBusService.broadcast(Constants.SHOW_LOADING);

      if (this.mode === "ADD") {
          // Create the Customer Preference model
          var customerPreference = new CustomerPreference(null,
                                                          this.user.selectedUserAuthority.customerKey,
                                                          this.user.selectedUserAuthority.customerName,
                                                          this.product.productDescription,                                                
                                                          this.product.entryType,
                                                          this.product.batDrugKey,
                                                          this.product.batDSUKey,
                                                          this.product.triKey,
                                                          this.product.msoIngStkKey,
                                                          this.product.batFormulation,
                                                          this.addEditCustomerPreferenceForm.get("doseFrom").value,
                                                          this.addEditCustomerPreferenceForm.get("doseTo").value,
                                                          this.product.unitOfMeasure,
                                                          this.addEditCustomerPreferenceForm.get("diluentContainer").value,
                                                          this.addEditCustomerPreferenceForm.get("volume").value,
                                                          this.addEditCustomerPreferenceForm.get("exact").value == true ? Constants.TRUE : Constants.FALSE,
                                                          this.addEditCustomerPreferenceForm.get("quantity").value,
                                                          this.addEditCustomerPreferenceForm.get("administrationRoute").value,
                                                          this.addEditCustomerPreferenceForm.get("infusionDuration").value,
                                                          0,
                                                          this.addEditCustomerPreferenceForm.get("comments").value,
                                                          this.user.userId,
                                                          this.user.userId);

            /* Cancel any pending call the API if there are any. */                                                      
            if (this.customerPreferencesSubscription) {
            this.customerPreferencesSubscription.unsubscribe();
            }

            /* Call the API to create the customer preference */
            this.customerPreferencesSubscription = this.customerPreferencesService.createCustomerPreferences(this.user.selectedUserAuthority.customerKey,customerPreference).subscribe(

                /* When successful */
                data => {

                          this.eventBusService.broadcast(Constants.HIDE_LOADING);
                          this.disableControls(false);

                          /* Inform grand parent component to refresh the customer preferences list. */
                          this.eventBusService.broadcast(Constants.REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT);

                          /* Close this modal dialog */
                          this.cancelBtn.nativeElement.click();

                          /* Alert the user of the successfull creation of the preference. */
                          this.alertService.success("Customer Preference successfully created.",true,'listCustomerPreferenceAlert');   
                },
                /* When there is an error. */
                error => {

                          /* Show generic error message for any backend errors. */          
                          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayCustomerPreferenceAlert');              

                          this.eventBusService.broadcast(Constants.HIDE_LOADING);
                          this.disableControls(false);
                },
                () => {
                    // Do nothing                    
                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                    this.disableControls(false);
                }
            );  
      } else {

          // Create the Customer Preference model
          var customerPreference = new CustomerPreference(this.currentlySelectedCustomerPreference.prefId,
                                                          this.currentlySelectedCustomerPreference.customerKey,
                                                          this.currentlySelectedCustomerPreference.customerName,
                                                          this.currentlySelectedCustomerPreference.productDescription,                                                
                                                          this.currentlySelectedCustomerPreference.productType,
                                                          this.currentlySelectedCustomerPreference.batDrugKey,
                                                          this.currentlySelectedCustomerPreference.batDSUKey,
                                                          this.currentlySelectedCustomerPreference.triKey,
                                                          this.currentlySelectedCustomerPreference.msoIngStkKey,
                                                          this.currentlySelectedCustomerPreference.batFormulation,
                                                          this.addEditCustomerPreferenceForm.get("doseFrom").value,
                                                          this.addEditCustomerPreferenceForm.get("doseTo").value,
                                                          this.currentlySelectedCustomerPreference.unitOfMeasure,
                                                          this.addEditCustomerPreferenceForm.get("diluentContainer").value,
                                                          this.addEditCustomerPreferenceForm.get("volume").value,
                                                          this.addEditCustomerPreferenceForm.get("exact").value == true ? Constants.TRUE : Constants.FALSE,
                                                          this.addEditCustomerPreferenceForm.get("quantity").value,
                                                          this.addEditCustomerPreferenceForm.get("administrationRoute").value,
                                                          this.addEditCustomerPreferenceForm.get("infusionDuration").value,
                                                          this.currentlySelectedCustomerPreference.rank,
                                                          this.addEditCustomerPreferenceForm.get("comments").value,
                                                          this.user.userId,
                                                          this.user.userId);

          /* Cancel any pending call the API if there are any. */                                                      
          if (this.customerPreferencesSubscription) {
          this.customerPreferencesSubscription.unsubscribe();
          }

          /* Call the API to create the customer preference */
          this.customerPreferencesSubscription = this.customerPreferencesService.updateCustomerPreference(this.user.selectedUserAuthority.customerKey,customerPreference).subscribe(

                  /* When successful */
                  data => {

                    //this.showWheel = false;
                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                    this.disableControls(false);

                    /* Inform grand parent component to refresh the customer preferences list. */
                    this.eventBusService.broadcast(Constants.REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT);

                    /* Close this modal dialog */
                    this.cancelBtn.nativeElement.click();

                    /* Alert the user of the successfull creation of the preference. */
                    this.alertService.success("Customer Preference successfully updated.",true,'listCustomerPreferenceAlert');   
                  },
                  /* When there is an error. */
                  error => {
                    
                    if (error.status === 404) {
                      /* The preference that needs to be updated has been deleted already. */          
                      this.alertService.error(Constants.CUSTOMER_PREFERENCE_UPDATE_RECORD_NOT_FOUND,'displayCustomerPreferenceAlert');              
                    } else {
                      /* Show generic error message for any backend errors. */          
                      this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayCustomerPreferenceAlert');              
                    }

                    

                    //this.showWheel = false;
                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                    this.disableControls(false);
                  },
                  () => {
                    // Do nothing
                    //this.showWheel = false;
                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                    this.disableControls(false);
                  }
          );  
      }
      

		}  else {      

      /*
       * If the form is still invalid after pressing the submit button,
       * then display all the validation errors. 
       */
      Object.keys(this.addEditCustomerPreferenceForm.controls).forEach(key => {
        this.addEditCustomerPreferenceForm.get(key).markAsDirty();
        this.addEditCustomerPreferenceForm.get(key).markAsTouched();
      });
      this.onValueChanged();

    }
  }

  /*
   * Do any clean up here
   */
  ngOnDestroy(): void {

    /* Close any pending call to the API before this component is closed. */
    if (this.customerPreferencesSubscription) {
      this.customerPreferencesSubscription.unsubscribe();
    }
  }

  /**
   * Reset the form when the cancel button is pressed.
   */
  OnCancel() {	  
    this.addEditCustomerPreferenceForm.reset();
	
    // Clear Error Message
    this.alertService.error("",'displayCustomerPreferenceAlert');

  }

  /**
   * Handy method to disable / enable all the form controls.
   * 
   * @param flag 
   */
  disableControls(flag:boolean) {
    Object.keys(this.addEditCustomerPreferenceForm.controls).forEach(key => {
      if (flag) {
        this.addEditCustomerPreferenceForm.get(key).disable();      
      } else {
        this.addEditCustomerPreferenceForm.get(key).enable();   
      }
    });    
  }

}
