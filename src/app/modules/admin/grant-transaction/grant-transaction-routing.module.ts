import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { GrantComponent } from './grant-transactions/grant.component';
import { GrantPaymentComponent } from './grant-payment/grant-payment.component';
import { GrantKycComponent } from './grant-kyc/grant-kyc.component';
import { ViewKycComponent } from './view-kyc/view-kyc.component';
const routes: Routes = [
    {
      path:'dsb',
      component: SidebarComponent,
      children: [
        { path: "", redirectTo: "/dsb/grant", pathMatch: "full" },
        {
          path: 'grant',
          component:GrantComponent
        },
        {
          path: 'grant-payment',
          component:GrantPaymentComponent
        },
        {
          path: 'grant-kyc',
          component:GrantKycComponent
        },
        {
          path: 'view-kyc/:id',
          component:ViewKycComponent
        },
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
export class GrantTransactionModule { }