import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FactorListComponent } from './factor-list/factor-list.component';
import { AddFactorComponent } from './add-factor/add-factor.component';
import { ViewFactorComponent } from './view-factor/view-factor.component';
import { EditFactorComponent } from './edit-factor/edit-factor.component';

const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/factor", pathMatch: "full" },
      {
        path: 'add-factor',
        component:AddFactorComponent
      },{
        path:'factor-list',
        component:FactorListComponent
      },
      {
        path:'view-factor',
        component:ViewFactorComponent
      },
      {
        path:'edit-factor',
        component:EditFactorComponent
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
export class FactorRoutingModule { }