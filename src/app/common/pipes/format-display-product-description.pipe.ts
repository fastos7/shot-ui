import { Pipe, PipeTransform } from '@angular/core';
import { DisplayBatch } from '../model/display-batch.model';

/**
 * This pipe is used to format the product description of a given batch. The 
 * product can be a generic or multi-drug and will also append the dose + unit 
 * of measure to each drugs.
 *
 * ### Example
 * ```
 * {{element | formatDisplayProductDescription}}
 * ```
 * @param exact string -
 * @return string - The description of the product(s)
 * 
 * @author Bhupinder Ubhi
 */
@Pipe({
  name: 'formatDisplayProductDescription'
})
export class FormatDisplayProductDescriptionPipe implements PipeTransform {

  transform(batch: DisplayBatch): string {

    let productDescription = '';

    if (batch) {
      if (batch.productDescription) {
        /*1st Product */
          productDescription = batch.productDescription + ' ' + (batch.doseUnit ? ( batch.dose + ' ' + batch.doseUnit) : "");

        /*2nd Product */
        if (batch.productDescription2) {
          productDescription += (productDescription === '' ? '' : ', <br>')
                                + batch.productDescription2 + ' ' + (batch.doseUnit2 ? (batch.dose2 + ' ' + batch.doseUnit2) : "");
        }

        /*3rd Product */
        if (batch.productDescription3) {
          productDescription += (productDescription === '' ? '' : ', <br>')
                                + batch.productDescription3 + ' ' + (batch.doseUnit3 ? (batch.dose3 + ' ' + batch.doseUnit3) : "" );
        }
      }
    }

    return productDescription;
  }

}
