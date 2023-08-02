import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';
import { CustomerRoutingModule } from './customer.routing.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerPlanPaymentComponent } from './customer-planPayment/customer-planPayment.component';


@NgModule({
  declarations: [
    CustomerKycComponent,
    CustomerListComponent,
    CustomerViewComponent,
    CustomerPlanPaymentComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ComponentsModule,
    AllMaterialModule,

  ],
  exports:[
    CustomerKycComponent,
    CustomerListComponent,
    CustomerViewComponent,
    CustomerPlanPaymentComponent
  ]
})
export class CustomerKycModule { }