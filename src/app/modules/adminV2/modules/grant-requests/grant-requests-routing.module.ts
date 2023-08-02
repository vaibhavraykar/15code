import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { GrantPaymentComponent } from './grant-payment/grant-payment.component';
import { GrantKycComponent } from './grant-kyc/grant-kyc.component';
import { GrantRequestsComponent } from './grant-requests.component';
import { ApproveRejectUserComponent } from '../user-mgmt/approve-reject-user/approve-reject-user.component';
import { AcceptRejectCouponComponent } from '../discount-mgmt/accept-reject-coupon/accept-reject-coupon.component';
import { ViewKycComponent } from './view-kyc/view-kyc.component';
import { GrantRmComponent } from './grant-rm/grant-rm.component';
import { GrantTransactionComponent } from './grant-transaction/grant-transaction.component';
import { GrantSubscriptionComponent } from '../subscription-mgmt/grant-subscription/grant-subscription.component';
import { GrantGCKycComponent } from './grant-gc-kyc/grant-gc-kyc.component';
import { GCViewKycComponent } from './gc-view-kyc/gc-view-kyc.component';
import { GrantBulkTransaction } from './grant-bulk-transaction/grant-bulk-transaction.component';


const routes: Routes = [
  {
    path: '',
    component: GrantRequestsComponent,
    children: [
      { path: 'payment', component: GrantPaymentComponent },
      { path: 'kyc', component: GrantKycComponent },
      { path: 'users', component: ApproveRejectUserComponent },
      { path: 'coupons', component: AcceptRejectCouponComponent },
      { path: 'grant-rm', component: GrantRmComponent },
      { path: 'transaction', component: GrantTransactionComponent },
      { path: 'subscription', component: GrantSubscriptionComponent },
      { path: 'groupCompany-kyc', component: GrantGCKycComponent },
      {path:'bulktransaction', component:GrantBulkTransaction},
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ],
  },
  { path: 'view-kyc/:id', component: ViewKycComponent },
  { path: 'groupCompany-view-kyc', component: GCViewKycComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrantRequestsRoutingModule { }
