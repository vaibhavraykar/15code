import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { RMManagementRoutingModule } from './rm-management-routing.module';
import { AssignGrantRmComponent } from './assign-grant-rm/assign-grant-rm.component';


@NgModule({
  declarations: [
    AssignGrantRmComponent,
  ],
  imports: [
    CommonModule,
    RMManagementRoutingModule,
    ComponentsModule,
    AllMaterialModule,
    
  ],
  exports: [
    AssignGrantRmComponent
  ]
})
export class RmModule { }
