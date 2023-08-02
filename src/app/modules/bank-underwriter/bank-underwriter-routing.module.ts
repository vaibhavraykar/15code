import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankUnderwriterComponent } from './bank-underwriter.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { FilterPopupComponent } from './popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { EsgComplaintPopupComponent } from './popup/esgcomplaint/esg-complaint/esg-complaint-popup/esg-complaint-popup.component';
import { MoreOptionsPopupComponent } from './popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { PlaceQuoteComponent } from './components/place-quote/place-quote.component';
import { NewSecondaryTransactionComponent } from './components/new-secondary-transaction/new-secondary-transaction.component';
import { TransactionAvailableComponent } from './components/transaction-available/transaction-available.component';
import { AllTransactionComponent } from './components/all-transaction/all-transaction.component';
import { ActiveTransactionComponent } from './components/active-transaction/active-transaction.component';
import { SaveTransactionComponent } from './components/save-transaction/save-transaction.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { EsgcomplaintComponent } from './popup/esgcomplaint/esgcomplaint.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details/transaction-details.component';
import { FilterComponent } from './popup/esgcomplaint/filter-second/filter/filter.component';
import { EditDetailsComponent } from './components/edit-details/edit-details/edit-details.component';
import { CongratulationComponent } from './components/congratulation/congratulation/congratulation.component';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';
import { SecondaryTransactionPreviewComponent } from './components/new-secondary-transaction/secondary-transaction-preview/secondary-transaction-preview.component';
import { SellingActiveTransactionComponent } from './components/selling-active-transaction/selling-active-transaction.component';
import { SellingTransactionDetailsComponent } from './components/selling-transaction-details/selling-transaction-details.component';
import { SellingSavedTransactionComponent } from './components/selling-saved-transaction/selling-saved-transaction.component';
import { BuyingNewRequestComponent } from './components/buying-new-request/buying-new-request.component';
import { BuyingActiveTransactionComponent } from './components/buying-active-transaction/buying-active-transaction.component';
import { BuyingTransactionDetailsComponent } from './components/buying-transaction-details/buying-transaction-details.component';
import { BuyingSavedTransactionComponent } from './components/buying-saved-transaction/buying-saved-transaction.component';
import { SecondryTransactionDetailsComponent } from './components/transaction-details/secondry-transaction-details/secondry-transaction-details.component';
import { SecondaryQuoteDetailsComponent } from './components/new-secondary-transaction/secondary-quote-details/secondary-quote-details.component';
import { BuyingQuotesComponent } from './components/buying-quotes/buying-quotes.component';
import { BuyingTransactionDetailComponent } from './components/transaction-details/buying-transaction-detail/buying-transaction-detail.component';
import { SecondaryBankQuotesComponent } from './components/new-secondary-transaction/secondary-bank-quotes/secondary-bank-quotes.component';
import { BankUnderwriterQuoteAcceptedComponent } from './components/bank-underwriter-quote-accepted/bank-underwriter-quote-accepted.component';
import { BuyingQuotesPreviewComponent } from './components/buying-quotes-preview/buying-quotes-preview.component';
import { AddBankDetailsComponent } from './components/add-bank-details/add-bank-details.component';
import { SecondaryCongratulationComponent } from './components/secondary-congratulation/secondary-congratulation.component';
import { DashboardNewComponent } from './components/dashboard-new/dashboard-new.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { SubscriptionDetailComponent } from '../customer/profile/subscription-detail/subscription-detail.component';
import { ReferComponent } from '../customer/profile/refer/refer.component';
import { SupportComponent } from '../customer/profile/support/support.component';
import { ChangePasswordComponent } from '../customer/profile/change-password/change-password.component';
import { CreditTransactionsComponent } from '../customer/profile/credit-transactions/credit-transactions.component';
import { TransactionPendingPaymentComponent } from '../customer/transaction/pages/transaction-pending-payment/transaction-pending-payment.component';
import { AutomatedStatusGuard } from 'src/app/core/AutomatedStatus.guard';



const routes: Routes = [
  {
    path: '',
    component: BankUnderwriterComponent,
    children: [
      {
        path: 'new-transaction',
        component: NewTransactionComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AutomatedStatusGuard]
      },
      {
        path: 'dashboard2',
        component: DashboardComponent,
        canActivate: [AutomatedStatusGuard]
      },
      {
        path: 'place-quote',
        component: PlaceQuoteComponent
      },
      {
        path: 'transaction-available',
        component: TransactionAvailableComponent
      },
      {
        path: 'new-secondary-transaction',
        component: NewSecondaryTransactionComponent,
        canActivate: [AutomatedStatusGuard]
      },
      {
        path: 'new-secondary-transaction/edit',
        component: NewSecondaryTransactionComponent,
        canActivate: [AutomatedStatusGuard]
      },
      {
        path: 'all-transaction',
        component: AllTransactionComponent
      },
      {
        path: 'active-transaction',
        component: ActiveTransactionComponent
      },
      {
        path: 'save-transaction',
        component: SaveTransactionComponent
      },
      {
        path: 'transaction-history',
        component: TransactionHistoryComponent
      },
      {
        path: 'transaction-details',
        component: TransactionDetailsComponent
      },
      {
        path: 'secondry-transaction-details',
        component: SecondryTransactionDetailsComponent
      },
      {
        path: 'secondry-transaction-details/:id',
        component: SecondryTransactionDetailsComponent
      },
      {
        path: 'quote-details',
        component: QuoteDetailsComponent
      },
      //
      {
        path: 'edit-details',
        component: EditDetailsComponent
      },
      {
        path: 'new-secondary-transaction-preview',
        component:SecondaryTransactionPreviewComponent
      },
      {
        path: 'success',
        component:CongratulationComponent
      },
      {
        path: 'secondary-success',
        component:SecondaryCongratulationComponent
      },
      //
      {
        path: 'active-secondary-transaction',
        component:SellingActiveTransactionComponent,
        canActivate: [AutomatedStatusGuard]
      },
      {
        path: 'secondary-transaction-details',
        component:SellingTransactionDetailsComponent,
        canActivate: [AutomatedStatusGuard]
      },
      {
        path: 'secondary-saved-transaction',
        component:SellingSavedTransactionComponent
      },
      {
        path: 'secondary-new-transaction-qoute',
        component:BuyingNewRequestComponent
      },
      {
        path: 'active-transaction-qoute',
        component:BuyingActiveTransactionComponent
      },
      {
        path: 'transaction-detail-qoute',
        component:BuyingTransactionDetailsComponent
      },
      {
        path: 'saved-transaction-qoute',
        component:BuyingSavedTransactionComponent
      },
      {
        path: 'selling-quote-details',
        component:SecondaryQuoteDetailsComponent
      },
      {
        path: 'secondry/buying-quote-details',
        component:BuyingQuotesComponent
      },
      {
        path: 'secondry/buying-quote-details/:id',
        component:BuyingQuotesComponent
      },
      {
        path: 'buying-transaction-details/:id',
        component: BuyingTransactionDetailComponent
      },
      {
        path: 'secondary-transaction-qoute/:id',
        component: SecondaryBankQuotesComponent
      },
      {
        path: 'active-secondary-transaction/quote/accepted',
        component: BankUnderwriterQuoteAcceptedComponent
      },
      {
        path: 'buying-quote/:id',
        component: BuyingQuotesPreviewComponent
      },
      {
        path: 'add-bank',
        component: AddBankDetailsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'manage-user',
        component: ManageUserComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionDetailComponent,
      },
      {
        path: 'refer',
        component: ReferComponent,
      },
      {
        path: 'support',
        component: SupportComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'credits-transaction',
        component: CreditTransactionsComponent,
      },
      {
        path:'pending-payment',
        component: TransactionPendingPaymentComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankUnderwriterRoutingModule { }
