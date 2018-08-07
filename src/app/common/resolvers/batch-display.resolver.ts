import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common'
import { Batch } from '../model/batch.model';
import { Observable } from 'rxjs/Observable';
import { BatchService } from '../services/batch.service';
import { UserService } from '../services/user.service';
import { UserAuthorities } from '../model/user-authorities.model';

/** 
 * This resolver is used to fetch the `Batch Details` from `Shot_Batch` table. 
 * The fetch data is then pass to `DisplayBatchComponent`.
 * 
 * @author Marlon Cenita 
 */
@Injectable()
export class BatchDisplayResolver implements Resolve<Batch> {

  private customerKey: string;  
  private userAuthorities:UserAuthorities;
  
  constructor(private batchService:BatchService,
              private location: Location,
              private userService:UserService,
              private router:Router) { 

    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
    this.userAuthorities = this.userService.getCurrentUser().selectedUserAuthority;

  }

  resolve(route: ActivatedRouteSnapshot) : any{

    let batchId = route.paramMap.get("batchId");

    return this.batchService.getBatchDetails(this.customerKey,batchId)
      .take(1)
      .map(batchDetails => {
        if (batchDetails) {    
          /*
           * Redirect the user to My Orders if the status of batch is Cancelled.
           */
          if (batchDetails.status == "Cancelled") {
            this.location.back();
            return null;  
          }
          return batchDetails;      
        } else { 
          /*
           * If there is no batch details for the batch id provided then 
           * redirect the user to the previous page. An example of this scenario
           * is if the user type directly the url and provided a non existent
           * batch id.
           */
          this.location.back();
          return null;
        }
      })
      .catch(
        error => {
          /* 
           * When there is an error, Redirect the user to the my-order page and 
           * show the orders for today's date.
           */
          let datePipe : DatePipe = new DatePipe('en_AU');
          let startDateToPass: string = datePipe.transform(new Date(), 'yyyy-MM-dd');
          this.router.navigate(['my-orders/day/delivery/' + startDateToPass]);
          return Observable.of(null);
        }
      );
  }
}
