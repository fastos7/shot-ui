import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompleterCmp, CompleterData, CompleterItem, CompleterService, RemoteData } from 'ng2-completer';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../app.constants';
import { UserAuthorities } from '../model/user-authorities.model';
import { Product } from '../model/product.model';

/**
 * This component is used to search products if a given customer. Below are the 
 * requirements to use this component:
 * 
 * * import SHOTCommonModule
 * * add the selector for this component
 * * bind an input parameter for customerKey
 * * bind an input parameter for mode
 * * bind a function for selectedProductUpdated event.
 * 
 * ### Example
 * ```
 * <app-search-product [userAuthorities]="userAuthorities"
 *                     [mode]="'CustomerPreference'"
 *                     (selectedProduct)="handleSelectedProduct($event)">
 * </app-search-product>
 * ```
 * 
 * @author Marlon Cenita
 */
@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',  
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit,OnDestroy {
  
  /**
   * This input parameter will be used to search the products. Users of this 
   * component should provide this.
   */
  @Input() userAuthorities: UserAuthorities;

  /**
   * This input parameter will determine the results of the product search.
   * Possible values:
   * 1.) 'CustomerPreference' - Will include 'Standard','Clinical Trials',
   *                            'Formulation' and 'Customer Nominated 
   *                            formulation' products only.
   * 2.) any values           - Will include 'Standard','Consignment Trials',
   *                            'Clinical Trials','Formulation' and 'Customer 
   *                            Nominated formulation','Manual' and 'Multidrug' 
   *                            products.
   */
  @Input() mode:string;

  /**
   * This event will be fired to the component user whenever a product is 
   * selected. Therefore component user should bind a function for this event.
   * The event will pass <code>CustomerProduct</code> model.
   */
  @Output('selectedProduct') selectedProductUpdated = new EventEmitter();

  @Input('searchProductStr') searchProductStr?: string;

  @Input('productSearchId') productSearchId: string;
  
  private productSearch:string;
  private currentlySelectedProduct: Product;

  private isValid:boolean;
  /**
   * Used by <code>ng2-completer</code> to search data via API.
   */
  protected remoteDataService: RemoteData;

  constructor(private completerService: CompleterService) { }

  ngOnInit() {

      /**
       * Configure ng2-completer.
       */
      this.remoteDataService = this.completerService.remote(null,'productDescription','productDescription');      
      this.remoteDataService.urlFormater(term => {  
        
          let builder = new RestURLBuilder().buildRestURL(Constants.CUSTOMER_PRODUCT_SEARCH_API_URL);
          builder.setNamedParameter("customerKey",this.userAuthorities.customerKey)    
          builder.setQueryParameter("searchStr",term);      
          builder.setQueryParameter("resultSet",this.mode);      
          let uri = builder.get(); 

          return uri;
      });
      //--------------------------------------------------------------------------

      this.isValid = true;

  }

  /**
   * This function will be called whenever a product is selected by a user. It
   * will then emit an event to inform the component user that a product has
   * been selected.
   * 
   * @param selected The selected item in the result list.
   */
  onProductSelected(selected: CompleterItem) {     
    if (selected) {
      if (selected.originalObject != '') {
          this.currentlySelectedProduct = <Product>selected.originalObject;
          this.selectedProductUpdated.emit(this.currentlySelectedProduct);  
          this.isValid = true;        
      } else {
          this.selectedProductUpdated.emit(null);     
      }
    }
  }

  ngOnDestroy(): void {
    if(this.remoteDataService) {
      this.remoteDataService.unsubscribe();
    }
  }

  clearInput() {
    this.searchProductStr = "";
    this.isValid = true;
  }

  setInvalid() {
    this.isValid = false;
  }
}
