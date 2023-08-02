import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { UserListComponent } from './user-list/user-list.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ApproveRejectUserComponent } from './approve-reject-user/approve-reject-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  { path: "", redirectTo: "/user-management/user-list", pathMatch: "full" },
      {
        path: 'user-list',
        component: UserListComponent,
      },
      {
        path: 'view-user/:id',
        component: ViewUserComponent,
      },
      {
        path: 'add-user',
        component: AddUserComponent,
      },
      {
        path: 'approve-reject-user',
        component: ApproveRejectUserComponent,
      },
      {
        path: 'edit-user',
        component: EditUserComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMgmtRoutingModule { }
