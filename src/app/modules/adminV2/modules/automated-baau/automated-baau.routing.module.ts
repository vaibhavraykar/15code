import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AutomatedBaauListComponent } from './automated-baau-list/automated-baau-list.component';
import { AutomatedBaauViewComponent } from './automated-baau-view/automated-baau-view.component';
import { CreateAutomatedBaauViewComponent } from './create-automated-baau/create-automated-baau.component';
import { AutomatedBaauQuotationComponent } from './automated-baau-quotation/automated-baau-quotation/automated-baau-quotation.component';
import { AutomatedBaauTranViewComponent } from './automated-baau-quotation/automated-baau-tran-view/automated-baau-tran-view.component';
import { AutomatedBaauQuotationViewComponent } from './automated-baau-quotation/automated-baau-quotation-view/automated-baau-quotation-view.component';

const routes: Routes = [
  { path: "", redirectTo: "/list", pathMatch: "full" },
  {
    path: 'list',
    component:AutomatedBaauListComponent
  },
  {
    path: 'view',
    component:AutomatedBaauViewComponent
  },
  {
    path: 'create',
    component:CreateAutomatedBaauViewComponent
  },
  {
    path:'quotation/:id',
    component:AutomatedBaauQuotationComponent
  },
  {
    path:'details/:id',
    component:AutomatedBaauTranViewComponent
  },
  {
    path:'quotationDetails/:id',
    component:AutomatedBaauQuotationViewComponent
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
export class AutomatedBaauRoutingModule { }
