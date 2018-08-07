import { Component, OnInit } from '@angular/core';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-patient-management-tabs',
  templateUrl: './patient-management-tabs.component.html',
  styleUrls: ['./patient-management-tabs.component.css']
})
export class PatientManagementTabsComponent implements OnInit {

  private selectedTab: number;

  constructor( private eventBusService: EventBusService) { }

  ngOnInit() {
    this.eventBusService.on(Constants.PM_TABS_GO_TO_SEARCH, () => {
      this.tabChanged(0);
    });
  }

  tabChanged(tabIndex: number) {
    this.selectedTab = tabIndex;
  }

  tabClicked(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.eventBusService.broadcast(Constants.PM_TABS_TAB_CHANGED_SEARCH);
    } else if (event.index === 1) {
      this.eventBusService.broadcast(Constants.PM_TABS_TAB_CHANGED_ADD_PATIENT);
    } else {
      this.eventBusService.broadcast(Constants.PM_TABS_TAB_CHANGED_BULK_ADD_PATIENTS);
    }
  }
}
