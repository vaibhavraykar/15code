import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaauAutomatedComponent } from './baau-automated.component';
import { AllMaterialModule } from 'src/app/material-module';
import { NgOtpInputModule } from 'ng-otp-input';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    BaauAutomatedComponent
  ],
  imports: [
    CommonModule,
    NgOtpInputModule,
    ComponentsModule,
    AllMaterialModule,
    RouterModule.forChild([
      {
        path: 'verification',
        component: BaauAutomatedComponent,
        pathMatch:"full"
      }
      // Add more routes here if needed
    ])
  ]
})
export class BaauAutomatedModule { }
