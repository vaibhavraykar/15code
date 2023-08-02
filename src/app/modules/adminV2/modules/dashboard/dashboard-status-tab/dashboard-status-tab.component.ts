import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard-status-tab',
  templateUrl: './dashboard-status-tab.component.html',
  styleUrls: ['./dashboard-status-tab.component.scss'],
})
export class DashboardStatusTabComponent implements OnInit {
  firstrowcardsProduct: any[] = [
    {
      totalNumber: '0',
      imageUrl: '/assets/images/adminV2/dashboard/status/customer.svg',
      name: 'Customers',
      value: 'Customers',
    },
    {
      totalNumber: '0',
      name: 'BAAU',
      imageUrl: '/assets/images/adminV2/dashboard/status/bankUnderwritter.svg',
      value: 'Banks (Underwriter)',
    },
    {
      totalNumber: '0',
      name: 'BAAC',
      imageUrl: '/assets/images/adminV2/dashboard/status/BanksCustomer.svg',
      value: 'Banks (Customer)',
    },
  ];
  secondrowcardsProduct: any[] = [
    {
      totalNumber: '0',
      name: 'Referrers',
      imageUrl: '/assets/images/adminV2/dashboard/status/referral.svg',
      value: 'Referrers',
    },
    {
      totalNumber: '0',
      name: 'Customer Rejected Trxn in last 7 days',
      imageUrl: '/assets/images/adminV2/dashboard/status/CustomerRejected.svg',
      value: 'Customer Rejected Trxn in last 7 days',
    },
    {
      totalNumber: '0',
      name: 'Customer Expired Trxn in last 7 days',
      imageUrl: '/assets/images/adminV2/dashboard/status/CustomerExpired.svg',
      value: 'Customer Expired Trxn in last 7 days',
    },
  ];
  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.load()
  }
  load() {
    this.dashboardService.getUserStatus().subscribe({
      next: (data) => {
        this.firstrowcardsProduct[0].totalNumber = data.totalCustomers
        this.firstrowcardsProduct[1].totalNumber = data.totalBankAsUnderwriters
        this.firstrowcardsProduct[2].totalNumber = data.totalBankAsCustomers
        this.secondrowcardsProduct[0].totalNumber = data.totalReferrers
        this.secondrowcardsProduct[1].totalNumber = data.customerRejectedTxnInLst7days
        this.secondrowcardsProduct[2].totalNumber = data.customerExpiredTxnInLst7days
      }
    });
  }




}
