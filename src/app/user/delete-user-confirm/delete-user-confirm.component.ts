import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../core/services/alert.service';
import { UserAccountService } from '../user-account.service';
import { User } from '../../common/model/user.model';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';

@Component({
  selector: 'app-delete-user-confirm',
  templateUrl: './delete-user-confirm.component.html',
  styleUrls: ['./delete-user-confirm.component.css'],
  providers: [
    AlertService
  ]
})
export class DeleteUserConfirmComponent implements OnInit {
  private user: User;
  private userDeleted: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteUserConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userAccountService: UserAccountService,
    private alertService: AlertService,
    private eventBusService: EventBusService)  { 
      this.user = this.data;
    }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  onDeleteUser() {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.userAccountService.deleteUser(this.user).subscribe(
      data => {
        this.userDeleted = true;
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.userAccountService.triggerDeleteUser(this.user);
        this.alertService.success('User was successfully deleted from the Site(s)');
      },
      error => {
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
      }
    );

  }
}
