import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { CorporateTransactionListComponent } from './corporate-transaction-list/corporate-transaction-list.component';
import { CorporateTransactionViewComponent } from './corporate-transaction-view/corporate-transaction-view.component';
import { CorporateTransactionFactorViewComponent } from './corporate-transaction-factor-view/corporate-transaction-factor-view.component';

const routes: Routes = [

  {
    path:'',
    component:CorporateTransactionListComponent
  },
  {
    path: 'view/:id',
    component: CorporateTransactionViewComponent
  },
  {
    path: 'factor-view/:id',
    component: CorporateTransactionFactorViewComponent
  },
  // {
  //   path: 'kyc/:id',
  //   component: CustomerKycComponent
  // }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class CorporateTransactionV2RoutingModule { }
