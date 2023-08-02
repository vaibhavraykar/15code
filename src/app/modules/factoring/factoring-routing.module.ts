import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongratulationComponent } from './components/congratulation/congratulation.component';
// import { TransactionPreviewComponent } from '../customer/transaction/pages/new-transaction/transaction-preview/transaction-preview.component';
// import { TransactionComponent } from '../customer/transaction/transaction.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { TransactionDetailsListComponent } from './components/transaction-details-list/transaction-details-list.component';
import { TransactionPreviewComponent } from './components/transaction-preview/transaction-preview.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ViewTransactionComponent } from './components/view-transaction/view-transaction.component';
import { FactoringComponent } from './factoring.component';
import { ViewPricingComponent } from './components/view-pricing/view-pricing.component';

const routes: Routes = [
  { 
    path: '', 
    component: FactoringComponent,
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent 
      },
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
        path:'view-pricing/:id',
        component:ViewPricingComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoringRoutingModule { }
