import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { RefererRoutingModule } from './referer.routing.module';
import { RefererListComponent } from './referer-list/referer-list.component';
import { ViewRefererComponent } from './view-referer/view-referer.component';
import { RefererKycComponent } from './referer-kyc/referer-kyc.component';
import { ViewReferenceComponent } from './view-reference/view-reference.component';
import { ViewDetailsRefComponent } from './view-details-ref/view-details-ref.component';

@NgModule({
  declarations: [
    RefererListComponent,
    ViewRefererComponent,
    RefererKycComponent,
    ViewReferenceComponent,
    ViewDetailsRefComponent
  ],
  exports: [
    RefererListComponent,
    ViewRefererComponent,
    RefererKycComponent,
    ViewReferenceComponent,
    ViewDetailsRefComponent
  ],
  imports: [
    CommonModule,
    RefererRoutingModule,
    ComponentsModule,
    AllMaterialModule,
  ]
})
export class RefererModule { }
