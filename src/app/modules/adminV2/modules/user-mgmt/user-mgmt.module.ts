import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { UserMgmtRoutingModule } from './user-mgmt-routing.module';
import { UserMgmtComponent } from './user-mgmt.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserMgmtTableComponent } from './user-mgmt-table/user-mgmt-table.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ApproveRejectUserComponent } from './approve-reject-user/approve-reject-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';



@NgModule({
    declarations: [
        UserMgmtComponent,
        UserListComponent,
        UserMgmtTableComponent,
        ViewUserComponent,
        AddUserComponent,
        ApproveRejectUserComponent,
        EditUserComponent
    ],
    exports: [
        UserMgmtComponent,
        ApproveRejectUserComponent,
        UserListComponent,
        UserMgmtTableComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AllMaterialModule,
        UserMgmtRoutingModule,
    ],


})
export class UserManagementModule { }
