import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { GrantRequestsComponent } from './grant-requests.component';
import { GrantRequestsRoutingModule } from './grant-requests-routing.module';
import { GrantPaymentComponent } from './grant-payment/grant-payment.component';
import { GrantKycComponent } from './grant-kyc/grant-kyc.component';
import { GrantRequestTableComponent } from './grant-table/grant-table.component';
import { DiscountManagementModule } from "../discount-mgmt/discount-mgmt.module";
import { UserManagementModule } from '../user-mgmt/user-mgmt.module';
import { ViewKycComponent } from './view-kyc/view-kyc.component';
import { GrantRmComponent } from './grant-rm/grant-rm.component';
import { GrantTransactionComponent } from './grant-transaction/grant-transaction.component';
import { SubscriptionMgmtModule } from '../subscription-mgmt/subscription-mgmt.module';
import { GrantGCKycComponent } from './grant-gc-kyc/grant-gc-kyc.component';
import { GCViewKycComponent } from './gc-view-kyc/gc-view-kyc.component';
import { GrantBulkTransaction } from './grant-bulk-transaction/grant-bulk-transaction.component';


 


@NgModule({
    declarations: [
        GrantRequestsComponent,
        GrantPaymentComponent,
        GrantKycComponent,
        GrantRequestTableComponent,
        ViewKycComponent,
        GrantRmComponent,
        GrantTransactionComponent,
        GrantGCKycComponent,
        GCViewKycComponent,
        GrantBulkTransaction
    ],
    exports: [
        GrantRequestsComponent,
        GrantRequestTableComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AllMaterialModule,
        GrantRequestsRoutingModule,
        DiscountManagementModule,
        UserManagementModule,
        SubscriptionMgmtModule
    ]
})
export class GrantRequestModule { }
