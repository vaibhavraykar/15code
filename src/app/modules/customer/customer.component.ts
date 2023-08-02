import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log('customer');
    let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    let status = localStorage.getItem('onBoardingStatus');
    const {
      subscriberType,
      isBusinessKycApproved,
      isPaymentDone,
      isPersonalKycApproved,
    } = userInfo;
    if (status === 'KYC_SUBMITTED') {
      if (!isBusinessKycApproved && !isPaymentDone && !isPersonalKycApproved) {
        this.router.navigateByUrl('/customer/profile/kyc-success');
      }
    }
  }
}
