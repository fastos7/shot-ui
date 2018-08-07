import { Component, OnInit } from '@angular/core';
import { MaterialDataSource } from '../../common/material-datasource';
import { Patient } from '../../common/model/patient.model';
import { UserService } from '../../common/services/user.service';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { Constants } from '../../common/app.constants';
import { TransferStockComponent } from '../transfer-stock/transfer-stock.component';

@Component({
  selector: 'app-patient-tab',
  templateUrl: './patient-tab.component.html',
  styleUrls: ['./patient-tab.component.scss']
})
export class PatientTabComponent extends MaterialDataSource implements OnInit {

  private customerKey:string;

  private displayedColumns = ['dsu',                              
                              'qtyAtHand',
                              'actions'];

  private drugStockAllocationList:Array<any>;                              

  private selectedPatient:Patient = new Patient(null, '', null, null);

  constructor(private userService: UserService,
              private modalService: BsModalService) { 
    super();
  }

  ngOnInit() {
    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
  }

  onPatientToSelected(patient:Patient) {

    if (patient) {
      this.drugStockAllocationList = new Array<any>();
      this.drugStockAllocationList.push({dsu:"Cisplatin",qtyAtHand:10});
      this.drugStockAllocationList.push({dsu:"Cisplatin",qtyAtHand:10});
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

}
