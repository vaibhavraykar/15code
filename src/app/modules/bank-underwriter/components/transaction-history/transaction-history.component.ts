import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import * as _moment from 'moment';
import { FilterComponent } from '../../popup/esgcomplaint/filter-second/filter/filter.component';
import { MatDialog } from '@angular/material/dialog';
import { CloseTransactionPopupComponent } from '../../popup/close-transaction/close-transaction-popup/close-transaction-popup.component';

export interface PeriodicElement {
  'Transaction ID':string;
  'Issuing Country': string;
  // 'Transaction Validity':string;
  'Amount':string;
  'Quote Expiry Date':string;
  'Issuance Bank':string;
  'Product':string;
  'Product Value':string;
  'Total Quotes':string;
  'Applicant Name':string;
  'Beneficiary Name':string;
  'Transaction Status':string;
}

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
  displayedColumns = [
    'Transaction ID',
    'Issuing Country',
    // 'Transaction Validity',
    'Currency',
    'Amount',
    'Quote Expiry Date',
    'Issuance Bank',
    'Product',
    'Total Quotes',
    'Applicant Name',
    'Beneficiary Name',
    'Transaction Status',
    'Action',
  ];

  dataSource: PeriodicElement[] = [];
  userDetails: any;
  totalItems: number;
  totalPages: number;
  dataLength: any = 0;
  pageIndex: any = 0;
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  transactionDetails: any;
  searchForm: FormGroup;
  selected: any;

  productsTypes: any[] = [
    { name: 'Confirmation', value: 'CONFIRMATION' },
    { name: 'Discounting', value: 'DISCOUNTING' },
    { name: 'Confirmation & Discounting', value: 'CONFIRMANDDISCOUNT' },
    { name: 'Refinancing', value: 'REFINANCE' },
    { name: 'Bankers Acceptance', value: 'BANKER' },
    { name: 'Bank Guarantee', value: 'BANKGUARANTEE' },
    { name: 'Avalisation', value: 'BILLAVALISATION' },
  ];

  filterBy: any[] = [
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED',
    'CLOSED',
    'WITHDRAWN',
  ];
  constructor(
    private router: Router,
    private bankService: BankUnderwriterService,
    private transactionService: TransactionService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('filter')) {
      this.filterBy = JSON.parse(sessionStorage.getItem('filter'));
      // this.payload.status = this.filterBy;
    }
    this.searchForm = new FormGroup({
      searchInput: new FormControl(''),
    });
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: this.filterBy,
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(data);
    this.selected = 'Open';
  }

  findProductName(name: any) {
    console.log(name);
    let product = this.productsTypes.find(
      (item: any) => item.value.toLowerCase() === name.toLowerCase()
    );
    console.log(product);
    return product.name.toUpperCase();
  }

  fetchData(data: any) {
    this.bankService.getQuotation(data).subscribe((res: any) => {
      this.page.page = res.page;
      this.transactionDetails = res.data;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = res.data.map((item: any) => {
        return {
          'Transaction ID': item?.transactionId,
          'Issuing Country': item?.lCIssuanceCountry,
          'Transaction Validity': item?.validity,
          'Currency':item?.lCCurrency,
          Amount: item?.lCValue,
          'Quote Expiry Date':
            item?.quotationsList.length != 0
              ? _moment(item?.quotationsList[0].validity).format(
                  'DD-MM-YYYY'
                )
              : '-',
          'Issuance Bank': item?.lCIssuanceBank,
          Product: this.findProductName(item?.requirementType),
          'Product Value': '-',
          'Total Quotes': item?.quotationsList
            ? item?.quotationsList.length
            : 0,
          'Applicant Name': item?.applicantName,
          'Beneficiary Name': item?.beneName,
          'Transaction Status': item?.transactionStatus,
          Action: '',
        };
      });
      console.log(this.dataSource);
      this.bankService.getCreditUpdate.next(true);
    });
  }

  viewTransaction(id: any) {
    console.log(id);
    this.router.navigateByUrl(
      `/bank-underwriter/transaction-details?transactionId=${id}`
    );
  }

  search(e: any) {
    this.page.index = 0;
    console.log(e.target.value);
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: [
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CLOSED',
        'WITHDRAWN',
      ],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: e.target.value,
    };

    this.fetchData(data);
    this.filterBy = [
      'ACCEPTED',
      'REJECTED',
      'EXPIRED',
      'CANCELLED',
      'CLOSED',
      'WITHDRAWN',
    ];
  }

  viewQuote(e: any) {
    console.log(e);
    let data = this.transactionDetails.filter(
      (item: any) => item.transactionId === e
    );
    console.log(data[0].quotationsList[0].quotationId);
    this.router.navigateByUrl(
      `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`
    );
  }

  downloadCSV() {
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: this.filterBy,
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.bankService.generateCSV(data).subscribe((res: any) => {
      console.log(res.data);
      window.open(res.data[0].url);
    });
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    console.log(payload);
    this.fetchData(payload);
  }

  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) < this.page?.totalElements
        ? this.page.size * (this.page.index + 1)
        : this.page?.totalElements;
    if (this.page.index == 0) {
      if (this.page.size >= this.page.totalElements) {
        return `1 - ${this.page.totalElements}`;
      } else {
        return `1 - ${this.page.size}`;
      }
    } else {
      return `${this.page.index * this.page.size + 1} - ${this.last} `;
    }
  }
  filter() {
    const dialog = this.dialog.open(FilterComponent, {
      data: {
        filterBy: this.filterBy,
        from: 'TRANSACTION_HISTORY',
      },
    });
    dialog.afterClosed().subscribe((res: any) => {
      if (res?.filter) {
        this.filterBy =
          res.filterBy !== 'ALL'
            ? [res.filterBy]
            : [
                'ACCEPTED',
                'REJECTED',
                'EXPIRED',
                'CANCELLED',
                'CLOSED',
                'WITHDRAWN',
              ];
        this.page.index = 0;
        sessionStorage.setItem('filter', JSON.stringify([res.filterBy]));
        let payload = {
          status: this.filterBy,
          page: this.page.index,
          size: this.page.size,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: '',
          passCodeUserId: '',
          transactionId: '',
        };
        this.fetchData(payload);
        // this.fetchDataAll(payload);
        this.filterBy = [res.filterBy];
      } else {
        let payload = {
          status: this.filterBy,
          page: this.page.index,
          size: this.page.size,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: '',
          passCodeUserId: '',
          transactionId: '',
        };
        sessionStorage.setItem('filter', JSON.stringify([
                'ACCEPTED',
                'REJECTED',
                'EXPIRED',
                'CANCELLED',
                'CLOSED',
                'WITHDRAWN',
              ]));
        this.fetchData(payload);
        // this.fetchDataAll(payload);
      }
    });
  }

  closeQuotation(e: any, transactionId: any) {
    console.log(e.value);
    if (e.value == 'Close') {
      console.log('hi', transactionId);
      const popup = this.dialog.open(CloseTransactionPopupComponent, {
        data: {
          transactionId: transactionId,
        },
      });

      popup.afterClosed().subscribe((res: any) => {
        this.selected = 'Open';
        let data = {
          status: ['ACCEPTED'],
          page: this.page.index,
          size: this.page.size,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: '',
          passCodeUserId: '',
          transactionId: '',
        };
        this.fetchData(data);
      });
    }
  }

  refresh() {
    this.page.index = 0;
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: [
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CLOSED',
        'WITHDRAWN',
      ],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(data);
    this.filterBy = [
      'ACCEPTED',
      'REJECTED',
      'EXPIRED',
      'CANCELLED',
      'CLOSED',
      'WITHDRAWN',
    ];
    sessionStorage.setItem('filter', JSON.stringify(this.filterBy));
  }

  onPageChange(event: any) {
    console.log(event);
    this.page.index = event.pageIndex;
    let payload = {
      page: this.page.index,
      size: event.pageSize,
      status: this.filterBy,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
}
