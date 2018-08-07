import { Component, OnInit } from '@angular/core';
import { Trial } from '../../common/model/trial.model';
import { MaterialDataSource } from '../../common/material-datasource';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { TransferStockComponent } from '../transfer-stock/transfer-stock.component';
import { Constants } from '../../common/app.constants';
import { StockHistoryComponent } from '../stock-history/stock-history.component';

@Component({
  selector: 'app-trial-tab',
  templateUrl: './trial-tab.component.html',
  styleUrls: ['./trial-tab.component.scss']
})
export class TrialTabComponent extends MaterialDataSource implements OnInit {

  private displayedColumns = ['poolOrPatient',                              
                              'qtyAtHand',
                              'actions'];
  
  private patientStockAllocationList:Array<any>;

  constructor(private modalService: BsModalService) { 
    super();
  }

  ngOnInit() {
  }

  handleSelectedTrial(trial:Trial) {

    if (trial) {

      this.patientStockAllocationList = new Array<any>();
      this.patientStockAllocationList.push({patientName: null,qtyAtHand:12});
      this.patientStockAllocationList.push({patientName: "Larry Smith",qtyAtHand:10});
    } else {
      this.patientStockAllocationList = new Array<any>();
    }
  }

  transferIn() {    
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      initialState : {
        mode        : Constants.FREE_STOCK_TRASFER_IN,
        patientFrom : null,
        qtyFrom     : null,
        patientTo   : null,
        qtyTo       : 10
      }
    };
    this.modalService.show(TransferStockComponent, Object.assign({}, options));
  }

  transferOut() {
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      initialState : {
        mode : Constants.FREE_STOCK_TRASFER_OUT,
        patientFrom : 'Larry Smith',
        qtyFrom     : 10,
        patientTo   : null,
        qtyTo       : null
      }
    };
    this.modalService.show(TransferStockComponent, Object.assign({}, options));
  }

  displayHistory() {
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class   : 'free-stock-history-modal',
      initialState : {}
    };
    this.modalService.show(StockHistoryComponent, Object.assign({}, options));
  }
}
