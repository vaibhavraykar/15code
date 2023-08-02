import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMaterialModule } from 'src/app/material-module';
import { CorporateTransactionV2RoutingModule } from './corporate-transaction.routing.module';
import { CorporateTransactionTableComponent } from './corporate-transaction-table/corporate-transaction-table.component';
import { CorporateTransactionListComponent } from './corporate-transaction-list/corporate-transaction-list.component';
import { CorporateTransactionViewComponent } from './corporate-transaction-view/corporate-transaction-view.component';
import { CorporateTransactionFactorViewComponent } from './corporate-transaction-factor-view/corporate-transaction-factor-view.component';


@NgModule({
  declarations: [
    CorporateTransactionTableComponent,
    CorporateTransactionListComponent,
    CorporateTransactionViewComponent,
    CorporateTransactionFactorViewComponent
  ],
  imports: [
    CommonModule,
    CorporateTransactionV2RoutingModule,
    AllMaterialModule    
  ],
  exports:[
  ]
})
export class CorporateTransactionV2Module { }