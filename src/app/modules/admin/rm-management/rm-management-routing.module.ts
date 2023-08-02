import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AssignGrantRmComponent } from '../rm-management/assign-grant-rm/assign-grant-rm.component';

const routes: Routes = [
    {
      path:'dsb',
      component: SidebarComponent,
      children: [
        { path: "", redirectTo: "/dsb/assign-grant-rm", pathMatch: "full" },
        {
          path: 'assign-grant-rm',
          component:AssignGrantRmComponent
        },
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
export class RMManagementRoutingModule { }