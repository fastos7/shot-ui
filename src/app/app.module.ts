import { LogisticsService } from './common/services/logistics.service';
import { CompleterService } from 'ng2-completer';
import { PatientComponent } from './orders/batch/patient/patient.component';
import { BatchOrderComponent } from './orders/batch/batch.component';
import { CommonModule } from '@angular/common';
import { ProductService } from './product/product.servce';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { Ng2CompleterModule } from 'ng2-completer';
import { MenuComponent } from './common/menu/menu.component';
import { LocalStoreManager } from './common/local-store-manager';
import { SHOTCommonModule } from './common/common.module';
import { UserAccessModule } from './user-access/user-access.module';
import { OrdersModule } from './orders/orders.module';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './common/guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './common/services/user.service';
import { UserPermissionsService } from './common/services/user-permissions.service';
import { HttpModule } from '@angular/http';
import { HttpClientService } from './common/services/http-client.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import 'hammerjs';
import { AuthInterceptor } from './common/interceptor/auth-interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons'

// Imports for Mock Backend
import { mockBackendProvider } from './common/mock-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { CustomerPreferencesModule } from './customer-preferences/customer-preferences.module';
import { SearchPatientComponent } from './patient/search-patient/search-patient.component';
import { SearchPatientMultipleComponent } from './patient/search-patient-multiple/search-patient-multiple.component';
import { ListPatientsComponent } from './patient/list-patients/list-patients.component';
import { DisplayPatientComponent } from './patient/display-patient/display-patient.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
import { UploadPatientsComponent } from './patient/upload-patients/upload-patients.component';
import { DisplayProductDetailsComponent } from './product/display-product-details/display-product-details.component';
import { DisplayDeliveryLocationsComponent } from './create-order/display-delivery-locations/display-delivery-locations.component';
import { AddBatchComponent } from './create-order/add-batch/add-batch.component';
import { ListBatchesComponent } from './create-order/list-batches/list-batches.component';
import { ConfirmBatchActionComponent } from './create-order/confirm-batch-action/confirm-batch-action.component';
import { ListOrderHistoryComponent } from './create-order/list-order-history/list-order-history.component';
import { UploadOrdersComponent } from './create-order/upload-orders/upload-orders.component';
import { DisplayTimeComponent } from './view-order/display-time/display-time.component';
import { ListTimesComponent } from './view-order/list-times/list-times.component';
import { DisplayLocationComponent } from './view-order/display-location/display-location.component';
import { ListLocationsComponent } from './view-order/list-locations/list-locations.component';
import { DisplayDayComponent } from './view-order/display-day/display-day.component';
import { ListDaysComponent } from './view-order/list-days/list-days.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { SearchUserComponent } from './user/search-user/search-user.component';
import { DisplayUserComponent } from './user/display-user/display-user.component';
import { ListUsersComponent } from './user/list-users/list-users.component';
import { PatientManagementComponent } from './patient/patient-management/patient-management.component';
import { PatientManagementTabsComponent } from './patient/patient-management-tabs/patient-management-tabs.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatTabsModule, MatTableModule, MatPaginatorModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule,MatTooltipModule,MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { DisplayDeliveryDateTimesComponent } from './create-order/display-delivery-datetimes/display-delivery-datetimes.component';
import { BatchCreationService } from './create-order/batch-create.service';
import { AddBatchPatientComponent } from './create-order/add-batch-patient/add-batch-patient.component';
import { DisplayBatchProductComponent } from './create-order/display-batch-product/display-batch-product.component';
import { CreateOrderService } from './create-order/create-order-service';
import { ManageUsersComponent } from './user/manage-users/manage-users.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { CreateUserTabComponent } from './user/create-user-tab/create-user-tab.component';
import { UserAccountService } from './user/user-account.service';
import { AddUserSiteComponent } from './user/add-user-site/add-user-site.component';
import { DayViewTreatmentTimesComponent } from './html/day-view-treatment-times/day-view-treatment-times.component';
import { DisplayMyOrdersComponent } from './view-order/display-my-orders/display-my-orders.component';
import { ListPatientCardsComponent } from './view-order/list-patient-cards/list-patient-cards.component';
import { DisplayPatientCardComponent } from './view-order/display-patient-card/display-patient-card.component';
import { DisplayMyOrdersHeaderComponent } from './view-order/display-my-orders-header/display-my-orders-header.component';
import { DisplayPatientBatchesWeekViewComponent } from './view-order/display-patient-batches-week-view/display-patient-batches-week-view.component';
import { DisplayPatientBatchesDayViewComponent } from './view-order/display-patient-batches-day-view/display-patient-batches-day-view.component';
import { ViewOrderService } from './common/services/view-order.service';
import { CookieService } from 'angular2-cookie/core';

import { LoadingModule } from 'ngx-loading';
import { QuillModule } from 'ngx-quill';
import { SearchUserResultsComponent } from './user/search-user-results/search-user-results.component';
import { SearchUserCardComponent } from './user/search-user-card/search-user-card.component';
import { SearchUserSitesCardComponent } from './user/search-user-sites-card/search-user-sites-card.component';
import { DeleteUserConfirmComponent } from './user/delete-user-confirm/delete-user-confirm.component';
import { NewOrderComponent } from './create-order/new-order/new-order.component';
import { FileManagerService } from './common/services/file-mgmt.service';
import { SiteUploadsComponent } from './site-admin/site-uploads/site-uploads.component';
import { SiteNewsFeedComponent } from './site-admin/site-news-feed/site-news-feed.component';
import { SiteAdminTabsComponent } from './site-admin/site-admin-tabs/site-admin-tabs.component';
import { URLGuard } from './common/guards/url.guard';
import { PendingChangesGuard } from './common/guards/pending-changes.guard';
import { RemoveOrdersComponent } from './create-order/remove-orders/remove-orders.component';
import { NewsFeedService } from './site-admin/site-news-feed/news-feed.service';
import { ViewNewsFeedComponent } from './site-admin/view-news-feed/view-news-feed.component';
import { CreateNewsFeedComponent } from './site-admin/create-news-feed/create-news-feed.component';
import { StorageService } from './common/services/storage.service';
import { HomeService } from './home/home.service';
import { AccountPreferencesTabComponent } from './user-profile/account-preferences-tab/account-preferences-tab.component';
import { AccountPreferencesComponent } from './user-profile/account-preferences/account-preferences.component';
import { AddBatchAddPatientComponent } from './create-order/add-batch-add-patient/add-batch-add-patient.component';
import { DeleteNewsFeedComponent } from './site-admin/delete-news-feed/delete-news-feed.component';
import { DisplayBatchComponent } from './view-order/display-batch/display-batch.component';
import { HelperComponent } from './helper/helper.component';
import { HelperService } from './helper/helper.service';
import { BatchDetailsComponent } from './view-order/batch-details/batch-details.component';
import { BatchHistoryComponent } from './view-order/batch-history/batch-history.component';
import { FreeStockComponent } from './free-stock/free-stock.component';
import { DrugTabComponent } from './free-stock/drug-tab/drug-tab.component';
import { PatientTabComponent } from './free-stock/patient-tab/patient-tab.component';
import { TrialTabComponent } from './free-stock/trial-tab/trial-tab.component';
import { TransferStockComponent } from './free-stock/transfer-stock/transfer-stock.component';
import { StockHistoryComponent } from './free-stock/stock-history/stock-history.component';
import { PoolPatientButtonGroupComponent } from './free-stock/pool-patient-button-group/pool-patient-button-group.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    BatchOrderComponent,
    PatientComponent,
    SearchPatientComponent,
    SearchPatientMultipleComponent,
    ListPatientsComponent,
    AddBatchPatientComponent,
    DisplayBatchProductComponent,
    DisplayPatientComponent,
    AddPatientComponent,
    EditPatientComponent,
    UploadPatientsComponent,
    DisplayProductDetailsComponent,
    DisplayDeliveryLocationsComponent,
    DisplayDeliveryDateTimesComponent,
    AddBatchComponent,
    ListBatchesComponent,
    ConfirmBatchActionComponent,
    ListOrderHistoryComponent,
    UploadOrdersComponent,
    DisplayTimeComponent,
    ListTimesComponent,
    DisplayLocationComponent,
    ListLocationsComponent,
    DisplayDayComponent,
    ListDaysComponent,
    ChangePasswordComponent,
    SearchUserComponent,
    DisplayUserComponent,
    ListUsersComponent,
    PatientManagementComponent,
    PatientManagementTabsComponent,
    ManageUsersComponent,
    CreateUserComponent,
    SearchUserComponent,
    CreateUserTabComponent,
    AddUserSiteComponent,
    DayViewTreatmentTimesComponent,
    DisplayMyOrdersComponent,
    ListPatientCardsComponent,
    DisplayPatientCardComponent,
    DisplayMyOrdersHeaderComponent,
    DisplayPatientBatchesWeekViewComponent,
    DisplayPatientBatchesDayViewComponent,
    SearchUserResultsComponent,
    SearchUserCardComponent,
    SearchUserSitesCardComponent,
    DeleteUserConfirmComponent,
    NewOrderComponent,
    SiteAdminTabsComponent,
    SiteUploadsComponent,
    SiteNewsFeedComponent,
    RemoveOrdersComponent,
    ViewNewsFeedComponent,
    CreateNewsFeedComponent,
    AccountPreferencesTabComponent,
    AccountPreferencesComponent,
    AddBatchAddPatientComponent,
    DeleteNewsFeedComponent,
    DisplayBatchComponent,
    HelperComponent,
    BatchDetailsComponent,
    BatchHistoryComponent,
    FreeStockComponent,
    DrugTabComponent,
    PatientTabComponent,
    TrialTabComponent,
    TransferStockComponent,
    StockHistoryComponent,
    PoolPatientButtonGroupComponent
  ],
  imports: [
    BrowserModule,
    Angular2FontawesomeModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    UserAccessModule,
    OrdersModule,
    SHOTCommonModule,
    CommonModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    CustomerPreferencesModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    LoadingModule,
    HttpClientModule,        
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),    
    QuillModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    URLGuard,
    PendingChangesGuard,
    UserService,
    UserPermissionsService,
    HttpClientService,
    LocalStoreManager,
    BatchCreationService,
    ProductService,
    LogisticsService,
    CompleterService,
    CreateOrderService,
    ViewOrderService,
    UserAccountService,
    FileManagerService,
    CookieService,
    NewsFeedService,
    StorageService,
    HomeService,
    HelperService,

    // Mock Backend Providers
    mockBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteUserConfirmComponent,
    DeleteNewsFeedComponent,
    DisplayBatchComponent,
    BatchDetailsComponent,
    TransferStockComponent,
    StockHistoryComponent
  ]
})
export class AppModule { }
