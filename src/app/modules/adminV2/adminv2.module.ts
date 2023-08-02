import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminV2RoutingModule } from './adminv2-routing.module';
import { ComponentModule } from './components/component.module';
import { AdminV2Component } from './adminv2component';
import { AdminChangePasswordComponent } from './modules/change-password/change-password.component';
import { AllMaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [AdminV2Component,AdminChangePasswordComponent,],
  imports: [CommonModule, ComponentModule, AdminV2RoutingModule,AllMaterialModule],
})
export class AdminV2Module {}
