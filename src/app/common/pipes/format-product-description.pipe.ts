import { Pipe, PipeTransform } from '@angular/core';
import { Batch } from '../model/batch.model';
import { Constants } from '../app.constants';

/**
 * This pipe is used to format the product description of a given batch. The 
 * product can be a generic or multi-drug and will also append the dose + unit 
 * of measure to each drugs.
 * 
 * ### Example
 * ```
 * {{element | formatProductDescription}} 
 * ```
 * @param exact string - 
 * @return string - The description of the product(s)
 * 
 * @author Marlon Cenita
 */
@Pipe({
  name: 'formatProductDescription'
})
export class FormatProductDescriptionPipe implements PipeTransform {

  transform(batch: Batch): string {

    var productDescription = "";

    if (batch) {
      if (batch.product) {

        if (batch.product.entryType == Constants.PRODUCT_ENTRY_TYPE_FORMULATION) {
          productDescription = batch.product.productDescription;
        } else {
          /*1st Product */
          if (batch.product.batDrugKey) {
            productDescription = batch.product.genericDrugDescription + " " + batch.dose + " " + batch.product.unitOfMeasure;
          }        

          /*2nd Product */
          if (batch.product.batDrugKey2) {
            productDescription += (productDescription == "" ? "" : ", <br/>") + batch.product.genericDrugDescription2 + " " + batch.dose2 + " " + batch.product.unitOfMeasure2;
          }        

          /*3rd Product */
          if (batch.product.batDrugKey3) {
            productDescription += (productDescription == "" ? "" : ", <br/>") + batch.product.genericDrugDescription3 + " " + batch.dose3 + " " + batch.product.unitOfMeasure3;
          }        
        }        
      }
    }

    return productDescription;
  }

}
