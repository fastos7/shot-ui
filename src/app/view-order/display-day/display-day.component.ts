import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-day',
  templateUrl: './display-day.component.html',
  styleUrls: ['./display-day.component.css']
})
export class DisplayDayComponent implements OnInit {

  @Input() dayData: any[] = [];
  @Input() dayOrWeek: string;
  @Input() deliveryOrTreatment: string;

  constructor() { }

  ngOnInit() {
  }

}
