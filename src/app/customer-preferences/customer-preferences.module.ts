import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPreferencesComponent } from './customer-preferences.component';
import { ListCustomerPreferencesComponent } from './list-customer-preferences/list-customer-preferences.component';
import { DisplayCustomerPreferenceComponent } from './display-customer-preference/display-customer-preference.component';
import { SHOTCommonModule } from '../common/common.module';
import { Ng2CompleterModule, CompleterService } from 'ng2-completer';
import { UserService } from '../common/services/user.service';
import { MatTabsModule, MatTableModule, MatPaginatorModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { RemoveCustomerPreferencesComponent } from './remove-customer-preferences/remove-customer-preferences.component';

@NgModule({
  imports: [
    CommonModule,
    SHOTCommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  declarations: [ CustomerPreferencesComponent, 
                  ListCustomerPreferencesComponent, 
                  DisplayCustomerPreferenceComponent,                                     
                  RemoveCustomerPreferencesComponent],
  providers : [ UserService ]  
})
export class CustomerPreferencesModule { }
