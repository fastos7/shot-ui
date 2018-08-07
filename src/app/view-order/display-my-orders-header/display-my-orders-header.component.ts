import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Constants } from '../../common/app.constants';



@Component({
  selector: 'app-display-my-orders-header',
  templateUrl: './display-my-orders-header.component.html',
  styleUrls: ['./display-my-orders-header.component.css'],
})

export class DisplayMyOrdersHeaderComponent implements OnInit, OnChanges {

  @Input() dayOrWeek: string;
  @Input() deliveryOrTreatment: string;
  @Input() startDate: Date;
  @Input() startDateForWeekView: Date;

  nextDate: Date;
  previousDate: Date;
  endDateForWeekView: Date;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  isPrev: boolean = true;
  isNext: boolean = true;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setupHeader();
  }

  dateChanged() {
    let datePipe : DatePipe = new DatePipe('en_AU');
    let startDateToPass: string = datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.router.navigate(['my-orders', this.dayOrWeek, this.deliveryOrTreatment, startDateToPass]);
  }

  setupHeader() {
    let dayDiff: number = 1;
    let displayStartDate = new Date(this.startDate);
    if ( this.dayOrWeek === 'week' ) {
      dayDiff = 7;
      displayStartDate = new Date(this.startDateForWeekView);
      this.nextDate = new Date(displayStartDate);
      this.previousDate = new Date(displayStartDate);
      this.nextDate.setDate(this.nextDate.getDate() + dayDiff);
      this.previousDate.setDate(this.previousDate.getDate() - dayDiff);
      this.endDateForWeekView = new Date(this.startDateForWeekView);
      this.endDateForWeekView.setDate(this.endDateForWeekView.getDate() + (dayDiff - 1));
    } else {
      this.nextDate = new Date(displayStartDate);
      this.previousDate = new Date(displayStartDate);
      this.nextDate.setDate(this.nextDate.getDate() + dayDiff);
      this.previousDate.setDate(this.previousDate.getDate() - dayDiff);
    }

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setHours(0, 0, 0, 0);
    this.nextDate.setHours(0, 0, 0, 0);
    this.previousDate.setHours(0, 0, 0, 0);
    this.minDate.setDate(this.minDate.getDate() - Constants.DATE_RANGE_CONSTANT);
    this.maxDate.setDate(this.maxDate.getDate() + Constants.DATE_RANGE_CONSTANT);

    if (this.nextDate > this.maxDate) {
      this.isNext = false;
    } else {
      this.isNext = true;
    }
    if (this.previousDate < this.minDate) {
      this.isPrev = false;
    } else {
      this.isPrev = true;
    }
  }

  onPrint() {
    window.print();
  }
}
