import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to append `mL` to a string value . If the string value 
 * is empty or null it will just display hyphen "-".This is usually used to
 * display `volume` values.
 * 
 * ### Example
 * ```
 * {{element.volume | formatVolume}} 
 * ```
 * @param exact string - 
 * @return string - The string parameter appended with `mL` or hyphen `-`
 * 
 * @author Marlon Cenita
 */
@Pipe({
  name: 'formatVolume'
})
export class FormatVolumePipe implements PipeTransform {

  transform(volume: string,exact:string): string {
    var displayValue:string = "-";
    if (volume && volume != "") {
      displayValue = volume + " mL";
      if (exact && (exact === "t" || exact === "Y")) {
        displayValue = displayValue + ", Exact";
      }
    } 
    
    return displayValue;
  }

}
