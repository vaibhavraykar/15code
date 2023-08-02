import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GrantRequestsServices } from '../services/grant-requests-services.services';

@Component({
  selector: 'app-grant-rm',
  templateUrl: './grant-rm.component.html',
  styleUrls: ['./grant-rm.component.scss']
})
export class GrantRmComponent {
  constructor(private router: Router, private grantRequestServices: GrantRequestsServices) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any = {
    displayColumns: [
      'more',
      'User Id',
      'User Type',
      'Company/Bank',
      'First Name',
      'Last Name',
      'Country',
      'RM Id',
      'RM User',
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
    applicableEntity: {
      showapplicableEntity: true,
      showapplicableEntityType: 'CUSTOMER',
      applicableEntityOption: [
        { value: 'CUSTOMER', viewValue: 'Customer' },
        { value: 'BANK', viewValue: 'BAAC' },
        { value: 'BANK_AS_UNDERWRITER', viewValue: 'BAAU' },
        { value: 'REFERRER', viewValue: 'Referrer' },
      ]
    }

  };
  



  ngOnInit(): void {
    this.grantRequestServices.getSelectedTabIndex().subscribe((index: number) => {
      if (index === 5) { 
        let payload = {
          page: 0,
          size: 10,
          status: 'MAKER_APPROVED',
          subscriberType: 'CUSTOMER'
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
      case 'applicableEntType':
        this.changeapplicableEntityType(event.event)
        break;
      case 'approveRM':
        this.onUpdateRM(event.event)
        break;
    }
  }

  changeapplicableEntityType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: 'MAKER_APPROVED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }

  fetchData(payload: any) {
    this.grantRequestServices.rmSelected(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'User Id': item?.personalDetails.username,
            'User Type': item?.personalDetails.subscriberType,
            'Company/Bank': item?.businessDetails.companyName,
            'First Name': item?.personalDetails.firstName,
            'Last Name': item?.personalDetails.lastName,
            'Country': item?.personalDetails.country,
            'RM Id': item?.businessDetails?.rmUser.id,
            'RM User': item?.businessDetails?.rmUser.firstName + ' ' + item?.businessDetails?.rmUser.lastName,
            'Action': {
              from: 'grant_rm',
              status: item?.businessDetails.rmStatusType,
              makerApprovedBy: item?.businessDetails.rmmakerApprovedBy,
              id: item?.personalDetails.id
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
      status: 'MAKER_APPROVED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }

  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: 'MAKER_APPROVED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }
  onUpdateRM(approveRM) {
    let payload = {
      page: 0,
      size: 10,
      status: 'MAKER_APPROVED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }
}
