import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionMgmtServices } from '../services/subscription-services.services';
import { CustomerService } from '../../customers/services/customer.service';
import { GrantRequestsServices } from '../../grant-requests/services/grant-requests-services.services';

@Component({
  selector: 'app-grant-subscription',
  templateUrl: './grant-subscription.component.html',
  styleUrls: ['./grant-subscription.component.scss']
})
export class GrantSubscriptionComponent {
  constructor(private subsMgmtServices: SubscriptionMgmtServices, private customerService: CustomerService, private grantRequestServices: GrantRequestsServices) { }
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
      selectedTransactionType: 'PENDING',
    },
    selectedUserType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.userType

  };
  this.grantRequestServices.getSelectedTabIndex().subscribe((index: number) => {
    if (index === 6) { 
      let payload = {
        page: 0,
      size: 10,
      status: 'PENDING',
      subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.userType
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
      case 'approveSubscription':
        this.onUpdateSubscription(event.event)
        break;
      case 'userType':
        this.changeUserType(event.event)
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
  }


  onUpdateSubscription(userType) {
    let payload = {
      page: 0,
      size: 10,
      status: 'PENDING',
      subscriberType: userType
    }
    this.fetchData(payload);
  }

  changeapplicableEntityType(subscriberType: any) {
    let payload = {
      page: 0,
      size: 10,
      status: 'PENDING',
      subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.userType
    }
    this.fetchData(payload);
  }

  fetchData(payload: any) {
    this.subsMgmtServices.getProductList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'User Type': item?.applicableEntityType,
            'Product Type': item?.productType.replace('_', ' '),
            'Currency': item?.currency,
            'Plan': item?.planName,
            'Credits': item?.credits,
            'Price': item?.price,
            'Duration': item?.duration,
            'Plan Type': item?.planType,
            'Status': item?.status,
            'Action' : {
              from : 'grant_product',
              userId : item?.id,
              status : item?.status,
              makerApprovedBy : item?.makerApprovedBy
            }

          }
        })
        this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
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
    }
    else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'PENDING',
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
        status: 'PENDING',
        subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : this.tableStructure.selectedUserType
      }
      this.fetchData(payload);
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
        status: 'PENDING',
        subscriberType: this.myRole == 'BANK_RM' ? 'BANK_AS_UNDERWRITER' : userType
      }
      this.fetchData(payload);
    }
  }

  getColumnKeys() {
    this.subsMgmtServices.metaFilter().subscribe((res: any) => {
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
    this.subsMgmtServices.getFilterd(e).subscribe({
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
            'Price': item?.price,
            'Duration': item?.duration,
            'Plan Type': item?.planType,
            'Status': item?.status,
            'Action' : {
              from : 'grant_product',
              userId : item?.id,
              status : item?.status,
              makerApprovedBy : item?.makerApprovedBy
            }
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }

}
