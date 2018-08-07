import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { Role } from '../../common/model/role.mode';
import { Customer } from '../../common/model/customer.model';
import { User } from '../../common/model/user.model';


@Component({
  selector: 'app-add-user-site',
  templateUrl: './add-user-site.component.html',
  styleUrls: ['./add-user-site.component.css']
})
export class AddUserSiteComponent implements OnInit {
  @Input() userSite: UserAuthorities;
  @Input() sites: Array<any>;
  @Input() roles: Array<any>;
  @Input() user: User;
  @Input() index: number;
  @Input() isSladeAdmin: boolean;

  @Output() default: EventEmitter<UserAuthorities> = new EventEmitter<UserAuthorities>();
  @Output() remove: EventEmitter<UserAuthorities> = new EventEmitter<UserAuthorities>();

  private selectedUserSite: UserAuthorities;
  private showRoles: boolean = false;
  private showBillTo: boolean = false;

  constructor() { }

  ngOnInit() {
    // If user being Edited
    if (this.user) {
      this.sites.forEach(site => {
        if (this.userSite.customerKey == site.customerKey) {
          this.selectedUserSite = site;
        }
      });
      this.showRoles = true;
    }
  }

  static buildUserSiteFormGroup(userAuthSite: UserAuthorities) {
    return new FormGroup({
      userSite: new FormControl(null, Validators.required),
      rolesArray: new FormArray([], Validators.required),
      billTos: new FormArray([])
    });
  }

  userSiteSelected() {
    this.userSite.customerKey = this.selectedUserSite.customerKey;
    this.userSite.customerName = this.selectedUserSite.customerName;
    this.userSite.id = this.selectedUserSite.id;
    this.showRoles = true;
    // const rolesArray = this.roles.map(role => new FormControl(role));
    // this.addEditUserForm.setControl('userSitesArray', this.formBuilder.array(userSitesGroup, Validators.required));
    //this.userSite.billTos = this.selectedUserSite.billTos.slice();
  }

  updateRoles(role: Role, event) {
    if (event.target.checked) {
      this.userSite.roleDTOs.push(role);
      if (role.hasBillingRight) {
        this.showBillTo = true;
      }
    } else {
      this.userSite.roleDTOs = this.userSite.roleDTOs.filter(
        rl => rl.roleId !== role.roleId);
      let checkBillTo: boolean = false;
      this.userSite.roleDTOs.forEach(role => {
        if (role.hasBillingRight) {
          checkBillTo = true;
        }
      });
      if (checkBillTo) {
        this.showBillTo = true;
      } else {
        this.showBillTo = false;
        this.userSite.billTos = [];
      }
    }
  }

  isUserRole(role: Role): boolean {
    let userRole: Role = this.userSite.roleDTOs.find((r: Role) => r.roleId == role.roleId);
    if (userRole) {
      if (userRole.hasBillingRight) {
        this.showBillTo = true;
      }
    }
    return userRole != null;
  }

  isUserBillTo(billTo: Customer): boolean {
    let userBillTo: Customer = this.userSite.billTos.find((cus: Customer) => cus.customerKey == billTo.customerKey);
    return userBillTo != null;
  }

  updateBillTos(billTo, event) {
    if (event.target.checked) {
      this.userSite.billTos.push(billTo);
    } else {
      this.userSite.billTos = this.userSite.billTos.filter(
        bl => bl.customerKey !== billTo.customerKey);
    }
  }

  makeSiteDefault() {
    this.default.emit(this.userSite);
  }

  removeSite() {
    this.remove.emit(this.userSite);
  }

}
