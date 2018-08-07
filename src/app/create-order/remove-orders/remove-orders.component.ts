import { Component, OnInit, Input, ElementRef, ViewChildren , QueryList, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Batch } from '../../common/model/batch.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MaterialDataSource } from '../../common/material-datasource';

@Component({
  selector: 'app-remove-orders',
  templateUrl: './remove-orders.component.html',
  styleUrls: ['./remove-orders.component.scss'],
  animations: [
    /*
     * Animation for the list of batches. 
     */
    trigger('batchesListVisibilityChanged', [
        state('shown',  style({ marginLeft:'0px' })),
        state('hidden', style({ marginLeft:'-1100px' })),
        transition('shown => hidden', [
          animate('0.3s 0.1s ease-in', style({transform: 'translateX(-100%)'}))
        ]),
        transition('hidden => shown', [
          animate('0.3s 0.1s ease-in', style({transform: 'translateX(100%)'}))
        ]),
        transition('void => shown', animate('0s'))
    ]),
    /*
     * Animation for the list of batches to be deleted. 
     */
    trigger('batchesTobeDeletedVisibilityChanged', [
      state('shown',  style({   })),
      state('hidden', style({   })),
      transition('shown => hidden', [
        animate('0.3s 0.1s ease-in', style({transform: 'translateX(100%)'}))
      ]),      
      transition('hidden => shown', [
        animate('0.3s 0.1s ease-in', style({transform: 'translateX(-100%)'}))
      ]),
      transition('void => shown', animate('0s'))
  ])
]
})
export class RemoveOrdersComponent extends MaterialDataSource implements OnInit {

  @Input("orderList") orderList:any[];

  @Input("patiendId") patiendId:number;

  @ViewChildren("checkboxes") checkboxes:QueryList<any>;

  /*
   * This is a reference to the cancel button so that the
   * modal dialog can be cancelled programmatically.
   */   
  @ViewChild("cancelBtn") cancelBtn:ElementRef;

  @ViewChild("select_all_checkbox") selectAllCheckbox:ElementRef;

  private selectedBatches:Batch[] = [];
  
  private displayedColumns = ['select',
                              'productName',                              
                              'deliveryMechanism',
                              'volume',                              
                              'route',                              
                              'quantity',
                              'deliverTo',
                              'deliverAt'];

  private displayedColumnsForSelectedBatches = [
                              'productNameForSelectedBatches',                              
                              'deliveryMechanismForSelectedBatches',
                              'volumeForSelectedBatches',                              
                              'routeForSelectedBatches',                              
                              'quantityForSelectedBatches',
                              'deliverToForSelectedBatches',
                              'deliverAtForSelectedBatches'];     
                              
  private batchesListVisibility:string;
  private batchesTobeDeletedListVisibility:string;

  constructor() { 
    super();
  }

  ngOnInit() {

    this.batchesListVisibility = "shown";
    this.batchesTobeDeletedListVisibility = "hidden";

  }

  getBatchesForPatient(patientId:number) : Batch[]  {

    if (!this.orderList || this.orderList.length <= 0) {
      return [];
    }

    var batchList:Batch[]=null;

    if (patientId == 0) {      
      let nonPatientOrder = this.orderList.find( order => order.patient.isPatient == false);
      if (nonPatientOrder) {
        batchList = nonPatientOrder.batchList;
      }      
    } else {
      let order = this.orderList.find( order => order.patient.patientId == patientId );   
      if (order) {
        batchList = order.batchList;
      }      
    }
    
    return batchList;
  }

  toggleCheckboxes(target) {   
    let batchList = this.getBatchesForPatient(this.patiendId); 
    if (target.srcElement.checked == true) {
      this.checkboxes.forEach( 
        element => {
          element.nativeElement.checked = true;
          let batchId = element.nativeElement.attributes.batchId.value;
          let batch = batchList.find(batch => batch.batchId == batchId);
          if (batch) {
            if (this.selectedBatches.findIndex( batch => batch.batchId == batchId) < 0) {
              this.selectedBatches.push(batch);  
            }
          }          
        }
      );
    } else {
      this.checkboxes.forEach( 
        element => {
          element.nativeElement.checked = false
          let batchId = element.nativeElement.attributes.batchId.value;
          this.selectedBatches = this.selectedBatches.filter(batch => batch.batchId != batchId);                                               
        }
      );
    }
  }

  selectCheckbox(target) {
    let batchList = this.getBatchesForPatient(this.patiendId); 
    let batchId = target.srcElement.attributes.batchId.value;

    if (target.srcElement.checked == true) {
      let batch = batchList.find(batch => batch.batchId == batchId);
      if (batch) {
        this.selectedBatches.push(batch);  

        /*
        * If all the checkboxes of each batch has been checked then set the "All" checkbox 
        * to checked too.
        */ 
        if (this.selectedBatches.length == batchList.length) {
          this.selectAllCheckbox.nativeElement.checked = true;
        }
      } 
    } else {      
      this.selectedBatches = this.selectedBatches.filter(batch => batch.batchId != batchId);        

      /*
       * If all the checkboxes of each batch has been unchecked then set the "All" checkbox 
       * to unchecked too.
       */ 
      if (this.selectedBatches.length <= 0) {
        this.selectAllCheckbox.nativeElement.checked = false;
      }
    }
  }

  OnRemoveSelected() {

    let patientBatches = this.getBatchesForPatient(this.patiendId);

    this.selectedBatches.forEach(
      batchToBeDeleted => {
        patientBatches = patientBatches.filter(batch => batch.batchId != batchToBeDeleted.batchId);
      }
    ); 

    this.selectedBatches = [];

    // assign the new array to the patient batch list
    if (this.patiendId == 0) {      
      if (patientBatches.length <= 0) {
        /*
         * If there are no more remaining batches for the patient then remove
         * the patient from the order 
         */
        let index = this.orderList.findIndex( order => order.patient.isPatient == false);        
        this.orderList.splice(index,1);
      } else {
        let nonPatientOrder = this.orderList.find( order => order.patient.isPatient == false);
        nonPatientOrder.batchList = patientBatches;
      }      
    } else {
      if (patientBatches.length <= 0 ) {
        /*
         * If there are no more remaining batches for the patient then remove
         * the patient from the order 
         */
        let index = this.orderList.findIndex( order => order.patient.patientId == this.patiendId);        
        this.orderList.splice(index,1);
      } else {
        let order = this.orderList.find( order => order.patient.patientId == this.patiendId );   
        if (order) {
          order.batchList = patientBatches;
        }      
      }      
    }

    /* Close this modal dialog */
    this.cancelBtn.nativeElement.click();
  }

  OnBack() {
    this.batchesListVisibility = "shown";
    this.batchesTobeDeletedListVisibility = "hidden";
  }
  OnNext() {
    this.batchesListVisibility = "hidden";
    this.batchesTobeDeletedListVisibility = "shown";
  }

  OnCancel(){
    this.batchesListVisibility = "shown";
    this.batchesTobeDeletedListVisibility = "hidden";

    this.selectedBatches = [];
    this.selectAllCheckbox.nativeElement.checked = false;
    this.checkboxes.forEach( element => element.nativeElement.checked = false );
  }
}
