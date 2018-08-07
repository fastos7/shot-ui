import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../../common/model/user.model';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { Role } from '../../common/model/role.mode';
import { Subscription } from 'rxjs/Subscription';
import { UserAccountService } from '../user-account.service';

@Component({
  selector: 'app-create-user-tab',
  templateUrl: './create-user-tab.component.html',
  styleUrls: ['./create-user-tab.component.css']
})
export class CreateUserTabComponent implements OnInit, OnDestroy {
  private editUserSubscription: Subscription;
  private resetUserSubscription: Subscription;
  private saveUserSubscription: Subscription;  

  @Input() user: User;
  @Input() private sites: UserAuthorities[];
  @Input() private roles: Role[];

  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  displayUser: boolean = false;

  constructor(private userAccountService: UserAccountService) { }

  ngOnInit() {
    this.editUserSubscription = this.userAccountService.subscribeToEditUser().subscribe(
      (selectedUser: User) => {
        this.user = selectedUser;
        this.displayUser = false;
      }
    );

    this.resetUserSubscription = this.userAccountService.subscribeToResetUser().subscribe(
      () => {
        this.user = null;
        this.displayUser = false;
      }
    );

    this.saveUserSubscription = this.userAccountService.subscribeToSavedUser().subscribe(
      (savedUser: User) => {
        this.user = savedUser;
        this.displayUser = true;
      }
    );
  }

  onAddEditUser(savedUser: User) {
    this.displayUser = false;
    this.user = savedUser;
    console.log('Add/Edit User: ' + this.user);
  }

  searchUser() {
    this.search.emit();
  }

  addAnotherUser() {
    this.displayUser = false;
    this.user = null;
  }

  ngOnDestroy() {
    this.editUserSubscription.unsubscribe();        
    this.resetUserSubscription.unsubscribe();
    this.saveUserSubscription.unsubscribe();
}
}
