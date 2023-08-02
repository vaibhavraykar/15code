import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AcceptRejectCouponsComponent} from './accept-reject-coupons/accept-reject-coupons.component';
import {DiscountCouponsComponent} from './discount-coupons/discount-coupons.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { NewCouponComponent } from './new-coupon/new-coupon.component';
const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/discount-coupons", pathMatch: "full" },
      {
        path: 'discount-coupons',
        component:DiscountCouponsComponent
      },{
        path:'accept-reject-coupons',
        component:AcceptRejectCouponsComponent
      },
      {
        path:'view-details/:id',
        component:ViewDetailsComponent
      },
      {
        path:'new-coupon',
        component:NewCouponComponent
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
export class DiscountManagementRoutingModule { }