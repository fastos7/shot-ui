import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { UserAccountService } from '../../user/user-account.service';

@Component({
  selector: 'app-account-preferences-tab',
  templateUrl: './account-preferences-tab.component.html',
  styleUrls: ['./account-preferences-tab.component.css']
})
export class AccountPreferencesTabComponent implements OnInit {
  private tabIndex: number = 0;

  constructor(private route: ActivatedRoute, 
              private userAccService: UserAccountService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.tabIndex = Number(params.get('index'));
      }
    );
  }

  tabChanged(event) {
    this.alertService.reset();
    this.userAccService.triggerResetUser();
  }
}
