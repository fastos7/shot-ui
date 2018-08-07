import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { Ng2CompleterModule, CompleterService } from 'ng2-completer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchProductComponent } from './search-product/search-product.component';
import { CustomerPreferencesService } from './services/customer-preferences.service';
import { FormatPreferenceDoseRangePipe } from './pipes/format-preference-dose-range.pipe';
import { FormatPreferenceExactPipe } from './pipes/format-preference-exact.pipe';
import { FormatPreferenceDiluentContainerPipe } from './pipes/format-preference-diluent-container.pipe';
import { PatientManagementService } from './services/patient-management.service';
import { ContactUsService } from './services/contact-us.service';
import { ProductAttributesComponent } from './product-attributes/product-attributes.component';
import { ProductsService } from './services/products.service';
import { EventBusService } from './services/event-bus.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormatVolumePipe } from './pipes/format-volume.pipe';
import { FormatInfDurationPipe } from './pipes/format-inf-duration.pipe';
import { FormatProductDescriptionPipe } from './pipes/format-product-description.pipe';
import { DisplayFullNamePipe } from './pipes/display-full-name.pipe';
import { BatchService } from './services/batch.service';
import { FormatRoutePipe } from './pipes/format-route.pipe';
import { FormatDisplayProductDescriptionPipe } from './pipes/format-display-product-description.pipe';
import { BatchDisplayResolver } from './resolvers/batch-display.resolver';
import { DisplayBatchModifiedByUserPipe } from './pipes/display-batch-modified-by-user.pipe';
import { DisplayFreeStockPatientPipe } from './pipes/display-free-stock-patient.pipe';
import { SearchTrialComponent } from './search-trial/search-trial.component';

@NgModule({
  declarations: [
    AlertComponent,
    SearchProductComponent,
    FormatPreferenceDoseRangePipe,
    FormatPreferenceDiluentContainerPipe,
    FormatPreferenceExactPipe,
    ProductAttributesComponent,
    FormatVolumePipe,
    FormatInfDurationPipe,
    FormatProductDescriptionPipe,
    DisplayFullNamePipe,
    FormatRoutePipe,
    FormatDisplayProductDescriptionPipe,
    DisplayBatchModifiedByUserPipe,
    DisplayFreeStockPatientPipe,
    SearchTrialComponent
  ],
  imports: [
    CommonModule,
    Ng2CompleterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [
      AlertComponent,
      SearchProductComponent,
      FormatPreferenceDoseRangePipe,
      FormatPreferenceDiluentContainerPipe,
      FormatPreferenceExactPipe,
      FormatVolumePipe,
      FormatInfDurationPipe,
      ProductAttributesComponent,
      FormatProductDescriptionPipe,
      DisplayFullNamePipe,
      FormatRoutePipe,
      FormatDisplayProductDescriptionPipe,
      DisplayBatchModifiedByUserPipe,
      DisplayFreeStockPatientPipe,
      SearchTrialComponent
    ],
  providers: [ CustomerPreferencesService,
               PatientManagementService,
               ContactUsService,
               ProductsService ,
               EventBusService,
               BatchService,
               BatchDisplayResolver ]
})
export class SHOTCommonModule {}
