import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryTransactionComponent } from './primary-transaction.component';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { ViewQuoteComponent } from './components/view-quote/view-quote.component';

const routes: Routes = [
  {
    path:'',
    component:PrimaryTransactionComponent
  },
  { path: 'quotation-list/:id', component:QuotationListComponent},
  { path: 'view-quote/:id', component:ViewQuoteComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimaryTransactionRoutingModule { }
