import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { PreviousTransactionComponent } from './pages/previous-transaction/previous-transaction.component';
import { ActiveTransactionComponent } from './pages/active-transaction/active-transaction.component';
import { SavedTransactionComponent } from './pages/saved-transaction/saved-transaction.component';
import { NewTransactionComponent } from './pages/new-transaction/new-transaction.component';
import { SelectProductComponent } from './pages/new-transaction/select-product/select-product.component';
import { ApplicantBeneficiaryComponent } from './pages/new-transaction/applicant-beneficiary/applicant-beneficiary.component';
import { TransactionDetailsComponent } from './pages/new-transaction/transaction-details/transaction-details.component';
import { TransactionPreviewComponent } from './pages/new-transaction/transaction-preview/transaction-preview.component';
import { TransactionSuccessComponent } from './pages/new-transaction/transaction-success/transaction-success.component';
import { ViewDetailsTransactionComponent } from './pages/view-details-transaction/view-details-transaction.component';
import { BankQuoteDetailsComponent } from './pages/bank-quote-details/bank-quote-details.component';
import { BankQuoteBreakupComponent } from './pages/bank-quote-details/bank-quote-breakup/bank-quote-breakup.component';
import { BankQuoteAcceptedComponent } from './pages/bank-quote-details/bank-quote-accepted/bank-quote-accepted.component';
import { TransactionService } from './services/transaction.service';
import { TransactionRoutingModule } from 'src/app/modules/customer/transaction/transaction.routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffect } from 'src/app/modules/customer/transaction/state/transaction.effects';
import { transactionReducer } from 'src/app/modules/customer/transaction/state/transaction.reducers';
import { TransactionFacadeService } from 'src/app/modules/customer/transaction/state/transaction.facade.service';
import { ComponentsModule } from 'src/app/components/components.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HeaderComponent } from '../header/header.component';
import { CustomerModule } from '../customer.module';
import { AllTransactionComponent } from './pages/all-transaction/all-transaction.component';
import { AddVasPopupComponent } from './pages/add-vas-popup/add-vas-popup.component';

import { TransactionInfoPopupComponent } from './pages/transaction-info-popup/transaction-info-popup.component';
import { AllMaterialModule } from 'src/app/material-module';
import { PreviewComponent } from './pages/new-transaction/preview/preview.component';
import { BeneficiaryPreviewComponent } from './pages/new-transaction/beneficiary-preview/beneficiary-preview.component';
import { TransactionCommentComponent } from './pages/new-transaction/transaction-comment/transaction-comment.component';
import { FilterTransactionsPopupComponent } from './pages/filter-transactions-popup/filter-transactions-popup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BankQuotePopupComponent } from './pages/bank-quote-details/bank-quote-popup/bank-quote-popup.component';
import { InvoiceViewComponent } from './pages/new-transaction/invoice-view/invoice-view.component';
import { QuoteDetailsComponent } from './pages/new-transaction/quote-details/quote-details.component';
import { NewViewDetailsTransactionComponent } from './pages/new-view-details-transaction/new-view-details-transaction.component';
import { CloseTransactionComponent } from './pages/close-transaction/close-transaction.component';
import { RejectPopupComponent } from './pages/reject-popup/reject-popup.component';
import { TransactionDetailsPopupComponent } from './pages/transaction-details-popup/transaction-details-popup.component';
import {RejectSuccessComponent} from './pages/reject-success/reject-success.component';
import { DashboardNewComponent } from './pages/dashboard-new/dashboard-new.component';
import { NotificationPopupComponent } from './pages/notification-popup/notification-popup.component';
import { TransactionPendingComponent } from './pages/transaction-pending/transaction-pending.component';
import { TransactionSuccessfulComponent } from './pages/transaction-successful/transaction-successful.component';
import { TransactionPaymentComponent } from './pages/transaction-payment/transaction-payment.component';
import { SubscriptionDetailComponent } from '../profile/subscription-detail/subscription-detail.component';
import { VasComponent } from '../profile/vas/vas.component';
import { MatIconModule } from '@angular/material/icon';
import { ReferComponent } from '../profile/refer/refer.component';
import { ReferCongratulationPopupComponent } from '../profile/refer-congratulation-popup/refer-congratulation-popup.component';
import { ReferPopupComponent } from '../profile/refer-popup/refer-popup.component';
import { BankProfileComponent } from './pages/bank-profile/bank-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddGroupCompanyPopupComponent } from '../profile/add-group-company-popup/add-group-company-popup.component';
import { TncComponent } from '../profile/tnc/tnc.component';
import { TransactionPendingPaymentComponent } from './pages/transaction-pending-payment/transaction-pending-payment.component';


@NgModule({
  declarations: [
    TransactionInfoPopupComponent,
    AddVasPopupComponent,
    AllTransactionComponent,
    TransactionComponent,
    PreviousTransactionComponent,
    ActiveTransactionComponent,
    SavedTransactionComponent,
    NewTransactionComponent,
    SelectProductComponent,
    ApplicantBeneficiaryComponent,
    TransactionDetailsComponent,
    TransactionPreviewComponent,
    TransactionSuccessComponent,
    ViewDetailsTransactionComponent,
    BankQuoteDetailsComponent,
    BankQuoteBreakupComponent,
    BankQuoteAcceptedComponent,
    PreviewComponent,
    BeneficiaryPreviewComponent,
    TransactionCommentComponent,
    FilterTransactionsPopupComponent,
    DashboardComponent,
    BankQuotePopupComponent,
    InvoiceViewComponent,
    QuoteDetailsComponent,
    NewViewDetailsTransactionComponent,
    CloseTransactionComponent,
    RejectPopupComponent,
    TransactionDetailsPopupComponent,
    RejectSuccessComponent,
    DashboardNewComponent,
    NotificationPopupComponent,
    TransactionPendingComponent,
    TransactionSuccessfulComponent,
    TransactionPaymentComponent,
    TransactionPendingPaymentComponent,
    SubscriptionDetailComponent,
    VasComponent,
    ReferComponent,
    ReferPopupComponent,
    ReferCongratulationPopupComponent,
    BankProfileComponent,
    ProfileComponent,
    AddGroupCompanyPopupComponent,
    TncComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    StoreModule.forFeature('TRANSACTION', transactionReducer),
    EffectsModule.forFeature([TransactionEffect]),
    CustomerModule,
    AllMaterialModule,
    ComponentsModule,
    MatIconModule
  ],
  exports: [
    SubscriptionDetailComponent, 
    TncComponent,
    ReferComponent,],
  providers: [TransactionFacadeService, TransactionService],
})
export class TransactionModule { }
