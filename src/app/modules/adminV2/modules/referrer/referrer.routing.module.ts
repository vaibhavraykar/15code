import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { ReferrerListComponent } from './referrer-list/referrer-list.component';
import { ReferrerDetailsListComponent } from './referrer-details-list/referrer-details-list.component';
import { ViewReferrerComponent } from './view-referrer/view-referrer.component';
import { ViewDetailsRefComponent } from './view-details-ref/view-details-ref.component';
import { ReferrerKycComponent } from './referrer-kyc/referrer-kyc.component';

const routes: Routes = [

  { path: "", redirectTo: "/referrer/list", pathMatch: "full" },
  {
    path: 'list',
    component: ReferrerListComponent
  },
  {
    path:'refer-list',
    component:ReferrerDetailsListComponent
  },
  {
    path: 'referrerView/:id',
    component: ViewReferrerComponent
  },
  {
    path: 'referView/:id',
    component: ViewDetailsRefComponent
  },
  {
    path: 'kyc/:id',
    component: ReferrerKycComponent
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
export class ReferrerRoutingModule { }
