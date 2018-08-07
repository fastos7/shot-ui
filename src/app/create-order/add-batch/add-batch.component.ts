import { Component, Input, OnDestroy, OnInit, EventEmitter, Output ,ViewChild, HostListener, SimpleChanges, ElementRef } from '@angular/core';
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
import { Patient } from '../../common/model/patient.model';
import { UserService } from '../../common/services/user.service';
import { MatTableDataSource } from '@angular/material';
import { Batch } from '../../common/model/batch.model';
import { DeliveryMechanism } from '../../common/model/delivery-mechanism.model';
import { Diluent } from '../../common/model/diluent.model';
import { Container } from '../../common/model/container.model';
import { AdministrationRoute } from '../../common/model/administration-route.model';
import { DisplayBatchProductComponent } from '../display-batch-product/display-batch-product.component';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddBatchPatientComponent } from '../add-batch-patient/add-batch-patient.component';
import { Constants } from '../../common/app.constants';
import { Customer } from '../../common/model/customer.model';
import { ComponentCanDeactivate } from '../../common/guards/pending-changes.guard';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { EventBusService } from '../../common/services/event-bus.service';
import { MaterialDataSource } from '../../common/material-datasource';

/**
 * This page is used to display and maintain newly added batches for a patient
 * or a non-patient.This page can be `ADD` or `EDIT` mode. 
 * 
 * In ADD mode, batches are not yet added to the `Order`. Use can still edit the 
 * batches or remove them at will. Batches will be added to the Order when the 
 * user clicks on the `ADD TO ORDER` button.
 * 
 * On the other hand, `EDIT` mode is when a user chose batches for a patient in 
 * the New Order screen and clicks on `EDIT` icon. Use can make any changes on 
 * the batches. User can delete a batch or add more batches. Any changes will only
 * be reflected in the New Order sceen once the user clicks `SAVE CHANGES` button.
 * 
 * This component also contains the Order History of the patient currently selected
 * which the user can use to re-order a batch.
 * 
 * @author Osama Shakeel
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-add-batch',
  templateUrl: './add-batch.component.html',
  styleUrls: ['./add-batch.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown',  style({   })),
      state('hidden', style({ marginLeft:'50px' })),
      transition('shown => hidden', [
        animate('0.4s 0.1s ease-in', style({transform: 'translateX(100%)'}))
      ]),      
      transition('hidden => shown', [
        animate('0.4s 0.1s ease-in', style({transform: 'translateX(-100%)'}))
      ]),
      transition('void => shown', animate('0s'))
  ])
]
})
export class AddBatchComponent extends MaterialDataSource implements OnInit,OnDestroy,OnChanges {

  /* The PO Number from the New Order page */
  @Input("poNumber") poNumber:string;

  /* The Bill To from the New Order page */
  @Input("billTo") billTo:Customer;

  /* This flag controls whether this component can be shown or not.*/
  @Input("visibility") visibility:string;

  /* This is a copy of the order list from the `New Order` screen. */
  @Input() orderList:Array<{patient:Patient,batchList:Array<Batch>}>;

  /* 
   * This controls the mode of this component. Possible values are `ADD` or 
   * `EDIT`.
   */
  @Input("mode") mode:string;

  /* This contains the Order currently being edited. */
  @Input("orderForEdit") orderForEdit:any;

  /* Output event to inform the  New Order that the order is cancelled.*/
  @Output("onCancel") onCancelOrders = new EventEmitter();

  /* References to the child components */
  @ViewChild("app_display_batch_product") displayBatchProductComponent:DisplayBatchProductComponent;
  @ViewChild("add_batch_patient") addBatchPatientComponent:AddBatchPatientComponent;
  @ViewChild("add_a_product") addAProductBtn:ElementRef;
  @ViewChild("add_another_product") addAnotherProductBtn:ElementRef;

  customerKey: string;

  private title:string;
  private submitButtonTitle:string;
  private message:string;

  /* The currently selected patient. This can also be a Non-Patient.*/
  patient: Patient;

  private currentlySelectedBatchIdForDelete:number;

  private tempDeletedBatchesList:Array<number> = [];

  private displayedColumns = ['productName',                              
                              'deliveryMechanism',
                              'volume',                             
                              'route',                              
                              'quantity',
                              'deliverTo',
                              'deliverAt',
                              'status',
                              'comments',
                              'actions' ];

  private displayedColumnsForDeleteConfirmation = 
                             ['productNameForDelete',                              
                              'deliveryMechanismForDelete',
                              'volumeForDelete',                              
                              'routeForDelete',                              
                              'quantityForDelete',
                              'deliverToForDelete',
                              'deliverAtForDelete'];                              

  /*
   * This array contains the list of batches for this patient. 
   */                                 
  private batchList:Array<Batch> = [];
  
  /*
   * This will determine whether the DisplayBatchProductComponent is in "EDIT" 
   * or "ADD" mode. 
   */
  private displayBatchProductMode:string;

  private afterBatchAddedSubscription: Subscription;
  private afterBatchUpdatedSubscription: Subscription;

  /*
   * Subject for any new Batch added. Parent component should subscribe to this 
   * Subject to listen for any new batch added. 
   */
  private addBatchesToOrderSubject   = new Subject<any>();

  /*
   * Subject for any Batch updated. Parent component should subscribe to this 
   * Subject to listen for any new batch updated. 
   */
  private updateBatchesToOrderSubject = new Subject<any>();

  constructor(
    private batchCreationService: BatchCreationService,
    private productService: ProductService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private eventBusService: EventBusService) { 
      super();
    }

  ngOnInit() {
    
    /* Get the current site */
    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
  
    /* Initially set the editing mode of the Display Batch component to "ADD" */
    this.displayBatchProductMode = "ADD";

    /*
     * Listen for any newly batch added and add it to the batch list of this
     * Patient. 
     */
    this.afterBatchUpdatedSubscription = this.displayBatchProductComponent.afterBatchAdded().subscribe(
      batch => {        
        this.batchList.push(batch);
      }
    );

    /*
     * Listen for any newly batch updated.
     */
    this.afterBatchAddedSubscription = this.displayBatchProductComponent.afterBatchUpdated().subscribe(
      oldAndNewBatch => {                
        this.onBatchUpdated(oldAndNewBatch.oldBatch,oldAndNewBatch.newBatch);
      }
    );

  }

  getBatchList(): any[]{
    return this.batchList;
  }

  /**
   * This method replaces the old batch with  the new updated one.
   * 
   * @param oldBatch 
   * @param newBatch 
   */
  onBatchUpdated(oldBatch,newBatch) {
    /*
     * Find the index of the batch that was updated. 
     */
    var index = this.batchList.findIndex(
      batch => batch.batchId == oldBatch.batchId
    );

    /*
     * Replace the old batch with the new updated one. 
     */
    this.batchList[index] = newBatch;

  }

  /**
   * Do clean up after this component is destroyed.
   */
  ngOnDestroy() {
    if (this.afterBatchAddedSubscription) {
      this.afterBatchAddedSubscription.unsubscribe();
    }

    if (this.afterBatchUpdatedSubscription) {
      this.afterBatchUpdatedSubscription.unsubscribe();
    }
  }

  onPatientSelected(patient: Patient) {
    this.patient = patient;
  }

  onDisplayBatchProduct() {
    this.displayBatchProductMode = "ADD";
  }

  /**
   * Inform New Order component that batches for this patient needs to be added 
   * or updated. Also clear the list.
   */
  onAddtoOrder() {

    if (this.mode === "ADD") {
      this.addBatchesToOrderSubject.next({"patient":Object.assign({},this.patient),"batchList":this.batchList});  
    } else {
      this.updateBatchesToOrderSubject.next({"patient":Object.assign({},this.patient),"batchList":this.batchList});  
    }
    
    this.patient = null;
    this.batchList = [];
    this.tempDeletedBatchesList = [];
    this.addBatchPatientComponent.clear();
  }
  
  /**
   * Inform the parent component that the batches have been cancelled.
   */
  onConfirmCancelOrders() {
    this.onCancelOrders.emit(null);

    this.patient = null;
    this.batchList = [];
    this.addBatchPatientComponent.clear();
  }

  /**
   * Inform the parent component that the user wants to go back to the previous 
   * page discarding any work in progress.
   */
  onGoBack() {
    this.onCancelOrders.emit(null);
    this.patient = null;
    this.batchList = [];
    this.addBatchPatientComponent.clear();
  }

  /**
   * Returns observable which could be subscribed by the parent component to be 
   * inform of newly added batch.
   */
  afterBatchesAddedToOrder() : Observable<Batch> {
    return this.addBatchesToOrderSubject.asObservable();
  }

  /**
   * Returns observable which could be subscribed by the parent component to be 
   * inform of newly added batch.
   */
  afterBatchesUpdatedToOrderList() : Observable<Batch> {
    return this.updateBatchesToOrderSubject.asObservable();
  }

  /**
   * Called whenever a batch is being edited.
   * 
   * @param batchId 
   */
  editBatch(batchId:number) {
    this.displayBatchProductMode = "EDIT";

    let selectedBatch = this.batchList.find(
      batch => {
        return batch.batchId == batchId;
      }
    );

    this.displayBatchProductComponent.prepareEditBatch(selectedBatch);
  }

  handleReorder(batchForReorder:Batch) {
    
    this.displayBatchProductComponent.prepareBatchForReorder(batchForReorder);

    if (this.addAProductBtn) {
      this.addAProductBtn.nativeElement.click();
    } else {
      this.addAnotherProductBtn.nativeElement.click();
    }
    
    this.eventBusService.broadcast(Constants.HIDE_LOADING);   
  }

  /**
   * Toggles the status of a particular batch. If the batch status is "New" it 
   * will be change to "On Hold". Otherwise it will be change to "New".
   * 
   * @param batchId 
   */
  toggleStatus(batchId:number) {
    
    let selectedBatch = this.batchList.find(
      batch => {
        return batch.batchId == batchId;
      }
    );

    if (selectedBatch) {
      if (selectedBatch.status == Constants.BATCH_STATUS_NEW) {
        selectedBatch.status = Constants.BATCH_STATUS_ON_HOLD;
      } else {
        selectedBatch.status = Constants.BATCH_STATUS_NEW;
      }
    }
  }

  /**
   * Once user confirm to delete a batch, filter it from the batch list and pass 
   * a new array of batches to the batch list.
   */
  onConfirmDeleteBatch() {
    if (this.currentlySelectedBatchIdForDelete) {
      /*
       * Store the batch id in a temp array list. 
       */
      this.tempDeletedBatchesList.push(Number(this.currentlySelectedBatchIdForDelete));

      this.batchList = this.batchList.filter(batch => batch.batchId != this.currentlySelectedBatchIdForDelete);
    }
  }

  /**
   * Retrieve a batch based on the batchId paramter from the batch list.
   * 
   * @param batchId 
   */
  getBatchFromList(batchId:number) : Batch[] {
    if (batchId) {
      let selectedBatch = this.batchList.find( batch => batch.batchId == batchId);
      if (selectedBatch) {
        return [selectedBatch];
      }
    }
    return null;
  }

   /**
   * Change the display texts based on the mode.
   */
  modeChange() {
    if (this.mode === "ADD") {
      this.title = "Add Products to Order";
      this.submitButtonTitle = "ADD TO ORDER";
      this.message = "Please enter a patient name to start ordering.<br>Alternatively you can start an order without a patient name and also add a new patient into our system.";
    } else {
      this.title = "Edit Products of an Order";
      this.submitButtonTitle = "SAVE CHANGES";
      this.message = "You can change the patient or edit the orders for this patient or add new products.";
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

      if (propName === "orderForEdit") {        
        if (this.orderForEdit && this.orderForEdit.patient) {
          if (this.orderForEdit.patient.isPatient == true) {
            this.addBatchPatientComponent.onPatientSelected( Object.assign({},this.orderForEdit.patient));
          } else {
            this.addBatchPatientComponent.onNoPatient();
          }          
          this.batchList =  Object.assign([],this.orderForEdit.batchList);
        }        
      }
      
    }  
  }
}  
