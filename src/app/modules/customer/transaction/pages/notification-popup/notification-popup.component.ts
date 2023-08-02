import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { SubscriptionDetailPopupComponent } from '../../../profile/subscription-detail-popup/subscription-detail-popup.component';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent implements OnInit {
  transactionDetails: any = [];
  selectedTransactionId: any = [];
  userType: any;

  constructor(
    public dialogRef: MatDialogRef<NotificationPopupComponent>,
    private cs: CustomerServicesService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}
  postpaidPaymentStatus: any;
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.userType = JSON.parse(
      localStorage.getItem('userInfo')
    )?.subscriberType;
    console.log(this.userType);
    this.fetchTransactionDetails();
  }

  fetchTransactionDetails() {
    let payload = {
      page: 0,
      size: 5,
    };
    this.cs.getPendingTransactions(payload).subscribe({
      next: (res: any) => {
        console.log(res.data[0]);
        this.transactionDetails = res.data;
      },
    });
  }

  getMonth(digit:number) {
    let monthArray =['January','February','March','April','May','June','July','August','September','October','November','December'];
    return monthArray[digit-1] || '';
  }

  pay() {
    if (this.selectedTransactionId.length > 0) {
      this.authService.getUserDetails().subscribe({
        next: (res: any) => {
          console.log(res.data);
          let orderType = res.data[0].orders.orderLines.find(
            (ele) => ele.productDetails.productType === 'SUBSCRIPTION_PLAN'
          ).productDetails?.planType;
          console.log(orderType, 'order----');
          if (orderType === 'POSTPAID') {
            console.log('reached inside postpaid chekc');
            this.postpaidPaymentStatus =
              res.data[0]?.postpaidPaymentInfo?.paymentStatus;
            if (this.postpaidPaymentStatus === 'PENDING_FOR_APPROVAL') {
              const popup = this.dialog.open(SubscriptionDetailPopupComponent);
            } else {
              if(this.userType!=='BANK_AS_UNDERWRITER'){
                this.router.navigate(['/customer/transactions/pending-payment'], {
                  state: {
                    id: this.selectedTransactionId,
                  },
                });
                this.close();
              }
              else{
                this.router.navigate(['/bank-underwriter/pending-payment'], {
                  state: {
                    id: this.selectedTransactionId,
                  }
                });
                this.close();
              }
            }
          }
        },
      });
      // if (
      //   this.postpaidPaymentStatus === 'PENDING' ||
      //   this.postpaidPaymentStatus === 'PENDING_FOR_APPROVAL'
      // ) {
      //   this.dialogRef.close();
      //   const popup = this.dialog.open(SubscriptionDetailPopupComponent);
      // } else {

      // }
    }
  }

  optionSelected(event: any, id: any) {
    // console.log(event)
    if (event.checked) {
      this.selectedTransactionId.push(id);
    } else {
      this.selectedTransactionId = this.selectedTransactionId.filter(
        (ele) => ele != id
      );
    }
    console.log(this.selectedTransactionId);
    // if(this.sel)
    // this.selectedTransactionId = event.value
  }

  optionCheckbox(event: any) {
    this.selectedTransactionId = [Number(event.value)];
  }
}
