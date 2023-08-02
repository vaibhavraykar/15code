import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactoringRoutingModule } from './factoring-routing.module';
import { FactoringComponent } from './factoring.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AllMaterialModule } from 'src/app/material-module';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SelectProductComponent } from './components/select-product/select-product.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionDetailsListComponent } from './components/transaction-details-list/transaction-details-list.component';
import { TransactionPreviewComponent } from './components/transaction-preview/transaction-preview.component';
import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';
import { ViewTransactionComponent } from './components/view-transaction/view-transaction.component';
import { CongratulationComponent } from './components/congratulation/congratulation.component';
import { UploadTransactionPopupComponent } from './components/upload-transaction-popup/upload-transaction-popup.component';
import { ViewPricingComponent } from './components/view-pricing/view-pricing.component';


@NgModule({
  declarations: [
    FactoringComponent,
    HeaderBarComponent,
    NewTransactionComponent,
    DashboardComponent,
    SelectProductComponent,
    TransactionDetailsComponent,
    TransactionsComponent,
    TransactionDetailsListComponent,
    TransactionPreviewComponent,
    EditTransactionComponent,
    ViewTransactionComponent,
    CongratulationComponent,
    UploadTransactionPopupComponent,
    ViewPricingComponent
  ],
  imports: [
    CommonModule,
    FactoringRoutingModule,
    AllMaterialModule,
    ComponentsModule,
    MatIconModule
  ],
  exports:[

    NewTransactionComponent,
    DashboardComponent,
    SelectProductComponent,
    TransactionDetailsComponent,
    TransactionsComponent,
    TransactionDetailsListComponent,
    TransactionPreviewComponent
  ]
})
export class FactoringModule { }
