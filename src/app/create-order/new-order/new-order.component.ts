import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../../common/model/patient.model';
import { Batch } from '../../common/model/batch.model';
import { Product } from '../../common/model/product.model';
import { DeliveryMechanism } from '../../common/model/delivery-mechanism.model';
import { Diluent } from '../../common/model/diluent.model';
import { Container } from '../../common/model/container.model';
import { AdministrationRoute } from '../../common/model/administration-route.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DeliveryLocation } from '../../common/model/delivery-location.model';
import { DeliveryDateTime } from '../../common/model/delivery-datetime.model';
import { AlertService } from '../../core/services/alert.service';
import { AddBatchComponent } from '../add-batch/add-batch.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';
import { CreateOrderService } from '../create-order-service';
import { UserService } from '../../common/services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { SubmitOrderRequestPayload } from '../../common/model/submit-order-request-payload.model';
import { SubmitOrderPatientBatchRequestPayload } from '../../common/model/submit-order-patient-batch-request-payload.model';
import { SubmitOrderPatientRequestPayload } from '../../common/model/submit-order-patient-request-payload.model';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Util } from '../../common/util';
import { ComponentCanDeactivate } from '../../common/guards/pending-changes.guard';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../common/model/customer.model';
import { MaterialDataSource } from '../../common/material-datasource';

/**
 * This is the page where User can create Orders. 
 * 
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown',  style({ marginLeft:'0px' })),
      state('hidden', style({ marginLeft:'-1350px' })),
      transition('shown => hidden', [
        animate('0.4s 0.1s ease-in', style({transform: 'translateX(-100%)'}))
      ]),
      transition('hidden => shown', [
        animate('0.4s 0.1s ease-in', style({transform: 'translateX(100%)'}))
      ]),
      transition('void => shown', animate('0s'))
  ])
]
})
export class NewOrderComponent extends MaterialDataSource implements OnInit,OnDestroy,ComponentCanDeactivate  {

  private billToList:Customer[];

  private newOrderForm:FormGroup;

  /*
   * This is the list of orders. Each order should have unique Delivery Date,
   * Delivery Location and Entity (Compounding Center). Each Order will have a 
   * list of Patients and each patient will have their orders. In summary, the 
   * heirarchy is shown below:
   * 
   * Patient1
   *      -> Batches
   *        -> Batch 1
   *        -> Batch 2
   * Patient2
   *      -> Batches
   *        -> Batch 1
   *        -> Batch 2
   */
  private orderList:Array<{patient:Patient,batchList:Array<Batch>}>;

  private displayedColumnsForNoPatientName = ['productNameForNoPatientName',                                              
                                              'deliveryMechanismForNoPatientName',
                                              'volumeForNoPatientName',                              
                                              'routeForNoPatientName',                              
                                              'quantityForNoPatientName',
                                              'deliverToForNoPatientName',
                                              'deliverAtForNoPatientName',
                                              'statusForNoPatientName',
                                              'commentsForNoPatientName' ];

private displayedColumnsForPatients = ['productName',                                       
                                       'deliveryMechanism',
                                       'volume',                              
                                       'route',                              
                                       'quantity',
                                       'deliverTo',
                                       'deliverAt',
                                       'status',
                                       'comments' ];                              

  /*
	 * Form errors container
	 */
	formErrors = {  
                  'poNumber'  : '',
                  'billTo'    : '',                  
                };

  /*
	 * Validation error messages
	 */
	validationMessages = {
                        'poNumber': {   
                                    'maxlength'  : 'Invalid PO Number.'                            
                                    },
                        'billTo'  : {   
                                    'required'  : 'Please select a Bill To.'                            
                                    }
                        };	             
                        
  /*
   * This flag will hide or show the "New Order" page.
   */                         
  private visibility:string;

  /*
   * This flag will hide or show the "Add Batch" page.
   */
  private addBatchVisibility:string;
  private addBatchComponentMode:string;                        

  private customerKey:string;

  /*
   * Reference to the "Add Batch" page.
   */
  @ViewChild("app_add_batch") addBatchComponent: AddBatchComponent;

  private createOrderServiceSubscription:Subscription;
  private afterBatchesAddedToOrderSubscription:Subscription;
  private afterBatchesUpdatedToOrderListSubscription:Subscription;

  /*
   * The current patient Id selected for removing batches. 
   */
  private currentPatientIdForDelete:number;

  /*
   * The current order selected for editing. This contains the current patient 
   * and batches being edited.
   */
  private currentOrderForEdit:any;

  private selectedBillTo:Customer;

  constructor(private formBuilder:FormBuilder,
              private alertService:AlertService,
              private eventBusService:EventBusService,
              private createOrderService:CreateOrderService,
              private userService:UserService) { 
    super();            
  }

  ngOnInit() {

    /* Get the currently selected Customer Site */
    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
    this.billToList = this.userService.getCurrentUser().selectedUserAuthority.billTos;

    /* Start a new Order Cycle */
    this.startNewOrder();

    /*
     * Listen to the Add Batch component for any new Batches Added. Whenever 
     * there is a new batch added to the order, show this component and hide the 
     * AddBatch Component. 
     */
    this.afterBatchesAddedToOrderSubscription = this.addBatchComponent.afterBatchesAddedToOrder().subscribe(
                                                    order => {        
                                                      this.addOrder(order);
                                                      this.visibility = "shown";
                                                      this.addBatchVisibility = "hidden";
                                                    }
                                                  );
    /*
     * Listen to the Add Batch component for any Batches updated. Whenever there
     * is a batch updated to the order, show this component and hide the 
     * AddBatch Component. 
     */                                                  
    this.afterBatchesUpdatedToOrderListSubscription = this.addBatchComponent.afterBatchesUpdatedToOrderList().subscribe(
                                                    order => {
                                                      this.updateOrder(order);
                                                      this.visibility = "shown";
                                                      this.addBatchVisibility = "hidden";
                                                    }
                                                  );

    /* Initially show this component and hide the batch component. */
    this.visibility = "shown";
    this.addBatchVisibility = "hidden";

  }

  /**
   * This will prevent the user from navigating away within this application or 
   * closing the tab,browser or moving away to other websites if there are any 
   * orders not yet submitted. 
   */
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    /*
     * Only allow to move away if there are no pending orders. This also 
     * includes scenario wherein no patient's products have been added to order 
     * yet but there are products added in the patient's order in the "Add 
     * Products to Order" page.
     */
    if (!this.orderList || 
        (this.hasBatchesInOrders() == false && 
        this.addBatchComponent.getBatchList().length <= 0)) {
      return true;
    } else {
      /*
       * If there are pending orders then confirm with the user whether they 
       * still want to move away. 
       */
      return confirm('WARNING: You have unsubmitted orders. Press Cancel to go back and submit these orders, or OK to lose these orders.');
    }    
  }

  /**
   * This method will be called whenever a new Batch have been added. If the 
   * batch that will be added is for a Non-Patient, then find the non-patient 
   * batches from the order list and add the new one.
   * 
   * @param orderToBeAdded 
   */
  addOrder(orderToBeAdded:any) {

    let patient = orderToBeAdded.patient;
    /* 
     * If the patient to be added is Non-Patient 
     */
    if (patient.isPatient == false) {

      /* Check if the Non-Patient is already in the batch list */
      let targetOrder = this.orderList.find( order => order.patient.isPatient == false);
      if (targetOrder) {
        /* 
         * Iterate thru all orders to be added and push them to the existing 
         * batch list of the Non-Patient.
         */
        orderToBeAdded.batchList.forEach( batch => targetOrder.batchList.push(batch));
      } else {
        /*
         * Otherwise add the order to the Order List.
         */ 
        this.orderList.push(orderToBeAdded);
      }

    /*
     * If the patient to be added Has a name.
     */  
    } else {
      /* Check if the Patient is already in the batch list */
      let targetOrder = this.orderList.find( order => order.patient.patientId == orderToBeAdded.patient.patientId);
      if (targetOrder) {
        /* 
         * Iterate thru all orders to be added and push them to the existing 
         * batch list of the Patient.
         */
        orderToBeAdded.batchList.forEach( batch => targetOrder.batchList.push(batch));
      } else {
        /*
         * Otherwise add the order to the Order List.
         */ 
        this.orderList.push(orderToBeAdded);
      }
    }    
  } 

  /**
   * This method will be called whenever a new Batch have been updated.
   * 
   * @param updatedOrder 
   */
  updateOrder(updatedOrder:any) {

    
    if (updatedOrder.patient.isPatient == false) {
      if (this.currentOrderForEdit.patient.isPatient == false) {
        /*
         * If there was no-change in the patient then set the current batchList 
         * being edited to the updated batchList return by the Add Batch 
         * component
         */
        if (updatedOrder.batchList.length > 0) {
          this.getNonPatientOrders()[0].batchList = updatedOrder.batchList;
        } else {
          this.orderList = this.orderList.filter( order => order.patient.patientId != updatedOrder.patient.patientId );      
        }
        
      } else {
        /*
         * If order being edited was a Patient and the order return by the Add 
         * Batch component is a non-patient and there is alredy non-patient
         * orders then just append the updated batchList. 
         */
        var nonPatientOrders  = this.getNonPatientOrders();
        if (nonPatientOrders && nonPatientOrders.length > 0) {
          updatedOrder.batchList.forEach(
            order => {
              nonPatientOrders[0].batchList.push(order);
            }
          )          
        /*
         * If order being edited was a Patient and the order return by the Add 
         * Batch component is a non-patient and there is no non-patient orders 
         * then add the non-patient order. 
         */  
        } else {
          this.orderList.push(updatedOrder);
        }  
        /* Remove the order which was previously edited*/
        this.orderList = this.orderList.filter( order => order.patient.patientId != this.currentOrderForEdit.patient.patientId );      
      }      
    } else {
      /*
       * If there was no-change in the patient then set the current batchList 
       * being edited to the updated batchList return by the Add Batch component
       */
      if (this.currentOrderForEdit.patient.patientId == updatedOrder.patient.patientId) {
        if (updatedOrder.batchList.length > 0) {
          this.getPatientOrders(updatedOrder.patient.patientId)[0].batchList = updatedOrder.batchList;
        } else {
          this.orderList = this.orderList.filter( order => order.patient.patientId != updatedOrder.patient.patientId );
        }
      } else {        
        /*
         * If the order being edited was different patient than the patient of 
         * the order return by the Add Batch component and there is already 
         * batchlist for the patient that was return by the Add Batch component 
         * then just append the updated batchList. 
         */
        var orders = this.getPatientOrders(updatedOrder.patient.patientId);
        if (orders && orders.length > 0) {
          updatedOrder.batchList.forEach(
            order => {
              orders[0].batchList.push(order);
            }
          )    
        
        /*
         * If the order being edited was different patient than the patient of 
         * the order return by the Add Batch component and there is no batchlist
         * for the patient that was return by the Add Batch component then add 
         * the updated order. 
         */
        } else {
          this.orderList.push(updatedOrder);
        }
        /* Remove the order which was previously edited*/
        this.orderList = this.orderList.filter( order => order.patient.patientId != this.currentOrderForEdit.patient.patientId );
      }
    }    
  }

  /**
   * This method starts a new order by clering the order list and resetting the 
   * form.
   */
  startNewOrder() {
    
    // Clear the order list
    this.orderList = [];

    // Build the form
    this.newOrderForm = this.formBuilder.group({
                        'billTo'    : [{value : '',disabled: false},                     
                                       [Validators.required]],
                        'poNumber'  : [{value : '',disabled: false},                     
                                       [Validators.maxLength(31)]]            
    });
    this.newOrderForm.reset();

    /* Listen to any changes in the form constrols */
    this.newOrderForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();

    if (this.billToList && this.billToList.length == 1) {            
      this.selectedBillTo = this.billToList[0];
    }

  }

  /**
	 * This method will be called if any of the controls were modified and will 
   * add error messages in the form errors container.
	 * @param any 
	 */
	onValueChanged(data?: any) {
	
		if (!this.newOrderForm) { return; }

		const form = this.newOrderForm;

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
   * This method submit the orders. Before submitting the orders, the order 
   * request payload should be build first. Below is the heirarchy of the order 
   * request pay load:
   * 
   * ### Submit Order Request Payload:
   * ```
   * Order1
   * -> Patient
   *  -> Batches
   *   -> batch 1
   *   -> batch 2
   * Order2
   * -> Patient
   *  -> Batches
   *   -> batch 1
   *   -> batch 2
   * ```
   */
  onSubmitOrder() {

    /*
     * Only submit the order if the PO and Bill to are valid. 
     */
    if (this.newOrderForm.valid) {	
      
      this.eventBusService.broadcast(Constants.SHOW_LOADING);
      
      /*
       * Build the order request payload based on the order list. 
       */
      let orderRequestPayload = this.buildOrderRequestPayload();
      
      /*
       * Cancel any Submit Order request if there are any. 
       */
      if (this.createOrderServiceSubscription) {
        this.createOrderServiceSubscription.unsubscribe();
      }

      /*
       * Call the Submit Order API. 
       */
      this.createOrderServiceSubscription = this.createOrderService.submitOrder(this.customerKey,orderRequestPayload).subscribe(
        /* When successful */
        data => {

                  /* Prepare for next new order */
                  this.startNewOrder();

                  /* Hide the loding spinner */
                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
                  /* Alert the user of the successfull creation of the batch. */
                  this.alertService.success("Orders successfully submitted.",true,'newOrderAlertSuccess');   
                
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
                      var errorMessage:string = "We are sorry! One or more batches encountered error:";
                      error.error.errorMessages.forEach(
                        msg => {
                          errorMessage += "<li>" + msg + "</li>";
                        }
                      );
                      errorMessage += "</ul>";
                      this.alertService.error(errorMessage,'newOrderAlertError');
                    } else {
                      this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'newOrderAlertError');
                    }                    
                  } else {
                    this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'newOrderAlertError');
                  }
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
      Object.keys(this.newOrderForm.controls).forEach(key => {
        this.newOrderForm.get(key).markAsDirty();
        this.newOrderForm.get(key).markAsTouched();
      });
      this.onValueChanged();
    }
  }

  /**
   * This method build the Submit Order Request payload based on the order list. 
   */
  buildOrderRequestPayload(): SubmitOrderRequestPayload[] {
    
    var submitOrderRequestPayload : SubmitOrderRequestPayload[] = [];


    this.orderList.forEach(
      patientOrders => {
        patientOrders.batchList.forEach(
          batch => {

            /** Create batch request payload */
            var submitOrderPatientBatchRequestPayload = new SubmitOrderPatientBatchRequestPayload();
            submitOrderPatientBatchRequestPayload.batchId                 = batch.batchId;
            submitOrderPatientBatchRequestPayload.comments                = batch.comments;            
            submitOrderPatientBatchRequestPayload.productType             = batch.product.entryType;
            submitOrderPatientBatchRequestPayload.quantity                = batch.quantity;
            submitOrderPatientBatchRequestPayload.isDeliveryRunRestricted = !batch.deliveryDateTime.withinCutOff1Time;
            submitOrderPatientBatchRequestPayload.hasDeliveryRunIncentive = batch.deliveryDateTime.withinIncentiveCutoffTime;

            if (batch.product.entryType != Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {
              submitOrderPatientBatchRequestPayload.productDescription    = batch.product.genericDrugDescription;
              submitOrderPatientBatchRequestPayload.productDescription2   = batch.product.genericDrugDescription2;
              submitOrderPatientBatchRequestPayload.productDescription3   = batch.product.genericDrugDescription3;
              submitOrderPatientBatchRequestPayload.deliveryMechanismDescription = batch.deliveryMechanism.diluent.stockDescription + " in " + batch.deliveryMechanism.container.stockDescription;
              submitOrderPatientBatchRequestPayload.routeName             = batch.route.description;
              submitOrderPatientBatchRequestPayload.closedSystem          = batch.closedSystem;
              submitOrderPatientBatchRequestPayload.infusionDuration      = batch.infusionDuration;
            } else {

              submitOrderPatientBatchRequestPayload.productDescription    = batch.product.productDescription;
              /*
               * For product type which are "Formulation", the fields below are 
               * should be empty. 
               */              
              submitOrderPatientBatchRequestPayload.productDescription2   = "";
              submitOrderPatientBatchRequestPayload.productDescription3   = "";
              submitOrderPatientBatchRequestPayload.deliveryMechanismDescription = "";
              submitOrderPatientBatchRequestPayload.routeName             = "";
              submitOrderPatientBatchRequestPayload.closedSystem          = false;
              submitOrderPatientBatchRequestPayload.infusionDuration      = "";
            }
            /*
             * If the user didnt specify any treatment date then set it to null. 
             */
            if (!batch.treatmentDateTime || batch.treatmentDateTime == "") {
              submitOrderPatientBatchRequestPayload.treatmentDateTime = null;  
            } else {
              submitOrderPatientBatchRequestPayload.treatmentDateTime = Util.formatDateTime(batch.treatmentDateTime,"YYYY-MM-DD HH:mm:ss");
            }            

            /*
             * If the status is "New" then set it to "Submitted".
             */
            if (batch.status == Constants.BATCH_STATUS_NEW) {
              submitOrderPatientBatchRequestPayload.status = Constants.BATCH_STATUS_SUBMITTED;  
            } else {
              submitOrderPatientBatchRequestPayload.status = batch.status;
            }
            
            /*
             * Check if there is already an order for the Delivery Date / 
             * Delivery Location / Manufacturing site. The order should be 
             * unique per Delivery Date / Delivery Location / Manufacturing site
             * and all batches intended to this should be added in this order.
             */
            let deliveryDate = Util.formatDateTime(batch.deliveryDateTime.value,"YYYY-MM-DD HH:mm:ss");
            let deliveryLocation = batch.deliveryLocation.locationKey;
            let manufacturingSite = batch.product.targetSite;

            var orders = submitOrderRequestPayload.find(
              order => {
                return (order.ordDeliveryDate     == deliveryDate && 
                        order.ordDeliveryLocation == deliveryLocation && 
                        order.ordEntity           == manufacturingSite);
              }
            );

            /*
             * If the order is in the Order request payload already.
             */  
            if (orders) {

              /*
               * Check if the patient already exist for this  Delivery Date / 
               * Delivery Location Manufacturing site
               */
              var submitOrderPatientRequestPayload = orders.patients.find(
                patient => {
                  return patient.patientId == patientOrders.patient.patientId;
                }
              ); 

              /*
               * If the patient request payload already exist then add the batch 
               * to it. 
               */
              if (submitOrderPatientRequestPayload) {
                submitOrderPatientRequestPayload.batches.push(submitOrderPatientBatchRequestPayload);

              /*
               * Otherwise create the Patient request payload and add the batch 
               * to it. Then add the Patient request payload to the order 
               * request payload.
               */   
              } else {

                var submitOrderPatientRequestPayload = new SubmitOrderPatientRequestPayload();
                submitOrderPatientRequestPayload.patientFirstName = patientOrders.patient.firstName;
                submitOrderPatientRequestPayload.patientLastName = patientOrders.patient.surName;                
                submitOrderPatientRequestPayload.patientDob = Util.formatDateTime(patientOrders.patient.dob,"YYYY-MM-DD","DD-MMM-YYYY");
                submitOrderPatientRequestPayload.patientUr = patientOrders.patient.mrnNo;
                submitOrderPatientRequestPayload.patientId = patientOrders.patient.patientId;
                submitOrderPatientRequestPayload.batches = [submitOrderPatientBatchRequestPayload];

                orders.patients.push(submitOrderPatientRequestPayload);

              }
            
            /*
             * If there is no order yet then create one. Also create the Patient 
             * request payload.
             */
            } else {
              var orderRequestPayload = new SubmitOrderRequestPayload();

              /*
               * If the user didnt specify a PO Number then just pass empty 
               * string "". 
               */
              let poNumber =  this.newOrderForm.get("poNumber").value;
              if (!poNumber || poNumber == "") {
                orderRequestPayload.ordNo = "";
              } else {
                orderRequestPayload.ordNo               = poNumber;
              }
              
              orderRequestPayload.ordCusKey           = this.customerKey;
              orderRequestPayload.ordLastUpdAction    = Constants.INSERT_ACTION;
              orderRequestPayload.ordStatus           = "New";
              orderRequestPayload.ordSendDate         =  Util.formatDateTime(batch.deliveryDateTime.dispatchDateTimeValue,"YYYY-MM-DD HH:mm:ss");
              orderRequestPayload.ordDeliveryDate     =  Util.formatDateTime(batch.deliveryDateTime.value,"YYYY-MM-DD HH:mm:ss");
              orderRequestPayload.createdBy           = this.userService.getCurrentUser().userId;
              orderRequestPayload.ordDeliveryLocation = batch.deliveryLocation.locationKey;
              orderRequestPayload.ordDeliveryLocationName = batch.deliveryLocation.locationName;
              orderRequestPayload.ordBillTo           = this.newOrderForm.get("billTo").value.customerKey;
              orderRequestPayload.ordEntity           = batch.product.targetSite;

              var submitOrderPatientRequestPayload = new SubmitOrderPatientRequestPayload();
              submitOrderPatientRequestPayload.patientFirstName   = patientOrders.patient.firstName;
              submitOrderPatientRequestPayload.patientLastName    = patientOrders.patient.surName;              
              submitOrderPatientRequestPayload.patientDob         = Util.formatDateTime(patientOrders.patient.dob,"YYYY-MM-DD","DD-MMM-YYYY");
              submitOrderPatientRequestPayload.patientUr          = patientOrders.patient.mrnNo;
              submitOrderPatientRequestPayload.patientId          = patientOrders.patient.patientId;
              submitOrderPatientRequestPayload.batches            = [submitOrderPatientBatchRequestPayload];

              orderRequestPayload.patients = [submitOrderPatientRequestPayload];

              submitOrderRequestPayload.push(orderRequestPayload);
            }
          }
        );
      }
    );

    return submitOrderRequestPayload;
    
  }

  /**
   * Show the Add Batch component. 
   */
  showAddBatch() {    
    this.addBatchComponentMode = "ADD"
    this.visibility = "hidden";
    this.addBatchVisibility = "shown";
  }

  /**
   * Returns all orders from the order list for Non-Patient. This method is used 
   * for displaying all orders for Non-Patient.
   */
  getNonPatientOrders() {
    return this.orderList.filter( order => order.patient.isPatient == false );    
  }

  /**
   * Returns all orders from the order list for Patients. This method is used 
   * for displaying all orders for Patients.
   */
  getPatientsOrders() {
    return this.orderList.filter( order => order.patient.isPatient == true );    
  }

  /**
   * Returns all orders from the order list for a Patient.   
   */
  getPatientOrders(patientId:number) {
    return this.orderList.filter( order => order.patient.patientId == patientId );    
  }

  /**
   * When the user confirm the cancellation of the orders then show a message 
   * that it was cancelled and start a new order.
   */
  onConfirmCancelOrder() {
   
    this.alertService.success("Orders successfully cancelled.",true,"newOrderAlertSuccess");

    this.startNewOrder();
    
  }

  handleCancelOrders(event:any) {
    this.visibility = "shown";
    this.addBatchVisibility = "hidden";
  }

  /**
   * Clean-up.
   */
  ngOnDestroy(){
    if (this.createOrderServiceSubscription) {
      this.createOrderServiceSubscription.unsubscribe();
    }

    if(this.afterBatchesAddedToOrderSubscription) {
      this.afterBatchesAddedToOrderSubscription.unsubscribe();
    }

    if (this.afterBatchesUpdatedToOrderListSubscription) {
      this.afterBatchesUpdatedToOrderListSubscription.unsubscribe();
    }
  }

  /**
   * This method marked the Patient Order that is currently being deleted. This 
   * patient Id is then passed to Remove Orders component so that it knows what 
   * batches to display.
   * 
   * @param patientId 
   */
  deletePatientOrders(patientId:number) {    
    this.currentPatientIdForDelete = patientId;
  }

  /**
   * This method is used to determine if there are batches in the list of 
   * patient orders. Usefull for enabling/disabling the Submit and Cancel button.
   */
  hasBatchesInOrders(): boolean{
    var hasBatch:boolean=false;

    this.orderList.forEach(
      order => {
        if (order.batchList.length > 0) {
          hasBatch = true;
        } 
      }
    );

    return hasBatch;
  }

  /**
   * This methods marked the patient order being edited for later comparison and
   * at the same time set the mode of the Add Batch component to "EDIT". It also 
   * toggles the visibility of both New Order and Add Batch Component.
   * 
   * @param patientId 
   */
  editPatientOrders(patientId:number) {
    
    if (patientId == 0) {
      this.currentOrderForEdit = Object.assign({},this.getNonPatientOrders()[0]);
    } else {
      this.currentOrderForEdit = Object.assign({},this.getPatientOrders(patientId)[0]);
    }

    this.addBatchComponentMode = "EDIT"

    this.visibility = "hidden";
    this.addBatchVisibility = "shown";

  }

  
   /**
   * This method is used by select object to uniquely identify Billto.
   * 
   * @param customer1 
   * @param customer2 
   */
  compareBillTo(customer1:Customer,customer2:Customer) {
    return customer1 && customer2 ? customer1.customerKey === customer2.customerKey : customer1 === customer2;
  }

}
