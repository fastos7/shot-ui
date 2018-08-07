import { Pipe, PipeTransform } from '@angular/core';
import { BatchHistoryModel } from '../model/batch-history.model';

/**
 * This pipe is used to construct the full name of the user. If the user is an
 * Axis user then it will just display "Slade Health" otherwise it will display
 * the full name.
 *
 * ### Example
 * ```
 * {{element | displayBatchModifiedByUser}}
 * ```
 * @param exact string -
 * @return string - The full name of the user or the system.
 * 
 * @author Marlon Cenita
 */
@Pipe({
  name: 'displayBatchModifiedByUser'
})
export class DisplayBatchModifiedByUserPipe implements PipeTransform {

  transform(batchHistory:BatchHistoryModel): any {
    
    if (batchHistory && batchHistory.batLastUpdBySystem) {
      if (batchHistory.batLastUpdBySystem == "Slade Health") {
        return batchHistory.batLastUpdBySystem;
      } else {
        var fullName = "";
        fullName += batchHistory.batLastUpdByFirstName ?  batchHistory.batLastUpdByFirstName : "";
        fullName += batchHistory.batLastUpdByLastName ? (" " + batchHistory.batLastUpdByLastName) : "";
        return fullName;
      }
    }

    return "-";

  }

}
