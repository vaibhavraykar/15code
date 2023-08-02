import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllMaterialModule } from 'src/app/material-module';
import { ReferrerRoutingModule } from './referrer.routing.module';
import { ReferrerListComponent } from './referrer-list/referrer-list.component';
import { ReferrerTableComponent } from './referrer-table/referrer-table.component';
import { ReferrerDetailsListComponent } from './referrer-details-list/referrer-details-list.component';
import { ReferrerDetailsTableComponent } from './referrer-details-table/referrer-details-table.component';
import { ViewDetailsRefComponent } from './view-details-ref/view-details-ref.component';
import { ViewReferrerComponent } from './view-referrer/view-referrer.component';
import { ReferrerKycComponent } from './referrer-kyc/referrer-kyc.component';



@NgModule({
  declarations: [
    ReferrerListComponent,
    ReferrerTableComponent,
    ReferrerDetailsListComponent,
    ReferrerDetailsTableComponent,
    ViewDetailsRefComponent,
    ViewReferrerComponent,
    ReferrerKycComponent
  ],
  imports: [
    CommonModule,
    ReferrerRoutingModule,
    AllMaterialModule    
  ],
  exports:[
  ]
})
export class RefferrerV2Module { }