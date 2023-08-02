import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { FactorRoutingModule } from './factor.routing.module';
import { FactorListComponent } from './factor-list/factor-list.component';
import { AddFactorComponent } from './add-factor/add-factor.component';
import { ViewFactorComponent } from './view-factor/view-factor.component';
import { EditFactorComponent } from './edit-factor/edit-factor.component';

@NgModule({
  declarations: [
    FactorListComponent,
    AddFactorComponent,
    ViewFactorComponent,
    EditFactorComponent
  ],
  imports: [
    CommonModule,
    FactorRoutingModule,
    ComponentsModule,
    AllMaterialModule,

  ],
  exports:[
    FactorListComponent,
    AddFactorComponent,
    ViewFactorComponent,
    EditFactorComponent
  ]
})
export class FactorModule { }