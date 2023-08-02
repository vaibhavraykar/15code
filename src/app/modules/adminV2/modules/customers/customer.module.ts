import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomersListComponent } from './customer-list/customer-list.component';
import { CustomerRoutingModule } from './customer.routing.module';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { AllMaterialModule } from 'src/app/material-module';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomersComponent } from './customer.component';
import { CustomerPlanAndPaymentComponent } from './customer-planAndPayment/customer-planAndPayment.component';
import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';
import { CustomerGCKycComponent } from './customer-gc-kyc/customer-gc-kyc.component';


@NgModule({
  declarations: [
    CustomersListComponent,
    CustomerTableComponent,
    CustomerViewComponent,
    CustomersComponent,
    CustomerPlanAndPaymentComponent,
    CustomerKycComponent,
    CustomerGCKycComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    AllMaterialModule    
  ],
  exports:[
  ]
})
export class CustomerV2Module { }