import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, AfterViewChecked, ChangeDetectorRef, DoCheck, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { Location } from '@angular/common'
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../common/app.constants';
import { DisplayDeliveryLocationsComponent } from '../../create-order/display-delivery-locations/display-delivery-locations.component';
import { DisplayDeliveryDateTimesComponent } from '../../create-order/display-delivery-datetimes/display-delivery-datetimes.component';
import { Batch } from '../../common/model/batch.model';
import { UserService } from '../../common/services/user.service';
import { Product } from '../../common/model/product.model';
import { DeliveryMechanism } from '../../common/model/delivery-mechanism.model';
import { AdministrationRoute } from '../../common/model/administration-route.model';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { BatchProduct } from '../../common/model/batch-product.model';
import { BatchCreationService } from '../../create-order/batch-create.service';
import { ProductAttributesComponent } from '../../common/product-attributes/product-attributes.component';
import { Subscription } from 'rxjs';
import { DeliveryDateTime } from '../../common/model/delivery-datetime.model';
import { Util } from '../../common/util';
import * as moment from 'moment';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { BatchService } from '../../common/services/batch.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '../../common/services/products.service';
import { DeliveryLocation } from '../../common/model/delivery-location.model';
import { EventBusService } from '../../common/services/event-bus.service';
import { SearchProductComponent } from '../../common/search-product/search-product.component';
import { CustomerPreference } from '../../common/model/customer-preference.model';
import { AlertService } from '../../core/services/alert.service';
import { CustomerPreferencesService } from '../../common/services/customer-preferences.service';
import { CreateOrderService } from '../../create-order/create-order-service';
import { BatchUpdateRequestPayload } from '../../common/model/batch-update-request-payload.model';
import { BatchHistoryComponent } from '../batch-history/batch-history.component';

/**
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-display-batch',
  templateUrl: './display-batch.component.html',
  styleUrls: ['./display-batch.component.scss'],
  /*
   * These providers are used by the datepicker input to display the date in 
   * DD/MM/YYYY format. This is just local to this component and will not affect 
   * others.
   */ 
  providers : [{provide: MAT_DATE_LOCALE, useValue: 'en-AU'},
               {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
               {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})
export class DisplayBatchComponent implements OnInit,OnChanges,OnDestroy {

  private customerKey: string;  
  private userAuthorities:UserAuthorities;

  private batch:Batch;

  private shotBatch:any;

   /* This is the currently selected product */
  private product:Product;

  private selectedDeliveryMechanism:DeliveryMechanism;
  private selectedAdministrationRoute:AdministrationRoute;

  private isMultiDrug:boolean=false;

  /* Batch Form */
  private displayEditBatchForm: FormGroup;
  
  @ViewChild("app_product_attributes") productAttributesComponent:ProductAttributesComponent;
  @ViewChild("app_display_delivery_datetimes") displayDeliveryDateTimesComponent:DisplayDeliveryDateTimesComponent
  @ViewChild("cancelBatchModal") cancelBatchModal:TemplateRef<any>;
  @ViewChild("discardChangesBatchModal") discardChangesBatchModal:TemplateRef<any>;  
  @ViewChild("successfullBatchCancellationModal") successfullBatchCancellationModal:TemplateRef<any>;  
  @ViewChild("confirmTakeOffHoldModal") confirmTakeOffHoldModal:TemplateRef<any>;    
  @ViewChild("app_search_product") searchProductComponent:SearchProductComponent;

  private productAttributesSubscription:Subscription;  
  private deliveryDateTimesLoadedSubscription:Subscription;
  private completeFromPreferencesSubscription:Subscription;
  private getProductsSubscription:Subscription;
  private getProductAttributesSubscription:Subscription;
  private updateBatchSubscription:Subscription;
  private getBatchDetailsSubscrition:Subscription;
  private cancelBatchSubcription:Subscription;
  private offHoldBatchSubscription:Subscription;

  /*
   * This is used to determine the minimum date value that can be chosen in the 
   * datepicker. If this is null then user can chose any dates.
   */
  private minimumDate:Date = null;

  private readBatchViewVisibility:string;
  private editBatchViewVisibility:string;

  private confirmCancelBatchModalRef:BsModalRef;
  private confirmdiscardChangesBatchModalRef:BsModalRef;
  private successfullBatchCancellationModalRef:BsModalRef;
  private confirmTakeOffHoldModalRef:BsModalRef;
  
  @ViewChild("treamentTimeHour") treamentTimeHourControl:ElementRef;
  @ViewChild("app_batch_history") appBatchHistory: BatchHistoryComponent;
  
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


  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private batchService: BatchService,
              private batchCreationService: BatchCreationService,
              private _changeRef: ChangeDetectorRef,
              private modalService: BsModalService,
              private location:Location,
              private router:Router,
              private route:ActivatedRoute,
              private productsService:ProductsService,
              private eventBusService:EventBusService,
              private alertService:AlertService,
              private customerPreferencesService:CustomerPreferencesService,
              private createOrderService:CreateOrderService) { }

  ngOnInit() {

    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
    this.userAuthorities = this.userService.getCurrentUser().selectedUserAuthority;

    this.shotBatch = this.route.snapshot.data.batchDetails;    
    this.buildForm();
    this.convertBatchDetails();
  }

  buildForm() {

    /* Build the form controls and set their validations. */
    this.displayEditBatchForm = this.formBuilder.group({      
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
    this.displayEditBatchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();

  
  }

  /**
	 * This method will be called if any of the controls were modified and will 
   * add error messages in the form errors container.
	 * @param any 
	 */
	onValueChanged(data?: any) {
	
		if (!this.displayEditBatchForm) { return; }

		const form = this.displayEditBatchForm;

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
        if (this.displayEditBatchForm) {
          let diluentContainerControl = this.displayEditBatchForm.get("diluentContainer");
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

          let administrationRoute = this.displayEditBatchForm.get("administrationRoute");
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
        if (this.displayEditBatchForm) {
          let diluentContainerControl = this.displayEditBatchForm.get("diluentContainer");
          if (diluentContainerControl) {
            diluentContainerControl.setValidators([]);  
            diluentContainerControl.updateValueAndValidity();              
          }

          let administrationRoute = this.displayEditBatchForm.get("administrationRoute");
          if (administrationRoute) {
            administrationRoute.setValidators([]);    
            administrationRoute.updateValueAndValidity();              
          }
        } 
      }

      /* 
       * Fetch delivery date / time  whenever the product is modified.
       */
      this.triggerDeliveryDateTimeFetch(this.product,this.displayEditBatchForm.get("quantity").value);


    /*
     * If the product selected is a Multi-Drug then the dose (2,3) fields are 
     * required if applicabled.  
     */
    if (this.product && this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG) {

      /*
        * If the 2nd Drug is present, set the dose are required. 
        */
      if (this.product.batDrugKey2 != null && this.product.batDrugKey2 != "") {
        this.displayEditBatchForm.get("dose2").setValidators([Validators.required,Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
      } else {
        this.displayEditBatchForm.get("dose2").setValidators([]);
      }
      this.displayEditBatchForm.get("dose2").updateValueAndValidity();

      /*
        * If the 3rd Drug is present, set the dose are required. 
        */
      if (this.product.batDrugKey3 != null && this.product.batDrugKey3 != "") {
        this.displayEditBatchForm.get("dose3").setValidators([Validators.required,Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
      } else {
        this.displayEditBatchForm.get("dose3").setValidators([]);
      }
      this.displayEditBatchForm.get("dose3").updateValueAndValidity();

    } else {

       /*
        * When the product selected is not a Multi-Drug then dose2 and dose3 are 
        * not required. (They are also hidden)
        */
      this.displayEditBatchForm.get("dose2").setValidators([]);
      this.displayEditBatchForm.get("dose2").updateValueAndValidity();

      this.displayEditBatchForm.get("dose3").setValidators([]);
      this.displayEditBatchForm.get("dose3").updateValueAndValidity();
    }

     /*
      * When the product selected is "Formulation" then the dose and volume is 
      * not required.
      */
    if (this.product && this.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {
      this.displayEditBatchForm.get("dose").setValidators([]);
      this.displayEditBatchForm.get("dose").updateValueAndValidity();

      this.displayEditBatchForm.get("volume").setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);
      this.displayEditBatchForm.get("volume").updateValueAndValidity();

      /* Clear fields which are not required for  Formulation */
      this.selectedDeliveryMechanism = null;
      this.selectedAdministrationRoute = null;

    } else {
      this.displayEditBatchForm.get("dose").setValidators([Validators.required,
                                                              Validators.pattern(Constants.REG_EX_DECIMAL_9_4_PATTERN)]);
      this.displayEditBatchForm.get("dose").updateValueAndValidity();
    }
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
        let volume = this.displayEditBatchForm.get("volume");  
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
        let infusionDuration = this.displayEditBatchForm.get("infusionDuration");  
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

      let volume = this.displayEditBatchForm.get("volume");        
      volume.setValidators([Validators.pattern(Constants.REG_EX_DECIMAL_9_2_PATTERN)]);        
      volume.markAsDirty();
      volume.updateValueAndValidity();  

      // update validation rules for infusion duration
      let infusionDuration = this.displayEditBatchForm.get("infusionDuration");        
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
   * Called whenever the Multi-Drug Toggle button is clicked.
   */
  OnToggleMultiDrug() {        
    
    /*
     * Reset the product and form whenever the user change from Multi-Drug to 
     * non Multi-Drug. 
     */
    this.product = null;
    this.displayEditBatchForm.reset();

  }

  prepareBatch() {

    /* Set the values for displayEditBatchForm form */    
    this.handleSelectedProduct(this.batch.product);

    if (this.batch.product.entryType == Constants.PRODUCT_ENTRY_TYPE_MULTI_DRUG) {
      this.isMultiDrug = true;
      this.displayEditBatchForm.get("dose2").setValue(this.batch.dose2);
      this.displayEditBatchForm.get("dose3").setValue(this.batch.dose3); 
    }

    this.displayEditBatchForm.get('dose' ).setValue(this.batch.dose);     
    this.displayEditBatchForm.get('closedSystem' ).setValue(this.batch.closedSystem); 
    this.displayEditBatchForm.get('volume' ).setValue(this.batch.volume); 
    this.displayEditBatchForm.get('exact' ).setValue(this.batch.exact == Constants.TRUE ? true : false); 
    this.displayEditBatchForm.get('infusionDuration' ).setValue(this.batch.infusionDuration); 
    this.displayEditBatchForm.get('quantity' ).setValue(this.batch.quantity); 

    this.productAttributesSubscription = this.productAttributesComponent.afterListinitialized().subscribe(
      data => {
        this.displayEditBatchForm.get('diluentContainer' ).setValue(this.batch.deliveryMechanism); 
        this.displayEditBatchForm.get('administrationRoute' ).setValue(this.batch.route); 
      }
    );
    
    this.deliveryDateTimesLoadedSubscription =  this.displayDeliveryDateTimesComponent.afterDeliverDateTimesLoaded().subscribe(
      data => {        
      this.displayEditBatchForm.get('deliveryDateTime' ).setValue(this.batch.deliveryDateTime);       
      }
    );
    this.triggerDeliveryDateTimeFetch(this.product,this.batch.quantity);
    
    this.displayEditBatchForm.get('deliveryLocation' ).setValue(this.batch.deliveryLocation); 
    
    this.handleSelectedDeliveryDateTime(this.batch.deliveryDateTime);              
    if (this.batch.treatmentDateTime && this.batch.treatmentDateTime != "") {          
      this.displayEditBatchForm.get('treatmentDate' ).setValue(moment(this.batch.treatmentDateTime));         
    } else {
      this.displayEditBatchForm.get('treatmentDate' ).setValue("");
    }             
    this.displayEditBatchForm.get('treamentTimeHour' ).setValue(Util.formatDateTime(this.batch.treatmentDateTime,"HH","YYYY-MM-DDTHH:mm:ss")); 
    this.displayEditBatchForm.get('treamentTimeMinute' ).setValue(Util.formatDateTime(this.batch.treatmentDateTime,"mm","YYYY-MM-DDTHH:mm:ss"));     
    
    this.displayEditBatchForm.get('comments' ).setValue(this.batch.comments); 

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

    this.displayEditBatchForm.get('treatmentDate').setValue("");
    this.displayEditBatchForm.get('treamentTimeHour').setValue("");
    this.displayEditBatchForm.get('treamentTimeMinute').setValue("");

    /*
     * Remove the validations for Treatment Time Hour and Minute.
     */
    this.displayEditBatchForm.get("treamentTimeHour").setValidators([]);
    this.displayEditBatchForm.get("treamentTimeHour").updateValueAndValidity();

    this.displayEditBatchForm.get("treamentTimeMinute").setValidators([]);
    this.displayEditBatchForm.get("treamentTimeMinute").updateValueAndValidity();
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
   * Used this method to fetch Delivery Date Time.
   * 
   * @param product 
   * @param quantity 
   */
  triggerDeliveryDateTimeFetch(product:Product,quantity:number) {
    
    var batchProduct = new BatchProduct();
    batchProduct.product = this.product;
    batchProduct.quantity = quantity;
    batchProduct.deliveryRunQuantities = null;
    
    this.batchCreationService.changeProductQty(batchProduct);
  }

  ngOnDestroy(){
      if (this.productAttributesSubscription) {
        this.productAttributesSubscription.unsubscribe();
      }

      if (this.deliveryDateTimesLoadedSubscription) {
        this.deliveryDateTimesLoadedSubscription.unsubscribe();
      }

      if (this.getProductsSubscription) {
        this.getProductsSubscription.unsubscribe();
      }

      if(this.completeFromPreferencesSubscription) {
        this.completeFromPreferencesSubscription.unsubscribe();
      }

      if (this.getProductAttributesSubscription) {
        this.getProductAttributesSubscription.unsubscribe();
      }

      if (this.updateBatchSubscription) {
        this.updateBatchSubscription.unsubscribe();
      }

      if (this.getBatchDetailsSubscrition) {
        this.getBatchDetailsSubscrition.unsubscribe();
      }

      if (this.cancelBatchSubcription) {
        this.cancelBatchSubcription.unsubscribe();
      }

      if (this.offHoldBatchSubscription) {
        this.offHoldBatchSubscription.unsubscribe();
      }
  }

  changeTreatmentDateEvent(event) {
    
    /*
     * Once the user provided a treatment date, the fields
     * treatment hour and minute will be mandatory. 
     */
    this.displayEditBatchForm.get("treamentTimeHour").setValidators([Validators.required]);
    this.displayEditBatchForm.get("treamentTimeHour").updateValueAndValidity();

    this.displayEditBatchForm.get("treamentTimeMinute").setValidators([Validators.required]);
    this.displayEditBatchForm.get("treamentTimeMinute").updateValueAndValidity();
  }

  editBatch() {
    this.readBatchViewVisibility = 'hidden';
    this.editBatchViewVisibility = 'shown';
  }

  cancelBatch() {
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: 'static',
      ignoreBackdropClick: true
    };
    this.confirmCancelBatchModalRef = this.modalService.show(this.cancelBatchModal, Object.assign({}, options));
    
  }

  confirmCancelBatch() {

    this.eventBusService.broadcast(Constants.SHOW_LOADING);
      
    /*
      * Cancel any pending calls if there are any. 
      */
    if (this.cancelBatchSubcription) {
      this.cancelBatchSubcription.unsubscribe();
    }

    
    
    this.cancelBatchSubcription = this.createOrderService.cancelBatch(this.customerKey,this.buildBatchCancelRequestPayload()).subscribe(
        /* When successful */
        data => {
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
                  this.confirmCancelBatchModalRef.hide();   

                  var options: ModalOptions = {    
                    animated: true,
                    keyboard: false,
                    backdrop: 'static',
                    ignoreBackdropClick: true
                  };
                  this.successfullBatchCancellationModalRef = this.modalService.show(this.successfullBatchCancellationModal, Object.assign({}, options));

        },
        /* When there is an error. */
        error => {

                this.confirmCancelBatchModalRef.hide();   

                this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchErrorAlert');
                
                this.eventBusService.broadcast(Constants.HIDE_LOADING);
                
        }
    );
    
  }

  discardChanges() {    
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: 'static',
      ignoreBackdropClick: true
    };
    this.confirmdiscardChangesBatchModalRef = this.modalService.show(this.discardChangesBatchModal, Object.assign({}, options));
    
  }

  confirmDiscardChangesBatch() {
    this.confirmdiscardChangesBatchModalRef.hide();
    this.location.back();
  }

  convertBatchDetails() {

    var convertedBatch:Batch = new Batch();
    
    if (this.shotBatch) {

      if (this.getProductsSubscription) {
        this.getProductsSubscription.unsubscribe();
      }
      /*
       * The product object in the selected batch for reorder just contains the 
       * name. The actual product object needs to be fetch from backend so that 
       * other attributes of the product will be present which is needed in the 
       * `DisplayBatchComponent`.
       */
      let productSearch = this.getProductDescription(this.shotBatch);
      this.getProductsSubscription = this.productsService.getProducts(this.customerKey,this.shotBatch.productDescription,productSearch[1]).subscribe(
        /* When successful */
        products => {

          if (!products || products.length <= 0) {                      
            // TODO : Handle scenario wherein there is no matching product.
            return;
          }        
          
          /*
           * Get the product from the list of product which has exactly the same 
           * description.  
           */
          let product:Product = products.find(
            product => {
              return product.productDescription == productSearch[0];
            }
          );

          if (!product) {
            // TODO : Handle scenario wherein there is no matching product.  
            return;
          }

          convertedBatch.product = product;

          /*
           * Get the delivery mechanism object from the product. For Formulation
           * products this is not required.
           */
          if (convertedBatch.product.entryType != Constants.PRODUCT_ENTRY_TYPE_FORMULATION &&
              product.deliveryMechanisms) {
                convertedBatch.deliveryMechanism = product.deliveryMechanisms.find(
              deliveryMechanism => {
                return deliveryMechanism.key == this.shotBatch.deliveryMechanismKey; 
              }
            );
          } else {
            convertedBatch.deliveryMechanism = null;
          }

          /*
           * At this point, we can copy the attributes of the order history to 
           * the Order object we are going to pass to the DisplayBatchComponent. 
           */
          convertedBatch.batchId           = this.shotBatch.batchId;
          convertedBatch.dose              = this.shotBatch.dose;
          convertedBatch.dose2             = this.shotBatch.dose2;
          convertedBatch.dose3             = this.shotBatch.dose3;
          convertedBatch.doseUnit          = this.shotBatch.doseUnit;
          convertedBatch.doseUnit2         = this.shotBatch.doseUnit2;
          convertedBatch.doseUnit3         = this.shotBatch.doseUnit3;          
          convertedBatch.closedSystem      = this.shotBatch.closedSystem;
          convertedBatch.volume            = this.shotBatch.specifiedVolume;
          convertedBatch.infusionDuration  = this.shotBatch.infusionDuration;
          convertedBatch.exact             = this.shotBatch.exact == Constants.YES ? Constants.TRUE : Constants.FALSE;
          convertedBatch.quantity          = this.shotBatch.quantity;
          convertedBatch.comments          = this.shotBatch.comments;
          convertedBatch.status            = this.shotBatch.status;          
          convertedBatch.deliveryLocation  = new DeliveryLocation(this.shotBatch.deliveryLocationId,this.shotBatch.ordDeliverylocation); 
          var deliveryDateTime  = new DeliveryDateTime(this.shotBatch.deliveryDate + ' ' + this.shotBatch.deliveryTime);
          if (this.shotBatch.batDispatchDatetime) {
            deliveryDateTime.dispatchDateTimeValue = this.shotBatch.batDispatchDatetime;
          }
          convertedBatch.deliveryDateTime = deliveryDateTime;

          if (this.shotBatch.treatmentDate && this.shotBatch.treatmentTime) {
            convertedBatch.treatmentDateTime = this.shotBatch.treatmentDate + 'T' + this.shotBatch.treatmentTime;
          } else {
            convertedBatch.treatmentDateTime = "";
          }
          

          /***********************************************************************/

          /*
           * Find the administration route for this order history
           */
          if (convertedBatch.product.entryType != Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {

            if (this.getProductAttributesSubscription) {
              this.getProductAttributesSubscription.unsubscribe();
            }

            this.getProductAttributesSubscription = this.productsService.getProductAttributes(this.customerKey,product).subscribe(
              attributes => {
                
                /* 
                * The administration routes for this product
                */
                if (attributes && attributes.administrationRoutes && attributes.administrationRoutes.length > 0) {

                  /*
                  * Find the administration route object
                  */
                  let route = attributes.administrationRoutes.find(
                    administrationRoute => {
                      return administrationRoute.administrationRoute.code == this.shotBatch.routeId;
                    }
                  );

                  if (route) {
                    convertedBatch.route = route.administrationRoute;
                  } else {
                    convertedBatch.route = null;
                  }
                } else {
                  convertedBatch.route = null;
                }

                /*
                * At this point, we can pass the batch to the 
                * DisplayOrderComponent. 
                */              
                this.batch = convertedBatch;
                this.prepareBatch();         
              },
              /*
              * When error occurs, we will allow the user to proceed and just set 
              * the Administration Route to null 
              */
              error => {
                convertedBatch.route = null;
                this.batch = convertedBatch;
                this.prepareBatch();         
              },
              () => {              
                //this.eventBusService.broadcast(Constants.HIDE_LOADING);   
              }
            );
          } else {
            convertedBatch.route = null;
            this.batch = convertedBatch;
            this.prepareBatch();  
          }  

          
        },
        /* When there is an error. */
        error => {

                  /* Show generic error message for any backend errors. */          
                  //this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'orderHistoryAlert');              

                  //this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
        },
        () => {
            // Do nothing           
            //this.eventBusService.broadcast(Constants.HIDE_LOADING);              
        }  
      );
    }
    
    
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
   * This will be called saving changes to a batch.
   */
  onSaveChanges() {

    /* Clear Error alert if there is any. */
    this.alertService.error("",'displayBatchErrorAlert');

    if (this.displayEditBatchForm.valid && this.product) {

      this.eventBusService.broadcast(Constants.SHOW_LOADING);
        
      /*  
       * Cancel any pending calls if there are any. 
       */
      if (this.updateBatchSubscription) {
        this.updateBatchSubscription.unsubscribe();
      }

      this.updateBatchSubscription = this.createOrderService.updateBatch(this.customerKey,this.buildBatchUpdateRequestPayload()).subscribe(
        /* When successful */
        data => {
                  this.retrieveUpdatedBatchDetails();
                  this.appBatchHistory.loadBatchHistory();
        },
        /* When there is an error. */
        error => {

                  if (error.status == 500) {                    
                    if (error.error.errorCode == "INVALID-DELV-DATE-TIME") {                      
                      /*
                      * This error occurred because the delivery date/time that
                      * was chosen by the user during batch creation is no 
                      * longer valid.
                      */
                      var errorMessage:string = "We are sorry! There was an error encountered during saving of the batch:";
                      error.error.errorMessages.forEach(
                        msg => {
                          errorMessage += "<li>" + msg + "</li>";
                        }
                      );
                      errorMessage += "</ul>";
                      this.alertService.error(errorMessage,'displayBatchErrorAlert');

                    } else if (error.error.errorCode == "SH-OM-UB-001") {

                      let errorMessage = "We are sorry! The batch was not updated because the status have changed. Please reload this batch and try again.";
                      this.alertService.error(errorMessage,'displayBatchErrorAlert');

                    } else {
                      this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchErrorAlert');
                    }                    
                  } else {
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchErrorAlert');
                  }
                  
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
        }
      );


    } else {
       /*
       * If the form is still invalid after pressing the submit button, then 
       * display all the validation errors. 
       */
      Object.keys(this.displayEditBatchForm.controls).forEach(key => {
        this.displayEditBatchForm.get(key).markAsDirty();
        this.displayEditBatchForm.get(key).markAsTouched();
      });
      this.onValueChanged();  

      if (!this.product) {
        this.formErrors.product = this.validationMessages["product"].required;
        this.searchProductComponent.setInvalid();
      }
      
    }
  }

  retrieveUpdatedBatchDetails() {
    if (this.getBatchDetailsSubscrition) {
       this.getBatchDetailsSubscrition.unsubscribe(); 
    }
    this.getBatchDetailsSubscrition =  this.batchService.getBatchDetails(this.customerKey,this.shotBatch.shotBatchId).subscribe(
      /* When successful */
      data => {
          
              this.shotBatch.batchId = data.batchId;              
              this.batch.batchId = data.batchId;

              this.shotBatch.status = data.status;              
              this.batch.status = data.status;

              this.alertService.success("Batch Successfully saved.",true,'displayBatchAlertTop');   
              
              this.eventBusService.broadcast(Constants.REFRESH_MYORDER_VIEW_EVENT);

              this.eventBusService.broadcast(Constants.HIDE_LOADING);
      },
      /* When there is an error. */
      error => {

              this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchErrorAlert');
              
              this.eventBusService.broadcast(Constants.HIDE_LOADING);
              
      }
    );

  }

  buildBatchCancelRequestPayload() : BatchUpdateRequestPayload {

    /*
     * Build the Order Request Payload 
     */
    var batchCancelRequestPayload = new BatchUpdateRequestPayload();
    batchCancelRequestPayload.shotBatchId = this.shotBatch.shotBatchId;
    batchCancelRequestPayload.batchId     = this.shotBatch.batchId;
    batchCancelRequestPayload.updatedBy   = this.userService.getCurrentUser().userId;
    batchCancelRequestPayload.ordNo       = this.shotBatch.ordNo;
    batchCancelRequestPayload.orderId     = this.shotBatch.orderId;

    return batchCancelRequestPayload;
  }

  buildBatchUpdateRequestPayload() : BatchUpdateRequestPayload {
    /*
     * Build the Order Request Payload 
     */
    var batchUpdateRequestPayload = new BatchUpdateRequestPayload();

    batchUpdateRequestPayload.shotBatchId   = this.shotBatch.shotBatchId;
    batchUpdateRequestPayload.batchId       = this.shotBatch.batchId;
    batchUpdateRequestPayload.closedSystem  = this.displayEditBatchForm.get("closedSystem").value ? true : false;
    batchUpdateRequestPayload.comments      =  this.displayEditBatchForm.get("comments").value;
    batchUpdateRequestPayload.customerId    = this.customerKey;

    let deliveryDateTime = this.displayEditBatchForm.get("deliveryDateTime").value;
    if (deliveryDateTime) {
      batchUpdateRequestPayload.deliveryDate = Util.formatDateTime(deliveryDateTime.value,"YYYY-MM-DD");
      batchUpdateRequestPayload.deliveryTime = Util.formatDateTime(deliveryDateTime.value,"HH:mm:ss");
      batchUpdateRequestPayload.batDispatchDatetime = deliveryDateTime.dispatchDateTimeValue;
    } else {
      batchUpdateRequestPayload.deliveryDate = "";
      batchUpdateRequestPayload.deliveryTime = "";
      batchUpdateRequestPayload.batDispatchDatetime = "";
    }

    let deliveryLocation = this.displayEditBatchForm.get("deliveryLocation").value;
    if (deliveryLocation) {
      batchUpdateRequestPayload.deliveryLocationId = deliveryLocation.locationKey;
    } else {
      batchUpdateRequestPayload.deliveryLocationId = "";
    }

    if (this.selectedDeliveryMechanism) {
      batchUpdateRequestPayload.deliveryMechanismDescription = this.selectedDeliveryMechanism.diluent.stockDescription + " in " + this.selectedDeliveryMechanism.container.stockDescription;
      batchUpdateRequestPayload.deliveryMechanismKey         = this.selectedDeliveryMechanism.key;
      batchUpdateRequestPayload.batDelMechKey                = this.selectedDeliveryMechanism.key;
    } else {
      batchUpdateRequestPayload.deliveryMechanismDescription  = "";
      batchUpdateRequestPayload.deliveryMechanismKey          = "";
      batchUpdateRequestPayload.batDelMechKey                 = "";
    }
    
    batchUpdateRequestPayload.dose  = Util.defaultString(this.displayEditBatchForm.get("dose").value); 
    batchUpdateRequestPayload.dose2 = Util.defaultString(this.displayEditBatchForm.get("dose2").value); 
    batchUpdateRequestPayload.dose3 = Util.defaultString(this.displayEditBatchForm.get("dose3").value); 

    batchUpdateRequestPayload.doseUnit    = Util.defaultString(this.product.unitOfMeasure); 
    batchUpdateRequestPayload.doseUnit2   = Util.defaultString(this.product.unitOfMeasure2); 
    batchUpdateRequestPayload.doseUnit3   = Util.defaultString(this.product.unitOfMeasure3); 

    batchUpdateRequestPayload.exact = this.displayEditBatchForm.get("exact").value ? Constants.TRUE : Constants.FALSE;
    batchUpdateRequestPayload.infusionDuration = this.displayEditBatchForm.get("infusionDuration").value;

    batchUpdateRequestPayload.ordBillto           = this.shotBatch.ordBillto;
    batchUpdateRequestPayload.ordDeliverylocation = this.shotBatch.ordDeliverylocation;
    batchUpdateRequestPayload.ordNo               = this.shotBatch.ordNo;
    batchUpdateRequestPayload.orderId             = this.shotBatch.orderId;

    batchUpdateRequestPayload.patientDob        = this.shotBatch.patientDob;
    batchUpdateRequestPayload.patientFirstName  = this.shotBatch.patientFirstName;
    batchUpdateRequestPayload.patientId         = this.shotBatch.patientId;
    batchUpdateRequestPayload.patientLastName   = this.shotBatch.patientLastName;
    batchUpdateRequestPayload.patientUr         = this.shotBatch.patientUr;

    batchUpdateRequestPayload.price = this.shotBatch.price;

    batchUpdateRequestPayload.productDescription  = this.product.genericDrugDescription;
    batchUpdateRequestPayload.productDescription2 = this.product.genericDrugDescription2;
    batchUpdateRequestPayload.productDescription3 = this.product.genericDrugDescription3;

    batchUpdateRequestPayload.quantity = this.displayEditBatchForm.get("quantity").value;

    if (this.selectedAdministrationRoute) {
      batchUpdateRequestPayload.routeId   = this.selectedAdministrationRoute.code;
      batchUpdateRequestPayload.routeName = this.selectedAdministrationRoute.description;    
    } else {
      batchUpdateRequestPayload.routeId   = "";
      batchUpdateRequestPayload.routeName = "";    
    }

    batchUpdateRequestPayload.specifiedVolume =  this.displayEditBatchForm.get("volume").value;  

    let treatmentDate       = this.displayEditBatchForm.get("treatmentDate").value;
    let treatmentTimeHour   = this.displayEditBatchForm.get("treamentTimeHour").value;
    let treamentTimeMinute  = this.displayEditBatchForm.get("treamentTimeMinute").value;

    if (treatmentDate && treatmentDate != "" &&  treatmentTimeHour && treatmentTimeHour != "" && treamentTimeMinute && treamentTimeMinute != "") {
      treatmentDate.hour(treatmentTimeHour);
      treatmentDate.minute(treamentTimeMinute);
      batchUpdateRequestPayload.treatmentDate = treatmentDate.format("YYYY-MM-DD");
      batchUpdateRequestPayload.treatmentTime = treatmentDate.format("HH:mm:ss");
    } else {
      batchUpdateRequestPayload.treatmentDate = null;
      batchUpdateRequestPayload.treatmentTime = null;
    }

    batchUpdateRequestPayload.updatedBy = this.userService.getCurrentUser().userId;
    
    batchUpdateRequestPayload.stkKey  = Util.defaultString(this.product.batDrugKey);
    batchUpdateRequestPayload.stkKey2 = Util.defaultString(this.product.batDrugKey2);
    batchUpdateRequestPayload.stkKey3 = Util.defaultString(this.product.batDrugKey3);

    batchUpdateRequestPayload.batDsukey       = Util.defaultString(this.product.batDSUKey);    
    batchUpdateRequestPayload.batEntKey       = this.product.targetSite;

    batchUpdateRequestPayload.axisBatchStatus = this.shotBatch.axisBatchStatus;
    batchUpdateRequestPayload.status = this.shotBatch.status;
    
    /*
     * Determine what type of batch update.  
     */
    batchUpdateRequestPayload.changeType = this.determineBatchChangeType(batchUpdateRequestPayload);

    return batchUpdateRequestPayload;
  }

  determineBatchChangeType(batchUpdateRequestPayload:BatchUpdateRequestPayload) : string {

    var changeType = Constants.BATCH_UPDATE_TYPE_BATCH;

    /*
     * Compare the Delivery Location / Delivery Datetime / Entity against the
     * previous value. If one of these values changed then it will be an Order "O"
     * type. Otherwise it will just be Batch 'B' change. 
     */

    let deliveryDateTimeNew = batchUpdateRequestPayload.deliveryDate + " " + batchUpdateRequestPayload.deliveryTime;
    let deliveryDateTimeOld = this.shotBatch.deliveryDate + " " + this.shotBatch.deliveryTime; 
    if (batchUpdateRequestPayload.deliveryLocationId != this.shotBatch.deliveryLocationId ||
        deliveryDateTimeNew != deliveryDateTimeOld ||
        batchUpdateRequestPayload.batEntKey != this.shotBatch.batEntKey) {

      changeType = Constants.BATCH_UPDATE_TYPE_ORDER;
    }
    return changeType;
    
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

    let dose = this.displayEditBatchForm.get('dose').value;
    if (!dose || dose == "") {
      this.formErrors.dose = this.validationMessages["dose"].required;
      this.displayEditBatchForm.get('dose').markAsDirty();
      this.displayEditBatchForm.get('dose').markAsTouched();
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

    let volume = this.displayEditBatchForm.get("volume").value;
    let exact  = this.displayEditBatchForm.get("exact").value;
    let infusionDuration = this.displayEditBatchForm.get("infusionDuration").value;

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
                this.alertService.success("Found a preference and successfully applied",true,'displayBatchAlertTop');   
                
      },
      /* When there is an error. */
      error => {

                if (error.status == Constants.HTTP_RESPONSE_STATUS_CODE_NOT_FOUND) {
                  /* Inform user that there is no matching preference */          
                  this.alertService.error(Constants.CUSTOMER_PREFERENCE_NO_MATCH_FOUND,'displayBatchErrorAlert',true);              
                } else if (error.status == Constants.HTTP_RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR) {
                    /* Show generic error message for any backend errors. */          
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchErrorAlert',true);  
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
    if (customerPreference.deliveryMechanism && (this.displayEditBatchForm.get('diluentContainer').value == "" || this.displayEditBatchForm.get('diluentContainer').value == null)) {      
      this.displayEditBatchForm.get('diluentContainer').setValue(customerPreference.deliveryMechanism); 
    }

    /* 
     * Apply Administration Route preference if there is any
     */
    if (customerPreference.administrationRoute && (this.displayEditBatchForm.get('administrationRoute').value == "" || this.displayEditBatchForm.get('administrationRoute').value == null)) {
      this.displayEditBatchForm.get('administrationRoute').setValue(customerPreference.administrationRoute); 
    }

    /* 
     * Apply Volume preference if there is any
     */
    if (customerPreference.volume && (this.displayEditBatchForm.get('volume').value == "" || this.displayEditBatchForm.get('volume').value == null)) {
      this.displayEditBatchForm.get('volume').setValue(customerPreference.volume); 
    }
    
    /* 
     * Apply Exact preference if there is any
     */
    if (customerPreference.exact && this.displayEditBatchForm.get('exact').value == "") {
      this.displayEditBatchForm.get('exact').setValue(customerPreference.exact == Constants.TRUE ? true : false); 
    }

    /* 
     * Apply Infusion Duration preference if there is any
     */
    if (customerPreference.infusionDuration && (this.displayEditBatchForm.get('infusionDuration').value == "" || this.displayEditBatchForm.get('infusionDuration').value == null)) {
      this.displayEditBatchForm.get('infusionDuration').setValue(customerPreference.infusionDuration); 
    }

    /* 
     * Apply Quantity preference if there is any
     */
    if (customerPreference.quantity && (this.displayEditBatchForm.get('quantity').value == "" || this.displayEditBatchForm.get('quantity').value == null)) {
      this.displayEditBatchForm.get('quantity').setValue(customerPreference.quantity); 
      this.triggerDeliveryDateTimeFetch(this.product,customerPreference.quantity);
    }

    /* 
     * Append Comments preference if there is any
     */
    if (customerPreference.comments) {
      let existingComments = this.displayEditBatchForm.get('comments').value;
      if (existingComments == null) {
        this.displayEditBatchForm.get('comments').setValue(customerPreference.comments ); 
      } else {
        this.displayEditBatchForm.get('comments').setValue(existingComments + " " + customerPreference.comments ); 
      }
      
    }
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

  getProductDescription(batch: any):[string,string] {
    var productDescription:string="";  
    var searchMode:string="AddProduct";  
    if (batch.productDescription) {
      productDescription = batch.productDescription;
      if (batch.productDescription2) {
        productDescription += " + " + batch.productDescription2;
        searchMode = "MultiDrug";
        if (batch.productDescription3) {
          productDescription += " + " + batch.productDescription3;
          searchMode = "MultiDrug";
        }
      }
    }
    return [productDescription,searchMode];
  }


  confirmSuccessfullBatchCancellation() {    
    this.successfullBatchCancellationModalRef.hide();
    this.location.back();
  }

  takeOffHold() {
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: 'static',
      ignoreBackdropClick: true
    };
    this.confirmTakeOffHoldModalRef = this.modalService.show(this.confirmTakeOffHoldModal, Object.assign({}, options));
  }

  confirmTakeOffHoldBatch() {

    this.eventBusService.broadcast(Constants.SHOW_LOADING);
        
      /*  
       * Cancel any pending calls if there are any. 
       */
      if (this.offHoldBatchSubscription) {
        this.offHoldBatchSubscription.unsubscribe();
      }

      this.offHoldBatchSubscription = this.createOrderService.offHoldBatch(this.customerKey,this.buildBatchOffHoldRequestPayload()).subscribe(
        /* When successful */
        data => {
                  this.confirmTakeOffHoldModalRef.hide();

                  this.alertService.success("Successfully taken batch off hold.",true,'displayBatchAlertTop');

                  this.retrieveUpdatedBatchDetails();

                  this.appBatchHistory.loadBatchHistory();
        },
        /* When there is an error. */
        error => {

                  this.confirmTakeOffHoldModalRef.hide();

                  this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'displayBatchErrorAlert');
                  
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
        }
      );

  }

  buildBatchOffHoldRequestPayload() : BatchUpdateRequestPayload{
     /*
     * Build the Order Request Payload 
     */
    var batchCancelRequestPayload = new BatchUpdateRequestPayload();
    batchCancelRequestPayload.shotBatchId = this.shotBatch.shotBatchId;
    batchCancelRequestPayload.batchId     = this.shotBatch.batchId;
    batchCancelRequestPayload.updatedBy   = this.userService.getCurrentUser().userId;
    batchCancelRequestPayload.ordNo       = this.shotBatch.ordNo;
    batchCancelRequestPayload.orderId     = this.shotBatch.orderId;
    batchCancelRequestPayload.status      = Constants.BATCH_STATUS_ON_HOLD;

    return batchCancelRequestPayload;
  }

}
