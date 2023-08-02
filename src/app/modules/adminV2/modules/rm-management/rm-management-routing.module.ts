import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RmListComponent } from './rm-list/rm-list.component';

const routes: Routes = [
  { path: "", redirectTo: "/rm/rm-list", pathMatch: "full" },
  {
    path: 'rm-list',
    component: RmListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RMManagementRoutingModule { }
