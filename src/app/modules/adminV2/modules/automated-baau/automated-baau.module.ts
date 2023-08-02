import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMaterialModule } from 'src/app/material-module';
import { AutomatedBaauRoutingModule } from './automated-baau.routing.module';
import { AutomatedBaauListComponent } from './automated-baau-list/automated-baau-list.component';
import { AutomatedBaauViewComponent } from './automated-baau-view/automated-baau-view.component';
import { AutomatedBaauTableComponent } from './automated-baau-table/automated-baau-table.component';
import { CreateAutomatedBaauViewComponent } from './create-automated-baau/create-automated-baau.component';
import { AutomatedBaauQuotationComponent } from './automated-baau-quotation/automated-baau-quotation/automated-baau-quotation.component';
import { AutomatedBaauQuotationTableComponent } from './automated-baau-quotation/automated-baau-quotation-table/automated-baau-quotation-table.component';
import { AutomatedBaauQuotationViewComponent } from './automated-baau-quotation/automated-baau-quotation-view/automated-baau-quotation-view.component';
import { AutomatedBaauTranViewComponent } from './automated-baau-quotation/automated-baau-tran-view/automated-baau-tran-view.component';


@NgModule({
  declarations: [
    AutomatedBaauTableComponent,
    AutomatedBaauListComponent,
    AutomatedBaauViewComponent,
    CreateAutomatedBaauViewComponent,
    AutomatedBaauQuotationComponent,
    AutomatedBaauQuotationTableComponent,
    AutomatedBaauQuotationViewComponent,
    AutomatedBaauTranViewComponent
  ],
  imports: [
    CommonModule,
    AutomatedBaauRoutingModule,
    AllMaterialModule
  ],
  exports: [
  ]
})
export class AutomatedBaauV2Module { }