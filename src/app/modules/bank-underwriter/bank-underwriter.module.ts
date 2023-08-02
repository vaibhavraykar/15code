import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankUnderwriterRoutingModule } from './bank-underwriter-routing.module';
import { BankUnderwriterComponent } from './bank-underwriter.component';
import { HeaderComponent } from './components/header/header.component';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatIconModule } from '@angular/material/icon';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EsgcomplaintComponent } from './popup/esgcomplaint/esgcomplaint.component';
import { FilterPopupComponent } from './popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { EsgComplaintPopupComponent } from './popup/esgcomplaint/esg-complaint/esg-complaint-popup/esg-complaint-popup.component';
import { MoreOptionsPopupComponent } from './popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { PlaceQuoteComponent } from './components/place-quote/place-quote.component';
//
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details/transaction-details.component';
import { LatestAcceptedTransactionsComponent } from './popup/latest-accepted-transactions/latest-accepted-transactions/latest-accepted-transactions.component';
import { NewSecondaryTransactionComponent } from './components/new-secondary-transaction/new-secondary-transaction.component';
import { FactoringModule } from "../admin/factoring/factoring.module";
import { SecondarySelectProductComponent } from './components/new-secondary-transaction/secondary-select-product/secondary-select-product.component';
import { SecondaryApplicantBeneficiaryComponent } from './components/new-secondary-transaction/secondary-applicant-beneficiary/secondary-applicant-beneficiary.component';
import { SecondaryTransactionDetailsComponent } from './components/new-secondary-transaction/secondary-transaction-details/secondary-transaction-details.component';
import { SecondaryPricingComponent } from './components/new-secondary-transaction/secondary-pricing/secondary-pricing.component';
import { TransactionAvailableComponent } from './components/transaction-available/transaction-available.component';
import { AllTransactionComponent } from './components/all-transaction/all-transaction.component';
import { ActiveTransactionComponent } from './components/active-transaction/active-transaction.component';
import { SaveTransactionComponent } from './components/save-transaction/save-transaction.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { QuotesAcceptedComponent } from './components/quotes-accepted/quotes-accepted.component';
import { QuotesNotAcceptedComponent } from './components/quotes-not-accepted/quotes-not-accepted.component';
import { FilterComponent } from './popup/esgcomplaint/filter-second/filter/filter.component';
import { EditDetailsComponent } from './components/edit-details/edit-details/edit-details.component';
import { CongratulationComponent } from './components/congratulation/congratulation/congratulation.component';
import { CloseTransactionPopupComponent } from './popup/close-transaction/close-transaction-popup/close-transaction-popup.component';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';
import { SecondaryTransactionPreviewComponent } from './components/new-secondary-transaction/secondary-transaction-preview/secondary-transaction-preview.component';
import { SellingActiveTransactionComponent } from './components/selling-active-transaction/selling-active-transaction.component';
import { SellingTransactionDetailsComponent } from './components/selling-transaction-details/selling-transaction-details.component';
import { SellingSavedTransactionComponent } from './components/selling-saved-transaction/selling-saved-transaction.component';
import { BuyingNewRequestComponent } from './components/buying-new-request/buying-new-request.component';
import { BuyingActiveTransactionComponent } from './components/buying-active-transaction/buying-active-transaction.component';
import { BuyingTransactionDetailsComponent } from './components/buying-transaction-details/buying-transaction-details.component';
import { BuyingSavedTransactionComponent } from './components/buying-saved-transaction/buying-saved-transaction.component';
import { SecondarySelectBankComponent } from './components/new-secondary-transaction/secondary-select-bank/secondary-select-bank.component';
import { SecondryTransactionDetailsComponent } from './components/transaction-details/secondry-transaction-details/secondry-transaction-details.component';
import { ConfirmationPopupComponent } from './popup/confirmation-popup/confirmation-popup.component';
import { SecondaryQuoteDetailsComponent } from './components/new-secondary-transaction/secondary-quote-details/secondary-quote-details.component';
import { BuyingQuotesComponent } from './components/buying-quotes/buying-quotes.component';
import { BuyingTransactionDetailComponent } from './components/transaction-details/buying-transaction-detail/buying-transaction-detail.component';
import { SecondaryBankQuotesComponent } from './components/new-secondary-transaction/secondary-bank-quotes/secondary-bank-quotes.component';
import { SecondaryBankQuotePopupComponent } from './popup/secondary-bank-quote-popup/secondary-bank-quote-popup.component';
import { BuyingQuotesPreviewComponent } from './components/buying-quotes-preview/buying-quotes-preview.component';
import { BankUnderwriterQuoteAcceptedComponent } from './components/bank-underwriter-quote-accepted/bank-underwriter-quote-accepted.component';
import { SecondaryCloseTransactionPopupComponent } from './popup/secondary-close-transaction-popup/secondary-close-transaction-popup.component';
import { AddBankDetailsComponent } from './components/add-bank-details/add-bank-details.component';
import { AddBankDetailsPopupComponent } from './popup/add-bank-details-popup/add-bank-details-popup.component';
import { SecondaryCongratulationComponent } from './components/secondary-congratulation/secondary-congratulation.component';
import { SecondaryAcceptTransactionPopupComponent } from './popup/secondary-accept-transaction-popup/secondary-accept-transaction-popup.component';
import { SecondaryRejectTransactionPopupComponent } from './popup/secondary-reject-transaction-popup/secondary-reject-transaction-popup.component';
import { RejectPopupComponent } from './components/reject-popup/reject-popup.component';
import { SubmitBankDetailsComponent } from './popup/submit-bank-details/submit-bank-details.component';
import { RejectSuccessComponent } from './components/reject-success/reject-success.component';
import { BuyingQuotationUpdatePopupComponent } from './popup/buying-quotation-update-popup/buying-quotation-update-popup.component';
import { SellingQuoteAcceptedComponent } from './popup/selling-quote-accepted/selling-quote-accepted.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { AddUserPopupComponent } from './components/add-user-popup/add-user-popup.component';
import { UserConfirmationComponent } from './components/user-confirmation/user-confirmation.component';
//
@NgModule({
  declarations: [
    BankUnderwriterComponent,
    HeaderComponent,
    NewTransactionComponent,
    DashboardComponent,
    EsgcomplaintComponent,
    FilterPopupComponent,
    EsgComplaintPopupComponent,
    MoreOptionsPopupComponent,
    PlaceQuoteComponent,
    //
    NewSecondaryTransactionComponent,
    SecondarySelectProductComponent,
    SecondaryApplicantBeneficiaryComponent,
    SecondaryTransactionDetailsComponent,
    SecondaryPricingComponent,
    TransactionAvailableComponent,
    AllTransactionComponent,
    ActiveTransactionComponent,
    SaveTransactionComponent,
    TransactionHistoryComponent,
    QuotesAcceptedComponent,
    QuotesNotAcceptedComponent,
    TransactionDetailsComponent,
    LatestAcceptedTransactionsComponent,
    FilterComponent,
    EditDetailsComponent,
    CongratulationComponent,
    CloseTransactionPopupComponent,
    QuoteDetailsComponent,
    RejectPopupComponent,
    //
    //  
    
    SecondaryTransactionPreviewComponent,
    SellingActiveTransactionComponent,
    SellingTransactionDetailsComponent,
    SellingSavedTransactionComponent,
    BuyingNewRequestComponent,
    BuyingActiveTransactionComponent,
    BuyingTransactionDetailsComponent,
    BuyingSavedTransactionComponent,
    SecondarySelectBankComponent,
    SecondryTransactionDetailsComponent,
    ConfirmationPopupComponent,
    SecondaryQuoteDetailsComponent,
    BuyingQuotesComponent,
    BuyingTransactionDetailComponent,
    SecondaryBankQuotesComponent,
    SecondaryBankQuotePopupComponent,
    BuyingQuotesPreviewComponent,
    BankUnderwriterQuoteAcceptedComponent,
    SecondaryCloseTransactionPopupComponent,
    SecondaryRejectTransactionPopupComponent,
    SecondaryAcceptTransactionPopupComponent,
    AddBankDetailsComponent,
    AddBankDetailsPopupComponent,
    SecondaryCongratulationComponent,
    SubmitBankDetailsComponent,
    RejectSuccessComponent,
    BuyingQuotationUpdatePopupComponent,
    SellingQuoteAcceptedComponent,
    ProfileComponent,
    ManageUserComponent,
    AddUserPopupComponent,
    UserConfirmationComponent
  ],
  imports: [
    CommonModule,
    BankUnderwriterRoutingModule,
    AllMaterialModule,
    ComponentsModule,
    MatIconModule,
    //
    FactoringModule
  ]
})
export class BankUnderwriterModule { }
