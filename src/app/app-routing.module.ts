import { BatchOrderComponent } from './orders/batch/batch.component';
import { LoginGuard } from './user-access/login/login.guard';
import { LoginComponent } from './user-access/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './common/guards/auth.guard';
import { CustomerPreferencesComponent } from './customer-preferences/customer-preferences.component';
import { PatientManagementComponent } from './patient/patient-management/patient-management.component';
import { AddBatchComponent } from './create-order/add-batch/add-batch.component';
import { ManageUsersComponent } from './user/manage-users/manage-users.component';
import { DayViewTreatmentTimesComponent } from './html/day-view-treatment-times/day-view-treatment-times.component';
import { DisplayMyOrdersComponent } from './view-order/display-my-orders/display-my-orders.component';
import { NewOrderComponent } from './create-order/new-order/new-order.component';
import { SiteAdminTabsComponent } from './site-admin/site-admin-tabs/site-admin-tabs.component';
import { URLGuard } from './common/guards/url.guard';
import { PendingChangesGuard } from './common/guards/pending-changes.guard';
import { AccountPreferencesTabComponent } from './user-profile/account-preferences-tab/account-preferences-tab.component';
import { ForgotPasswordMainComponent } from './user-access/forgot-password-main/forgot-password-main.component';
import { ResetPasswordComponent } from './user-access/reset-password/reset-password.component';
import { LogoutGuard } from './user-access/login/logout.guard';
import { HelperComponent } from './helper/helper.component';
import { DisplayBatchComponent } from './view-order/display-batch/display-batch.component';
import { ContactUsComponent } from './user-access/contact-us/contact-us.component';
import { BatchDisplayResolver } from './common/resolvers/batch-display.resolver';
import { FreeStockComponent } from './free-stock/free-stock.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LoginComponent, canActivate: [LogoutGuard] },
  {
    path: 'order/free-stock',component:FreeStockComponent,
    canActivate: [URLGuard]
  },
  {
    path: 'order/new', component: NewOrderComponent,
    canDeactivate: [PendingChangesGuard],
    canActivate: [URLGuard]
  },
  { path: 'customers/preferences', component: CustomerPreferencesComponent, canActivate: [URLGuard] },
  { path: 'patientManagement/search', component: PatientManagementComponent, canActivate: [URLGuard] },
  { path: 'my-orders/:dayOrWeek/:deliveryOrTreatment/:startDate', component: DisplayMyOrdersComponent, canActivate: [URLGuard] },
  { path: 'my-orders/batches/:batchId', component: DisplayBatchComponent, 
    canActivate: [URLGuard],
    resolve : { batchDetails : BatchDisplayResolver}
  },  
  { path: 'manageUsers', component: ManageUsersComponent, canActivate: [URLGuard] },
  { path: 'day-view-treatment-times', component: DisplayMyOrdersComponent, canActivate: [URLGuard] },
  { path: 'day-view-treatment-times-test', component: DayViewTreatmentTimesComponent, canActivate: [URLGuard] },
  { path: 'site-admin', component: SiteAdminTabsComponent, canActivate: [URLGuard] },
  { path: 'acc-preferences/:index', component: AccountPreferencesTabComponent },
  { path: 'forgot-password', component: ForgotPasswordMainComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'helper', component: HelperComponent},
  // Default route if none of the URLs match
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


