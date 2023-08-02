import { Component } from '@angular/core';
import { SecondaryBankQuotePopupComponent } from '../../../popup/secondary-bank-quote-popup/secondary-bank-quote-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { SecondaryAcceptTransactionPopupComponent } from '../../../popup/secondary-accept-transaction-popup/secondary-accept-transaction-popup.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-secondary-bank-quotes',
  templateUrl: './secondary-bank-quotes.component.html',
  styleUrls: ['./secondary-bank-quotes.component.scss'],
})
export class SecondaryBankQuotesComponent {
  transactionId: any;
  transactionDetails: any = {};
  userDetails: any;
  bankDetails: any = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router,
    private location: Location
  ) {
    this.route.queryParams.subscribe({
      next: (res: any) => {
        console.log(res);
        this.fetchData(res.id);
      },
    });
  }

  ngOnInit(): void {}
  fetchData(id: any) {
    this.transactionService.getSecondryTransactionByID(id).subscribe({
      next: (res: any) => {
        const { data } = res;
        this.transactionDetails = data[0];
        this.bankDetails = this.transactionDetails.quotationList.filter(e=>e.quotationStatus!=='REJECTED');
      },
    });
  }
  getGroupCompany(id: any) {}

  open(index: any) {
    const popup = this.dialog.open(SecondaryBankQuotePopupComponent, {
      data: {
        transactionDetails: this.transactionDetails,
        bankDetails: this.bankDetails[index],
      },
    });
    popup.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          let confirmPop = this.dialog.open(
            SecondaryAcceptTransactionPopupComponent,
            {
              data: {
                transactionId: this.bankDetails[index].transactionId,
                quotationId: this.bankDetails[index].quotationId,
              },
            }
          );
          confirmPop.afterClosed().subscribe({
            next: (res) => {
              if (res) {
                // this.router.navigateByUrl('/bank-underwriter/secondary-transaction-details')
              }
            },
          });
        }
      },
    });
  }

  goBack(){
    this.location.back();
  }
}
