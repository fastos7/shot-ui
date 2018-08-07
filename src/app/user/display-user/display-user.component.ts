import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../common/model/user.model';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { AlertService } from '../../core/services/alert.service';
import { UserAccountService } from '../user-account.service';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {

  @Input() user: User;

  @Output() search: EventEmitter<any> = new EventEmitter<any>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  //@Output() edit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userAccountService: UserAccountService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.success('The following user has been saved to the system. Please confirm all details are accurate');
  }

  addUser() {
    this.userAccountService.triggerResetUser();
  }

  searchUsers() {
    this.userAccountService.triggerSearchUser();
  }

  editUser(user) {
    this.userAccountService.triggerEditUser(user);
  }
}
