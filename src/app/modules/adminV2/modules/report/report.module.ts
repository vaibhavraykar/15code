import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report.routing.module';
import { AllMaterialModule } from 'src/app/material-module';
import { ReportDownloadComponent } from './report-download/report-download.component';



@NgModule({
  declarations: [ReportDownloadComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    AllMaterialModule
  ]
})
export class ReportModule { }
