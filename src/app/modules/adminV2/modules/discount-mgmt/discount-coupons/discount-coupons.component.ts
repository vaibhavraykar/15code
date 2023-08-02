import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountManagementServices } from '../services/discount-mgmt-services.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../customers/services/customer.service';


@Component({
  selector: 'app-discount-coupons',
  templateUrl: './discount-coupons.component.html',
  styleUrls: ['./discount-coupons.component.scss']
})
export class DiscountCouponsComponent implements OnInit {

  constructor(private router: Router, private discountmgmtService: DiscountManagementServices, private customerService: CustomerService) { }
  @ViewChild('customTable') customTable: any
  data = []
  transType: any = 'ALL';
  tableStructure: any;
  myRights: any;

  ngOnInit(): void {
    this.customerService.selectedTransactionType.subscribe(res => {
      if (res) {
        this.transType = res;
      }
    })
    let payload = {
      page: 0,
      size: 10,
      status: this.transType,
      subscriberType: 'ADMIN'
    }
    this.fetchData(payload);
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.tableStructure = {
      displayColumns: [
        'more',
        'Coupon Code',
        'CCY',
        'Fix Amount',
        'Discount %',
        'Max. Discount',
        'Quantity',
        'Con. Coupons',
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
        showTransType: true,
        selectedTransactionType: this.transType,
        transactionsOption: [
          { value: 'ALL', viewValue: 'All' },
          { value: 'ACTIVE', viewValue: 'Active' },
          { value: 'INACTIVE', viewValue: 'Inactive' },
          { value: 'PENDING', viewValue: 'Pending' },
          { value: 'REJECTED', viewValue: 'Rejected' },
        ]
      }

    };
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
      case 'activeInactive':
        this.onupdateUser(event.event)
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
  }

  changeTransType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: status,
      subscriberType: 'ADMIN'
    }
    this.fetchData(payload);
  }

  fetchData(payload: any) {
    this.discountmgmtService.getDiscountCouponsList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'Coupon Code': item?.couponCode,
            'CCY': item?.currency,
            'Fix Amount': item?.fixAmount.toLocaleString('en') + '.00',
            'Discount %': item?.discountPercentage,
            'Max. Discount': item?.maxDiscount.toLocaleString('en') + '.00',
            'Quantity': item?.quantity,
            'Con. Coupons': item?.consumedCoupons,
            'Status': item?.status.charAt(0).toUpperCase() + item?.status.slice(1).toLowerCase(),
            'Action': {
              from: 'discount_coupons',
              id: item?.id
            }
          }
        })
        this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
  }

  newCoupon() {
    this.router.navigateByUrl('/adminv2/discount-management/new-coupon');
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
        subscriberType: 'ADMIN'
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
        subscriberType: 'ADMIN'
      }
      this.fetchData(payload);
    }
  }
  onupdateUser(activeInactive) {
    let payload = {
      page: 0,
      size: 10,
      status: this.tableStructure.transaction.selectedTransactionType,
      subscriberType: 'ADMIN'
    }
    this.fetchData(payload);
  }

  getColumnKeys() {
    this.discountmgmtService.metaFilter().subscribe((res: any) => {
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
        subscriberType: "ADMIN"
      };
      this.fetchData(payload);
    }

  }

  fetchFilteredSearch(e) {
    if(Array.isArray(e)){
      var updatedFilters = e.map((filter) => {
        return {
          ...filter,
          statusType: this.tableStructure.transaction.selectedTransactionType,
        };
      });
      console.log(updatedFilters);
    }else{
      e.statusType = this.tableStructure.transaction.selectedTransactionType,
      updatedFilters = e;
    }
    this.discountmgmtService.getFilterd(e).subscribe({
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
            'Coupon Code': item?.couponCode,
            'CCY': item?.currency,
            'Fix Amount': item?.fixAmount.toLocaleString('en') + '.00',
            'Discount %': item?.discountPercentage,
            'Max. Discount': item?.maxDiscount.toLocaleString('en') + '.00',
            'Quantity': item?.quantity,
            'Con. Coupons': item?.consumedCoupons,
            'Status': item?.status.charAt(0).toUpperCase() + item?.status.slice(1).toLowerCase(),
            'Action': {
              from: 'discount_coupons',
              id: item?.id
            },
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
