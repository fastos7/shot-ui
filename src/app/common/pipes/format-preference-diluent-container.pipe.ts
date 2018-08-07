import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to display Diluent / Container in the form of <diluent> in 
 * <container> . This will handle if any of the values are null or empty.
 *
 * ### Example
 * ```
 * {{element | formatPreferenceDiluentContainer}}
 * 
 * ```
 * @param - customer preference JSON representation.
 * 
 * @author Marlon Cenita
 * 
 */
@Pipe({
  name: 'formatPreferenceDiluentContainer'
})
export class FormatPreferenceDiluentContainerPipe implements PipeTransform {

  transform(preference: any): string {
    
    if (!preference) return "-";

    if (!preference.deliveryMechanism) return "-";
    
    if (preference.deliveryMechanism.diluent) {
      if (preference.deliveryMechanism.container) {        
        return (preference.deliveryMechanism.diluent.stockDescription + " in " + preference.deliveryMechanism.container.stockDescription );        
      } else {
        return (preference.deliveryMechanism.diluent.stockDescription);        
      }
    } else {
      if (preference.deliveryMechanism.container) {
        return (preference.deliveryMechanism.container.stockDescription);        
      } else {
        return "-";        
      }
    }
  }

}
