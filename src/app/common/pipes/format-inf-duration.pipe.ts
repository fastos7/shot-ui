import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatInfDuration'
})
export class FormatInfDurationPipe implements PipeTransform {

  transform(infDuration: string): string {
    let displayValue: string = '-';
    if (infDuration && infDuration !== '') {
      displayValue = infDuration + ' hours';
    }

    return displayValue;
  }
}
