import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { RmManagementComponent } from './rm-management.component';
import { RMManagementRoutingModule } from './rm-management-routing.module';
import { RmListComponent } from './rm-list/rm-list.component';
import { RMTableComponent } from './rm-table/rm-table.component';



@NgModule({
    declarations: [
     RmManagementComponent,
     RmListComponent,
     RMTableComponent
    ],
    exports: [
       RmManagementComponent,
       RMTableComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AllMaterialModule,
        RMManagementRoutingModule
    ],


})
export class RMManagementModule { }
