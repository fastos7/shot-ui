import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to display dose range in the form of <doseFrom>-<doseTo> 
 * <unitOfMeasure>. This will handle if any of the values are null or empty.
 *
 * ### Example
 * ```
 * {{element | formatPreferenceDoseRange}}
 * 
 * ```
 * @param - customer preference JSON representation.
 * 
 * @author Marlon Cenita
 */
@Pipe({
  name: 'formatPreferenceDoseRange'
})
export class FormatPreferenceDoseRangePipe implements PipeTransform {

  transform(preference: any): string {
    
    if (!preference) return "-";

    if (preference.doseFrom) {
      if (preference.doseTo) {        
        return (preference.doseFrom + "-" + preference.doseTo + " " + ((preference.unitOfMeasure) ? preference.unitOfMeasure : ""));        
      } else {
        return (preference.doseFrom + " " + ((preference.unitOfMeasure) ? preference.unitOfMeasure : ""));        
      }
    } else {
      if (preference.doseTo) {
        return (preference.doseTo + " " + ((preference.unitOfMeasure) ? preference.unitOfMeasure : ""));        
      } else {
        return "-";        
      }
    }
  }

}
