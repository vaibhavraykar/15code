import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardStatusTabComponent } from './dashboard-status-tab/dashboard-status-tab.component';
import { DashboardAttentionTabComponent } from './dashboard-attention-tab/dashboard-attention-tab.component';
import { DashboardRevenueTabComponent } from './dashboard-revenue-tab/dashboard-revenue-tab.component';
import { DashboardTransactionTabComponent } from './dashboard-transaction-tab/dashboard-transaction-tab.component';
import { DashboardUsersTabComponent } from './dashboard-users-tab/dashboard-users-tab.component';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [DashboardComponent, DashboardStatusTabComponent, DashboardAttentionTabComponent, DashboardRevenueTabComponent, DashboardTransactionTabComponent, DashboardUsersTabComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  ReactiveFormsModule,
  MatTableModule,
  MatPaginatorModule,
  MatIconModule
  ]
})
export class DashboardModule { }
