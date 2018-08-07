import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-days',
  templateUrl: './list-days.component.html',
  styleUrls: ['./list-days.component.css']
})
export class ListDaysComponent implements OnInit {

  @Input() dayOrWeek: string;
  @Input() daysArray: any[] = [];
  @Input() deliveryOrTreatment: string;

  constructor() { }

  ngOnInit() {
  }

}
