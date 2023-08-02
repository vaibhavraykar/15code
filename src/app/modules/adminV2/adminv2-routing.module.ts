import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDetailsComponent } from './components/all-details/all-details.component';
import { AdminV2Component } from './adminv2component';

const routes: Routes = [
  {
    path: '',
    component: AdminV2Component,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },

      {
        path: 'customer',
        loadChildren: () =>
          import('./modules/customers/customer.module').then(
            (m) => m.CustomerV2Module
          ),
      },
      {
        path: 'baau',
        loadChildren: () =>
          import('./modules/baau/baau.module').then((m) => m.BaauV2Module),
      },
      {
        path: 'discount-management',
        loadChildren: () =>
          import('./modules/discount-mgmt/discount-mgmt.module').then(
            (m) => m.DiscountManagementModule
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./modules/user-mgmt/user-mgmt.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'grant-requests',
        loadChildren: () =>
          import('./modules/grant-requests/grant-requests.module').then(
            (m) => m.GrantRequestModule
          ),
      },
      {
        path: 'primary-transaction',
        loadChildren: () =>
          import(
            './modules/primary-transaction/primary-transaction.module'
          ).then((m) => m.PrimaryTransactionModule),
      },
      {
        path: 'secondary-transaction',
        loadChildren: () =>
          import(
            './modules/secondry-transaction/secondry-transaction.module'
          ).then((m) => m.SecondryTransactionModule),
      },
      {
        path: 'view/:id',
        component: AllDetailsComponent,
      },
      {
        path: 'referrer',
        loadChildren: () =>
          import('./modules/referrer/referrer.module').then(
            (m) => m.RefferrerV2Module
          ),
      },
      {
        path: 'automated-baau',
        loadChildren: () =>
          import('./modules/automated-baau/automated-baau.module').then(
            (m) => m.AutomatedBaauV2Module
          ),
      },
      {
        path: 'corporate-transaction',
        loadChildren: () =>
          import('./modules/corporate-transaction/corporate-transaction.module').then(
            (m) => m.CorporateTransactionV2Module
          ),
        },
        {
        path: 'rm',
        loadChildren: () =>
          import('./modules/rm-management/rm-management.module').then(
            (m) => m.RMManagementModule
          ),
      },
      {
        path: 'subscription-management',
        loadChildren: () =>
          import('./modules/subscription-mgmt/subscription-mgmt.module').then(
            (m) => m.SubscriptionMgmtModule
          ),
      },
      {
        path: 'factor',
        loadChildren: () =>
        import('./modules/factor/factor.module').then(
          (m)=> m.FactorV2Module
        ),
      },
      {
        path: 'report',
        loadChildren: () =>
        import('./modules/report/report.module').then(
          (m)=> m.ReportModule
        ),
      },
      {
        path: 'bulk-upload',
        loadChildren: () =>
        import('./modules/bulk-Upload/bulk.module').then(
          (m)=> m.BulkModule
        ),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminV2RoutingModule {}
