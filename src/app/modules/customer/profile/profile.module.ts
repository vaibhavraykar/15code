import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { SupportComponent } from './support/support.component';
import { CreditTransactionsComponent } from './credit-transactions/credit-transactions.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { VASPlanComponent } from './vas-plan/vas-plan.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

import { ProfileRoutingModule } from 'src/app/modules/customer/profile/profile.routing.module';
import { CustomerModule } from '../customer.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';
import { KycSuccessPageComponent } from './kyc-success-page/kyc-success-page.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { PostpaidTransactionPopupComponent } from './postpaid-transaction-popup/postpaid-transaction-popup.component';
import { PostpaidTransactionSuccessComponent } from './postpaid-transaction-success/postpaid-transaction-success.component';
import { MatIconModule } from '@angular/material/icon';
import {SubscriptionDetailPopupComponent} from './subscription-detail-popup/subscription-detail-popup.component'
import { CreditsFilterPopupComponent } from './credits-filter-popup/credits-filter-popup.component';
import { SendEmailPopupComponent } from './send-email-popup/send-email-popup.component';
import { ProfileUpdatePopupComponent } from './profile-update-popup/profile-update-popup.component';


@NgModule({
  declarations: [
    MyProfileComponent,
    ManageGroupsComponent,
    SupportComponent,
    CreditTransactionsComponent,
    SubscriptionComponent,
    VASPlanComponent,
    ChangePasswordComponent,
    PersonalDetailsComponent,
    BusinessDetailsComponent,
    KycDetailsComponent,
    KycSuccessPageComponent,
    PostpaidTransactionPopupComponent,
    PostpaidTransactionSuccessComponent,
    SubscriptionDetailPopupComponent,
    CreditsFilterPopupComponent,
    SendEmailPopupComponent,
    ProfileUpdatePopupComponent,
  ],
  imports: [
    AllMaterialModule,
    CommonModule,
    ProfileRoutingModule,
    CustomerModule,
    ComponentsModule,
    NgxPayPalModule,
    MatIconModule,
  ],
  exports: [
    SupportComponent,
    ChangePasswordComponent,

    CreditTransactionsComponent,
  ],
})
export class ProfileModule {}
