import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMaterialModule } from 'src/app/material-module';
import { FactorRoutingModule } from './factor.routing.module';
import { FactorTableComponent } from './factor-table/factor-table.component';
import { FactorListComponent } from './factor-list/factor-list.component';
import { FactorViewComponent } from './factor-view/factor-baau-view.component';
import { CreateFactorComponent } from './create-factor/create-factor.component';
import { EditFactorComponent } from './edit-factor/edit-factor.component';


@NgModule({
  declarations: [
    FactorTableComponent,
    FactorListComponent,
    FactorViewComponent,
    CreateFactorComponent,
    EditFactorComponent
  ],
  imports: [
    CommonModule,
    FactorRoutingModule,
    AllMaterialModule    
  ],
  exports:[
  ]
})
export class FactorV2Module { }