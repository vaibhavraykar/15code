import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { SubscriptionMgmtComponent } from './subscription-mgmt.component';
import { SubscriptionMgmtRoutingModule } from './subscription-mgmt-routing.module';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { GrantSubscriptionComponent } from './grant-subscription/grant-subscription.component';
import { SubscriptionMgmtTable } from './subscription-table/subscription-table.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';





@NgModule({
    declarations: [
        SubscriptionMgmtComponent,
        SubscriptionListComponent,
        GrantSubscriptionComponent,
        SubscriptionMgmtTable,
        ViewSubscriptionComponent,
        AddSubscriptionComponent,
        EditSubscriptionComponent
       
    ],
    exports: [
        SubscriptionMgmtComponent,
        SubscriptionMgmtTable,
        GrantSubscriptionComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AllMaterialModule,
        SubscriptionMgmtRoutingModule
        


    ]
})
export class SubscriptionMgmtModule { }
