import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FactorListComponent } from './factor-list/factor-list.component';
import { FactorViewComponent } from './factor-view/factor-baau-view.component';
import { CreateFactorComponent } from './create-factor/create-factor.component';
import { EditFactorComponent } from './edit-factor/edit-factor.component';

const routes: Routes = [

  { path: '',
    component:FactorListComponent
   },
  {
    path: 'create',
    component: CreateFactorComponent
  },
  {
    path: 'view',
    component: FactorViewComponent
  },
  {
    path: 'edit',
    component: EditFactorComponent
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
export class FactorRoutingModule { }
