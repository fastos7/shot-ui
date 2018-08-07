import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to display the `Administration Route` of the a batch if 
 * there is any.
 *
 * ### Example
 * ```
 * {{element | formatRoute}}
 * ```
 * @param exact string -
 * @return string - The description of the `Administration Route` if there is 
 *                  any.
 * 
 * @author Marlon Cenita
 */
@Pipe({
  name: 'formatRoute'
})
export class FormatRoutePipe implements PipeTransform {

  transform(batch: any): string {
    
    if (batch) {
      if (batch.route) {
        if (batch.route.description) {
          return batch.route.description;
        }
      }
    }
    return "-";
  }
}
