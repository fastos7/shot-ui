import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BatchCreationService } from '../batch-create.service';
import { Subscription } from 'rxjs/Subscription';
import { Product } from '../../common/model/product.model';
import { LogisticsService } from '../../common/services/logistics.service';
import { BatchOrder } from '../../common/model/batch-order.model';
import { DeliveryGroup } from '../../common/model/delivery-group.model';
import { DeliveryDateTime } from '../../common/model/delivery-datetime.model';
import { DeliveryLocation } from '../../common/model/delivery-location.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-display-delivery-locations',
  templateUrl: './display-delivery-locations.component.html',
  styleUrls: ['./display-delivery-locations.component.css']
})
export class DisplayDeliveryLocationsComponent implements OnInit, OnDestroy {

  // Component Inputs
  @Input() customerKey: string;

  // Form inputs
  @Input('form') form: FormGroup;
  @Input("name") DELIVERY_LOC: string = 'deliveryLocation';

  // Other component data
  deliveryLocations: DeliveryLocation[] = new Array<DeliveryLocation>();
  //selectedDeliveryLocation: DeliveryLocation;

  // Constants
  private DELIVERY_DV_LOC_ERROR: string = 'Delivery Location is required';

  constructor(private batchProductService: BatchCreationService,
    private logisticsService: LogisticsService) { }

  /**
   * Initialize component on loading
   */
  ngOnInit() {
    // Load Delivery Locations
    this.loadDeliveryLocations(this.customerKey);
  }

  private loadDeliveryLocations(customrKey: string) {
    this.logisticsService.getDeliveryLocations(this.customerKey)
      .subscribe(
        (items : any) => {
          this.deliveryLocations = items.map(
            (item) => {
              return new DeliveryLocation(item.locationKey, item.locationName);
            }
          );
          //this.deliveryLocations =  new DeliveryLocation(item.locationKey, item.locationName);
      }  
      // (locations: DeliveryLocation[]) => {
      //   this.deliveryLocations = locations;
      // }
      );
  }

  validateDeliveryLocation(): boolean {
    let dvLocCtrl: FormControl = <FormControl>this.form.get(this.DELIVERY_LOC);
    if (!dvLocCtrl.valid && dvLocCtrl.touched) {
      return false;
    }
    return true;
  }

  /**
   * Event method whenever a Delivery Location is selected from the list.
   * @param deliveryLoc
   */
  // onDeliveryLocationSelected(deliveryLoc: DeliveryLocation) {
  //   this.batchProductService.changeDeliveryLocation(deliveryLoc);
  // }

  /**
   * Perform steps when Component gets destroyed.
   */
  ngOnDestroy() {

  }

  static buildFormControl(deliveryLocation: DeliveryLocation) {
    return new FormControl(deliveryLocation, Validators.required)
  }

  compareDeliveryLocation(deliveryLocation1: DeliveryLocation,deliveryLocation2: DeliveryLocation) {
    return deliveryLocation1 && deliveryLocation2 ? deliveryLocation1.locationKey === deliveryLocation2.locationKey : deliveryLocation1 === deliveryLocation2;
  }
}
