import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayFreeStockPatient'
})
export class DisplayFreeStockPatientPipe implements PipeTransform {

  transform(fullName: string): string {
    let displayValue: string = '';
    if (fullName) {
      displayValue = fullName;
    } else {
      displayValue = "Pool";
    }
    return displayValue;
  }

}
