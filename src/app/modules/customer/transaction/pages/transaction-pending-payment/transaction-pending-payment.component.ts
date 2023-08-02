import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SendEmailPopupComponent } from '../../../profile/send-email-popup/send-email-popup.component';
import { Router } from '@angular/router';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { FormControl } from '@angular/forms';
import { SubscriptionDetailPopupComponent } from '../../../profile/subscription-detail-popup/subscription-detail-popup.component';

@Component({
  selector: 'app-transaction-pending-payment',
  templateUrl: './transaction-pending-payment.component.html',
  styleUrls: ['./transaction-pending-payment.component.scss'],
})
export class TransactionPendingPaymentComponent implements OnInit {
  paymentMethods: any = [
    { name: 'Paypal', value: 'PAYPAL' },
    { name: 'Wire Transfer', value: 'WIRE_TRANSFER' },
  ];
  paymentMethod: any;
  showPaymentMethodSelectionError: boolean = false;
  routeState: any;
  couponCode = new FormControl('');
  enableCouponButton: boolean = true;
  couponSuccessMessage: boolean = false;
  couponCodeValid: boolean = false;
  discount: any;
  grandTotal: any;
  subtotal: any = 0;
  selectedTransactionIds: any = [];
  selectedTransactionDetails: any = [];
  subscriberType: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cs: CustomerServicesService
  ) {
    this.subscriberType = JSON.parse(
      localStorage.getItem('userDetails')
    )?.subscriberType;
    const navigation = this.router.getCurrentNavigation();
    this.routeState = navigation?.extras?.state;
    console.log(this.routeState);
    if (this.routeState) {
      this.selectedTransactionIds = this.routeState.id;
    } else {
      if (this.subscriberType === 'BANK_AS_UNDERWRITER') {
        this.router.navigateByUrl('/bank-underwriter/dashboard');
      } else {
        this.router.navigateByUrl('/customer/transactions/dashboard');
      }
    }
  }

  ngOnInit(): void {
    // this.subscriberType = JSON.parse(
    //   localStorage.getItem('userDetails')
    // )?.subscriberType;
    console.log(this.selectedTransactionIds);
    this.fetchData(this.selectedTransactionIds);
  }

  fetchData(itemId: any) {
    let data = {
      page: 0,
      size: 5,
    };
    this.cs.getPendingTransactions(data).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.selectedTransactionDetails = res.data.filter((ele: any) =>
          itemId.includes(ele.id)
        );
        console.log(this.selectedTransactionDetails);
        this.subtotal = this.selectedTransactionDetails.reduce((acc, curr) => {
          // console.log(curr.lCValue)
          // console.log(acc)
          if (this.subscriberType !== 'BANK_AS_UNDERWRITER') {
            return (acc = acc + curr.chargableAmount);
          } else {
            return (acc = acc + curr.price);
          }
        }, 0);
        this.grandTotal = this.subtotal;
        console.log(this.subtotal);
      },
    });
  }

  couponCodeHandler(e: any) {
    if (this.couponCode.value !== '') {
      this.enableCouponButton = false;
    } else {
      this.enableCouponButton = true;
    }
  }
  removeCoupon() {
    console.log('remove');
    this.couponSuccessMessage = false;
    this.enableCouponButton = true;
    this.couponCode.setValue('');
    this.discount = 0;
    this.grandTotal = this.subtotal - (this.discount ? this.discount : 0);
  }

  applyDiscount() {
    let data = {};
    console.log('APplying disconit,', this.couponCode.value);
    if (this.subscriberType !== 'BANK_AS_UNDERWRITER') {
      data = {
        couponCode: this.couponCode.value,
        transactionIds: this.selectedTransactionIds,
      };
    }
    else{
      data = {
        couponCode: this.couponCode.value,
        bauBillingIds: this.selectedTransactionIds,
      };
    }
    this.cs.getPendingTransactionsDiscount(data).subscribe(
      (res: any) => {
        console.log(res);
        this.couponSuccessMessage = true;
        this.couponCodeValid = true;
        this.discount = res.data[0].discountValue;
        this.grandTotal = this.subtotal - (this.discount ? this.discount : 0);
      },
      (err: any) => {
        this.couponCodeValid = false;
        console.log('error');
        this.couponSuccessMessage = false;
        this.discount = 0;
        this.grandTotal = this.subtotal - (this.discount ? this.discount : 0);
      }
    );
  }

  onRadioChange(e: any) {
    console.log(e);
    this.showPaymentMethodSelectionError = false;
    this.paymentMethod = e.value;
  }

  sendEmailPopup() {
    this.dialog.open(SendEmailPopupComponent);
  }

  createRequest() {
    let data = {};
    if (this.subscriberType !== 'BANK_AS_UNDERWRITER') {
      data = {
        transactionIds: this.selectedTransactionIds,
        couponCode: this.couponCodeValid ? this.couponCode.value : '',
        paymentDetails: [
          {
            currency: 'USD',
            modeOfPayment: this.paymentMethod,
          },
        ],
      };
    } else {
      data = {
        bauBillingIds: this.selectedTransactionIds,
        couponCode: this.couponCodeValid ? this.couponCode.value : '',
        paymentDetails: [
          {
            currency: 'USD',
            modeOfPayment: this.paymentMethod,
          },
        ],
      };
    }

    if (this.paymentMethod) {
      this.showPaymentMethodSelectionError = false;
      this.cs.createPendingTransactionsOrder(data).subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          localStorage.setItem('productId', res.data[0].paymentDetails[0].pid);
          localStorage.setItem('orderId', res.data[0].orderId);
          if (this.paymentMethod != 'PAYPAL') {
            const popup = this.dialog.open(SubscriptionDetailPopupComponent);
            popup.afterClosed().subscribe({
              next: () => {
                switch (this.subscriberType) {
                  case 'BANK':
                    this.router.navigateByUrl(
                      '/customer/transactions/dashboard'
                    );
                    break;
                  case 'CUSTOMER':
                    this.router.navigateByUrl(
                      '/customer/transactions/dashboard'
                    );
                    break;
                  case 'BANK_AS_UNDERWRITER':
                    this.router.navigateByUrl('/bank-underwriter/dashboard');
                    break;
                  default:
                    this.router.navigateByUrl(
                      '/customer/transactions/dashboard'
                    );
                }
              },
            });
          } else {
            console.log(res.data[0].paymentDetails);
            let links = res.data[0].paymentDetails[0].links;
            console.log(links);
            let newLink = '';
            links.forEach((e) => {
              if (e.rel == 'approve') {
                console.log('dfd', e.href);
                localStorage.setItem('paypalLink', e.href);
                window.location.href = e.href;
              }
            });
          }
        }
      });
    } else {
      this.showPaymentMethodSelectionError = true;
    }
  }

  getMonth(digit: number) {
    let monthArray = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthArray[digit - 1] || '';
  }
}
