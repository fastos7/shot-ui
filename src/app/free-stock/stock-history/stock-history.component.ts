import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MaterialDataSource } from '../../common/material-datasource';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.scss']
})
export class StockHistoryComponent extends MaterialDataSource implements OnInit {

  private displayedColumns = ['datetimeUpdated', 
                              'updatedBy',                         
                              'transactionType',
                              'qtyDifference',
                              'qtyBalance', 
                              'comments'];

  private stockHistoryList:Array<any>;              
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bsModalRef: BsModalRef) {
    super();
  }

  ngOnInit() {
    this.stockHistoryList = new Array<any>();
    this.stockHistoryList.push({
      datetimeUpdated : '2018-03-16 16:02:44',
      updatedBy       : 'Marlon Cenita',
      transactionType : 'Receive',
      qtyDifference : 10,
      qtyBalance : 10,
      comments : 'this is a comment'
    });
  }

  close() {
    this.bsModalRef.hide();
  }
}
