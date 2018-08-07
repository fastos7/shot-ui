import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to transform a string value from "t" to "Yes" and anything 
 * else to "No". This is usually used to display `exact` values.
 * 
 * ### Example
 * ```
 * {{element.exact | formatPreferenceExact}} 
 * ```
 * @param exact string - Values can be "t" or "f"
 * @return string - "Yes" or "No"
 * 
 * @author Marlon Cenita
 */
@Pipe({
  name: 'formatPreferenceExact'
})
export class FormatPreferenceExactPipe implements PipeTransform {

  transform(exact: string): any {
    var displayValue:string = "-";
    if (exact) {
      if (exact === "t")
        displayValue = "Yes";
      else 
        displayValue = "No";  
    } 
    return displayValue;
  }

}
