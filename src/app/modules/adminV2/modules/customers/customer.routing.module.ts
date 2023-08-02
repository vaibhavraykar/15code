import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { CustomersListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerPlanAndPaymentComponent } from './customer-planAndPayment/customer-planAndPayment.component';
import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';
import { CustomerGCKycComponent } from './customer-gc-kyc/customer-gc-kyc.component';

const routes: Routes = [

  { path: "", redirectTo: "/customer/list", pathMatch: "full" },
  {
    path: 'list',
    component: CustomersListComponent
  },
  {
    path: 'view/:id',
    component: CustomerViewComponent
  },
  {
    path: 'planAndPayment/:id',
    component: CustomerPlanAndPaymentComponent
  },
  {
    path: 'kyc/:id',
    component: CustomerKycComponent
  },
  {
    path: 'groupCompany/:id',
    component: CustomerGCKycComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
