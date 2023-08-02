import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/modules/adminV2/modules/customers/services/customer.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CustomerServicesService } from 'src/app/modules/customer/services/customer-services.service';
@Component({
  selector: 'app-bank-quote-accepted',
  templateUrl: './bank-quote-accepted.component.html',
  styleUrls: ['./bank-quote-accepted.component.scss'],
})
export class BankQuoteAcceptedComponent implements OnInit {
  userDetails: any;
  transactionDetails: any;
  routeState:any;

  constructor(
    public router: Router,
    private as: AuthService,
    private cs: CustomerServicesService
  ) {

    const navigation: any = this.router.getCurrentNavigation();
    this.routeState = navigation?.extras?.state;
  }

  ngOnInit(): void {
    this.as.getUserDetails().subscribe({
      next: (res: any) => {
        this.userDetails = res.data[0];
        if (this.userDetails?.postpaidPaymentInfo) {
          this.fetchTransactionDetails();
        }
      },
    });
  }

  continue() {
    if (this.userDetails?.postpaidPaymentInfo?.paymentStatus === 'PENDING') {
      this.router.navigate(['/customer/transactions/pending-payment'], {
        state: {
          id: [this.routeState?.transactionId],
        },
      });
    } else {
      this.router.navigateByUrl('/customer/transactions/previous-transaction');
    }
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
}
