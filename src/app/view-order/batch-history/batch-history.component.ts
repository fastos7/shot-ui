import { Component, OnInit, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BatchService } from '../../common/services/batch.service';
import { UserService } from '../../common/services/user.service';
import { Subscription } from 'rxjs';
import { BatchHistoryModel } from '../../common/model/batch-history.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-batch-history',
  templateUrl: './batch-history.component.html',
  styleUrls: ['./batch-history.component.scss']
})
export class BatchHistoryComponent  implements OnInit,OnDestroy,AfterViewInit {

  @Input() batchId:string;
  
  private customerKey: string;  

  private getBatchHistorySubcription:Subscription;

  private batchHistory: Array<BatchHistoryModel> = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private dataSource = new MatTableDataSource<any>(this.batchHistory);

  private displayedColumns = ['date',
                              'user',
                              'product',
                              'quantity',                              
                              'volume',
                              'route',
                              'treatmentDateTime',
                              'status',
                              'deliveryDateTime',                              
                              'comments'];

  constructor(private batchService:BatchService,
              private userService:UserService) {
    
   }

  ngOnInit() {

    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
    
    this.loadBatchHistory();
                            
  }

  loadBatchHistory() {
    this.getBatchHistorySubcription = this.batchService.getBatchHistory(this.customerKey,this.batchId).subscribe(
      /* When successful */
      data => {
        
        this.batchHistory = data;
        this.dataSource.data = this.batchHistory;        
        this.dataSource.paginator = this.paginator;

      },
      /* When there is an error. */
      error => {
    
      }  
    );
  }

  ngOnDestroy(): void {
    if (this.getBatchHistorySubcription) {
      this.getBatchHistorySubcription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    
  }

}
