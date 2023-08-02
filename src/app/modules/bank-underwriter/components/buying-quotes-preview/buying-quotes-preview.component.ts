import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { Dialog } from '@angular/cdk/dialog';
import { SecondaryBankQuotePopupComponent } from '../../popup/secondary-bank-quote-popup/secondary-bank-quote-popup.component';
import { SecondaryRejectTransactionPopupComponent } from '../../popup/secondary-reject-transaction-popup/secondary-reject-transaction-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-buying-quotes-preview',
  templateUrl: './buying-quotes-preview.component.html',
  styleUrls: ['./buying-quotes-preview.component.scss'],
})
export class BuyingQuotesPreviewComponent implements OnInit {
  viewType = 'default';
  transactionDetails: any = {};
  previewData: any = {};
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private bs: BankUnderwriterService,
    private ts: TransactionService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (value: any) => {
        this.fetchData(value.id);
      },
    });
  }

  fetchData(id: string) {
    this.ts.getSecondryTransactionByID2(id).subscribe({
      next: (value: any) => {
        const { data } = value;
        this.transactionDetails = data[0];
        let quoteDetails: any = this.transactionDetails?.quotationList[0];
        let userDetails = JSON.parse(
          localStorage.getItem('userDetails') || '{}'
        );
        // if (this.transactionDetails?.quotationList?.length > 0) {
        //   for (let i of this.transactionDetails?.quotationList) {
        //     if (i.bankId === userDetails?.username) {
        //       quoteDetails = i;
        //     }
        //   }
        // }
        this.previewData = quoteDetails||{};
        console.log(quoteDetails);
        if (this.previewData.isOfferdPriceAccepted) {
          this.viewType = 'default_active';
        } else {
          this.viewType = 'default';
        }
        console.log(this.previewData.quotationStatus);
      },
    });
  }
  goBack(type?: any) {
    this.location.back();
  }
  reject() {
    let confirmPop: any = this.dialog.open(
      SecondaryRejectTransactionPopupComponent,
      {
        data: {
          transactionId: this.transactionDetails?.transactionId,
          quotationId: this.previewData.quotationId,
        },
      }
    );
    confirmPop.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.router.navigateByUrl(
            '/bank-underwriter/transaction-detail-qoute'
          );
        }
      },
    });
  }

  editQuotation(){
    this.router.navigateByUrl(
      `/bank-underwriter/secondry/buying-quote-details/${this.previewData?.quotationId}`
    );
  }

  withdraw() {
    let payload = {
      transactionId: this.transactionDetails?.transactionId,
      quotationId: this.previewData.quotationId,
    };
    this.bs.withdrawSecondaryQuotation(payload).subscribe((res:any)=>{
      console.log(res)
      this.router.navigateByUrl(
        '/bank-underwriter/secondary-new-transaction-qoute'
      );
    })
  }

  // rejectQuotation(transactionId: any, quoteid: any) {
  //   this.dialog.open(RejectPopupComponent, {
  //     data: {
  //       transactionId: transactionId,
  //       quotationId: quoteid,
  //     },
  //     autoFocus: false,
  //   });
  // }
}
