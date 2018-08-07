import { Component, OnInit } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { User } from '../../common/model/user.model';
import { Product } from '../../common/model/product.model';
import { MaterialDataSource } from '../../common/material-datasource';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { TransferStockComponent } from '../transfer-stock/transfer-stock.component';
import { StockHistoryComponent } from '../stock-history/stock-history.component';
import { Constants } from '../../common/app.constants';

@Component({
  selector: 'app-drug-tab',
  templateUrl: './drug-tab.component.html',
  styleUrls: ['./drug-tab.component.scss']
})
export class DrugTabComponent extends MaterialDataSource implements OnInit {

  private userAuthorities:UserAuthorities;

  private currentlySelectedProduct:Product;

  private displayedColumns = ['poolOrPatient',                              
                              'qtyAtHand',
                              'actions'];

  private patientStockAllocationList:Array<any>;
  
  constructor(private userService:UserService,
              private modalService: BsModalService) {
    super();
   }

  ngOnInit() {

    /* Get the currently selected customer site from local storage */
    let user: User = this.userService.getCurrentUser()
    this.userAuthorities = user.selectedUserAuthority;

    
  }

  handleSelectedProduct(product:Product) {

    if (product) {
      this.currentlySelectedProduct = product;

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
