import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { GrantTransactionModule } from './grant-transaction-routing.module';
import { GrantComponent } from './grant-transactions/grant.component';
import { GrantPaymentComponent } from './grant-payment/grant-payment.component';
import { CustomerFactoringModule } from "../../customer-factoring/customer-factoring.module";
import { GrantKycComponent } from './grant-kyc/grant-kyc.component';
import { ViewKycComponent } from './view-kyc/view-kyc.component';


@NgModule({
    declarations: [
        GrantComponent,
        GrantPaymentComponent,
        GrantKycComponent,
        ViewKycComponent,
    ],
    exports: [
        GrantComponent,
        GrantPaymentComponent
    ],
    imports: [
        CommonModule,
        GrantTransactionModule,
        ComponentsModule,
        AllMaterialModule,
        CustomerFactoringModule
    ]
})
export class GrantModule { }
