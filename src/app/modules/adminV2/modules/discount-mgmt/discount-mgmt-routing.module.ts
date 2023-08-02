import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountMgmtComponent } from './discount-mgmt.component';
import { DiscountCouponsComponent } from './discount-coupons/discount-coupons.component';
import { AcceptRejectCouponComponent } from './accept-reject-coupon/accept-reject-coupon.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NewCouponComponent } from './new-coupon/new-coupon.component';
import { ViewCouponComponent } from './view-coupon/view-coupon.component';

const routes: Routes = [
  { path: "", redirectTo: "/discount-management/discount-coupons", pathMatch: "full" },
  {
    path: 'discount-coupons',
    component: DiscountCouponsComponent,
  },
  {
    path: 'accept-reject-coupon',
    component: AcceptRejectCouponComponent,
  },
  {
    path: 'new-coupon',
    component: NewCouponComponent,
  },
  {
    path: 'view-coupon/:id',
    component: ViewCouponComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountManagementRoutingModule { }
