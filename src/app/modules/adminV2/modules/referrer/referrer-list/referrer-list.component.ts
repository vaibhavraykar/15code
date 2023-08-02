import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-referrer-list',
  templateUrl: './referrer-list.component.html',
  styleUrls: ['./referrer-list.component.scss']
})
export class ReferrerListComponent {

  constructor(private customerService: CustomerService) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any;
  transType:any='ALL';

  ngOnInit(): void {
    this.customerService.selectedTransactionType.subscribe(res=>{
      if(res){
        this.transType = res;
      }
    })
    let payload = {
      page: 0,
      size: 10,
      status: this.transType,
      subscriberType: "REFERRER"
    }
    this.fetchData(payload);
    this.tableStructure = {
      displayColumns: [
        'more',
        'User ID',
        'First Name',
        'Last Name',
        'Mobile No',
        'Email ID',
        'Business Country',
        'Company Name',
        'KYC',
        'Total References',
        'Approved References',
        'Rejected References',
        'Pending References',
        'Earning(USD)',
        'Actions',
      ],
      dataSource: new MatTableDataSource([]),
      compareDate: true,
  
      page: {
        previousPageIndex: 1,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      },
  
      transaction: {
        showTransType: true,
        selectedTransactionType: this.transType,
        transactionsOption: [
          { value: 'ALL', viewValue: 'All' },
          { value: 'ACTIVE', viewValue: 'Approved' },
          { value: 'PENDING', viewValue: 'Pending' },
          { value: 'REJECTED', viewValue: 'Rejected' },
  
        ]
      },
      selectedUserType: 'REFERRER'
  
    };
  
  
  }


  fetchData(payload: any) {
    this.customerService.getCustomerList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          if (item?.kycDetails?.[0]) {
            item.kycDetails[0].documentList = item?.kycDetails?.[0]?.documentList?.sort((a, b) => b.id - a.id);
          }
          if (item?.kycDetails?.[1]) {
            item.kycDetails[1].documentList = item?.kycDetails?.[1]?.documentList?.sort((a, b) => b.id - a.id);
          }
          return {
            'User ID': item?.personalDetails?.username,
            'First Name': item?.personalDetails?.firstName,
            'Last Name': item?.personalDetails?.lastName,
            'Mobile No': item?.personalDetails?.mobileNumber,
            'Email ID': item?.personalDetails?.email,
            'Business Country': item?.personalDetails?.country,
            'Company Name': item?.businessDetails?.companyName,
            'KYC': item?.kycDetails.length <= 0 ? 'Not Updated' : item?.kycDetails[0]?.documentList[0]?.kycStatus == 'ACTIVE' && item?.kycDetails[1]?.documentList[0]?.kycStatus == 'ACTIVE' ? 'Approved' : (item?.kycDetails[0]?.documentList[0]?.kycStatus == 'REJECTED' && item?.kycDetails[1]?.documentList[0]?.kycStatus == 'REJECTED') ? 'Rejected' : (item?.kycDetails[0]?.documentList[0]?.kycStatus == 'PENDING' || item?.kycDetails[1]?.documentList[0]?.kycStatus == 'PENDING') ? 'Pending' : 'Pending',
            'Total References': item?.totalReferences,
            'Approved References':item.approvedReferences,
            'Rejected References':item.rejectedReferences,
            'Pending References':item.pendingReferences,
            'Earning(USD)':item.totalEarning,
            'Actions':{
              from: 'referrerList',
            },

          }
        })
        this.tableStructure.dataSource = new MatTableDataSource(data);
        console.log(this.tableStructure.dataSource);
        this.customTable.refreshTable()
      }
    })
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
      case 'transactionType':
        this.changeTransType(event.event)
        break;
    }
  }
  goNextPrevious(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: this.tableStructure.transaction.selectedTransactionType,
      subscriberType: "REFERRER"
    }
    this.fetchData(payload);
  }
  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: this.tableStructure.transaction.selectedTransactionType,
      subscriberType: "REFERRER"
    }
    this.fetchData(payload);
  }
  changeTransType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: status,
      subscriberType: "REFERRER"
    }
    this.fetchData(payload);
  }


}
