import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { Location } from "@angular/common";
import { RejectPopupComponent } from '../../reject-popup/reject-popup.component';
import { SecondaryRejectTransactionPopupComponent } from '../../../popup/secondary-reject-transaction-popup/secondary-reject-transaction-popup.component';
@Component({
  selector: 'app-secondary-quote-details',
  templateUrl: './secondary-quote-details.component.html',
  styleUrls: ['./secondary-quote-details.component.scss'],
})
export class SecondaryQuoteDetailsComponent {
  constructor(
    private bankService: BankUnderwriterService,
    private router: Router,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private dialog: MatDialog,

    private location: Location
  ) {}
  transactionId = '';
  transactionDetails: any = {};
  from = '';
  panelOpenState = false;
  viewType = 'default';
  transactionInformationDetails: any;
  isOfferdPriceAccepted: boolean;
  secTransactionType: any;
  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.transactionId = param['transactionId'];
      // this.bankService.getQuotationById(this.quoteID).subscribe((res: any) => {
      //   console.log(res.data);
      //   this.transactionDetails = res.data[0];
      //   this.transactionId = this.transactionDetails.transactionId;
      //   this.product = this.transactionDetails?.requirementType;
      //   this.previewData = this.transactionDetails?.quotationsList[0];
      // });
    });
    // const navigation = this.router.getCurrentNavigation()
    // const routerState:any = navigation?.extras?.state || { from: '' };
    //   this.from = routerState.from;
    this.transactionService
      .getSecondryTransactionByID(this.transactionId)
      .subscribe({
        next: (response: any) => {
          this.transactionDetails = response?.data[0];
          this.transactionInformationDetails =
            this.transactionDetails?.quotationList;
        },
      });
  }

  rejectQuote(e:any,id:any){
    console.log(id, this.transactionDetails.transactionId);
    let confirmPop: any = this.dialog.open(
      SecondaryRejectTransactionPopupComponent,
      {
        data: {
          transactionId: this.transactionDetails.transactionId,
          quotationId: id,
        },
        autoFocus: false,
      }
    );
    confirmPop.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.router.navigateByUrl(
            '/bank-underwriter/secondary-transaction-details'
          );
        }
      },
    });
  }

  goBack() {
    this.location.back();
  }

  getViewType(data: any) {

    if (data?.isOfferdPriceAccepted) {
      return 'default';
    } else {
      if (data?.secTransactionType === 'FUNDED') {
        return 'placeNewQuoteFunded';
      } else {
        return 'placeNewQuoteUnfunded';
      }
    }
  }
}
