import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMaterialModule } from 'src/app/material-module';
import { BaauRoutingModule } from './baau.routing.module';
import { BaauTableComponent } from './baau-table/baau-table.component';
import { BaauListComponent } from './baau-list/baau-list.component';
import { BaauViewComponent } from './baau-view/baau-view.component';
import { BaauKycComponent } from './baau-kyc/baau-kyc.component';
import { BaauPlanAndPaymentComponent } from './baau-planAndPayment/baau-planAndPayment.component';
import { BaauQuotationComponent } from './baau-quotation/baau-quotation/baau-quotation.component';
import { BaauQuotationTableComponent } from './baau-quotation/baau-quotation-table/baau-quotation-table.component';
import { BaauTranViewComponent } from './baau-quotation/baau-tran-view/baau-tran-view.component';
import { BaauQuotationViewComponent } from './baau-quotation/baau-quotation-view/baau-quotation-view.component';
import { BaauAddUserKycComponent } from './baau-addUser-kyc/baau-addUser-kyc.component';


@NgModule({
  declarations: [
    BaauTableComponent,
    BaauListComponent,
    BaauViewComponent,
    BaauKycComponent,
    BaauPlanAndPaymentComponent,
    BaauTranViewComponent,
    BaauQuotationComponent,
    BaauQuotationTableComponent,
    BaauQuotationViewComponent,
    BaauAddUserKycComponent
  ],
  imports: [
    CommonModule,
    BaauRoutingModule,
    AllMaterialModule    
    ],
  exports:[
  ]
})
export class BaauV2Module { }