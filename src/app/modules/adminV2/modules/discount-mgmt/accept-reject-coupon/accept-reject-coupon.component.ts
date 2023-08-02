import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountManagementServices } from '../services/discount-mgmt-services.service';
import { GrantRequestsServices } from '../../grant-requests/services/grant-requests-services.services';

@Component({
  selector: 'app-accept-reject-coupon',
  templateUrl: './accept-reject-coupon.component.html',
  styleUrls: ['./accept-reject-coupon.component.scss']
})
export class AcceptRejectCouponComponent implements OnInit{
  constructor(private discountmgmtService: DiscountManagementServices, private grantRequestServices: GrantRequestsServices) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any = {
    displayColumns: [
      'more',
      'Coupon Code',
      'CCY',
      'Quantity',
      'Fix Amount',
      'Discount %',
      'Max. Discount',
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
      showTransType: false,
      selectedTransactionType: 'PENDING',
    }

  };



  ngOnInit(): void {
    this.grantRequestServices.getSelectedTabIndex().subscribe((index: number) => {
      if (index === 4) { 
        let payload = {
          page: 0,
          size: 10,
          status: 'PENDING',
          subscriberType: 'ADMIN'
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
      case 'activeInactive':
        this.onupdateUser(event.event)
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
  }


  onupdateUser(data){
    let payload = {
      page: 0,
      size: 10,
      status: 'PENDING',
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
            'Coupon Code' : item?.couponCode,
            'CCY' : item?.currency,
            'Quantity' : item?.quantity,
            'Fix Amount' : item?.fixAmount,
            'Discount %' : item?.discountPercentage,
            'Max. Discount' : item?.maxDiscount,
            'Con. Coupons' : item?.consumedCoupons,
            'Status' : item?.status.charAt(0).toUpperCase() + item?.status.slice(1).toLowerCase(),
            'Action' : {
              from: 'approval_coupons',
              id: item?.id,
              makerApprovedBy : item?.makerApprovedBy,
              status: item?.status
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
    } else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'PENDING',
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
        status: 'PENDING',
        subscriberType: 'ADMIN'
      }
      this.fetchData(payload);
    }
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
        status: 'PENDING',
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
          statusType: 'PENDING'
        };
      });
      console.log(updatedFilters);
    }else{
      e.statusType = 'PENDING',
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
              from: 'approval_coupons',
              id: item?.id,
              makerApprovedBy : item?.makerApprovedBy,
              status: item?.status
            },
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}

