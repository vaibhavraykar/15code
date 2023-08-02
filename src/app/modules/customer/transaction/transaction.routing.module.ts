import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from 'src/app/modules/customer/transaction/transaction.component';
import { ViewDetailsTransactionComponent } from 'src/app/modules/customer/transaction/pages/view-details-transaction/view-details-transaction.component';
import { ActiveTransactionComponent } from 'src/app/modules/customer/transaction/pages/active-transaction/active-transaction.component';
import { SavedTransactionComponent } from 'src/app/modules/customer/transaction/pages/saved-transaction/saved-transaction.component';
import { NewTransactionComponent } from 'src/app/modules/customer/transaction/pages/new-transaction/new-transaction.component';
import { PreviousTransactionComponent } from 'src/app/modules/customer/transaction/pages/previous-transaction/previous-transaction.component';
import { TransactionPreviewComponent } from 'src/app/modules/customer/transaction/pages/new-transaction/transaction-preview/transaction-preview.component';
import { TransactionSuccessComponent } from 'src/app/modules/customer/transaction/pages/new-transaction/transaction-success/transaction-success.component';
import { BankQuoteDetailsComponent } from 'src/app/modules/customer/transaction/pages/bank-quote-details/bank-quote-details.component';
import { BankQuoteAcceptedComponent } from 'src/app/modules/customer/transaction/pages/bank-quote-details/bank-quote-accepted/bank-quote-accepted.component';
import { AllTransactionComponent } from './pages/all-transaction/all-transaction.component';
import { PreviewComponent } from './pages/new-transaction/preview/preview.component';
import { BeneficiaryPreviewComponent } from './pages/new-transaction/beneficiary-preview/beneficiary-preview.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QuoteDetailsComponent } from './pages/new-transaction/quote-details/quote-details.component';
import { NewViewDetailsTransactionComponent } from './pages/new-view-details-transaction/new-view-details-transaction.component';
import { DashboardNewComponent } from './pages/dashboard-new/dashboard-new.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SubscriptionDetailComponent } from '../profile/subscription-detail/subscription-detail.component';
import { VasComponent } from '../profile/vas/vas.component';
import { CreditTransactionsComponent } from '../profile/credit-transactions/credit-transactions.component';
import { ManageGroupsComponent } from '../profile/manage-groups/manage-groups.component';
import { ReferComponent } from '../profile/refer/refer.component';
import { TncComponent } from '../profile/tnc/tnc.component';
import { ChangePasswordComponent } from '../profile/change-password/change-password.component';
import { SupportComponent } from '../profile/support/support.component';
import { BankProfileComponent } from './pages/bank-profile/bank-profile.component';
import { TransactionPendingPaymentComponent } from './pages/transaction-pending-payment/transaction-pending-payment.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'dashboard2',
        component: DashboardComponent,
      },
      {
        path: 'active-transaction',
        component: ActiveTransactionComponent,
      },
      {
        path: 'saved-transaction',
        component: SavedTransactionComponent,
      },
      {
        path: 'new',
        component: NewTransactionComponent,
      },
      {
        path: 'all-transaction',
        component: AllTransactionComponent,
      },
      {
        path: 'previous-transaction',
        component: PreviousTransactionComponent,
      },
      {
        path: 'new/transaction-preview',
        component: TransactionPreviewComponent,
      },
      {
        path: 'new/preview',
        component: PreviewComponent,
      },
      {
        path: 'new/beneficiary-preview',
        component: BeneficiaryPreviewComponent,
      },
      {
        path: 'new/success',
        component: TransactionSuccessComponent,
      },
      {
        path: 'quote',
        component: BankQuoteDetailsComponent,
      },
      {
        path: 'quote/accepted',
        component: BankQuoteAcceptedComponent,
      },
      {
        path: 'view',
        component: ViewDetailsTransactionComponent,
      },
      {
        path: 'view-details',
        component: NewViewDetailsTransactionComponent,
      },
      {
        path: 'quotes-details',
        component: QuoteDetailsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'bank-profile',
        component: BankProfileComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionDetailComponent,
      },
      {
        path: 'vas-plan',
        component: VasComponent,
      },
      {
        path: 'credits-transaction',
        component: CreditTransactionsComponent,
      },
      {
        path: 'manage-group',
        component: ManageGroupsComponent,
      },
      {
        path: 'refer',
        component: ReferComponent,
      },
      {
        path: 'tnc',
        component: TncComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'support',
        component: SupportComponent,
      },
      {
        path:'pending-payment',
        component:TransactionPendingPaymentComponent
      }
    ],
  } /* ,
    {
      path: '/:id',
      component:ViewDetailsTransactionComponent
    } */,
  // {
  //   path: 'active',
  //   component:ActiveTransactionComponent
  // },{
  //   path: 'saved',
  //   component:SavedTransactionComponent
  // },{
  //   path: 'new',
  //   component:NewTransactionComponent
  // },{
  //   path: 'previous',
  //   component:PreviousTransactionComponent
  // },
  // {
  //   path: 'new/preview',
  //   component:TransactionPreviewComponent
  // },
  // {
  //   path: 'new/success',
  //   component:TransactionSuccessComponent
  // },
  // {
  //   path: 'quote/:id',
  //   component:BankQuoteDetailsComponent
  // },
  // {
  //   path: 'quote/accepted/:id',
  //   component:BankQuoteAcceptedComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
