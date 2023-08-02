import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CloseTransactionPopupComponent } from '../../../popup/close-transaction/close-transaction-popup/close-transaction-popup.component';
import { ConfirmationPopupComponent } from '../../../popup/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-secondry-transaction-details',
  templateUrl: './secondry-transaction-details.component.html',
  styleUrls: ['./secondry-transaction-details.component.scss'],
})
export class SecondryTransactionDetailsComponent {
  from = '';
  validDate: any;
  totalDate: Date;
  showEdit: boolean = false;
  transactionId: any;
  transactionDetails: any;
  quoteDetails: any;
  userDetails: any;
  partnersBankList: any = [];
  tooltipText: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private location: Location,
    private bankService: BankUnderwriterService,
    private dialog: MatDialog
  ) {
    const navigation: any = this.router.getCurrentNavigation();
    const routerState = navigation?.extras?.state || { from: '' };
    this.from = routerState.from;
    if (!this.from) {
      this.location.back();
    }
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
    this.route.params.subscribe((param) => {
      this.transactionId = param['id'];

      this.transactionService
        .getSecondryTransactionByID(this.transactionId)
        .subscribe({
          next: (response: any) => {
            console.log(response.data[0]);
            this.transactionDetails = response.data[0] || {};
            this.validDate = new Date(this.transactionDetails?.validity);
            this.validDate.setDate(this.validDate.getDate() + 7);
            let today = new Date();
            if (today.getTime() < this.validDate.getTime()) {
              this.showEdit = true;
            } else {
              this.showEdit = false;
            }
          },
        });
      this.transactionService.getPartnerBankList().subscribe({
        next: (res: any) => {
          try {
            this.partnersBankList = res?.data.map((item: any) => {
              return {
                firstName: item.firstName,
                id: item.id,
              };
            });
          } catch (e) {
            this.partnersBankList = [];
          }
        },
      });
    });
  }

  back() {
    this.location.back();
  }

  cloneTransaction() {
    this.router.navigateByUrl(
      `/bank-underwriter/new-secondary-transaction/edit?id=${this.transactionId}&clone=true`
    );
  }

  reopen() {
    this.transactionService
      .reopenSecondryTransaction(this.transactionId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.router.navigateByUrl(
            '/bank-underwriter/active-secondary-transaction'
          );
        }
      });
  }

  editTransaction() {
    this.router.navigateByUrl(
      `/bank-underwriter/new-secondary-transaction/edit?id=${this.transactionId}`
    );
  }

  openFile() {}
  joinPartnerBank(arr: any = []) {
    if (!(arr?.length > 0)) {
      return '';
    }
    let newArr = [];
    for (let item of arr) {
      let bank = this.partnersBankList?.find((ele: any) => ele.id == item);
      if (bank) {
        // newArr.push(bank.firstName);
        newArr.push(`• ${bank.firstName}`);
      }
    }
    // return newArr?.join(', \n') || '';

    return newArr?.join('\n') || '';
  }

  cancelTransaction() {
    const dialog = this.dialog.open(ConfirmationPopupComponent, {
      autoFocus: false,
      data: {
        title: 'Cancel Transaction',
        type: 'transaction',
      },
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.transactionService
          .cancelSecondryTransaction({
            transactionId: this.transactionId,
            quotationId: '',
          })
          .subscribe({
            next: (res) => {
              this.router.navigateByUrl(
                '/bank-underwriter/secondary-transaction-details'
              );
            },
          });
      } else {
      }
    });
  }
  viewQuote() {
    this.router.navigateByUrl(
      `/bank-underwriter/selling-quote-details?transactionId=${this.transactionId}`
    );
  }
  getValue(val){
    let text = Number(val)

    if(isNaN(text)){
      return val
    }else{
      return  text?.toLocaleString('en')||''
    }
  }
}
