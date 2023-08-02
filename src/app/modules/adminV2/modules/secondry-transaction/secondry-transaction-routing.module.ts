import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecTransactionListComponent } from './sec-transaction-list/sec-transaction-list.component';
import { SecQuotationListComponent } from './sec-quotation-list/sec-quotation-list.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { ViewQuotationComponent } from './view-quotation/view-quotation.component';


const routes: Routes = [
  { path: "", redirectTo: "/secondary-transaction/sec-transaction-list", pathMatch: "full" },
  {
    path: "sec-transaction-list",
    component: SecTransactionListComponent
  },
  { path: 'sec-quotation-list/:id', component: SecQuotationListComponent},
  { path: 'transaction-details/:id', component: TransactionDetailsComponent},
  { path: 'view-quotation/:id', component: ViewQuotationComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecondaryTranRoutingModule { }
