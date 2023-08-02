import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationGuard } from './core/verificationGuard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate:[VerificationGuard]
  },
  {
    path: 'adminv2',
    loadChildren: () => import('./modules/adminV2/adminv2.module').then(m => m.AdminV2Module),
    canActivate:[VerificationGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule) ,
  },
  {path:'baau',loadChildren:() => import('./modules/baau-automated/baau-automated.module').then(m=>m.BaauAutomatedModule), canActivate:[VerificationGuard]},

  { path: 'factoring', loadChildren: () => import('./modules/factoring/factoring.module').then(m => m.FactoringModule), canActivate:[VerificationGuard] },
  {path:'cust',loadChildren:() => import('./modules/customer-factoring/customer-factoring.module').then(m=>m.CustomerFactoringModule), canActivate:[VerificationGuard]},
  { path: 'bank-underwriter', loadChildren: () => import('./modules/bank-underwriter/bank-underwriter.module').then(m => m.BankUnderwriterModule), canActivate:[VerificationGuard] },
  {
    path: "**",
    redirectTo: "/auth/login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
