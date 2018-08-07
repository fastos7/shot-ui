import { Component, OnInit, Input } from '@angular/core';
import { DisplayBatch } from '../../common/model/display-batch.model';
import { MatTableDataSource } from '@angular/material';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { BatchDetailsComponent } from '../batch-details/batch-details.component';

@Component({
  selector: 'app-display-patient-batches-day-view',
  templateUrl: './display-patient-batches-day-view.component.html',
  styleUrls: ['./display-patient-batches-day-view.component.scss']
})
export class DisplayPatientBatchesDayViewComponent implements OnInit {

  @Input() batchArray: any[] = [];

  displayedColumns: string[] = ['Product Description', 'Diluent / Container', 'Volume', 'Quantity',
  'RoA', 'Inf Duration', 'Batch#, Expiry Date', 'OrdNo', 'Status'];

  dataSource = new MatTableDataSource<DisplayBatch>(this.batchArray);

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<DisplayBatch>(this.batchArray);
  }

  showBatchDetails(data:any) {
    /*
     * Initialize the `BatchDetailsComponent` options.
     */
    var options: ModalOptions = {    
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'display-batch-modal',
      initialState : {        
        shotBatch:data
      }
    };
    this.modalService.show(BatchDetailsComponent, Object.assign({}, options));
    
  }
}
