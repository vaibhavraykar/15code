import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactoringRoutingModule } from './factoring-routing.module';
import { FactoringComponent } from './factoring.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AllMaterialModule } from 'src/app/material-module';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SelectProductComponent } from './components/select-product/select-product.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionDetailsListComponent } from './components/transaction-details-list/transaction-details-list.component';
import { TransactionPreviewComponent } from './components/transaction-preview/transaction-preview.component';
import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';
import { ViewTransactionComponent } from './components/view-transaction/view-transaction.component';
import { CongratulationComponent } from './components/congratulation/congratulation.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { CustomerFactoringModule } from '../../customer-factoring/customer-factoring.module';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { ViewTransListComponent } from './components/view-trans-list/view-trans-list.component';
import { QuoatationListComponent } from './components/quoatation-list/quoatation-list.component';
import { ViewQuotationComponent } from './components/view-quotation/view-quotation.component';
import { DetailsFactoringComponent } from './components/details-factoring/details-factoring.component';

@NgModule({
  declarations: [
    FactoringComponent,
    NewTransactionComponent,
    // DashboardComponent,
    SelectProductComponent,
    TransactionDetailsComponent,
    TransactionsComponent,
    TransactionDetailsListComponent,
    TransactionPreviewComponent,
    EditTransactionComponent,
    ViewTransactionComponent,
    CongratulationComponent,
    AddCommentComponent,
    TransactionListComponent,
    ViewTransListComponent,
    QuoatationListComponent,
    ViewQuotationComponent,
    DetailsFactoringComponent,
  ],
  imports: [
    CommonModule,
    FactoringRoutingModule,
    AllMaterialModule,
    ComponentsModule,
    MatIconModule,
    CustomerFactoringModule

  ],
  exports:[

    NewTransactionComponent,
    // DashboardComponent,
    SelectProductComponent,
    TransactionDetailsComponent,
    TransactionsComponent,
    TransactionDetailsListComponent,
    TransactionPreviewComponent,
    TransactionListComponent,
    ViewTransListComponent
  ]
})
export class FactoringModule { }
