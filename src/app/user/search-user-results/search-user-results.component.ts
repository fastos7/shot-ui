import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../../common/model/user.model';
import { Subscription } from 'rxjs/Subscription';
import { UserAccountService } from '../user-account.service';

@Component({
  selector: 'app-search-user-results',
  templateUrl: './search-user-results.component.html',
  styleUrls: ['./search-user-results.component.css']
})
export class SearchUserResultsComponent implements OnInit {

  @Input() users: User[];

  constructor(private userAccountService: UserAccountService) { }

  ngOnInit() {
  }
}
