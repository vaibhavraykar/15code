import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFactoringSidebarComponent } from './customer-factoring-sidebar/customer-factoring-sidebar.component';
import { CustomerSendOtpComponent } from './customer-send-otp/customer-send-otp.component';
import { NewRequestFactoringComponent } from './new-request-factoring/new-request-factoring.component';
import { CommonModule } from '@angular/common';
import { ViewTranFactoringComponent } from './view-tran-factoring/view-tran-factoring.component';
import { ActiveTranFactoringComponent } from './active-tran-factoring/active-tran-factoring.component';
import { HisTranFactoringComponent } from './his-tran-factoring/his-tran-factoring.component';

const routes: Routes = [
  {
    path:'',
    component: CustomerFactoringSidebarComponent,
    children: [
      {
        path:'new-request',
        component:NewRequestFactoringComponent
      },{
        path:'view-tran/:id',
        component:ViewTranFactoringComponent
      },
      {
        path:'active-tran',
        component:ActiveTranFactoringComponent
      },{
        path:'history-tran',
        component:HisTranFactoringComponent
      }
    ]
  },
  { 
        path: 'verification', 
        component: CustomerSendOtpComponent,
        pathMatch:"full"
  },

];

@NgModule({ 
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CustomerFactoringRoutingModule { }
