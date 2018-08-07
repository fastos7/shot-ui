import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ProductsService } from '../services/products.service';
import { Subscription, Subject } from 'rxjs';
import { Constants } from '../app.constants';
import { AdministrationRoute } from '../model/administration-route.model';
import { DeliveryMechanism } from '../model/delivery-mechanism.model';
import { FormGroup } from '@angular/forms';
import { UserAuthorities } from '../model/user-authorities.model';
import { Product } from '../model/product.model';
import { UserService } from '../services/user.service';
import { User } from '../model/user.model';
import { Observable } from 'rxjs/Observable';

/**
 * This component is used to display `Delivery Mechanism` , `Administration 
 * Routes` and a tickbox called `Remove Closed System`.
 * 
 * This component will automatically populate the Delivery Mechanisms and 
 * Administration Routes dropdown lists. The delivery mechanism will get the 
 * list of Delivery Mechanisms from the Product input. While the administration 
 * route will be retrieved from an API using the product/drug key of the input 
 * product.
 * 
 * To use this component you must:
 * * import SHOTCommonModule<p/>
 * * add the selector for this component
 * * bind an input parameter for showRemovedClosedSystem 
 * * bind an input parameter for product
 * * bind a function for selectedDeliveryMechanism event.
 * * bind a function for selectedAdministrationRoute event.
 * 
 * ### Example
 * ```
 * <app-product-attributes [form]="addEditCustomerPreferenceForm"
 *                         [formErrors]="formErrors"  
 *                         [showRemovedClosedSystem]="false"                                      
 *                         [product]="product"
 *                         (selectedDeliveryMechanism)="handleSelectedDeliveryMechanism($event)"
 *                         (selectedAdministrationRoute)="handleSelectedAdministrationRoute($event)">
 *</app-product-attributes>   
 * ```
 * 
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.css']
})
export class ProductAttributesComponent implements OnInit,OnChanges,OnDestroy {

  /**
   * This will show or hide the tickbox "Removed Closed System".
   */
  @Input() showRemovedClosedSystem:boolean;

  /**
   * This input parameter contains the Delivery Mechanisms and the drug key will 
   * be used to retrieve the Administration Routes.
   */
  @Input() product: Product;

  @Input('form') parentForm:FormGroup;

  @Input('formErrors') formErrors:any;
  
  @Output("selectedDeliveryMechanism") selectedDeliveryMechanismUpdated = new EventEmitter();
  @Output("selectedAdministrationRoute") selectedAdministrationRouteUpdated = new EventEmitter();
  
  private productAttributesSubscription:Subscription;
  private productAttributes:any;
  private selectedDeliveryMechanism:any;
  private selectedAdministrationRoute:any;

  private customerKey:string;

  private listInitialised = new Subject<any>();

  constructor(private productsService:ProductsService,
              private userService:UserService) { }

  ngOnInit() {
    this.selectedDeliveryMechanism = null;
    this.selectedAdministrationRoute = null;    
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];      
      
      /*
       * Retrive the list of Administration Routes if the product is changed.
       */
      if (propName === "product") {   
        if (this.product) {
          this.reloadProductAttributes();
        } else {
          this.productAttributes = null;
        }              
      }  

    }
  }

  /**
   * This method is used by select object to uniquely identify Delivery 
   * Mechanism.
   * 
   * @param diluentContainer1 
   * @param diluentContainer2 
   */
  compareDiluentContainer(diluentContainer1:DeliveryMechanism,diluentContainer2:DeliveryMechanism) {
    return diluentContainer1 && diluentContainer2 ? diluentContainer1.key === diluentContainer2.key : diluentContainer1 === diluentContainer2;
  }

  /**
   * This method is used by select object to uniquely identify Administration 
   * Route.
   * 
   * @param administrationRoute1 
   * @param administrationRoute2 
   */
  compareAdministrationRoute(administrationRoute1:AdministrationRoute,administrationRoute2:AdministrationRoute) {
    return administrationRoute1 && administrationRoute2 ? administrationRoute1.code === administrationRoute2.code : administrationRoute1 === administrationRoute2;
  }

  /**
   * Get the list of product attributes of the this product. As of now, the 
   * attributes only contains Administration Routes. 
   */
  reloadProductAttributes() {

    if (this.product) {
      if ((this.product.entryType === Constants.PRODUCT_ENTRY_TYPE_FORMULATION ||
           this.product.entryType === Constants.PRODUCT_ENTRY_TYPE_CNF_FORMULATION) == false) {

            if (!this.customerKey) {
              /* Get the currently selected customer site from local storage */
              let user: User = this.userService.getCurrentUser()
              this.customerKey = user.selectedUserAuthority.customerKey;
            }
          
            this.productAttributesSubscription = this.productsService.getProductAttributes(this.customerKey,this.product).subscribe(
              data => {
        
                this.productAttributes = data;   
                /*
                 * Inform the parent component that the list have been 
                 * initialized. 
                 */
                this.listInitialised.next();         
              },
              error => {
                // TODO : Show system error for errors other than 404
        
                /* No customer preferences for the selected product */
                if (error.status === 404) {
                  this.productAttributes = null;          
                }
                
              },
              () => {
                // Do nothing
                
              }
            );  
      } else {
        /* If the product is formulation then it does not have Administration 
         * Route 
         */ 
        this.productAttributes = null;    
      }      
    }    
  }

  ngOnDestroy(): void {
    if (this.productAttributesSubscription) {
      this.productAttributesSubscription.unsubscribe();
    }
  }

  /**
   * Inform the parent component that Delivery Mechanism has been selected.
   */
  onChangeDeliveryMechanism(deliveryMechanism:DeliveryMechanism) {    
    if (deliveryMechanism) {
      this.selectedDeliveryMechanismUpdated.emit(deliveryMechanism);
    }
  }

  /**
   * Inform the parent component that Administration Routes has been selected.
   */
  onChangeAdministrationRoute(administrationRoute:AdministrationRoute) {
    if (administrationRoute) {
      this.selectedAdministrationRouteUpdated.emit(administrationRoute);
    }
  }

  afterListinitialized() :Observable<any>  {
    return this.listInitialised.asObservable();
  }
}
