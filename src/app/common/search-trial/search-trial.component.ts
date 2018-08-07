import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RemoteData, CompleterService, CompleterItem } from 'ng2-completer';
import { RestURLBuilder } from 'rest-url-builder';
import { Constants } from '../app.constants';
import { UserService } from '../services/user.service';
import { Trial } from '../model/trial.model';

@Component({
  selector: 'app-search-trial',
  templateUrl: './search-trial.component.html',
  styleUrls: ['./search-trial.component.scss']
})
export class SearchTrialComponent implements OnInit {

  @Input('searchTrialStr') searchTrialStr?: string;
  @Input('trialSearchId') trialSearchId: string;
  
  /**
   * This event will be fired to the component user whenever a product is 
   * selected. Therefore component user should bind a function for this event.
   * The event will pass <code>CustomerProduct</code> model.
   */
  @Output('selectedTrial') selectedTrialUpdated = new EventEmitter();
  
  protected remoteDataService: RemoteData;

  private customerKey:string;

  private isValid:boolean;

  private currentlySelectedTrial: Trial;
  
  constructor(private completerService: CompleterService,
              private userService: UserService) { }

  ngOnInit() {


    this.customerKey = this.userService.getCurrentUser().selectedUserAuthority.customerKey;
    /**
       * Configure ng2-completer.
       */
      this.remoteDataService = this.completerService.remote(null,'name','name');      
      this.remoteDataService.urlFormater(term => {  
        
          let builder = new RestURLBuilder().buildRestURL(Constants.FREE_STOCK_SEARCH_TRIALS_URL);
          builder.setNamedParameter("customerKey",this.customerKey)    
          builder.setQueryParameter("searchStr",term);                
          let uri = builder.get(); 

          return uri;
      });
      //--------------------------------------------------------------------------

      this.isValid = true;
  }

  onTrialSelected(selected: CompleterItem) {
    if (selected) {
      if (selected.originalObject != '') {
          this.currentlySelectedTrial = <Trial>selected.originalObject;
          this.selectedTrialUpdated.emit(this.currentlySelectedTrial);  
          this.isValid = true;        
      } else {
          this.selectedTrialUpdated.emit(null);     
      }
    }
  }

}
