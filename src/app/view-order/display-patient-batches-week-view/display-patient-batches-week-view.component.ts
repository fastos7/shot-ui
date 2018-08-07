import { Component, OnInit, Input } from '@angular/core';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { BatchDetailsComponent } from '../batch-details/batch-details.component';

@Component({
  selector: 'app-display-patient-batches-week-view',
  templateUrl: './display-patient-batches-week-view.component.html',
  styleUrls: ['./display-patient-batches-week-view.component.css']
})
export class DisplayPatientBatchesWeekViewComponent implements OnInit {

  @Input() batchArray: any[] = [];

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  showBatchDetails(data:any) {
    /*
     * Initialize the `DisplayBatchComponent` options.
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
