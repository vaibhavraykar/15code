import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { PrimaryTransactionRoutingModule } from './primary-transaction-routing.module';
import { PrimaryTableComponent } from './components/primary-table/primary-table.component';
import { PrimaryTransactionComponent } from './primary-transaction.component';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { ViewQuoteComponent } from './components/view-quote/view-quote.component';
import { FilterPopupComponent } from '../../components/filter-popup/filter-popup.component';
import { QuoteTableComponent } from './components/quote-table/quote-table.component';
import { DatepickerComponent } from '../../components/datepicker/datepicker.component';



@NgModule({
  declarations: [PrimaryTransactionComponent,PrimaryTableComponent,QuoteTableComponent, QuotationListComponent, ViewQuoteComponent, FilterPopupComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    AllMaterialModule,
    PrimaryTransactionRoutingModule,
    DatepickerComponent
  ],
  exports:[
    QuoteTableComponent
  ]
})
export class PrimaryTransactionModule { }
