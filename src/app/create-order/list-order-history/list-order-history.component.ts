import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Patient } from '../../common/model/patient.model';
import { Batch } from '../../common/model/batch.model';
import { CreateOrderService } from '../create-order-service';
import { MatTableDataSource } from '@angular/material';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ProductsService } from '../../common/services/products.service';
import { UserService } from '../../common/services/user.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { AlertService } from '../../core/services/alert.service';
import { Product } from '../../common/model/product.model';
import { DeliveryMechanism } from '../../common/model/delivery-mechanism.model';
import { Subscription } from 'rxjs/Subscription';
import { MaterialDataSource } from '../../common/material-datasource';

@Component({
  selector: 'app-list-order-history',
  templateUrl: './list-order-history.component.html',
  styleUrls: ['./list-order-history.component.scss']
})
export class ListOrderHistoryComponent extends MaterialDataSource implements OnInit,OnChanges,OnDestroy {

  @Input() customerKey: string;
  @Input() patient: Patient;

  /*
   * Output event to inform the  AddBatchComponent that user wants to re-order.
   */
  @Output("onReorder") onReorder = new EventEmitter();

  isLoading: boolean = false;

  batches: Batch[] = Array();

  private displayedColumns = ['date',
                              'productDetails',
                              'action'];

  private getProductsSubscription:Subscription;                              
  private getProductAttributesSubscription:Subscription;                              

  constructor(private createOrderService: CreateOrderService,
              private productsService:ProductsService,
              private eventBusService:EventBusService,
              private alertService:AlertService) { 
    super();            
  }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    if (this.getProductsSubscription) {
      this.getProductsSubscription.unsubscribe();
    }  

    if (this.getProductAttributesSubscription) {
      this.getProductAttributesSubscription.unsubscribe();
    }
  }

  /**
   * Load Patient/Non Patient Batch History
   */
  loadBatches() {

    /* Clear the batch first */
    this.batches = []; 

    this.isLoading = true;
    this.createOrderService.getOrderHistory(this.customerKey, this.patient)
      .subscribe(
      (batches: Batch[]) => {
        this.batches = batches;
        this.isLoading = false;
      }
      );
  }

  toDate(dateValue: string) {
    return new Date(dateValue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];      
      
      if (propName === "patient") {          
       this.loadBatches();
      }  
    } 
  }

  reOrderBatch(batchId:number) {
    
    this.eventBusService.broadcast(Constants.SHOW_LOADING);


    var batchForReorder = new Batch();

    /* Find the batch with the batchId parameter */
    let selectedBatchForReorder:any = this.batches.find(
      batch => {
        return batch.batchId == batchId;
      }
    );

    if (selectedBatchForReorder) {

      if (this.getProductsSubscription) {
        this.getProductsSubscription.unsubscribe();
      }
      /*
       * The product object in the selected batch for reorder just contains the 
       * name. The actual product object needs to be fetch from backend so that 
       * other attributes of the product will be present which is needed in the 
       * `DisplayBatchComponent`.
       */
      let productSearch = this.getProductDescription(selectedBatchForReorder);
      this.getProductsSubscription = this.productsService.getProducts(this.customerKey,selectedBatchForReorder.productDesc,productSearch[1]).subscribe(
        /* When successful */
        products => {

          if (!products || products.length <= 0) {                      
            this.alertService.error("We are sorry. We can't proceed with the reorder because the product does not exist anymore.",'orderHistoryAlert'); 
            this.eventBusService.broadcast(Constants.HIDE_LOADING);   
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
            this.alertService.error("We are sorry. We can't proceed with the reorder because the product does not exist anymore.",'orderHistoryAlert'); 
            this.eventBusService.broadcast(Constants.HIDE_LOADING);   
            return;
          }

          batchForReorder.product = product;

          /*
           * Get the delivery mechanism object from the product. For Formulation
           * products this is not required.
           */
          if (batchForReorder.product.entryType != Constants.PRODUCT_ENTRY_TYPE_FORMULATION &&
              product.deliveryMechanisms) {
            batchForReorder.deliveryMechanism = product.deliveryMechanisms.find(
              deliveryMechanism => {
                return deliveryMechanism.key == selectedBatchForReorder.deliveryMechanismKey; 
              }
            );
          } else {
            batchForReorder.deliveryMechanism = null;
          }
          

          /*
           * At this point, we can copy the attributes of the order history to 
           * the Order object we are going to pass to the DisplayBatchComponent. 
           */
          batchForReorder.batchId           = null;
          batchForReorder.dose              = selectedBatchForReorder.dose;
          batchForReorder.dose2             = selectedBatchForReorder.dose2;
          batchForReorder.dose3             = selectedBatchForReorder.dose3;
          batchForReorder.doseUnit          = selectedBatchForReorder.doseUnit;
          batchForReorder.doseUnit2         = selectedBatchForReorder.doseUnit2;
          batchForReorder.doseUnit3         = selectedBatchForReorder.doseUnit3;
          batchForReorder.closedSystem      = selectedBatchForReorder.closedSystem;
          batchForReorder.volume            = selectedBatchForReorder.volume;
          batchForReorder.infusionDuration  = selectedBatchForReorder.infusionDuration;
          batchForReorder.exact             = selectedBatchForReorder.exact == Constants.YES ? Constants.TRUE : Constants.FALSE;
          batchForReorder.quantity          = selectedBatchForReorder.quantity;
          batchForReorder.comments          = selectedBatchForReorder.comments;
          batchForReorder.status            = Constants.BATCH_STATUS_NEW;

          /* Set these fields to null because the user will provide new one. */
          batchForReorder.deliveryLocation  = null;
          batchForReorder.deliveryDateTime  = null;
          batchForReorder.treatmentDateTime = null;

          /***********************************************************************/

          /*
           * Find the administration route for this order history
           */
          if (batchForReorder.product.entryType != Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {
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
                      return administrationRoute.administrationRoute.code == selectedBatchForReorder.routeId;
                    }
                  );
  
                  if (route) {
                    batchForReorder.route = route.administrationRoute;
                  } else {
                    batchForReorder.route = null;
                  }
                } else {
                  batchForReorder.route = null;
                }
  
                /*
                 * At this point, we can pass the batch to the 
                 * DisplayBatchProductComponent. 
                 */
                this.onReorder.emit(batchForReorder);              
              },
              /*
               * When error occurs, we will allow the user to proceed and just 
               * set the Administration Route to null 
               */
              error => {
                batchForReorder.route = null;
                this.onReorder.emit(batchForReorder);              
              },
              () => {              
                this.eventBusService.broadcast(Constants.HIDE_LOADING);   
              }
            );
          } else {
            /*
             * At this point, we can pass the batch to the 
             * DisplayBatchProductComponent. 
             */
            this.onReorder.emit(batchForReorder);   
          }
          

          
        },
        /* When there is an error. */
        error => {

                  /* Show generic error message for any backend errors. */          
                  this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'orderHistoryAlert');              

                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
        },
        () => {
            // Do nothing           
            this.eventBusService.broadcast(Constants.HIDE_LOADING);              
        }  
      );
    }
  }

  getProductDescription(batch: any):[string,string] {
    var productDescription:string="";  
    var searchMode:string="AddProduct";  
    if (batch.productDesc) {
      productDescription = batch.productDesc;
      if (batch.productDesc2) {
        productDescription += " + " + batch.productDesc2;
        searchMode = "MultiDrug";
        if (batch.productDesc3) {
          productDescription += " + " + batch.productDesc3;
          searchMode = "MultiDrug";
        }
      }
    }
    return [productDescription,searchMode];
  }
}
