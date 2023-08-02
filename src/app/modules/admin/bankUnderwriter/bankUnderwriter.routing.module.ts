import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BankUnderwriterListComponent } from './bankUnderwriter-list/bankUnderwriter-list.component';
import { BankUnderwriterViewComponent } from './bankUnderwriter-view/bankUnderwriter-view.component';
import { BankUnderwriterKycComponent } from './bankUnderwriter-kyc/bankUnderwriter-kyc.component';
import { BankUnderwriterQuotationComponent } from './banUnderwriter-quotation/banUnderwriter-quotation.component';
import { BankUnderwriterQuotationViewComponent } from './bankUnderwriter-quotation-view/bankUnderwriter-quotation-view.component';

const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/baau-list", pathMatch: "full" },
      {
        path: 'baau-kyc/:id',
        component:BankUnderwriterKycComponent
      },
      {
        path: 'baau-list',
        component:BankUnderwriterListComponent
      },
      {
        path:'baau-view/:id',
        component:BankUnderwriterViewComponent
      },
      {
        path:'baau/quotation/:id',
        component:BankUnderwriterQuotationComponent
      },
      {
        path:'baau/quotation/view/:id',
        component:BankUnderwriterQuotationViewComponent
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
export class BankUnderwriterRoutingModule { }