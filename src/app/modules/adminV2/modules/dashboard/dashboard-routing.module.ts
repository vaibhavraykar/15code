import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardStatusTabComponent } from './dashboard-status-tab/dashboard-status-tab.component';
import { DashboardAttentionTabComponent } from './dashboard-attention-tab/dashboard-attention-tab.component';
import { DashboardRevenueTabComponent } from './dashboard-revenue-tab/dashboard-revenue-tab.component';
import { DashboardTransactionTabComponent } from './dashboard-transaction-tab/dashboard-transaction-tab.component';
import { DashboardUsersTabComponent } from './dashboard-users-tab/dashboard-users-tab.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'status', component: DashboardStatusTabComponent },
      { path: 'actions-needed', component: DashboardAttentionTabComponent },
      { path: 'revenue-analysis', component: DashboardRevenueTabComponent },
      { path: 'transaction-analysis', component: DashboardTransactionTabComponent },
      { path: 'user-analysis', component: DashboardUsersTabComponent },
      { path: '', redirectTo: 'status', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
