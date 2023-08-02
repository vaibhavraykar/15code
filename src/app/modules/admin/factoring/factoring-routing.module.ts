import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CongratulationComponent } from './components/congratulation/congratulation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { TransactionDetailsListComponent } from './components/transaction-details-list/transaction-details-list.component';
import { TransactionPreviewComponent } from './components/transaction-preview/transaction-preview.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ViewTransactionComponent } from './components/view-transaction/view-transaction.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { ViewTransListComponent } from './components/view-trans-list/view-trans-list.component';
import { QuoatationListComponent } from './components/quoatation-list/quoatation-list.component';
import { ViewQuotationComponent } from './components/view-quotation/view-quotation.component';
import { FactoringComponent } from './factoring.component';
import { DetailsFactoringComponent } from './components/details-factoring/details-factoring.component';

const routes: Routes = [
  { 
    path: '', 
    component:SidebarComponent,
    children: [
      // { 
      //   path: 'dashboard', 
      //   component: DashboardComponent 
      // },
      { 
        path: 'new-transact', 
        component: NewTransactionComponent ,
      },
      {
        path:'transaction',
        component:TransactionsComponent
      },
      {
        path:'transaction-preview',
        component:TransactionPreviewComponent
      },
      {
        path:'transaction-details',
        component:TransactionDetailsListComponent
      },
      {
        path:'edit-transaction/:id',
        component:EditTransactionComponent
      },
      {
        path:'view-transaction/:id',
        component:ViewTransactionComponent
      },
      {
        path: 'success',
        component:CongratulationComponent
      },
      {
        path:'transaction-list',
        component:TransactionListComponent
      },
      {
        path:'view-trans-list/:id',
        component:ViewTransListComponent
      },
      {
        path:'quoatation-list/:id',
        component:QuoatationListComponent
      },
      {
        path:'view-quotation/:id',
        component:ViewQuotationComponent
      },
      {
        path:'details-factoring/:id',
        component:DetailsFactoringComponent
      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoringRoutingModule { }
