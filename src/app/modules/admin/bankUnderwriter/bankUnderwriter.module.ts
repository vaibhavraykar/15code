import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
// import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';
// import { CustomerViewComponent } from './customer-view/customer-view.component';
import { BankUnderwriterRoutingModule } from './bankUnderwriter.routing.module';
import { BankUnderwriterListComponent } from './bankUnderwriter-list/bankUnderwriter-list.component';
import { BankUnderwriterViewComponent } from './bankUnderwriter-view/bankUnderwriter-view.component';
import { BankUnderwriterKycComponent } from './bankUnderwriter-kyc/bankUnderwriter-kyc.component';
import { BankUnderwriterQuotationComponent } from './banUnderwriter-quotation/banUnderwriter-quotation.component';
import { BankUnderwriterQuotationViewComponent } from './bankUnderwriter-quotation-view/bankUnderwriter-quotation-view.component';
import { CustomerFactoringModule } from '../../customer-factoring/customer-factoring.module';


@NgModule({
  declarations: [
    BankUnderwriterListComponent,
    BankUnderwriterViewComponent,
    BankUnderwriterKycComponent,
    BankUnderwriterQuotationComponent,
    BankUnderwriterQuotationViewComponent,


  ],
  imports: [
    CommonModule,
    BankUnderwriterRoutingModule,
    ComponentsModule,
    AllMaterialModule,
    CustomerFactoringModule

  ],
  exports:[
    BankUnderwriterListComponent,
    BankUnderwriterViewComponent,
    BankUnderwriterKycComponent,
    BankUnderwriterQuotationComponent,
    BankUnderwriterQuotationViewComponent,
    
  ]
})
export class bankUnderwriterModule { }