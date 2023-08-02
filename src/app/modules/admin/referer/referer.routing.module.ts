import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RefererListComponent } from './referer-list/referer-list.component';
import { ViewRefererComponent } from './view-referer/view-referer.component';
import { RefererKycComponent } from './referer-kyc/referer-kyc.component';
import { ViewReferenceComponent } from './view-reference/view-reference.component';
import { ViewDetailsRefComponent } from './view-details-ref/view-details-ref.component';
const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/referer-list", pathMatch: "full" },
      {
        path: 'referer-list',
        component:RefererListComponent
      },
      {
        path: 'view-referer/:id',
        component:ViewRefererComponent
      },
      {
        path: 'referer-kyc/:id',
        component:RefererKycComponent
      },
      {
        path: 'view-reference',
        component:ViewReferenceComponent
      },
      {
        path: 'view-details-ref/:id',
        component:ViewDetailsRefComponent
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
export class RefererRoutingModule { }