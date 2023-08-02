import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaauListComponent } from './baau-list/baau-list.component';
import { BaauViewComponent } from './baau-view/baau-view.component';
import { BaauKycComponent } from './baau-kyc/baau-kyc.component';
import { BaauPlanAndPaymentComponent } from './baau-planAndPayment/baau-planAndPayment.component';
import { BaauTranViewComponent } from './baau-quotation/baau-tran-view/baau-tran-view.component';
import { BaauQuotationComponent } from './baau-quotation/baau-quotation/baau-quotation.component';
import { BaauQuotationViewComponent } from './baau-quotation/baau-quotation-view/baau-quotation-view.component';
import { BaauAddUserKycComponent } from './baau-addUser-kyc/baau-addUser-kyc.component';

const routes: Routes = [
  { path: "", redirectTo: "/list", pathMatch: "full" },
  {
    path: 'list',
    component:BaauListComponent
  },
  {
    path: 'view/:id',
    component:BaauViewComponent
  },
  {
    path:'planAndPayment/:id',
  component:BaauPlanAndPaymentComponent
},
{
  path:'kyc/:id',
  component:BaauKycComponent
},
{
  path:'quotation/:id',
  component:BaauQuotationComponent
},
{
  path:'details/:id',
  component:BaauTranViewComponent
},
{
  path:'quotationDetails/:id',
  component:BaauQuotationViewComponent
},
{
  path:'user/:id',
  component:BaauAddUserKycComponent
}

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class BaauRoutingModule { }
