import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllMaterialModule } from 'src/app/material-module';
import { BulkRoutingModule } from './bulk-routing.module';
import { BulkUploadTranscationComponent } from './bulk-upload-transcation/bulk-upload-transcation.component';




@NgModule({
  declarations: [BulkUploadTranscationComponent],
  imports: [
    CommonModule,
    BulkRoutingModule,
    AllMaterialModule
  ]
})
export class BulkModule { }
