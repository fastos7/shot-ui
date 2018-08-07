import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../common/model/user.model';
import { UserAccountService } from '../user-account.service';
import { AlertService } from '../../core/services/alert.service';
import { Constants } from '../../common/app.constants';
import { UserService } from '../../common/services/user.service';
import { MatDialog } from '@angular/material';
import { DeleteUserConfirmComponent } from '../delete-user-confirm/delete-user-confirm.component';

@Component({
  selector: 'app-search-user-card',
  templateUrl: './search-user-card.component.html',
  styleUrls: ['./search-user-card.component.css']
})
export class SearchUserCardComponent implements OnInit {
  @Input() user: User;

  constructor(private userAccountService: UserAccountService,
    private userService: UserService,
    private alertService: AlertService,
    private deleteDialog: MatDialog) { }

  ngOnInit() {
  }

  editUser(user) {
    this.userAccountService.triggerEditUser(user);
  }

  deleteUser(user: User) {
    let deleteDialogRef = this.deleteDialog.open(DeleteUserConfirmComponent, {
      width: '400px', data: user
    });
  }
}
