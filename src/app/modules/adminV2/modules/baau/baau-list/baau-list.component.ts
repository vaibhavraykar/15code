import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { CustomerService } from "../../customers/services/customer.service";

@Component({
  selector: 'app-baau-list',
  templateUrl: './baau-list.component.html',
  styleUrls: ['./baau-list.component.scss']
})
export class BaauListComponent {
  constructor(private customerService: CustomerService) { }
  @ViewChild('customTable') customTable: any
  data = [];
  transType: any = 'ALL';
  userName: any;
  myRole: any;

  tableStructure: any;
  ngOnInit(): void {
    this.customerService.selectedTransactionType.subscribe(res => {
      if (res) {
        this.transType = res;
      }
    });
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
    this.userName = localStorage.getItem('userName');
    if (this.myRole == 'BANK_RM') {
      let payload = { page: 0, size: 10, status: this.transType, subscriberType: "BANK_AS_UNDERWRITER", userId: this.userName }
      this.fetchData(payload);
    } else {
      let payload = { page: 0, size: 10, status: this.transType, subscriberType: "BANK_AS_UNDERWRITER" }
      this.fetchData(payload);
    }
    this.tableStructure = {
      displayColumns: [
        'more',
        'User ID',
        'Business Country',
        'Bank Name',
        'Orders Pending Approval',
        'Total Orders',
        'Pending Users',
        'Total Users',
        'Total Quotes',
        'KYC',
        'Action',
      ],
      dataSource: new MatTableDataSource([]),
      compareDate: false,
      columnKeys: [],
      filters: [],
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
      selectedUserType: 'BANK_AS_UNDERWRITER'
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
            'Business Country': item?.businessDetails?.addressDetails?.registeredCountry,
            'Bank Name': item?.businessDetails?.bankName,
            'Orders Pending Approval': item?.pendingOrders,
            'Total Orders': item?.totalOrders,
            'Pending Users':item?.pendingBaauUsers,
            'Total Users':item?.totalBaauUsers,
            'Total Quotes': item?.quotationCount,
            'KYC': item?.kycDetails.length <= 0 ? 'Not Updated' : item?.kycDetails[0]?.documentList[0]?.kycStatus == 'ACTIVE' && item?.kycDetails[1]?.documentList[0]?.kycStatus == 'ACTIVE' ? 'Approved' : (item?.kycDetails[0]?.documentList[0]?.kycStatus == 'REJECTED' && item?.kycDetails[1]?.documentList[0]?.kycStatus == 'REJECTED') ? 'Rejected' : (item?.kycDetails[0]?.documentList[0]?.kycStatus == 'PENDING' || item?.kycDetails[1]?.documentList[0]?.kycStatus == 'PENDING') ? 'Pending' : 'Pending',
            'Action': {
              from: 'baaulist',
              userName: item?.personalDetails?.username,
              mid: item?.businessDetails?.id,
              personalid: item?.personalDetails?.id
            }

          };
        });
        this.tableStructure.columnKeys = this.getColumnKeys();
        console.log('column keys line 209', this.tableStructure.columnKeys);


        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
        console.log('this.tableStructure.dataSource line 117', this.tableStructure.dataSource);

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
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
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
        status: this.tableStructure.transaction.selectedTransactionType,
        subscriberType: "BANK_AS_UNDERWRITER"
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
        status: this.tableStructure.transaction.selectedTransactionType,
        subscriberType: "BANK_AS_UNDERWRITER"
      }
      this.fetchData(payload);
    }
  }
  changeTransType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: status,
      subscriberType: "BANK_AS_UNDERWRITER"
    }
    this.fetchData(payload);
  }

  getColumnKeys() {
    this.customerService.metaFilter().subscribe((res: any) => {
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
        status: 'ALL',
        subscriberType: "BANK_AS_UNDERWRITER"
      };
      this.fetchData(payload);
    }

  }

  fetchFilteredSearch(e) {
    if(Array.isArray(e)){
      var updatedFilters = e.map((filter) => {
        return {
          ...filter,
          subscriberType:'BANK_AS_UNDERWRITER',
        };
      });
      console.log(updatedFilters);
    }else{
      e.subscriberType = 'BANK_AS_UNDERWRITER';
      updatedFilters = e;
    }
    this.customerService.getFilterd(e).subscribe({
      next: (res: any) => {
        let response = res.content;
        this.tableStructure.page = {
          previousPageIndex: res.page - 1,
          pageIndex: res.page,
          pageSize: res.size,
          length: res.totalElements,
        };
        let data = response.map((item: any) => {
          if (item?.kycDetails?.[0]) {
            item.kycDetails[0].documentList = item?.kycDetails?.[0]?.documentList?.sort((a, b) => b.id - a.id);
          }
          if (item?.kycDetails?.[1]) {
            item.kycDetails[1].documentList = item?.kycDetails?.[1]?.documentList?.sort((a, b) => b.id - a.id);
          }
          return {
            'User ID': item?.personalDetails?.username,
            'Business Country': item?.businessDetails?.addressDetails?.registeredCountry,
            'Bank Name': item?.businessDetails?.bankName,
            'Orders Pending Approval': item?.pendingOrders,
            'Total Orders': item?.totalOrders,
            'Total Quotes': item?.quotationCount,
            'Pending Users':item?.pendingBaauUsers,
            'Total Users':item?.totalBaauUsers,
            'KYC': item?.kycDetails.length <= 0 ? 'Not Updated' : item?.kycDetails[0]?.documentList[0]?.kycStatus == 'ACTIVE' && item?.kycDetails[1]?.documentList[0]?.kycStatus == 'ACTIVE' ? 'Approved' : (item?.kycDetails[0]?.documentList[0]?.kycStatus == 'REJECTED' && item?.kycDetails[1]?.documentList[0]?.kycStatus == 'REJECTED') ? 'Rejected' : (item?.kycDetails[0]?.documentList[0]?.kycStatus == 'PENDING' || item?.kycDetails[1]?.documentList[0]?.kycStatus == 'PENDING') ? 'Pending' : 'Pending',
            'Action': {
              from: 'baaulist',
              userName: item?.personalDetails?.username,
              mid: item?.businessDetails?.id
            },
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
