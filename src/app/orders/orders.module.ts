import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SHOTCommonModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SHOTCommonModule
  ],
  declarations: [],
  exports: [
    
  ]
})
export class OrdersModule { }
