import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DisplayBatch } from '../../common/model/display-batch.model';

@Component({
  selector: 'app-day-view-treatment-times',
  templateUrl: './day-view-treatment-times.component.html',
  styleUrls: ['./day-view-treatment-times.component.scss']
})
export class DayViewTreatmentTimesComponent {

  constructor() {
}
/*
deliveryTimesArray: any[] = this.getDeliveryHeirarchicalJSON(list);

displayedColumns: string[] = ['Product Description', 'Diluent / Container', 'Volume',
                                      'RoA', 'Infusion Duration', 'Batch#, Expiry Date', 'Price', 'Status'];

//displayedColumns: string[] = ['productName'];

dataSource = new MatTableDataSource<DisplayBatch>(batchList);

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = null;
    this.dataSource = new MatTableDataSource<DisplayBatch>(batchList);
  }

  getDeliveryHeirarchicalJSON(list: any[]) {
    let groupArray = require('group-array');
    // group by the `tag` property 
    let grouped= groupArray(list, 'deliveryDate', 'deliveryTime', 'ordDeliverylocation', 'patientLastName');
    console.log(grouped);

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
                subSecArray.push({'label': subSecKey, 'value': patientList});
              }
            }
            secArray.push({'label' : secKey, 'value' : subSecArray});
          }
        }
        daysArray.push({'label' : dayKey, 'value' : secArray});
      }
    }

    console.log(daysArray);
    return daysArray;
  }
  */
}
/*
const batchList: DisplayBatch[] = [
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'Cancelled'
  },
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'On Hold'
  },
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'Submitted'
  },
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'Preproduction'
  },
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'Production'
  },
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'Shipped'
  },
  {
    batchId: 'BH1234',
    orderId: 'ord1234',
    productName: 'Cisplatin',
    dose: '10 mg',
    delMechanism: '0.9% Sodium Chloride in FreeFlexBag',
    removeClosedSystem: true,
    volume: '100 mL',
    exact: true,
    route: 'Intravenous',
    infDuration: '46 hours',
    qty: 5,
    expiryDate: '29/11/2017',
    price: 10000,
    status: 'Received'
  }
];

const list: any[] = [{
  'batchId': 'BH1712383',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Sydney',
  'patientLastName': 'Snow',
  'patientDob': '2017-12-29',
  'status': 'Status'
},
{
  'batchId': 'BH1712384',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Sydney',
  'patientLastName': 'Snow',
  'patientDob': '2017-12-29',
  'status': 'Status'
},
{
  'batchId': 'BH1712385',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Sydney',
  'patientLastName': 'Winslet',
  'patientDob': '2017-12-29',
  'status': 'Status'
},
{
  'batchId': 'BH1712381',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Sydney',
  'patientLastName': 'Martin',
  'patientDob': '2017-12-29',
  'status': 'Status'
},
{
  'batchId': 'BH1712382',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Sydney',
  'patientLastName': 'Martin',
  'patientDob': '2017-12-29',
  'status': 'Status'
},
{
  'batchId': 'BH1712386',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Melbourne',
  'patientLastName': 'Winslet',
  'patientDob': '2017-12-29',
  'status': 'Status'
},
{
  'batchId': 'BH1712387',
  'deliveryDate': '2017-09-27',
  'deliveryTime': '22:00',
  'treatmentDateTime': 1514536347390,
  'productDescription': 'CISPLATIN 100 mg\rIN 0.9% SODIUM CHLORIDE\rFOR INTRAVENOUS INFUSION',
  'ordDeliverylocation': 'Melbourne',
  'patientLastName': 'PatientLastName',
  'patientDob': '2017-12-29',
  'status': 'Status'
}
];
*/