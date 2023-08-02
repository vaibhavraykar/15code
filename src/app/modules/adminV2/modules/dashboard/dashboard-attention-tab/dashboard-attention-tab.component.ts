import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-attention-tab',
  templateUrl: './dashboard-attention-tab.component.html',
  styleUrls: ['./dashboard-attention-tab.component.scss'],
})
export class DashboardAttentionTabComponent implements OnInit {
constructor(private ds:DashboardService){}
  ngOnInit(): void {
   this.load()
  }
  firstrowcardsProduct: any[] = [
    {
      totalNumber: '0',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/paymentApprovals.svg',
      name: 'Payment Approvals',
      value: 'Payment Approvals',
    },
    {
      totalNumber: '0',
      name: 'Grant Payments',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/grantPayments.svg',
      value: 'Grant Payments',
    },
    {
      totalNumber: '0',
      name: 'Assign RM',
      imageUrl: '/assets/images/adminV2/dashboard/actionNeeded/assignRM.svg',
      value: 'Assign RM',
    },
    {
      totalNumber: '0',
      imageUrl: '/assets/images/adminV2/dashboard/actionNeeded/grantRM.svg',
      name: 'Grant RM',
      value: 'Grant RM',
    },
    {
      totalNumber: '0',
      imageUrl: '/assets/images/adminV2/dashboard/actionNeeded/grantUser.svg',
      name: 'Grant User',
      value: 'Grant User',
    },
  ];
  secondrowcardsProduct: any[] = [
    {
      totalNumber: '0',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/KYCApprovals.svg',
      name: 'KYC Approvals',
      value: 'KYC Approvals',
    },
    {
      totalNumber: '0',
      imageUrl: '/assets/images/adminV2/dashboard/actionNeeded/GrantKYC.svg',
      name: 'Grant KYC',
      value: 'Grant KYC',
    },
    {
      totalNumber: '0',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/KYCPendingUsers.svg',
      name: 'KYC Pending Users',
      value: 'KYC Pending Users',
    },
    {
      totalNumber: '0',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/SubscriptionExpiring.svg',
      name: 'Subscription expiring in next 30 days',
      value: 'Subscription expiring in next 30 days',
    },
    {
      totalNumber: '0',
      imageUrl: '/assets/images/adminV2/dashboard/actionNeeded/pending.svg',
      name: 'Payment Pending User',
      value: 'Payment Pending User',
    },
  ];
  thirdrowcardsProduct: any[] = [
    {
      totalNumber: '0',
      name: 'Grant subscription',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/Grantsubscription.svg',
      value: 'Grant subscription',
    },
    {
      totalNumber: '0',
      imageUrl: '/assets/images/adminV2/dashboard/actionNeeded/GrantVAS.svg',
      name: 'Grant VAS',
      value: 'Grant VAS',
    },
    {
      totalNumber: '0',
      imageUrl:
        '/assets/images/adminV2/dashboard/actionNeeded/discountcoupons.svg',
      name: 'Grant discount coupons',
      value: 'Grant discount coupons',
    },
  ];
  transactionTypeChange(e) { }

  load(){
   this.ds.getActionNeeded().subscribe({
    next:(data)=>{
      console.log(data)
      this.firstrowcardsProduct[0].totalNumber=data.paymentApprovals
      this.firstrowcardsProduct[1].totalNumber=data.grantPayments
      this.firstrowcardsProduct[2].totalNumber=data.assignRM
      this.firstrowcardsProduct[3].totalNumber=data.grantRM
      this.firstrowcardsProduct[4].totalNumber=data.grantUser
      this.secondrowcardsProduct[0].totalNumber=data.approvalKycs
      this.secondrowcardsProduct[1].totalNumber=data.grantKycs
      this.secondrowcardsProduct[2].totalNumber=data.pendingKycs
      this.secondrowcardsProduct[3].totalNumber=data.subscriptionExpiringIn30Days
      this.secondrowcardsProduct[4].totalNumber=0 //required form backend
      this.thirdrowcardsProduct[0].totalNumber=data.grantSubscription
      this.thirdrowcardsProduct[1].totalNumber=data.grantVaas
      this.thirdrowcardsProduct[2].totalNumber=data.grantDiscountCoupon
    }
   })
  }
  pendingReqOpts=[
    {
      value:'ALL',
      viewValue:'All'
    },
    {
      value:'CUSTOMER',
      viewValue:'Customer'
    },  {
      value:'BANK',
      viewValue:'BAAC'
    },  {
      value:'BAAU',
      viewValue:'BAAU'
    },
    {
      value:'REFERRER',
      viewValue:'Referrer'
    }
]
}
