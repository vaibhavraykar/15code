import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { SecTransactionListComponent } from './sec-transaction-list/sec-transaction-list.component';
import { SecondaryTranRoutingModule } from './secondry-transaction-routing.module';
import { SecondaryTable } from './secondary-table/secondary-table.component';
import { SecQuotationListComponent } from './sec-quotation-list/sec-quotation-list.component';
import { PrimaryTransactionModule } from '../primary-transaction/primary-transaction.module';
import { ViewQuotationComponent } from './view-quotation/view-quotation.component';
import { SecQuoteTableComponent } from './sec-quote-table/sec-quote-table.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { SecTransDetailsComponent } from './transaction-details/sec-trans-details/sec-trans-details.component';
import { SecBankDetailsComponent } from './transaction-details/sec-bank-details/sec-bank-details.component';



@NgModule({
  declarations: [
    SecTransactionListComponent,
    SecondaryTable,
    SecQuotationListComponent,
    ViewQuotationComponent,
    SecQuoteTableComponent,
    TransactionDetailsComponent,
    SecTransDetailsComponent,
    SecBankDetailsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    AllMaterialModule,
    SecondaryTranRoutingModule,
  ]
})
export class SecondryTransactionModule { }
