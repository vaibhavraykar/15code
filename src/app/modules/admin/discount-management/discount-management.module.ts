import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DiscountManagementRoutingModule } from './discount-management-routing.module';
import { DiscountManagementComponent } from './discount-management.component';
import { DiscountCouponsComponent } from './discount-coupons/discount-coupons.component';
import { AcceptRejectCouponsComponent } from './accept-reject-coupons/accept-reject-coupons.component';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { NewCouponComponent } from './new-coupon/new-coupon.component';
import { CustomerFactoringModule } from "../../customer-factoring/customer-factoring.module";


@NgModule({
    declarations: [
        DiscountManagementComponent,
        DiscountCouponsComponent,
        AcceptRejectCouponsComponent,
        ViewDetailsComponent,
        NewCouponComponent
    ],
    exports: [
        DiscountManagementComponent,
        DiscountCouponsComponent,
        AcceptRejectCouponsComponent
    ],
    imports: [
        CommonModule,
        DiscountManagementRoutingModule,
        ComponentsModule,
        AllMaterialModule,
        CustomerFactoringModule
    ]
})
export class DiscountManagementModule { }
