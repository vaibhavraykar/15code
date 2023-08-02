import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerPlanPaymentComponent } from './customer-planPayment/customer-planPayment.component';

const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/customer-kyc", pathMatch: "full" },
      {
        path: 'customer-kyc/:id',
        component:CustomerKycComponent
      },
      {
        path: 'customer-list',
        component:CustomerListComponent
      },
      {
        path:'customer-view/:id',
        component:CustomerViewComponent
      },
      {
        path:'planPayment/:id',
        component:CustomerPlanPaymentComponent
      }

    ]
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CustomerRoutingModule { }