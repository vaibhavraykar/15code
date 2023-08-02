import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { ViewuserComponent } from './view-user/view-user.component';
import { EdituserComponent } from './edit-user/edit-user.component'
import { AcceptRejectUserComponent } from './accept-reject-user/accept-reject-user.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/user-list", pathMatch: "full" },
      {
        path: 'user-list',
        component:UserListComponent
      },{
        path:'add-user',
        component:AddUserComponent
      },{
        path:'viewuser/:id',
        component:ViewuserComponent
      },
      {
        path:'edit-user',
        component:EdituserComponent
      },{
        path:'accept-reject-user',
        component:AcceptRejectUserComponent
      }
    ]
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class UserManagementRoutingModule { }