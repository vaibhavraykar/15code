import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SecondaryTransactionServices } from '../services/sec-transaction-services.services';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-sec-transaction-list',
  templateUrl: './sec-transaction-list.component.html',
  styleUrls: ['./sec-transaction-list.component.scss']
})
export class SecTransactionListComponent implements OnInit {
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute, private secondaryTransService: SecondaryTransactionServices,
    private customerService: CustomerService
  ) {

  }
  @ViewChild('customTable') customTable: any
  data = [];
  tableStructure: any;
  transType: any = 'ALL';


  ngOnInit(): void {
    this.customerService.selectedTransactionType.subscribe(res => {
      if (res) {
        this.transType = res;
      }
    });
    let payload = {
      page: 0,
      size: 10,
      status: this.transType,
    }
    this.fetchData(payload);
    this.tableStructure = {
      displayColumns: [
        'more',
        'User ID',
        'Mobile',
        'Email ID',
        'Beneficary',
        'B_Country',
        'Applicant',
        'A_Country',
        'Transaction ID',
        'Date & Time',
        'Trans Validity',
        'Issuing Bank',
        'Amount',
        'CCY',
        'Requirement',
        'Trxn Status',
        'Quotes',
        'Action',
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
          { value: 'PENDING', viewValue: 'Pending' },
          { value: 'ACCEPTED', viewValue: 'Accepted' },
          { value: 'REJECTED', viewValue: 'Rejected' },
          { value: 'CANCELLED', viewValue: 'Cancelled' },
          { value: 'EXPIRED', viewValue: 'Expired' },
        ],
      },

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
        this.changeTransType(event.event);
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
      status: this.tableStructure.transaction.selectedTransactionType
    }
    this.fetchData(payload);
  }


  fetchData(payload: any) {
    this.secondaryTransService.getAllSecondaryTransactions(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'User ID': item?.personalDetails.username,
            'Mobile': item?.personalDetails.mobileNumber,
            'Email ID': item?.personalDetails.email,
            'Beneficary': item?.beneName,
            'B_Country': item?.beneCountry,
            'Applicant': item?.applicantName,
            'A_Country': item?.applicantCountry,
            'Transaction ID': item?.transactionId,
            'Date & Time': item?.insertedDate,
            'Trans Validity': item?.validity,
            'Issuing Bank': item?.obligorBank,
            'Amount': item?.lCValue.toLocaleString('en') + '.00',
            'CCY': item?.lCCurrency,
            'Requirement': item?.requirementType,
            'Trxn Status': item?.transactionStatus,
            'Quotes': item?.quotationCount,
            'Action': {
              from: 'sec_transaction',
              status: item?.transactionStatus,
              trxnId: item?.transactionId,
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
        status: this.tableStructure.transaction.selectedTransactionType
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
        status: this.tableStructure.transaction.selectedTransactionType
      }
      this.fetchData(payload);
    }
  }

  getColumnKeys() {
    this.secondaryTransService.metaFilter().subscribe((res: any) => {
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
      case 'Double':
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
          status: this.tableStructure.transaction.selectedTransactionType,
        };
      });
      console.log(updatedFilters);
    }else{
      e.status = this.tableStructure.transaction.selectedTransactionType,
      updatedFilters = e;
    }
    this.secondaryTransService.getFilterd(e).subscribe({
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
            'User ID': item?.personalDetails.username,
            'Mobile': item?.personalDetails.mobileNumber,
            'Email ID': item?.personalDetails.email,
            'Beneficary': item?.beneName,
            'B_Country': item?.beneCountry,
            'Applicant': item?.applicantName,
            'A_Country': item?.applicantCountry,
            'Transaction ID': item?.transactionId,
            'Date & Time': item?.insertedDate,
            'Trans Validity': item?.validity,
            'Issuing Bank': item?.obligorBank,
            'Amount': item?.lCValue.toLocaleString('en') + '.00',
            'CCY': item?.lCCurrency,
            'Requirement': item?.requirementType,
            'Trxn Status': item?.transactionStatus,
            'Quotes': item?.quotationCount,
            'Action': {
              from: 'sec_transaction',
              status: item?.transactionStatus,
              trxnId: item?.transactionId,
            },
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
