import { LocalStoreManager } from './common/local-store-manager';
import { Component, OnInit } from '@angular/core';
import { EventBusService } from './common/services/event-bus.service';
import { Constants } from './common/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SHOTApp';

  /*
   * Show/Hide the loader.
   */
  private loading = false;

  constructor(private localStoreManager: LocalStoreManager,
              private eventBusService: EventBusService) {}

  ngOnInit() {
    this.localStoreManager.initialiseStorageSyncListener();

    /*
     * Listen for the event the show the loader.
     */
    this.eventBusService.on(Constants.SHOW_LOADING,() => {
    			this.loading = true;
    });

    /*
     * Listen for the event the hide the loader.
     */
    this.eventBusService.on(Constants.HIDE_LOADING,() => {
      this.loading = false;
    });
  }
}
