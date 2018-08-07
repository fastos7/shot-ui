import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ViewOrderService } from '../../common/services/view-order.service';
import { User } from '../../common/model/user.model';
import { UserService } from '../../common/services/user.service';
import { Constants } from '../../common/app.constants';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { BatchService } from '../../common/services/batch.service';
import { Util } from '../../common/util';

@Component({
  selector: 'app-display-my-orders',
  templateUrl: './display-my-orders.component.html',
  styleUrls: ['./display-my-orders.component.css']
})
export class DisplayMyOrdersComponent implements OnInit, OnChanges {

  @Input() dayOrWeek: string = 'day';
  @Input() deliveryOrTreatment: string = 'delivery';
  @Input() startDate: Date = new Date(2017, 8, 27);

  startDateForWeekView: Date;

  weekArray: string[] = [];

  customerKey: string;
  sub: any;
  displayMessage: string = Constants.GENERIC_RETRIEVING_RESULTS_MESSAGE;
  hero$: any;
  isError: boolean = false;

  daysArray: any[] = [];

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private viewOrderService: ViewOrderService,
    private alertService: AlertService,
    private eventBusService: EventBusService,
    private batchService:BatchService) { }

  setStartDateToMondayForWeekView() {
    const day = this.startDateForWeekView.getDay() || 7;
    if ( day !== 1 ) {
      this.startDateForWeekView.setHours(-24 * (day - 1));
    }
  }

  populateWeekArray() {
    let startDateForWeekArray: Date = new Date(this.startDateForWeekView);
    for (let i = 0; i < 7; i++) {
      let thisDay: string = startDateForWeekArray.getDate() < 10 ? '0' + startDateForWeekArray.getDate() : '' + startDateForWeekArray.getDate();
      let thisMonth: string = startDateForWeekArray.getMonth() < 9 ?  '0' + (startDateForWeekArray.getMonth()+1) : '' + (startDateForWeekArray.getMonth()+1);
      let thisYear: string = '' + startDateForWeekArray.getFullYear();
      this.weekArray[i] = thisYear + '-' + thisMonth + '-' + thisDay;
      startDateForWeekArray.setDate(startDateForWeekArray.getDate() + 1);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.refreshView(params);
      }
    );
    
    /* Register Event Listener */
    this.eventBusService.on(Constants.REFRESH_MYORDER_VIEW_EVENT,() => {
     
      let startDateString = this.startDate.getFullYear() + '-'
                          + (this.startDate.getMonth() + 1) + '-'
                          + this.startDate.getDate();

			var params = { params : {
                                dayOrWeek : this.dayOrWeek,
                                deliveryOrTreatment : this.deliveryOrTreatment,
                                startDate : startDateString}
                   };
                    
      this.refreshView(params);                     
		});
  }

  refreshView(params) {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.dayOrWeek = params['params']['dayOrWeek'];
    this.deliveryOrTreatment = params['params']['deliveryOrTreatment'];
    let startDateString = params['params']['startDate'];
    this.startDate = new Date(params['params']['startDate']); //date passed in yyyy-mm-dd
    this.startDateForWeekView = new Date(params['params']['startDate']);
    this.setStartDateToMondayForWeekView();
    this.populateWeekArray();
    if (this.dayOrWeek === 'week') {
      startDateString = this.startDateForWeekView.getFullYear() + '-'
                        + (this.startDateForWeekView.getMonth() + 1) + '-'
                        + this.startDateForWeekView.getDate();
    }
    const user: User = this.userService.getCurrentUser();
    this.customerKey = user.selectedUserAuthority.customerKey;
    this.viewOrderService.getOrders(this.customerKey, startDateString, this.dayOrWeek, this.deliveryOrTreatment + 'Time').subscribe(
      data => {
        this.daysArray = this.getDaysHeirarchicalJSON(data);
        if (this.daysArray === null || this.daysArray.length === 0) {
          this.displayMessage = Constants.MY_ORDERS_NO_ORDERS_FOUND;
          this.isError = false;
        }
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      },
      error => {
        this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'viewOrderErrorAlert');
        this.isError = true;
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      });
  }

  ngOnChanges() {
  }

  sortedPatientList( patientList: any[]) {
    if (patientList.length === 1) {
      return patientList;
    } else {
      for (let i = 0 ; i < patientList.length; i++) {
        if (patientList[i].label === '-1') {
          let noPatientRecords : any = new Object();
          Object.assign(noPatientRecords, patientList[i]);
          patientList.splice(i, 1);
          patientList.unshift(noPatientRecords);
          return patientList;
        }
    }
    return patientList;
  }
}

sortPatients( patient1: any, patient2: any) {
  if (patient1.value[0].patientLastName < patient2.value[0].patientLastName) {
    return -1;
  } else {
    if (patient1.value[0].patientLastName > patient2.value[0].patientLastName) {
      return 1;
    } else {
      if (patient1.value[0].patientFirstName < patient2.value[0].patientFirstName) {
        return -1;
      } else {
        if (patient1.value[0].patientFirstName > patient2.value[0].patientFirstName) {
          return 1;
        } else {
          return -1;
        }
      }
    }
  }
}

getDaysHeirarchicalJSON(list: any[]) {

    for (let i = 0; i < list.length; i++) {
      if(list[i].patientId === null) {
        list[i].patientId = '-1';
      }
    }

    let groupArray = require('group-array');
    let grouped: any;
    // group by the `tag` property
    if(this.deliveryOrTreatment == 'delivery')
    {
      grouped= groupArray(list, 'deliveryDate', 'deliveryTime', 'ordDeliverylocation', 'patientId');
    }
    else{
      grouped= groupArray(list, 'treatmentDate', 'ordDeliverylocation', 'treatmentTime', 'patientId');
    }
//    console.log(grouped);
    let daysArray: any[] = [];
    for (let dayKey in grouped) {
      if (grouped.hasOwnProperty(dayKey)) {
        let secArray: any[] = [];
        for (let secKey in grouped[dayKey]) {
          if (grouped[dayKey].hasOwnProperty(secKey)) {
            let subSecArray: any[] = [];
            for (let subSecKey in grouped[dayKey][secKey]) {
              if (grouped[dayKey][secKey].hasOwnProperty(subSecKey)) {
                let patientList: any[] = [];
                for (let patKey in grouped[dayKey][secKey][subSecKey]) {
                  if (grouped[dayKey][secKey][subSecKey].hasOwnProperty(patKey)) {
                    patientList.push({'label' : patKey , 'value' : grouped[dayKey][secKey][subSecKey][patKey]});
                  }
                }
                // tslint:disable-next-line:max-line-length
                subSecArray.push({'label': subSecKey, 'value': this.sortedPatientList(patientList.sort((a, b) => this.sortPatients(a, b)))});
              }
            }
            secArray.push({'label': secKey, 'value': subSecArray.sort((a, b) => a.label < b.label ? -1 : 1)});
          }
        }
        daysArray.push({'label' : dayKey, 'value' : secArray.sort((a, b) => a.label < b.label ? -1 : 1)});
      }
    }

//    console.log(daysArray);
    if (this.dayOrWeek === 'week') {
      if (daysArray !== null && daysArray.length > 0) {
        if (-1 === (daysArray.find(x => x.label === this.weekArray[5]) || daysArray.find(x => x.label === this.weekArray[6]) ? 1 : -1)) {
          this.weekArray = this.weekArray.slice(0, 5);
        }
        if (daysArray.length < 7) {
//          console.log('weekArray ' + this.weekArray);
          for ( let i = 0; i < this.weekArray.length; i++ ) {
            if (-1 === (daysArray.find(x => x.label === this.weekArray[i]) ? 1 : -1 )) {
              daysArray.push( { 'label' : this.weekArray[i], 'value' : [] } );
            }
          }
        }
      }
    }
    daysArray.sort((a, b) => a.label < b.label ? -1 : 1);
    return daysArray;
  }

}
