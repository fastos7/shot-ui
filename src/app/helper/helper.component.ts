import { Component, OnInit } from '@angular/core';
import { HelperService } from './helper.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html'
})
export class HelperComponent implements OnInit {

  newDateTime = 'MMddhhmm[[yy]yy]';

  constructor(private _helperService: HelperService) { }

  ngOnInit() {
  }

  changeDateTime() {
    console.log(this.newDateTime);
    this._helperService.changeDateTime(this.newDateTime);
  }

}
