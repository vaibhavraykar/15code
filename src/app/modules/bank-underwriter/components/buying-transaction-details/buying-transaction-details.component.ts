import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { FilterComponent } from '../../popup/esgcomplaint/filter-second/filter/filter.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { MatTableDataSource } from '@angular/material/table';
import { SecondaryCloseTransactionPopupComponent } from '../../popup/secondary-close-transaction-popup/secondary-close-transaction-popup.component';
export interface activeTransactionElemen {
  'Transaction ID': string;
  'Obligor Bank': string;
  'Date (Quote Accepted on)': string;
  Product: string;
  Amount: string;
  Currency: string;
  'Total Quote': string;
  'Transaction Status': string;
}
@Component({
  selector: 'app-buying-transaction-details',
  templateUrl: './buying-transaction-details.component.html',
  styleUrls: ['./buying-transaction-details.component.scss'],
})
export class BuyingTransactionDetailsComponent {
  userInfo: any = {};

  filterBy: any = ['ACCEPTED'];
  displayColumns = [
    'Transaction ID',
    'Obligor Bank',
    'Date (Quote Accepted on)',
    'Product',
    'Amount',
    'Currency',
    'Total Quote',
    'Transaction Status',
    'Action',
  ];

  productsTypes: any[] = [
    { name: 'Confirmation', value: 'CONFIRMATION' },
    { name: 'Discounting', value: 'DISCOUNTING' },
    { name: 'Confirmation & Discounting', value: 'CONFIRMANDDISCOUNT' },
    { name: 'Refinancing', value: 'REFINANCE' },
    { name: 'Bankers Acceptance', value: 'BANKER' },
    { name: 'Bank Guarantee', value: 'BANKGUARANTEE' },
    { name: 'Avalisation', value: 'BILLAVALISATION' },
    { name: 'Trade Loan', value: 'TRADELOAN' },
  ];
  payload: any = {};

  newDataSource: any = [];
  searchInput = new FormControl('');
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  };
  userDetails: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    public bankService: BankUnderwriterService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userInfo = JSON.parse(localStorage.getItem('userDetails') || '{}');

    this.payload = {
      page: 0,
      size: 10,
      status: ['ACCEPTED'],
      subscriberType: this.userDetails?.subscriberType,
      userId: this.userInfo?.username,
      transactionId: '',
    };
  }
  ngOnInit(): void {
    if(sessionStorage.getItem('filter')){
      this.filterBy=JSON.parse(sessionStorage.getItem('filter'))
      this.payload.status=this.filterBy
    }
    this.fetchData(this.payload);
  }
  search(e: any) {
    let payload = {
      status: this.filterBy,
      page: 0,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      transactionId: e.target.value,
    };
    this.fetchData(payload);
  }
  refresh() {
    this.filterBy = ['ACCEPTED']
    sessionStorage.setItem('filter',JSON.stringify(['ACCEPTED']))
    let payload = {
      page: 0,
      size: this.pageSize,
      status: ['ACCEPTED'],
      subscriberType: this.userDetails?.subscriberType,
      userId: this.userInfo?.username,
      transactionId: '',
    };
    this.fetchData(payload);
  }
  downloadAll(){
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: this.filterBy,
      subscriberType: 'BANK_AS_UNDERWRITER',
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.bankService.generateQuotationCSV(payload).subscribe((res: any) => {
      console.log(res);
      window.open(res.data[0].url);
    });
  }
  filterpopup() {
    const filter = this.dialog.open(FilterComponent, {
      data: {
        for: 'secondry_buying',
        filterBy: this.filterBy,
      },
    });
    filter.afterClosed().subscribe((res: any) => {
      if (res.filter) {
        let payload = {
          status: [res.filterBy],
          page: this.page.index,
          size: 10,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: '',
          passCodeUserId: '',
          transactionId: '',
        };

        this.fetchData(payload);
        this.filterBy = [res.filterBy];
        this.displayColumns[2] = `Date (Quote ${this.capitalizeFirstLetter(
          this.filterBy
        )} on)`;
        sessionStorage.setItem('filter',JSON.stringify( [res.filterBy]))
      } else {
        let payload = {
          status: this.filterBy,
          page: this.page.index,
          size: 10,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: '',
          passCodeUserId: '',
          transactionId: '',
        };
        sessionStorage.setItem('filter',JSON.stringify( this.filterBy))
        this.fetchData(payload);
      }
    });
  }
  placeQuote(id: any) {}
  viewDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/buying-transaction-details/${id}`,
      { state: { from: 'viewDetails' } }
    );
  }

  viewQuoteDetails(id: any) {
    this.router.navigateByUrl(`/bank-underwriter/buying-quote/${id}`);
  }
  openQuotes(id: any, quoteCount: any) {
    if (quoteCount > 0) {
      console.log(id);
      // this.router.navigateByUrl(`/customer/transactions/quote?transactionId=${id}`)
    }
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
  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size: this.pageSize,
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
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    console.log(payload);
    this.fetchData(payload);
  }
  fetchData(data: any) {
    this.bankService.getSecondryQuatationList(data).subscribe({
      next: (res: any) => {
        console.log(res);
        const { data, totalElements, totalPages, page, size } = res;
        this.page = {
          ...page,
          size: size,
          totalPages: totalPages,
          totalItems: totalElements,
          totalElements: totalElements,
          index: this.page.index,
        };
        let userDetails = JSON.parse(
          localStorage.getItem('userDetails') || '{}'
        );
        let mappedArray = data.map((item: any) => {
          let quoteDetails: any = item?.quotationList[0];

          console.log(quoteDetails, 'quotes details');
          let Val = {
            'Transaction ID': item.transactionId || '',
            'Obligor Bank': item.obligorBank || '',
            'Date (Quote Accepted on)': item.acceptedOn || '-',
            Product: this.findProductName(item?.requirementType),
            Amount: item?.lCValue?.toFixed(2) || 0,
            Currency: item?.lCCurrency || '',
            'Total Quote': quoteDetails?.totalQuote?.toFixed(2) || 0,
            'Transaction Status': quoteDetails?.quotationStatus,
            quoteId: quoteDetails?.quotationId,

            Action: '',
          };
          if (this.filterBy[0] === 'ACCEPTED') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date (Quote Accepted on)',
              'Product',
              'Amount',
              'Currency',
              'Total Quote',
              'Transaction Status',
              'Action',
            ];
            Val['Date (Quote Accepted on)'] = item?.acceptedOn || '-';
            Val['acceptedDropDownValue'] =
              quoteDetails.quotationStatus === 'CLOSED' ? 'close' : 'open';
          }
          if (this.filterBy[0] === 'REJECTED') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date (Quote Rejected on)',
              'Product',
              'Amount',
              'Currency',
              'Total Quote',
              'Action',
            ];
            Val['Date (Quote Rejected on)'] = quoteDetails?.rejectedOn || '';
          }
          if (this.filterBy[0] === 'WITHDRAWN') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date (Quote Withdrawn on)',
              'Product',
              'Amount',
              'Currency',
              'Total Quote',
              'Action',
            ];
            Val['Date (Quote Withdrawn on)'] = quoteDetails?.modifiedDate || '';
          }
          if (this.filterBy[0] === 'EXPIRED') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date (Quote Expired on)',
              'Product',
              'Amount',
              'Currency',
              'Total Quote',
              'Action',
            ];
            Val['Date (Quote Expired on)'] = item



            ?.validity || '';
          }
          return Val;
        });

        console.log(mappedArray);
        this.newDataSource = new MatTableDataSource(mappedArray);
        this.bankService.getCreditUpdate.next(true);
      },
    });
  }

  capitalizeFirstLetter(str = '') {
    console.log(str[0])
    if(str){
      return `${str[0]?.toLowerCase()?.charAt(0)?.toUpperCase()}${str[0]
        ?.slice(1)
        ?.toLowerCase()}`;
    }else{
      return `${str[0]}`;
    }

  }
  changeAcceptedTrans(e: any, id: any, tID: any) {
    if (e.value === 'close') {
      const dialog = this.dialog.open(SecondaryCloseTransactionPopupComponent, {
        data: {
          transactionId: tID,
          quotationId: id,
        },
      });
      dialog.afterClosed().subscribe({
        next: () => {
          let payload = {
            status: this.filterBy,
            page: this.page.index,
            size: 10,
            subscriberType: this.userDetails?.subscriberType,
            subsidaryId: '',
            passCodeUserId: '',
            transactionId: '',
          };

          this.fetchData(payload);
        },
      });
    }
  }

  findProductName(name: any) {
    console.log(name);
    let product = this.productsTypes.find(
      (item: any) => item.value.toLowerCase() === name.toLowerCase()
    );
    console.log(product);
    return product.name.toUpperCase();
  }

    //
    pageSize: any =10;
    onPageChange(event) {
      this.page.index = event.pageIndex;
      this.pageSize = event.pageSize
      let payload = {
        status: this.filterBy,
        page: this.page.index,
        size: this.pageSize,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload);
    }
}
