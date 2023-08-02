import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from 'src/app/modules/customer/customer.component';
import { PaypalCancelComponent } from './paypal-cancel/paypal-cancel.component';
import { PaypalComponent } from './paypal/paypal.component';
import { VerificationGuard } from 'src/app/core/verificationGuard';

const routes: Routes = [
    { 
      path: '',
      component:CustomerComponent
    },
    { 
      path: 'transactions',
      loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      canActivate:[VerificationGuard]  
    },
    { 
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate:[VerificationGuard] 
    },
    { 
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) 
    },
    {
      path:'paypal/complete',
      component:PaypalComponent
    },{
      path:'paypal/cancel',
      component:PaypalCancelComponent
    }
   
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
