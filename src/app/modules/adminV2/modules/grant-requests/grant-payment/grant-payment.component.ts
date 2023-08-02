import { Component,OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GrantRequestsServices } from '../services/grant-requests-services.services';

@Component({
  selector: 'app-grant-payment',
  templateUrl: './grant-payment.component.html',
  styleUrls: ['./grant-payment.component.scss']
})
export class GrantPaymentComponent {
  constructor(private router: Router, private grantRequestServices: GrantRequestsServices) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any = {
    displayColumns: [
      'more',
      'User Id',
      'First Name',
      'Last Name',
      'Email',
      'Mobile',
      // 'Plan and Payment',
      'Business Country',
      'Status',
      'Action'
    ],
    dataSource: new MatTableDataSource([]),
    // compareDate: true,

    page: {
      previousPageIndex: 1,
      pageIndex: 0,
      pageSize: 10,
      length: 0,
    },

    transaction: {
      showTransType: false,
      selectedTransactionType: 'MAKER_APPROVED',

    }

  };



  ngOnInit(): void {
    this.grantRequestServices.getSelectedTabIndex().subscribe((index: number) => {
      if (index === 2) { 
        let payload = {
          page: 0,
          size: 10,
          status: 'MAKER_APPROVED'
        }
        this.fetchData(payload);
      }
    });
  }


  tableEventEmitter(event) {
    console.log(event)
    switch (event.eventName) {
      case 'paginationButton':
        this.goNextPrevious(event.event)
        break;
      case 'entrySize':
        this.changeEntrySize(event.event)
        break;
      case 'approvePayment':
        this.onupdatePayment(event.event)
        break;
    }
  }

  changeTransType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: 'MAKER_APPROVED'
    }
    this.fetchData(payload);
  }
  
  fetchData(payload: any) {
    this.grantRequestServices.getCustomerListPayment(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'User Id' : item?.personalDetails.username,
            'First Name' : item?.personalDetails.firstName,
            'Last Name' : item?.personalDetails.lastName,
            'Email' : item?.personalDetails.email,
            'Mobile' : item?.personalDetails.mobileNumber,
            // 'Plan and Payment',
            'Business Country' : item?.businessDetails.addressDetails.registeredCountry,
            'Status' : item?.orders.status,
            'Action' : {
              from: 'grant_payment',
              orderId: item?.orders.orderId,
              paymentId: item?.orders.paymentDetails[0].pid,
              modeOfPayment: item?.orders.paymentDetails[0].modeOfPayment,
              tokenValue: item?.orders.paymentDetails[0].orderToken,
              userId: item?.personalDetails.username,
              makerApprovedBy: item?.orders.makerApprovedBy
            }

          }
        })
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      }
    })
  }

  
  goNextPrevious(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: 'MAKER_APPROVED'
    }
    this.fetchData(payload);
  }

  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: 'MAKER_APPROVED'
    }
    this.fetchData(payload);
  }
  onupdatePayment(approvePayment){
    let payload = {
      page: 0,
      size: 10,
      status: 'MAKER_APPROVED'
    }
    this.fetchData(payload);
  }

}
