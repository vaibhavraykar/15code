import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserMangementComponent } from './user-mangement.component';
import { UserManagementRoutingModule } from './user-mangement-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { ViewuserComponent } from './view-user/view-user.component';
import { EdituserComponent } from './edit-user/edit-user.component';
import { AcceptRejectUserComponent } from './accept-reject-user/accept-reject-user.component';
import { CustomerFactoringModule } from "../../customer-factoring/customer-factoring.module";

@NgModule({
    declarations: [
        UserMangementComponent,
        UserListComponent,
        AddUserComponent,
        ViewuserComponent,
        EdituserComponent,
        AcceptRejectUserComponent
    ],
    exports: [
        UserMangementComponent,
        UserListComponent,
        AddUserComponent,
        ViewuserComponent,
        EdituserComponent,
        AcceptRejectUserComponent
    ],
    imports: [
        CommonModule,
        UserManagementRoutingModule,
        ComponentsModule,
        AllMaterialModule,
        CustomerFactoringModule
    ]
})
export class UserManagementModule { }