import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllMaterialModule } from 'src/app/material-module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ComponentsModule } from 'src/app/components/components.module';
import { DiscountManagementRoutingModule } from './discount-mgmt-routing.module';
import { DiscountMgmtComponent } from './discount-mgmt.component';
import { DiscountCouponsComponent } from './discount-coupons/discount-coupons.component';
import { AcceptRejectCouponComponent } from './accept-reject-coupon/accept-reject-coupon.component';
import { DiscountMgmtTableComponent } from './discount-mgmt-table/discount-mgmt-table.component';
import { NewCouponComponent } from './new-coupon/new-coupon.component';
import { ViewCouponComponent } from './view-coupon/view-coupon.component';




@NgModule({
    declarations: [
        DiscountMgmtComponent,
        DiscountCouponsComponent,
        AcceptRejectCouponComponent,
        DiscountMgmtTableComponent,
        NewCouponComponent,
        ViewCouponComponent
    ],
    exports: [
        DiscountMgmtComponent,
        DiscountCouponsComponent,
        AcceptRejectCouponComponent,
        DiscountMgmtTableComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AllMaterialModule,
        MatSlideToggleModule,
        DiscountManagementRoutingModule,
    ],


})
export class DiscountManagementModule { }
