import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PrimaryTransactionServicesService } from './services/primary-transaction-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customers/services/customer.service';

@Component({
  selector: 'app-primary-transaction',
  templateUrl: './primary-transaction.component.html',
  styleUrls: ['./primary-transaction.component.scss'],
})
export class PrimaryTransactionComponent implements OnInit {
  constructor(
    private primaryTransactionService: PrimaryTransactionServicesService,private customerService: CustomerService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }
  @ViewChild('customTable') customTable: any
  data = []
  mid: any = '';
  transStatus: any = 'ALL';
  filterDateOn: boolean = false;
  tableStructure: any ;
  transType:any='ALL';
  startDate: any;
  endDate: any;
  startFormatted: any;
  endFormatted: any;

  ngOnInit(): void {
    this.customerService.selectedTransactionType.subscribe(res => {
      if (res) {
        this.transType = res;
      }
    });
    this.route.queryParams.subscribe((param: any) => {
      this.mid = param['mid'];
    });
    let payload = {
      page: 0,
      size: 10,
      status: this.transType,
      mid: this.mid,
    };
    this.fetchData(payload);
    this.tableStructure = {
      displayColumns: [
        'more',
        'Transaction ID',
        'User ID',
        'Mobile',
        'Email ID',
        'Beneficary',
        'B_Country',
        'Applicant',
        'A_Country',
        'Date',
        'Trans Validity',
        'Issuing Bank',
        'Amount',
        'CCY',
        'Requirement',
        'Trxn Status',
        'Min. Commision Amt',
        'Min. Commision %',
        'Plan Type',
        'Quotes',
        'Quotes Relay',
        'Action',
      ],
      dataSource: new MatTableDataSource([]),
      compareDate: true,
      columnKeys: [],
      filters: [],
      page: {
        previousPageIndex: 1,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      },
      counts: {
        quoteReceived: 0,
        quoteAccepted: 0,
        totalTransaction: 0,
        quotation: 0
      },
  
      transaction: {
        showTransType: true,
        selectedTransactionType: this.transType,
        transactionsOption: [
          { value: 'ALL', viewValue: 'All' },
          { value: 'RELAYTXN', viewValue: 'Quotes Relay' },
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
    console.log(event);
    switch (event.eventName) {
      case 'paginationButton':
        this.goNextPrevious(event.event);
        break;
      case 'entrySize':
        this.changeEntrySize(event.event);
        break;
      case 'approvePending':
        this.onUpdatePendingTrans(event.event);
        break;
      case 'transactionType':
        this.transStatus = event.event;
        this.changeTransType(event.event);
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
      case 'dateRange':
        this.filterDateOn = true;
        const moment = require('moment');
        this.startDate = event.event.start;
        this.endDate = event.event.end;
        this.startFormatted = moment(this.startDate).format('YYYY-MM-DD');
        this.endFormatted = moment(this.endDate).format('YYYY-MM-DD');
        let payload = {
          page: 0,
          size: 10,
          dateFrom: this.startFormatted,
          dateTo: this.endFormatted,
          userId: '',
          mid: this.mid,
          status: this.transStatus,
        };
        this.filterByDate(payload);
        break;
    }
  }

  changeTransType(status: any) {
    if (this.filterDateOn) {
      let payload = {
        page: 0,
        size: 10,
        dateFrom: this.startFormatted,
        dateTo: this.endFormatted,
        userId: '',
        mid: this.mid,
        status: status,
      };
      this.filterByDate(payload);
    } else {
      let payload = {
        page: 0,
        size: 10,
        status: status,
        mid: this.mid,
      };
      this.fetchData(payload);
    }
  }

  onUpdatePendingTrans(approvePending) {
    let payload = {
      page: 0,
      size: 10,
      status: this.tableStructure.transaction.selectedTransactionType,
      mid: this.mid
    }
    this.fetchData(payload);
  }
  fetchData(payload: any) {
    this.primaryTransactionService
      .getAllPrimaryTransactions(payload)
      .subscribe({
        next: (response: any) => {
          this.tableStructure.page = {
            previousPageIndex: response.page - 1,
            pageIndex: response.page,
            pageSize: response.size,
            length: response.totalElements,
          };
          this.tableStructure.counts = {
            quoteReceived: response.counts.quoteReceived,
            quoteAccepted: response.counts.quoteAccepted,
            totalTransaction: response.counts.totalTransaction,
            quotation: response.counts.quotation,
          };
          let data = response.content.map((item: any) => {
            return {
              'User ID': item?.userId,
              Mobile: item?.mobileNo,
              'Email ID': item?.email,
              Beneficary: item?.beneName,
              B_Country: item?.beneCountry,
              Applicant: item?.applicantName,
              A_Country: item.applicantCountry,
              'Transaction ID': item?.mtransactionId,
              'Date': item?.date,
              'Trans Validity': item?.validity,
              'Issuing Bank': item?.lcissuanceBank,
              Amount: item?.lcvalue.toLocaleString('en')+'.00',
              CCY: item?.lccurrency,
              Requirement: item?.requirementType,
              'Trxn Status': item?.transactionStatus,
              'Min. Commision Amt': item?.minimumCommisionAmount,
              'Min. Commision %': item?.minimumCommisionPercentage,
              'Plan Type': item?.planType,
              Quotes: item?.noOfQuotation,
              Action: {
                from: 'primary_transaction',
                status: item?.transactionStatus,
                trxnId: item?.mtransactionId,
                percentValue: item?.minimumCommisionPercentage,
                amtValue: item?.minimumCommisionAmount
              },
            };
          });
          this.tableStructure.columnKeys = this.getColumnKeys();
          this.tableStructure.dataSource = new MatTableDataSource(data);
          this.customTable.refreshTable();
        },
      });
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
      if (this.filterDateOn) {
        let payload = {
          page: data.pageIndex,
          size: data.pageSize,
          dateFrom: this.startFormatted,
          dateTo: this.endFormatted,
          userId: '',
          mid: this.mid,
          status: this.transStatus,
        };
        this.filterByDate(payload);
      } else {
        let payload = {
          page: data.pageIndex,
          size: data.pageSize,
          status: this.transStatus,
          mid: this.mid,
        };
        this.fetchData(payload);
      }
    }
  }

  changeEntrySize(data) {
    if (this.tableStructure.filters.length > 0) {
      console.log();
      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    } else {
      if (this.filterDateOn) {
        let payload = {
          page: data.pageIndex,
          size: data.pageSize,
          dateFrom: this.startFormatted,
          dateTo: this.endFormatted,
          userId: '',
          mid: this.mid,
          status: this.transStatus,
        };
        this.filterByDate(payload);
      } else {
        let payload = {
          page: data.pageIndex,
          size: data.pageSize,
          status: this.tableStructure.transaction.selectedTransactionType,
          mid: this.mid,
        };
        this.fetchData(payload);
      }
    }
  }

  filterByDate(data: any) {
    this.primaryTransactionService.getAllPrimaryTransactions(data).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: response.page - 1,
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        };
        let data = response.content.map((item: any) => {
          return {
            'User ID': item?.userId,
            Mobile: item?.mobileNo,
            'Email ID': item?.email,
            Beneficary: item?.beneName,
            B_Country: item?.beneCountry,
            Applicant: item?.applicantName,
            A_Country: item.applicantCountry,
            'Transaction ID': item?.mtransactionId,
            'Date': item?.date,
            'Trans Validity': item?.validity,
            'Issuing Bank': item?.lcissuanceBank,
            Amount: item?.lcvalue.toLocaleString('en')+'.00',
            CCY: item?.lccurrency,
            Requirement: item?.requirementType,
            'Trxn Status': item?.transactionStatus,
            'Min. Commision Amt': item?.minimumCommisionAmount,
            'Min. Commision %': item?.minimumCommisionPercentage,
            'Plan Type': item?.planType,
            Quotes: item?.noOfQuotation,
            Action: {
              from: 'primary_transaction',
              status: item?.transactionStatus,
              id: item?.mtransactionId,
              trxnId: item?.mtransactionId,
              percentValue: item?.minimumCommisionPercentage,
              amtValue: item?.minimumCommisionAmount
            }

          }
        })
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
  getColumnKeys() {
    this.primaryTransactionService.metaFilter().subscribe((res: any) => {
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
        mid: this.mid,
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
    this.primaryTransactionService.getFilterd(e).subscribe({
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
            'User ID': item?.userId,
            Mobile: item?.mobileNo,
            'Email ID': item?.email,
            Beneficary: item?.beneName,
            B_Country: item?.beneCountry,
            Applicant: item?.applicantName,
            A_Country: item.applicantCountry,
            'Transaction ID': item?.mtransactionId,
            'Date': item?.date,
            'Trans Validity': item?.validity,
            'Issuing Bank': item?.lcissuanceBank,
            Amount: item?.lcvalue.toLocaleString('en')+'.00',
            CCY: item?.lccurrency,
            Requirement: item?.requirementType,
            'Trxn Status': item?.transactionStatus,
            'Min. Commision Amt': item?.minimumCommisionAmount,
            'Min. Commision %': item?.minimumCommisionPercentage,
            'Plan Type': item?.planType,
            Quotes: item?.noOfQuotation,
            Action: {
              from: 'primary_transaction',
              status: item?.transactionStatus,
              trxnId: item?.mtransactionId,
              percentValue: item?.minimumCommisionPercentage,
              amtValue: item?.minimumCommisionAmount
            },
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
