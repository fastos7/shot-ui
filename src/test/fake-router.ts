import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';


@Injectable()
export class FakeRouter {
  //navigate(commands: any[], extras?: NavigationExtras) { }

  navigateByUrl(url: string) { return url; }  
}
