import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GrantRequestsServices } from '../services/grant-requests-services.services';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-grant-kyc',
  templateUrl: './grant-kyc.component.html',
  styleUrls: ['./grant-kyc.component.scss']
})
export class GrantKycComponent {
  constructor(private router: Router, private grantRequestServices: GrantRequestsServices, private customerService: CustomerService) { }
  @ViewChild('customTable') customTable: any
  data = [];
  tableStructure: any;
  userType: any = 'CUSTOMER';

  ngOnInit(): void {
    this.customerService.selectedUserTypeForTable.subscribe(res => {
      if (res) {
        this.userType = res;
      }
    })
    console.log('type check',this.userType)
    this.grantRequestServices.getSelectedTabIndex().subscribe((index: number) => {
      if (index === 1) { 
        let payload = {
          page: 0,
          size: 10,
          status: 'MAKER_APPROVED',
          subscriberType: this.userType
        }
        this.fetchData(payload);
      }
    });
    
    this.tableStructure = {
      displayColumns: [
        'more',
        'User Id',
        'First Name',
        'Last Name',
        'Email',
        'Mobile',
        'Business Status',
        'Personal Status',
        'Action'

      ],
      dataSource: new MatTableDataSource([]),
      columnKeys: [],
      filters: [],

      page: {
        previousPageIndex: 1,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      },

      transaction: {
        showTransType: false,
        selectedTransactionType: 'MAKER_APPROVED',

      },
      applicableEntity: {
        showapplicableEntity: true,
        showapplicableEntityType: this.userType,
        applicableEntityOption: [
          { value: 'CUSTOMER', viewValue: 'Customer' },
          { value: 'BANK', viewValue: 'BAAC' },
          { value: 'BANK_AS_UNDERWRITER', viewValue: 'BAAU' },
          { value: 'REFERRER', viewValue: 'Referrer' },
        ]
      }
    };
    console.log('usertype',this.tableStructure.applicableEntity.showapplicableEntityType)

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
      case 'applicableEntType':
        this.changeapplicableEntityType(event.event)
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
  }

  changeTransType(data) {
    if (this.tableStructure.filters.length > 0) {
      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    } else {
      let payload = {
        page: 0,
        size: 10,
        status: 'MAKER_APPROVED',
        subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
      }
      this.fetchData(payload);
    }
  }

  changeapplicableEntityType(userType: any) {
    let payload = {
      page: 0,
      size: 10,
      status: 'MAKER_APPROVED',
      subscriberType: userType
    }
    this.fetchData(payload);
  }

  fetchData(payload: any) {
    this.grantRequestServices.getCustomerList(payload).subscribe({
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
            'First Name': item?.personalDetails.firstName,
            'Last Name': item?.personalDetails.lastName,
            'Email': item?.personalDetails.email,
            'Mobile': item?.personalDetails.mobileNumber,
            'Plan and Payment': item?.plans?.planType,
            'Business Status': item?.kycDetails[0].documentList[0].kycStatus,
            'Personal Status': item?.kycDetails[1].documentList[0].kycStatus,
            'Action': {
              from: 'grant_kyc',
              userId: item?.personalDetails.username
            }

          }
        })
        this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      }
    })
  }


  goNextPrevious(data) {
    if (this.tableStructure.filters.length > 0) {
      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    } else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'MAKER_APPROVED',
        subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
      }
      this.fetchData(payload);
    }
  }

  changeEntrySize(data) {
    if (this.tableStructure.filters.length > 0) {
      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    } else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'MAKER_APPROVED',
        subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
      }
      this.fetchData(payload);
    }
  }
  onupdatePayment(approvePayment) {
    let payload = {
      page: 0,
      size: 10,
      status: 'MAKER_APPROVED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }

  getColumnKeys() {
    this.grantRequestServices.metaFilter().subscribe((res: any) => {
      const newData = res.data;
      console.log('Data', newData);
      const fieldInfo = newData[0].fieldInfo;
      this.tableStructure.columnKeys = fieldInfo.map((field) => ({
        value: field.key,
        viewValue: field.key.toUpperCase(),
        fieldType: this.getType(field.value),
      }));

      console.log(this.tableStructure.columnKeys);
    })
  }

  getType(value) {
    switch (value) {
      case 'long':
        return 'LONG';
      case 'String':
        return 'STRING';
      case 'double':
        return 'DOUBLE';
      case 'Boolean':
        return 'BOOLEAN';
      case 'Integer':
        return 'INTEGER';
      default:
        return 'UNKNOWN';
    }
  }

  applyFilter(e) {
    console.log(e)
    if (e.filters[0].key && e.filters[0].fieldType && e.filters[0].operator && e.filters[0].value) {
      this.fetchFilteredSearch(e);
    } else {
      let payload = {
        page: 0,
        size: 10,
        status: 'MAKER_APPROVED',
        subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
        // mid: this.mid,
      };
      this.fetchData(payload);
    }

  }

  fetchFilteredSearch(e) {
    if (Array.isArray(e)) {
      var updatedFilters = e.map((filter) => {
        return {
          ...filter,
          subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType,
        };
      });
      console.log(updatedFilters);
    } else {
      e.subscriberType = this.tableStructure.applicableEntity.showapplicableEntityType;
      updatedFilters = e;
    }
    this.grantRequestServices.getFilterd(e).subscribe({
      next: (res: any) => {
        let response = res.content;
        this.tableStructure.page = {
          previousPageIndex: res.page - 1,
          pageIndex: res.page,
          pageSize: res.size,
          length: res.totalElements,
        };
        let data = response.map((item: any) => {
          return {
            'User Id': item?.personalDetails.username,
            'First Name': item?.personalDetails.firstName,
            'Last Name': item?.personalDetails.lastName,
            'Email': item?.personalDetails.email,
            'Mobile': item?.personalDetails.mobileNumber,
            'Plan and Payment': item?.plans?.planType,
            'Business Status': item?.kycDetails[0].documentList[0].kycStatus,
            'Personal Status': item?.kycDetails[1].documentList[0].kycStatus,
            'Action': {
              from: 'grant_kyc',
              userId: item?.personalDetails.username
            }
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
