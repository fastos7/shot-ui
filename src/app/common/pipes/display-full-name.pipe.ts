import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayFullName'
})
export class DisplayFullNamePipe implements PipeTransform {

  transform(surName: string, firstName: string): string {
    let displayValue: string = '';
    if (surName && surName !== '') {
      if (firstName && firstName !== '') {
        displayValue = surName + ', ' + firstName;
      } else {
        displayValue = surName;
      }
    } else {
      if (firstName && firstName !== '') {
        displayValue = firstName;
      }
    }
    return displayValue.toUpperCase();
  }
}
