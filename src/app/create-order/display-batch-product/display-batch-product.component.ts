import { Component, Input, OnDestroy, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { BatchCreationService } from '../batch-create.service';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { BatchOrder } from '../../common/model/batch-order.model';
import { BatchProduct } from '../../common/model/batch-product.model';
import { Product } from '../../common/model/product.model';
import { DisplayDeliveryLocationsComponent } from '../display-delivery-locations/display-delivery-locations.component';
import { ProductService } from '../../product/product.servce';
import { DisplayDeliveryDateTimesComponent } from '../display-delivery-datetimes/display-delivery-datetimes.component';
import { DeliveryDateTime } from '../../common/model/delivery-datetime.model';
import { DeliveryLocation } from '../../common/model/delivery-location.model';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/model/user.model';
import { Constants } from '../../common/app.constants';
import { DeliveryMechanism } from '../../common/model/delivery-mechanism.model';
import { AdministrationRoute } from '../../common/model/administration-route.model';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatSlideToggle } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS,MomentDateAdapter } from '@angular/material-moment-adapter'
import { Subscription } from 'rxjs/Subscription';
import { CreateOrderService } from '../create-order-service';
import { EventBusService } from '../../common/services/event-bus.service';
import { AlertService } from '../../core/services/alert.service';
import { Subject } from 'rxjs/Subject';
import { Batch } from '../../common/model/batch.model';
import { Observable } from 'rxjs/Observable';
import { SearchProductComponent } from '../../common/search-product/search-product.component';
import { BatchCreateRequestPayload } from '../../common/model/batch-create-request-payload.model';
import { Util } from '../../common/util';
import * as moment from 'moment';
import { CustomerPreferencesService } from '../../common/services/customer-preferences.service';
import { CustomerPreference } from '../../common/model/customer-preference.model';
import { DeliveryRunQuantity } from '../../common/model/logistics-req.model';
import { Patient } from '../../common/model/patient.model';

/**
 * @author Osama Shakeel
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-display-batch-product',
  templateUrl: './display-batch-product.component.html',
  styleUrls: ['./display-batch-product.component.scss'],
  /*
   * These providers are used by the datepicker input to display the date in 
   * DD/MM/YYYY format. This is just local to this component and will not affect
   * others.
   */ 
  providers : [{provide: MAT_DATE_LOCALE, useValue: 'en-AU'},
               {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
               {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})
export class DisplayBatchProductComponent implements OnInit, OnDestroy,OnChanges {

  @Input() customerKey: string;  
  @Input() mode:string;
  @Input() batchList:Array<Batch>;
  @Input() orderList:Array<{patient:Patient,batchList:Array<Batch>}>;
  @Input() tempDeletedBatchesList:Array<number>;

  @ViewChild("treamentTimeHour") treamentTimeHourControl:ElementRef;

  /*
   * This is a reference to the cancel button so that the modal dialog can be 
   * cancelled programmatically.
   */   
  @ViewChild("cancelBtn") cancelBtn:ElementRef;

  @ViewChild("app_search_product") searchProductComponent:SearchProductComponent;

  @ViewChild("app_display_delivery_datetimes") displayDeliveryDatetimesComponent: DisplayDeliveryDateTimesComponent;

  /* Batch Form */
  private displayBatchProductForm: FormGroup;

  /* Variables for display */
  private title:string;
  private headerMessage:string;
  private submitButtonTitle:string;

  private userAuthorities:UserAuthorities;

  /* This is the currently selected product */
  private product:Product;

  private selectedDeliveryMechanism:DeliveryMechanism;
  private selectedAdministrationRoute:AdministrationRoute;

  private createOrderServiceSubscription:Subscription;
  private completeFromPreferencesSubscription:Subscription;

  /*
   * This is used to determine the minimum date value that can be chosen in the 
   * datepicker. If this is null then user can chose any dates.
   */
  private minimumDate:Date = null;

  /*
   * Subject for any new Batch added. Parent component should subscribe to this 
   * Subject to listen for any new batch added. 
   */
  private addBatchSubject   = new Subject<Batch>();

  /*
   * Subject for any new Batch updated. Parent component should subscribe to 
   * this Subject to listen for any new batch updated. 
   */
  private editBatchSubject  = new Subject<any>();

  /*
   * The batch currently being edited if this component is in EDIT mode. 
   */
  private batchCurrentlyEdit:Batch;

  private isMultiDrug:boolean=false;
  /*
	 * Form errors container
	 */
	formErrors = { 
                  "product"             : "",
                  "dose"                : "",
                  "dose2"               : "",
                  "dose3"               : "",
                  "diluentContainer"    : "",
                  "administrationRoute" : "",
                  "volume"              : "",
                  "infusionDuration"    : "",
                  "quantity"            : "",
                  "exact"               : "",
                  "treatmentDateTime"   : "",    
                  "treamentTimeHour"    : "",                  
                  "treamentTimeMinute"  : "",                  
                  "comments"            : ""
               };

  /*
  * Validation error messages
  */
  validationMessages = {
                          'product'             : { 'required'  : 'Product is required.'},
                          'dose'                : { 'required'  : 'Dose is required.',
                                                    'pattern'   : 'Invalid value for Dose.'},
                          'dose2'               : { 'required'  : 'Dose is required.',
                                                    'pattern'   : 'Invalid value for Dose.'},
                          'dose3'               : { 'required'  : 'Dose is required.',
                                                    'pattern'   : 'Invalid value for Dose.'},                                                    
                          'diluentContainer'    : { 'required'  : 'Diluent Container is required.'},
                          'administrationRoute' : { 'required'  : 'Route is required.'},        
                          'volume'              : { 'required'  : 'Volume is required.',
                                                    'pattern'   : 'Invalid value for Volume.'},        
                          'infusionDuration'    : { 'required'  : 'Infusion Duration is required.',
                                                    'pattern'   : 'Invalid value for Infusion Duration.'},
                          'quantity'            : { 'required'  : 'Quantity is required.',
                                                    'pattern'   : 'Invalid value for Quantity.' },
                          'treatmentDateTime'   : { 'required'  : 'Treatment Date Time is required.'},    
                          'treamentTimeHour'    : { 'required'  : 'Treatment Time is required.'},                                                   
                          'treamentTimeMinute'  : { 'required'  : 'Treatment Time is required.'},                                                   
                          'comments'            : { 'maxlength' : "Max. number of comments reached."}
                          };

  constructor(
    private userService: UserService,
    private batchCreationService: BatchCreationService,
    private productService: ProductService,
    private createOrderService:CreateOrderService,
    private formBuilder: FormBuilder,
    private eventBusService:EventBusService,
    private alertService:AlertService,
    private customerPreferencesService:CustomerPreferencesService) { }

  ngOnInit() {

    /* Get the currently selected customer site from local storage */
    let user: User = this.userService.getCurrentUser()
    this.userAuthorities = user.selectedUserAuthority;

    this.buildForm();
  }

  buildForm() {

    /* Build the form controls and set their validations. */
    this.displayBatchProductForm = this.formBuilder.group({
      'dose'                : [{value : '',disabled: false},
                               [Validators.required,
                                Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],
      'dose2'                : [{value : '',disabled: false},
                                [Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],
      'dose3'                : [{value : '',disabled: false},
                                [Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]],                                
      'diluentContainer'    : [{value: '',disabled : false}],
      'administrationRoute' : [{value: '',disabled : false}],     
      'closedSystem'        : [{value: '',disabled : false}],                        
      'volume'              : [{value: '',disabled : false},
                               [Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]],
      'infusionDuration'    : [{value: '',disabled : false},
                               [Validators.pattern(Constants.REG_EX_DECIMAL_9_1_PATTERN)]],
      'quantity'            : [{value: '',disabled : false},
                               [Validators.required,
                                Validators.pattern(Constants.REG_EX_NUMBER_9_PATTERN)]], 
      'deliveryLocation'    : DisplayDeliveryLocationsComponent.buildFormControl(null),        
      'deliveryDateTime'    : DisplayDeliveryDateTimesComponent.buildFormControl(null),                                 
      'exact'               : [{value: '',disabled : false}],
      'treatmentDate'       : [{value: '',disabled : true}],    
      'treamentTimeHour'    : [{value: '',disabled : false}],                                                                                                                       
      'treamentTimeMinute'  : [{value: '',disabled : false}],                                                                                                                             
      'comments'            : [{value: '',disabled : false},
                               [Validators.maxLength(1000)]]
    });

    /* Listen to any changes in the form constrols */
    this.displayBatchProductForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  startNewProductOrder() {

    this.displayBatchProductForm.reset();

    this.product = null;

    this.selectedDeliveryMechanism = null;

    this.selectedAdministrationRoute = null;

    this.disableTreatmentTimeHourOptions(false);

    this.searchProductComponent.clearInput();

    this.minimumDate = null;

    this.alertService.error("",'displayBatchProductAlert');

    this.isMultiDrug = false;

  }

 /**
	 * This method will be called if any of the controls were modified and will 
   * add error messages in the form errors container.
   * 
	 * @param any 
	 */
	onValueChanged(data?: any) {
	
		if (!this.displayBatchProductForm) { return; }

		const form = this.displayBatchProductForm;

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
   * Listen for any changes in this component instance variables.
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];      
      
      if (propName === "mode") {          
        this.modeChange();
      }  
      
    }  
  }

  /**
   * Clean-up all subcriptions
   */
  ngOnDestroy() {

    /**
     * Close any pending calls if there is any.
     */
    if (this.createOrderServiceSubscription) {
      this.createOrderServiceSubscription.unsubscribe();
    }

    if (this.completeFromPreferencesSubscription) {
      this.completeFromPreferencesSubscription.unsubscribe();
    }

  }

  /**
   * Change the display texts based on the mode.
   */
  modeChange() {
    if (this.mode === "ADD") {
      this.title = "Add Product to Order";
      this.submitButtonTitle = "ADD PRODUCT";
      this.headerMessage = "Please add values to the below fields to add a new product";  
      this.batchCurrentlyEdit = null;    
    } else {
      this.title = "Edit Product";
      this.submitButtonTitle = "SAVE CHANGES";
      this.headerMessage = "Please edit the product values below. Click save to update, cancel to discard changes.";
    }
  }

  handleSelectedProduct(product:Product) {     
      this.product = product;  
      
      if (!this.product) {
        this.formErrors.product = this.validationMessages["product"].required;
      }
      
      /*
       * The fields "diluentContainer" and "administrationRoute" validation is 
       * dependent on the current product. If the product's type is either 
       * "Formulation" or "CNF Formulation" then these controls mentioned above 
       * are required.
       * 
       */
      if (this.product) {
        if (this.displayBatchProductForm) {
          let diluentContainerControl = this.displayBatchProductForm.get("diluentContainer");
          if (diluentContainerControl) {              
            if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
                this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) {
                  diluentContainerControl.setValidators([]);    
            } else {                
              diluentContainerControl.setValidators([Validators.required]);  
            }              
            diluentContainerControl.updateValueAndValidity();  
            diluentContainerControl.setValue("");
          }

          let administrationRoute = this.displayBatchProductForm.get("administrationRoute");
          if (administrationRoute) {
            
            if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
                this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) {
                  administrationRoute.setValidators([]);    
            } else {                
              administrationRoute.setValidators([Validators.required]);  
            }
            
            administrationRoute.updateValueAndValidity();  
            administrationRoute.setValue("");
            
          }
        } 
      } else {

        /*
         * If there is no product selected then these controls are not required.
         */
        if (this.displayBatchProductForm) {
          let diluentContainerControl = this.displayBatchProductForm.get("diluentContainer");
          if (diluentContainerControl) {
            diluentContainerControl.setValidators([]);  
            diluentContainerControl.updateValueAndValidity();              
          }

          let administrationRoute = this.displayBatchProductForm.get("administrationRoute");
          if (administrationRoute) {
            administrationRoute.setValidators([]);    
            administrationRoute.updateValueAndValidity();              
          }
        } 
      }

      /* 
       * Fetch delivery date / time  whenever the product is modified.
       */
      this.triggerDeliveryDateTimeFetch(this.product,this.displayBatchProductForm.get("quantity").value);

      /*
       * If the product selected is a Multi-Drug then the dose (2,3) fields are 
       * required if applicabled.  
       */
      if (this.product && this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG) {

        /*
         * If the 2nd Drug is present, set the dose are required. 
         */
        if (this.product.batDrugKey2 != null && this.product.batDrugKey2 != "") {
          this.displayBatchProductForm.get("dose2").setValidators([Validators.required,Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
        } else {
          this.displayBatchProductForm.get("dose2").setValidators([]);
        }
        this.displayBatchProductForm.get("dose2").updateValueAndValidity();

        /*
         * If the 3rd Drug is present, set the dose are required. 
         */
        if (this.product.batDrugKey3 != null && this.product.batDrugKey3 != "") {
          this.displayBatchProductForm.get("dose3").setValidators([Validators.required,Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
        } else {
          this.displayBatchProductForm.get("dose3").setValidators([]);
        }
        this.displayBatchProductForm.get("dose3").updateValueAndValidity();

      } else {

        /*
         * When the product selected is not a Multi-Drug then dose2 and dose3 
         * are not required. (They are also hidden)
         */
        this.displayBatchProductForm.get("dose2").setValidators([]);
        this.displayBatchProductForm.get("dose2").updateValueAndValidity();

        this.displayBatchProductForm.get("dose3").setValidators([]);
        this.displayBatchProductForm.get("dose3").updateValueAndValidity();
      }

      /*
       * When the product selected is "Formulation" then the dose and volume is 
       * not required.
       */
      if (this.product && this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {
        this.displayBatchProductForm.get("dose").setValidators([]);
        this.displayBatchProductForm.get("dose").updateValueAndValidity();

        this.displayBatchProductForm.get("volume").setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);
        this.displayBatchProductForm.get("volume").updateValueAndValidity();
        
      } else {
        this.displayBatchProductForm.get("dose").setValidators([Validators.required,
                                                                Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
        this.displayBatchProductForm.get("dose").updateValueAndValidity();
      }
  }

  /**
   * This will be called when adding or editing a product.
   */
  onSubmit() {

    if (this.displayBatchProductForm.valid && this.product) {

      this.eventBusService.broadcast(Constants.SHOW_LOADING);
        
        /*
         * Cancel any pending calls if there are any. 
         */
        if (this.createOrderServiceSubscription) {
          this.createOrderServiceSubscription.unsubscribe();
        }

        this.createOrderServiceSubscription = this.createOrderService.createOrder(this.customerKey,this.buildOrderRequestPayload()).subscribe(
          /* When successful */
          data => {

                    let newBatch = this.buildBatchObject(data);
                    if (this.mode == "ADD") {
                      /* 
                       * Inform the parent component that a new batch/ product 
                       * have been created.
                       */
                      this.addBatchSubject.next(newBatch);  
                    } else {
                      /* 
                       * Inform the parent component that a new batch/ product 
                       * have been created.
                       */
                      this.editBatchSubject.next({oldBatch:this.batchCurrentlyEdit,newBatch:newBatch});
                    }
                    
                    /* Prepare for next new order */
                    this.startNewProductOrder();

                    /* Hide the loding spinner */
                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                    
                    /* Close this modal dialog */
                    this.cancelBtn.nativeElement.click();

                    if (this.mode == "ADD") {
                      /* Alert the user of the successfull creation of the batch. */
                      this.alertService.success("Order successfully created.",true,'addBatchAlert');   
                    } else {
                      /* Alert the user of the successfull udpate of the batch. */
                      this.alertService.success("Order successfully updated.",true,'addBatchAlert');   
                    }
                    
                   
          },
          /* When there is an error. */
          error => {

                    // TODO: handle error response when the product has expiry.

                    /* Show generic error message for any backend errors. */          
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchProductAlert');              

                    this.eventBusService.broadcast(Constants.HIDE_LOADING);
                    
          },
          () => {
              // Do nothing
              this.eventBusService.broadcast(Constants.HIDE_LOADING);              
          }
        );

    } else {
       /*
       * If the form is still invalid after pressing the submit button, then 
       * display all the validation errors. 
       */
      Object.keys(this.displayBatchProductForm.controls).forEach(key => {
        this.displayBatchProductForm.get(key).markAsDirty();
        this.displayBatchProductForm.get(key).markAsTouched();
      });
      this.onValueChanged();  

      if (!this.product) {
        this.formErrors.product = this.validationMessages["product"].required;
        this.searchProductComponent.setInvalid();
      }
      
    }
  }

  /**
   * Builds the request payload that will be used to call Create Order API.
   */
  buildOrderRequestPayload() : BatchCreateRequestPayload {

    /*
     * Build the Order Request Payload 
     */
    var orderRequestPayload = new BatchCreateRequestPayload();
    orderRequestPayload.stkKey              = this.product.batDrugKey;
    orderRequestPayload.batDelMechKey       = this.selectedDeliveryMechanism ?  this.selectedDeliveryMechanism.key : "";
    orderRequestPayload.batClosedSystem     = this.displayBatchProductForm.get("closedSystem").value ? true : false;
    orderRequestPayload.batDose             = this.displayBatchProductForm.get("dose").value;
    orderRequestPayload.batQuantity         = this.displayBatchProductForm.get("quantity").value;
    orderRequestPayload.batExact            = this.displayBatchProductForm.get("exact").value ? Constants.TRUE : Constants.FALSE;
    orderRequestPayload.entRiva             = Constants.YES;
    orderRequestPayload.batAdminRouteCode   = this.selectedAdministrationRoute ? this.selectedAdministrationRoute.code : "";
    orderRequestPayload.batSpecifiedVolume  = this.displayBatchProductForm.get("volume").value;    
    orderRequestPayload.batDsukey           = Util.defaultString(this.product.batDSUKey);
    orderRequestPayload.infusionDuration    = this.displayBatchProductForm.get("infusionDuration").value;
    orderRequestPayload.batEntKey           = Util.defaultString(this.product.targetSite);
    orderRequestPayload.batProcessType      = this.product.processType == Constants.PRODUCT_PROCESS_TYPE_MANUAL_STOCK_ONLY ? "M" : "";
    
    /* 
     * 2nd drug (if Multi-Drug)
     */
    orderRequestPayload.stkKey2             = Util.defaultString(this.product.batDrugKey2); 
    orderRequestPayload.batDose2            = Util.defaultString(this.displayBatchProductForm.get("dose2").value); 
    orderRequestPayload.batDsukey2          = Util.defaultString(this.product.batDSUKey2);

    /* 
     * 3rd drug (if Multi-Drug)
     */
    orderRequestPayload.stkKey3             = Util.defaultString(this.product.batDrugKey3); 
    orderRequestPayload.batDose3            = this.displayBatchProductForm.get("dose3").value; 
    orderRequestPayload.batDsukey3          = Util.defaultString(this.product.batDSUKey3);

    /*
     * For formulation products 
     */
    orderRequestPayload.batMsoIngStkKey     = this.product.msoIngStkKey;

    let deliveryDateTime = this.displayBatchProductForm.get("deliveryDateTime").value;
    if (deliveryDateTime) {
      orderRequestPayload.batDeliveryDatetime = deliveryDateTime.value;
      orderRequestPayload.batDispatchDatetime = deliveryDateTime.dispatchDateTimeValue;
    } else {
      orderRequestPayload.batDeliveryDatetime = "";
      orderRequestPayload.batDispatchDatetime = "";
    }

    let deliveryLocation = this.displayBatchProductForm.get("deliveryLocation").value;
    if (deliveryLocation) {
      orderRequestPayload.batDeliveryLocation = deliveryLocation.locationKey;
    } else {
      orderRequestPayload.batDeliveryLocation = "";
    }

    /* Treatment Date / Time */
    let treatmentDate = this.displayBatchProductForm.get("treatmentDate").value;
    let treatmentTimeHour = this.displayBatchProductForm.get("treamentTimeHour").value;
    let treamentTimeMinute = this.displayBatchProductForm.get("treamentTimeMinute").value;

    if (treatmentDate && treatmentDate != "" &&  treatmentTimeHour && treatmentTimeHour != "" && treamentTimeMinute && treamentTimeMinute != "") {
      treatmentDate.hour(treatmentTimeHour);
      treatmentDate.minute(treamentTimeMinute);
      orderRequestPayload.batTreatDate = treatmentDate.format("YYYY-MM-DD HH:mm:ss");
    } else {
      orderRequestPayload.batTreatDate = "";
    }
    
    orderRequestPayload.batLastUpdAction    = Constants.INSERT_ACTION;

    return  orderRequestPayload;
  }

  /**
   * Builds a batch object based from the result of calling the Create Order API
   * and the fields specified in the form.
   * 
   * @param responseData 
   */
  buildBatchObject(responseData:any) : Batch {
    var batch = new Batch();
    batch.batchId           = responseData.batchId;
    batch.product           = this.product;
    batch.dose              = this.displayBatchProductForm.get("dose").value;

    if (this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG) {
      batch.dose2 = this.displayBatchProductForm.get("dose2").value;
      batch.dose3 = this.displayBatchProductForm.get("dose3").value;
    }

    batch.doseUnit          = this.product.unitOfMeasure;
    batch.deliveryMechanism = this.selectedDeliveryMechanism;
    batch.closedSystem      = this.displayBatchProductForm.get("closedSystem").value ? true : false; 
    batch.volume            = this.displayBatchProductForm.get("volume").value;
    batch.infusionDuration  = this.displayBatchProductForm.get("infusionDuration").value;
    batch.exact             = this.displayBatchProductForm.get("exact").value ? Constants.TRUE : Constants.FALSE;
    batch.route             = this.selectedAdministrationRoute;
    batch.quantity          = this.displayBatchProductForm.get("quantity").value;
    batch.deliveryLocation  = this.displayBatchProductForm.get("deliveryLocation").value;
    batch.deliveryDateTime  = this.displayBatchProductForm.get("deliveryDateTime").value;

    /* Treatment Date / Time */
    let treatmentDate = this.displayBatchProductForm.get("treatmentDate").value;
    let treatmentTimeHour = this.displayBatchProductForm.get("treamentTimeHour").value;
    let treamentTimeMinute = this.displayBatchProductForm.get("treamentTimeMinute").value;

    if (treatmentDate && treatmentDate != "" &&  treatmentTimeHour && treatmentTimeHour != "" && treamentTimeMinute && treamentTimeMinute != "") {
      treatmentDate.hour(treatmentTimeHour);
      treatmentDate.minute(treamentTimeMinute);
      batch.treatmentDateTime = treatmentDate.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      batch.treatmentDateTime = null;
    }
    
    batch.comments          = this.displayBatchProductForm.get("comments").value;

    if (this.mode === "ADD")  {
      batch.status = Constants.BATCH_STATUS_NEW;
    } else {
      batch.status = this.batchCurrentlyEdit.status;
    }
    
    return batch;
  }

  /**
   * Called everytime a quantity has changed to fetch Delivery Date/Time.
   * 
   * @param event 
   */
  OnQuantityChanged(event) {

    this.triggerDeliveryDateTimeFetch(this.product,event.target.value)

  }

  /**
   * Used this method to fetch Delivery Date Time.
   * 
   * @param product 
   * @param quantity 
   */
  triggerDeliveryDateTimeFetch(product:Product,quantity:number) {
    
    var batchProduct = new BatchProduct();
    batchProduct.product = this.product;
    batchProduct.quantity = quantity;
    batchProduct.deliveryRunQuantities = this.getExistingDeliveryRunQuantities();
    
    this.batchCreationService.changeProductQty(batchProduct);
  }

  /** 
   * This method summarizes the total quantity of batches that are not added to 
   * the order yet and those batches that are already added in the order. This 
   * is required when retrieving Delivery Date/Time (a.k.a Logistics).
   */
  getExistingDeliveryRunQuantities(): DeliveryRunQuantity[] {

    var deliveryRunQuantities:Array<DeliveryRunQuantity> = [];

    if (this.product && this.product.targetSite) {

      /* 
       * Temporary map to store batches that were created but was not added to 
       * the order yet and those batches that were already added to the order.  
       */
      var tempBatchList = {};
     
      /* 
       * Iterate thru all batch not yet added to the order and add them to the
       * temp map. Dont include the batch that has the same batch id of the 
       * batch which is currently being edited (if in EDIT mode) and those batch
       * whose status are not "On Hold".
       */
      if (this.batchList && this.batchList.length > 0) {
        this.batchList.forEach(
          batch => {

            if (!tempBatchList[batch.batchId]) {
              if (!(this.batchCurrentlyEdit && this.batchCurrentlyEdit.batchId == batch.batchId) &&
                  (batch.status != Constants.BATCH_STATUS_ON_HOLD)) {
                tempBatchList[batch.batchId] = batch;
              }              
            }
          }
        );
      }
      
      /*
       * Iterate thru all batches already added to the order and add them to the
       * temp map. Dont include the batch that has the same batch id of the 
       * batch which is currently being edited (if in EDIT mode) and those batch
       * whose status are not "On Hold". Exclude also those batches that were
       * deleted (but not yet saved ) in the "Add Products to Order" screen.
       */
      if (this.orderList && this.orderList.length > 0) {
        this.orderList.forEach(
          order => {
            order.batchList.forEach(
              batch => {

                if (!tempBatchList[batch.batchId]) {
                  if (!(this.batchCurrentlyEdit && this.batchCurrentlyEdit.batchId == batch.batchId) &&
                      (batch.status != Constants.BATCH_STATUS_ON_HOLD) &&
                      this.isInTempDeletedBatches(batch.batchId) == false) {

                    tempBatchList[batch.batchId] = batch;

                  }
                }              
              }                
            );
          }
        );
      }

      if (Object.keys(tempBatchList).length > 0) {
        Object.keys(tempBatchList).forEach(
          key => {
            var tempBatch = tempBatchList[key];
             
             /*
             * Look for all batches in the temp map which have the same target 
             * site (compounding center) with the batch that the user is 
             * currently working on and that `withinCutOff1Time` is false. 
             */
             if ((tempBatch.product.targetSite == this.product.targetSite) &&
                  (tempBatch.deliveryDateTime.withinCutOff1Time == false)) {
                  
                  /*
                    * Get the DeliveryRunQuantity if it already exists.
                    */   
                  var deliveryRunQuantitiesExist:DeliveryRunQuantity = deliveryRunQuantities.find(
                    deliveryRunQuantity => {
                      return deliveryRunQuantity.dispatchDateTime == tempBatch.deliveryDateTime.dispatchDateTimeValue;
                    }
                  );
  
                  /*
                    * Add the quantity of the batch to the running total 
                    */
                  if (deliveryRunQuantitiesExist) {
                    deliveryRunQuantitiesExist.totalQuantity = deliveryRunQuantitiesExist.totalQuantity + tempBatch.quantity;
                  /*
                    * Otherwise create a new one.
                    */   
                  } else {
                    deliveryRunQuantities.push(new DeliveryRunQuantity(tempBatch.deliveryDateTime.dispatchDateTimeValue,tempBatch.quantity));
                  }
              }
          }
        );

      }
    }
    return deliveryRunQuantities;
  }
  /**
   * This method will be called everytime the Delivery Mechanism field has been 
   * selected.
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
        let volume = this.displayBatchProductForm.get("volume");  
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
         * If the selected Container is Elastomerics (stock code starts with 22)
         * then the "infusionDuration" field is required. otherwise its not 
         * required.
         */
        let infusionDuration = this.displayBatchProductForm.get("infusionDuration");  
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

      let volume = this.displayBatchProductForm.get("volume");        
      volume.setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);        
      volume.markAsDirty();
      volume.updateValueAndValidity();  

      // update validation rules for infusion duration
      let infusionDuration = this.displayBatchProductForm.get("infusionDuration");        
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

  /**
   * Invoked everytime a new Delivery Date time have been selected.
   * 
   * @param deliveryDateTime 
   */
  handleSelectedDeliveryDateTime(deliveryDateTime:DeliveryDateTime) {
    
    if (deliveryDateTime && deliveryDateTime.value != "") {
      let dateString = deliveryDateTime.value;
      this.minimumDate = new Date(dateString);      
      this.disableTreatmentTimeHourOptions(true,this.minimumDate.getHours());  

    } else {
      this.minimumDate = null;  
      this.disableTreatmentTimeHourOptions(false);  
    } 

    this.displayBatchProductForm.get('treatmentDate').setValue("");
    this.displayBatchProductForm.get('treamentTimeHour').setValue("");
    this.displayBatchProductForm.get('treamentTimeMinute').setValue("");

    /*
     * Remove the validations for Treatment Time Hour and Minute.
     */
    this.displayBatchProductForm.get("treamentTimeHour").setValidators([]);
    this.displayBatchProductForm.get("treamentTimeHour").updateValueAndValidity();

    this.displayBatchProductForm.get("treamentTimeMinute").setValidators([]);
    this.displayBatchProductForm.get("treamentTimeMinute").updateValueAndValidity();
  }

  /**
   * Handy method to disable a range of hours in the treatment date time control
   * or enable all of them.
   * 
   * @param disable 
   * @param hour 
   */
  disableTreatmentTimeHourOptions(disable:boolean,hour?:number) {
    var i=0;
    if (disable == true) {      
      for (i;i< this.treamentTimeHourControl.nativeElement.options.length;i++) {
        let option = this.treamentTimeHourControl.nativeElement.options.item(i);
        if (hour && option.value < hour) {
          option.disabled = true;
        }        
      }      
    } else {
      for (i;i< this.treamentTimeHourControl.nativeElement.options.length;i++) {
        let option = this.treamentTimeHourControl.nativeElement.options.item(i);       
        option.disabled = false;        
      }
    }
  }

  /**
   * Returns observable which could be subscribed by the parent component to be 
   * inform of newly added batch.
   */
  afterBatchAdded() : Observable<Batch> {
    return this.addBatchSubject.asObservable();
  }

  /**
   * Returns observable which could be subscribed by the parent component to be 
   * inform of newly updated batch.
   */
  afterBatchUpdated() : Observable<any> {
    return this.editBatchSubject.asObservable();
  }

  OnCancel() {
    this.startNewProductOrder();
  }

  prepareEditBatch(batch:Batch) {

    this.batchCurrentlyEdit = batch; 
    /* Set the values */    
    this.handleSelectedProduct(batch.product);

    if (batch.product.entryType == Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG) {
      this.isMultiDrug = true;
      this.displayBatchProductForm.get("dose2").setValue(batch.dose2);
      this.displayBatchProductForm.get("dose3").setValue(batch.dose3);      
    }
    
    this.displayBatchProductForm.get('dose' ).setValue(batch.dose); 
    this.displayBatchProductForm.get('diluentContainer' ).setValue(batch.deliveryMechanism); 
    this.displayBatchProductForm.get('administrationRoute' ).setValue(batch.route); 
    this.displayBatchProductForm.get('closedSystem' ).setValue(batch.closedSystem); 
    this.displayBatchProductForm.get('volume' ).setValue(batch.volume); 
    this.displayBatchProductForm.get('exact' ).setValue(batch.exact == Constants.TRUE ? true : false); 
    this.displayBatchProductForm.get('infusionDuration' ).setValue(batch.infusionDuration); 
    this.displayBatchProductForm.get('quantity' ).setValue(batch.quantity); 
    this.triggerDeliveryDateTimeFetch(this.product,batch.quantity);
    this.displayBatchProductForm.get('deliveryLocation' ).setValue(batch.deliveryLocation); 
    this.displayBatchProductForm.get('deliveryDateTime' ).setValue(batch.deliveryDateTime);   
    this.handleSelectedDeliveryDateTime(batch.deliveryDateTime);              
    if (batch.treatmentDateTime && batch.treatmentDateTime != "") {    
      this.displayBatchProductForm.get('treatmentDate' ).setValue(moment(batch.treatmentDateTime)); 
    } else {
      this.displayBatchProductForm.get('treatmentDate' ).setValue("");
    }             

    this.displayBatchProductForm.get('treamentTimeHour' ).setValue(Util.formatDateTime(batch.treatmentDateTime,"HH","YYYY-MM-DDTHH:mm:ss")); 
    this.displayBatchProductForm.get('treamentTimeMinute' ).setValue(Util.formatDateTime(batch.treatmentDateTime,"mm","YYYY-MM-DDTHH:mm:ss")); 
    this.displayBatchProductForm.get('comments' ).setValue(batch.comments); 

  }

  prepareBatchForReorder(batch:Batch) {

    this.batchCurrentlyEdit = null; 
    /* Set the values */    
    this.handleSelectedProduct(batch.product);

    if (batch.product.entryType == Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG) {
      this.isMultiDrug = true;
      this.displayBatchProductForm.get("dose2").setValue(batch.dose2);
      this.displayBatchProductForm.get("dose3").setValue(batch.dose3); 
    }

    this.displayBatchProductForm.get('dose' ).setValue(batch.dose); 
    this.displayBatchProductForm.get('diluentContainer' ).setValue(batch.deliveryMechanism); 
    this.displayBatchProductForm.get('administrationRoute' ).setValue(batch.route); 
    this.displayBatchProductForm.get('closedSystem' ).setValue(batch.closedSystem); 
    this.displayBatchProductForm.get('volume' ).setValue(batch.volume); 
    this.displayBatchProductForm.get('exact' ).setValue(batch.exact == Constants.TRUE ? true : false); 
    this.displayBatchProductForm.get('infusionDuration' ).setValue(batch.infusionDuration); 
    this.displayBatchProductForm.get('quantity' ).setValue(batch.quantity); 
    this.triggerDeliveryDateTimeFetch(this.product,batch.quantity);

    this.displayBatchProductForm.get('deliveryLocation' ).setValue(""); 
    this.displayBatchProductForm.get('deliveryDateTime' ).setValue("");       
    this.displayBatchProductForm.get('treatmentDate' ).setValue("");
    this.displayBatchProductForm.get('treamentTimeHour' ).setValue(""); 
    this.displayBatchProductForm.get('treamentTimeMinute' ).setValue(""); 
    this.displayBatchProductForm.get('comments' ).setValue(batch.comments); 

  }

  /**
   * This method calls the complete from preference API. It checks whether the 
   * user have selected a product and have given a dose. If these are not yet 
   * given it warns the user. Otherwise it will call the API and if it finds 
   * matching preference then it will apply the preference.
   */
  completeFromPreferences() {

    var productOrDoseInvalid = false;

    /* Check if a product and dose are present  */
    if (!this.product) {
      this.formErrors.product = this.validationMessages["product"].required;
      this.searchProductComponent.setInvalid();
      productOrDoseInvalid = true;
    }

    let dose = this.displayBatchProductForm.get('dose').value;
    if (!dose || dose == "") {
      this.formErrors.dose = this.validationMessages["dose"].required;
      this.displayBatchProductForm.get('dose').markAsDirty();
      this.displayBatchProductForm.get('dose').markAsTouched();
      productOrDoseInvalid = true;
    }

    if (productOrDoseInvalid) {
      return;
    }
      
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
      
    /*
      * Cancel any pending calls if there are any. 
      */
    if (this.completeFromPreferencesSubscription) {
      this.completeFromPreferencesSubscription.unsubscribe();
    }

    /*
      * Get the batch information if there are any. 
      */
    let deliveryMechanismKey = null;      
    if (this.selectedDeliveryMechanism) {
      deliveryMechanismKey = this.selectedDeliveryMechanism.key;
    }

    let routeKey = null;
    if (this.selectedAdministrationRoute) {
      routeKey = this.selectedAdministrationRoute.code;
    }

    let volume = this.displayBatchProductForm.get("volume").value;
    let exact  = this.displayBatchProductForm.get("exact").value;
    let infusionDuration = this.displayBatchProductForm.get("infusionDuration").value;

    /* Call the API and find if there any matching preference */
    this.completeFromPreferencesSubscription = this.customerPreferencesService.getMatchingPreference(this.customerKey,
                                                                                                      this.product,
                                                                                                      dose,
                                                                                                      deliveryMechanismKey,
                                                                                                      routeKey,
                                                                                                      volume,
                                                                                                      exact,
                                                                                                      infusionDuration).subscribe(
      /* When successful */
      data => {
                /* Apply the preference if we have one. */
                this.applyPreference(<CustomerPreference>data);

                /* Hide the loading spinner */
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
                
                /* Alert the user of the successfull creation of the batch. */
                this.alertService.success("Found a preference and successfully applied",true,'displayBatchProductAlertTop');   
                
      },
      /* When there is an error. */
      error => {

                if (error.status == Constants.HTTP_RESPONSE_STATUS_CODE_NOT_FOUND) {
                  /* Inform user that there is no matching preference */          
                  this.alertService.error(Constants.CUSTOMER_PREFERENCE_NO_MATCH_FOUND,'displayBatchProductAlert',true);              
                } else if (error.status == Constants.HTTP_RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR) {
                    /* Show generic error message for any backend errors. */          
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchProductAlert',true);  
                }
                
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
                
      },
      () => {
          // Do nothing
          this.eventBusService.broadcast(Constants.HIDE_LOADING);              
      }
    );

   
  }

  /**
   * Apply the preference values to the Add Batch Component fields. The 
   * preference values will only be applied if the field doesnt have a value yet.
   * However, the comment in the preference will be appended to the comment 
   * field if there are any.
   * 
   * @param customerPreference 
   */
  applyPreference(customerPreference:CustomerPreference) {

    /*
     * NOTE : Dont apply the preference values if the field already has a value. 
     */

    /* 
     * Apply Delivery Mechanism preference if there is any     
     */
    if (customerPreference.deliveryMechanism && (this.displayBatchProductForm.get('diluentContainer').value == "" || this.displayBatchProductForm.get('diluentContainer').value == null)) {      
      this.displayBatchProductForm.get('diluentContainer').setValue(customerPreference.deliveryMechanism); 
    }

    /* 
     * Apply Administration Route preference if there is any
     */
    if (customerPreference.administrationRoute && (this.displayBatchProductForm.get('administrationRoute').value == "" || this.displayBatchProductForm.get('administrationRoute').value == null)) {
      this.displayBatchProductForm.get('administrationRoute').setValue(customerPreference.administrationRoute); 
    }

    /* 
     * Apply Volume preference if there is any
     */
    if (customerPreference.volume && (this.displayBatchProductForm.get('volume').value == "" || this.displayBatchProductForm.get('volume').value == null)) {
      this.displayBatchProductForm.get('volume').setValue(customerPreference.volume); 
    }
    
    /* 
     * Apply Exact preference if there is any
     */
    if (customerPreference.exact && this.displayBatchProductForm.get('exact').value == "") {
      this.displayBatchProductForm.get('exact').setValue(customerPreference.exact == Constants.TRUE ? true : false); 
    }

    /* 
     * Apply Infusion Duration preference if there is any
     */
    if (customerPreference.infusionDuration && (this.displayBatchProductForm.get('infusionDuration').value == "" || this.displayBatchProductForm.get('infusionDuration').value == null)) {
      this.displayBatchProductForm.get('infusionDuration').setValue(customerPreference.infusionDuration); 
    }

    /* 
     * Apply Quantity preference if there is any
     */
    if (customerPreference.quantity && (this.displayBatchProductForm.get('quantity').value == "" || this.displayBatchProductForm.get('quantity').value == null)) {
      this.displayBatchProductForm.get('quantity').setValue(customerPreference.quantity); 
      this.triggerDeliveryDateTimeFetch(this.product,customerPreference.quantity);
    }

    /* 
     * Append Comments preference if there is any
     */
    if (customerPreference.comments) {
      let existingComments = this.displayBatchProductForm.get('comments').value;
      if (existingComments == null) {
        this.displayBatchProductForm.get('comments').setValue(customerPreference.comments ); 
      } else {
        this.displayBatchProductForm.get('comments').setValue(existingComments + " " + customerPreference.comments ); 
      }
      
    }
  }

  changeTreatmentDateEvent(event) {
    
    /*
     * Once the user provided a treatment date, the fields treatment hour and 
     * minute will be mandatory. 
     */
    this.displayBatchProductForm.get("treamentTimeHour").setValidators([Validators.required]);
    this.displayBatchProductForm.get("treamentTimeHour").updateValueAndValidity();

    this.displayBatchProductForm.get("treamentTimeMinute").setValidators([Validators.required]);
    this.displayBatchProductForm.get("treamentTimeMinute").updateValueAndValidity();
  }

  /** 
   * Called whenever the Multi-Drug Toggle button is clicked.
   */
  OnToggleMultiDrug() {        
    
    /*
     * Reset the product and form whenever the user change from Multi-Drug to 
     * non Multi-Drug. 
     */
    this.product = null;
    this.displayBatchProductForm.reset();
  }

  /** 
   * Determine whether the product that is currently selected is of type 
   * "Formulation" or not. This is used in the UI to hide/show fields that are
   * relevant only to "Formulation" products.
   */
  isSelectedProductFormulation(): boolean {
    if (this.product && this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {
      return true;
    } else {
      return false;
    }   
  }

  /**
   * Check if the batchId provided is already on the list of batches that were 
   * already deleted but not yet saved.
   * 
   * @param batchId 
   */
  isInTempDeletedBatches(batchId:number) : boolean {
    var index:number= -1;
    if (this.tempDeletedBatchesList && this.tempDeletedBatchesList.length > 0) {
      index = this.tempDeletedBatchesList.findIndex( tempBatchId => tempBatchId == batchId );      
    }    
    return (index > -1);
  }
}
