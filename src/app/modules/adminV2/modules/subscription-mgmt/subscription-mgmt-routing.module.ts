import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';


const routes: Routes = [
  { path: "", redirectTo: "/subscription-management/subscription-list", pathMatch: "full" },
  {
    path: 'subscription-list',
    component: SubscriptionListComponent,
  },
  {
    path: 'add-subscription',
    component: AddSubscriptionComponent,
  },
  {
    path: 'edit-subscription/:id',
    component: EditSubscriptionComponent,
  },
  {
    path: 'view-subscription/:id',
    component: ViewSubscriptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionMgmtRoutingModule { }
