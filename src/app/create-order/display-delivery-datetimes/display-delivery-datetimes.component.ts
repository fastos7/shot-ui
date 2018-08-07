import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { BatchCreationService } from '../batch-create.service';
import { Subscription } from 'rxjs/Subscription';
import { Product } from '../../common/model/product.model';
import { LogisticsService } from '../../common/services/logistics.service';
import { BatchOrder } from '../../common/model/batch-order.model';
import { DeliveryGroup } from '../../common/model/delivery-group.model';
import { DeliveryDateTime } from '../../common/model/delivery-datetime.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BatchProduct } from '../../common/model/batch-product.model';
import { Subject } from 'rxjs';
import { Batch } from '../../common/model/batch.model';
import { Observable } from 'rxjs/Observable';
import { DeliveryRunQuantity } from '../../common/model/logistics-req.model';

@Component({
  selector: 'app-display-delivery-datetimes',
  templateUrl: './display-delivery-datetimes.component.html',
  styleUrls: ['./display-delivery-datetimes.component.css']
})
export class DisplayDeliveryDateTimesComponent implements OnInit, OnDestroy {

  // Component Inputs
  @Input() customerKey: string;
  @Input() product: Product;
  @Input() quantity: number;
  @Input() deliveryRunQuantities: DeliveryRunQuantity[];
  //@Input() batchOrder: BatchOrder;

  // Form inputs
  @Input('form') form: FormGroup;
  @Input("name") DELIVERY_DT: string = 'deliveryDateTime';

  @Output("selectedDeliveryDateTime") selectedDeliveryDateTimeEvent = new EventEmitter();

  // Subscriptions
  private productQtySubscription: Subscription;

  // Other component data
  deliveryGroup: DeliveryGroup;
  deliveryDateTimes: DeliveryDateTime[];
  isLoading: boolean = false;
  isSpecialDeliveryRun: boolean = false;
  hasIncentive: boolean = false;

  private componentInitialized = new Subject<any>();
  private deliverDateTimesLoaded = new Subject<any>();

  // Constants
  //private SPECIAL_DELV_DT: string = '1900-01-01T00:00:00';
  private SPECIAL_DELV_DT: DeliveryDateTime = new DeliveryDateTime('', true, true);
  private DELIVERY_DT_ERROR: string = 'Delivery Date Time is required';

  constructor(private batchProductService: BatchCreationService,
    private logisticsService: LogisticsService) { }

  /**
   * Initialize component on loading
   */
  ngOnInit() {
    // If New Product flow: Product does not exist
    if (this.product) {
      this.loadDeliveryDateTimes(this.customerKey, this.product, this.quantity);
    }

    // Subscribe to Product changes
    this.productQtySubscription = this.subscribeToProductChanges();

    this.componentInitialized.next();
  }

  private subscribeToProductChanges() {
    return this.batchProductService.productQtyChanged().subscribe(
      (batchProduct: BatchProduct) => {
        //this.isSpecialDeliveryRun = false;
        if (batchProduct) {
          this.resetControl();
          this.product = batchProduct.product;
          this.quantity = batchProduct.quantity
          this.deliveryRunQuantities = batchProduct.deliveryRunQuantities;

          // Load/Refresh Delivery Date Times
          this.loadDeliveryDateTimes(this.customerKey, batchProduct.product, batchProduct.quantity);
        }
      }
    );
  }

  /**
   * Loads list of Delivery Date and Times 
   * based on the Batch Product and Quantity selected
   * @param batchOrder 
   */
  private loadDeliveryDateTimes(customerKey: string, product: Product, quantity: number) {
    this.resetFlags();
    if (product && quantity) {
      this.isLoading = true;
      this.logisticsService.getDeliveryDateTimes(this.customerKey, this.product, this.quantity, this.deliveryRunQuantities)
        .subscribe(
        (deliveryGroup: DeliveryGroup) => {
          this.deliveryGroup = deliveryGroup;
          this.deliveryDateTimes = new Array<DeliveryDateTime>();
          this.deliveryDateTimes.push(this.SPECIAL_DELV_DT);
          deliveryGroup.deliveryDateTimes.forEach(
            (deliveryDt: DeliveryDateTime) => {
              this.deliveryDateTimes.push(deliveryDt);
            }
          )
          this.isLoading = false;    
          
          /* Raise an event that the Deliver Date/Times have been loaded. */
          this.deliverDateTimesLoaded.next();      
        },
        error => {
          console.log(error.status);
        }
        );
    }
  }

  /**
   * Event method whenever a Delivery Date Time is selected from the list.
   * @param deliveryDateTime 
   */
  onDeliveryDateSelected() {
    let deliveryDateTime: DeliveryDateTime = this.form.get(this.DELIVERY_DT).value;
    this.resetFlags();
    if (deliveryDateTime.value === '') {
      this.isSpecialDeliveryRun = true;
    }
    if (deliveryDateTime.withinIncentiveCutoffTime) {
      this.hasIncentive = true;
    }
    //this.batchProductService.changedeliveryDtt(deliveryDateTime);
    this.selectedDeliveryDateTimeEvent.emit(deliveryDateTime);
  }

  validateDeliveryDateTime(): boolean {
    let ddtCtrl: FormControl = <FormControl>this.form.get(this.DELIVERY_DT);
    if (!ddtCtrl.valid && ddtCtrl.touched) {
      return false;
    }
    return true;
  }

  toDate(dateValue: string) {
    return new Date(dateValue);
  }

  /**
       * Perform steps when Component gets destroyed.
       */
  ngOnDestroy() {
    if (this.productQtySubscription) {
      this.productQtySubscription.unsubscribe();
    }
  }

  resetFlags() {
    this.isSpecialDeliveryRun = false;
    this.hasIncentive = false;
  }

  resetControl() {
    // Reset Delivery Date Time in form
    let ddtCtrl: FormControl = <FormControl>this.form.get(this.DELIVERY_DT);
    ddtCtrl.reset();
    this.form.patchValue({
      deliveryDateTime: null
    });
    this.deliveryGroup = null;
    this.deliveryDateTimes = null;
  }

  static buildFormControl(deliveryDateTime: DeliveryDateTime) {
    return new FormControl(deliveryDateTime, Validators.required)
  }

  compareDeliveryDateTime(deliveryDateTime1: DeliveryDateTime,deliveryDateTime2: DeliveryDateTime) {
    return deliveryDateTime1 && deliveryDateTime2 ? deliveryDateTime1.value === deliveryDateTime2.value : deliveryDateTime1 === deliveryDateTime2;
  }

  afterComponentInitialized() : Observable<any> {
    return this.componentInitialized.asObservable();
  }

  afterDeliverDateTimesLoaded() : Observable<any> {
    return this.deliverDateTimesLoaded.asObservable();
  }
}
