import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { Subscription } from 'rxjs';
import { BatchService } from '../../common/services/batch.service';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { CreateOrderService } from '../../create-order/create-order-service';
import { UserService } from '../../common/services/user.service';
import { BatchCreateRequestPayload } from '../../common/model/batch-create-request-payload.model';
import { BatchUpdateRequestPayload } from '../../common/model/batch-update-request-payload.model';
import { BatchHistoryComponent } from '../batch-history/batch-history.component';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss']
})
export class BatchDetailsComponent implements OnInit,OnDestroy {

  private shotBatch:any;

  private batchDetailsForm: FormGroup;

  private customerKey:string;

  @ViewChild("app_batch_history") appBatchHistory: BatchHistoryComponent;

  /*
	 * Form errors container
	 */
	formErrors = {                
    "comments"            : ""
  };

  /*
  * Validation error messages
  */
  validationMessages = {                                                      
          'comments'            : { 'maxlength' : "Max. number of comments reached."}
  };

  private updateBatchCommentsSubscription:Subscription;

  constructor(private formBuilder: FormBuilder,
              private bsModalRef: BsModalRef,
              private eventBusService:EventBusService,                            
              private alertService:AlertService,
              private router:Router,
              private createOrderService:CreateOrderService,
              private userService: UserService) { 
    
  }

  ngOnInit() {

    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;

    this.buildForm();

  }

  buildForm() {

    this.batchDetailsForm = this.formBuilder.group({
      'comments'            : [{value: this.shotBatch.comments,disabled : false},
                               [Validators.maxLength(1000)]]
    });

    /* Listen to any changes in the form constrols */
    this.batchDetailsForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

   /**
	 * This method will be called if any of the controls were modified and will 
   * add error messages in the form errors container.
	 * @param any 
	 */
	onValueChanged(data?: any) {
	
		if (!this.batchDetailsForm) { return; }

		const form = this.batchDetailsForm;

		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
				}
			}
		}			
  }

  editBatch() {

    this.close();        
    this.router.navigate(['my-orders/batches/',this.shotBatch.shotBatchId]);
  }

  close() {
    this.bsModalRef.hide();
  }

  getTreatmentDateTime() {
    if (this.shotBatch) {
      if (this.shotBatch.treatmentDate && this.shotBatch.treatmentTime) {
        return this.shotBatch.treatmentDate + ' ' + this.shotBatch.treatmentTime;
      } 
    }
    return "";      
  }

  saveComments() {

    if (this.batchDetailsForm.valid) {

      this.eventBusService.broadcast(Constants.SHOW_LOADING);
        
      /*  
       * Cancel any pending calls if there are any. 
       */
      if (this.updateBatchCommentsSubscription) {
        this.updateBatchCommentsSubscription.unsubscribe();
      }

      this.updateBatchCommentsSubscription = this.createOrderService.updateBatchComments(this.customerKey,this.buildBatchUpdateRequestPayload()).subscribe(
        /* When successful */
        data => {

                  this.alertService.success("Comments Successfully saved.",true,'saveCommentsSuccessAlert');   

                  this.appBatchHistory.loadBatchHistory();
                  
                  this.eventBusService.broadcast(Constants.REFRESH_MYORDER_VIEW_EVENT);
        },
        /* When there is an error. */
        error => {

                  /* Show generic error message for any backend errors. */          
                  this.alertService.error(Constants.GENERIC_ERROR_MESSAGE,'saveCommentsErrorAlert');              

                  this.eventBusService.broadcast(Constants.HIDE_LOADING);
                  
        },
        () => {
            // Do nothing
            this.eventBusService.broadcast(Constants.HIDE_LOADING);              
        }
      );
      
      
    } else {
       /*
       * If the form is still invalid after pressing the submit button, then 
       * display all the validation errors. 
       */
      Object.keys(this.batchDetailsForm.controls).forEach(key => {
        this.batchDetailsForm.get(key).markAsDirty();
        this.batchDetailsForm.get(key).markAsTouched();
      });
      this.onValueChanged();  
 
    }
  }

  ngOnDestroy()  {    
    if (this.updateBatchCommentsSubscription) {
      this.updateBatchCommentsSubscription.unsubscribe();
    }
  }  


  buildBatchUpdateRequestPayload() : BatchUpdateRequestPayload {
    /*
     * Build the Order Request Payload 
     */
    var batchUpdateRequestPayload = new BatchUpdateRequestPayload();
    batchUpdateRequestPayload.changeType = Constants.BATCH_UPDATE_TYPE_COMMENTS_ONLY;
    batchUpdateRequestPayload.comments =  this.batchDetailsForm.get("comments").value;
    batchUpdateRequestPayload.shotBatchId = this.shotBatch.shotBatchId;
    batchUpdateRequestPayload.batchId = this.shotBatch.batchId;
    batchUpdateRequestPayload.axisBatchStatus = this.shotBatch.axisBatchStatus;
    batchUpdateRequestPayload.status = this.shotBatch.status;
    batchUpdateRequestPayload.orderId = this.shotBatch.orderId;

    return batchUpdateRequestPayload;
  }
}
