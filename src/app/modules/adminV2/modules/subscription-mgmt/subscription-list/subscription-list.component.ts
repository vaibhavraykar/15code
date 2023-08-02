import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SubscriptionMgmtServices } from '../services/subscription-services.services';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {
  constructor(private router: Router, private subsMgmtService: SubscriptionMgmtServices, private customerService: CustomerService) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any;
  myRights: any;
  myRole: any;
  userType: any = 'CUSTOMER';

  ngOnInit(): void {
    this.customerService.selectedUserTypeForTable.subscribe(res => {
      if (res) {
        this.userType = res;
      }
    })
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
    this.tableStructure = {
      displayColumns: [
        'more',
        'User Type',
        'Product Type',
        'Currency',
        'Plan',
        'Credits',
        'Price',
        'Duration',
        'Plan Type',
        'Status',
        'Action'
      ],
      dataSource: new MatTableDataSource([]),
      // compareDate: true,
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
        selectedTransactionType: 'ALL',
      },

      selectedUserType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.userType

    };
    let payload = {
      page: 0,
      size: 10,
      status: 'ALL',
      subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.userType
    }
    this.fetchData(payload);
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
      case 'userType':
        this.changeUserType(event.event)
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
  }

  changeUserType(userType) {
    if (this.tableStructure.filters.length > 0) {
      let payload = {
        ...this.tableStructure.filtersPayload,
        page: 0,
        size: 10,
      };
      this.fetchFilteredSearch(payload);
    }
    else {
      let payload = {
        page: 0,
        size: 10,
        status: 'ALL',
        subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : userType
      }
      this.fetchData(payload);
    }
  }

  fetchData(payload: any) {
    this.subsMgmtService.getProductList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        console.log('data', response);
        let data = response.content.map((item: any) => {
          console.log('duration', item?.duration);
          return {
            'User Type': item?.applicableEntityType,
            'Product Type': item?.productType.replace('_', ' '),
            'Currency': item?.currency,
            'Plan': item?.planName,
            'Credits': item?.credits,
            'Price': item?.price.toLocaleString('en') + '.00',
            'Duration': item?.duration != undefined ? item?.duration + ' ' + item?.durationType : '',
            'Plan Type': item?.planType,
            'Status': item?.status,
            'Action': {
              from: 'subscription_list',
              userId: item?.id
            }
          }
        })
        this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
  }

  addSubscription() {
    this.router.navigateByUrl('/adminv2/subscription-management/add-subscription');
  }

  goNextPrevious(data) {
    if (this.tableStructure.filters.length > 0) {
      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    }
    else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'ALL',
        subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.tableStructure.selectedUserType
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
    }
    else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'ALL',
        subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.tableStructure.selectedUserType
      }
      this.fetchData(payload);
    }
  }
  onupdateUser(activeInactive) {
    let payload = {
      page: 0,
      size: 10,
      status: 'ALL',
      subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.tableStructure.selectedUserType
    }
    this.fetchData(payload);
  }
  getColumnKeys() {
    this.subsMgmtService.metaFilter().subscribe((res: any) => {
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
        status: this.tableStructure.transaction.selectedTransactionType,
        subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.tableStructure.selectedUserType
      };
      this.fetchData(payload);
    }

  }

  fetchFilteredSearch(e) {
    if(Array.isArray(e)){
      var updatedFilters = e.map((filter) => {
        return {
          ...filter,
          subscriberType:this.tableStructure.selectedUserType,
          statusType: this.tableStructure.transaction.selectedTransactionType,
        };
      });
      console.log(updatedFilters);
    }else{
      e.subscriberType = this.tableStructure.selectedUserType;
      e.statusType = this.tableStructure.transaction.selectedTransactionType,
      updatedFilters = e;
    }
    this.subsMgmtService.getFilterd(e).subscribe({
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
            'User Type': item?.applicableEntityType,
            'Product Type': item?.productType.replace('_', ' '),
            'Currency': item?.currency,
            'Plan': item?.planName,
            'Credits': item?.credits,
            'Price': item?.price.toLocaleString('en') + '.00',
            'Duration': item?.duration != undefined ? item?.duration + ' ' + item?.durationType : '',
            'Plan Type': item?.planType,
            'Status': item?.status,
            'Action': {
              from: 'subscription_list',
              userId: item?.id
            }
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }

}
