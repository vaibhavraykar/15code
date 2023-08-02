import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { FilterComponent } from '../../popup/esgcomplaint/filter-second/filter/filter.component';
import { SecondaryCloseTransactionPopupComponent } from '../../popup/secondary-close-transaction-popup/secondary-close-transaction-popup.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
export interface transactionDetailsElemen {
  'Transaction ID': string;
  'Obligor Bank': string;
  'Date': string;
  Product: string;
  Amount: string;
  currency: string;
  'Transaction Status': string;
}
@Component({
  selector: 'app-selling-transaction-details',
  templateUrl: './selling-transaction-details.component.html',
  styleUrls: ['./selling-transaction-details.component.scss'],
})
export class SellingTransactionDetailsComponent implements OnInit {
  @ViewChild('active') ActiveTransactionComponent: any;
  filterBy: any = ['ACCEPTED'];
  page = {
    index: 0,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  };
  payload: any;
  displayColumns = [
    'Transaction ID',
    'Obligor Bank',
    'Date',
    'Product',
    'Amount',
    'Currency',
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
  newDataSource: any;
  last: any;
  searchInput = new FormControl('');
  userDetails: any;
  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService,
    private bankService: BankUnderwriterService,
    private router: Router
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.payload = {
      page: 0,
      size: 10,
      status: this.filterBy,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
  }

  search(e: any) {
    this.page.index = 0;
    let payload = {
      status: this.filterBy,
      page:this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: e.target.value,
    };
    this.fetchData(payload);
  }
  refresh() {
    this.filterBy = ['ACCEPTED'];
     sessionStorage.setItem('filter',JSON.stringify(['ACCEPTED']))
    this.page.index = 0;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size:  this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchData(payload);
    this.ActiveTransactionComponent?.refresh();
  }
  filterpopup() {
    const filter = this.dialog.open(FilterComponent, {
      data: {
        for: 'secondry',
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
        sessionStorage.setItem('filter',JSON.stringify([res.filterBy]))
        this.fetchData(payload);
        this.filterBy = [res.filterBy];
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
        this.bankService.getCreditUpdate.next(true)
      }
    });
  }
  placeQuote(id: any) {}
  viewDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/secondry-transaction-details/${id}`,
      {
        state: {
          from: 'sellingTransactionDetails',
        },
      }
    );
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
      size:  this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size:  this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
  fetchData(data: any) {
    this.transactionService.getSecondryTransactionList(data).subscribe({
      next: (response: any) => {
        const { data, totalElements, totalPages, page, size } = response;
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

          let Val = {
            'Transaction ID': item.transactionId || '',
            'Obligor Bank': item.obligorBank || '',
            Date: item?.validity || '-',
            Product: this.findProductName(item?.requirementType),
            Amount: item?.lCValue?.toFixed(2) || 0,
            Currency: item?.lCCurrency || '',
            'Total Quote': quoteDetails?.totalQuote?.toFixed(2) || 0,
            'Transaction Status': item?.transactionStatus,
            quoteId: quoteDetails?.quotationId,

            Action: '',
          };
          if (this.filterBy[0] === 'ACCEPTED') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date',
              'Product',
              'Amount',
              'Currency',
              'Transaction Status',
              'Action',
            ];
            // Val['Date (Quote Accepted on)'] = quoteDetails?.acceptedOn || '';
            Val['acceptedDropDownValue'] =
              quoteDetails.quotationStatus === 'CLOSED' ? 'close' : 'open';
          }
          if (this.filterBy[0] === 'REJECTED') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date',
              'Product',
              'Amount',
              'Currency',
              'Action',
            ];
            // Val['Date'] = quoteDetails?.rejectedOn || '';
          }
          if (this.filterBy[0] === 'WITHDRAWN') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date',
              'Product',
              'Amount',
              'Currency',
              'Action',
            ];
            // Val['Date'] = quoteDetails?.modifiedDate || '';
          }
          if (this.filterBy[0] === 'EXPIRED') {
            this.displayColumns = [
              'Transaction ID',
              'Obligor Bank',
              'Date',
              'Product',
              'Amount',
              'Currency',

              'Action',
            ];
            // Val['Date (Quote Expired on)'] = quoteDetails?.validity || '';
          }
          return Val;
        });

        console.log(mappedArray);
        this.newDataSource = new MatTableDataSource(mappedArray);
        this.bankService.getCreditUpdate.next(true);
      },
    });
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('filter')){
      this.filterBy=JSON.parse(sessionStorage.getItem('filter'))
      this.payload.status=this.filterBy
    }
    console.log(this.payload)
    this.fetchData(this.payload);
  }
  changeAcceptedTrans(e: any, id: any, tID: any) {
    console.log({ transactionId: tID, quotationId: id, viewType: 'selling' });
    if (e.value === 'close') {
      const dialog = this.dialog.open(SecondaryCloseTransactionPopupComponent, {
        data: {
          transactionId: tID,
          quotationId: id,
          viewType: 'selling',
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

  viewQuoteDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/selling-quote-details?transactionId=${id}`
    );
  }

  downloadTransactionCSV(id: any) {
    let payload = {
      page: 0,
      size: 10,
      status: this.filterBy,
      subscriberType: 'BANK_AS_UNDERWRITER',
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: id,
    };
    this.bankService.generateTransactionCSV(payload).subscribe((res: any) => {
      console.log(res);
      window.open(res.data[0].url);
    });
  }

  downloadAllCSV(){
    let payload = {
      page: 0,
      size: this.pageSize,
      status: this.filterBy,
      subscriberType: 'BANK_AS_UNDERWRITER',
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.bankService.generateTransactionCSV(payload).subscribe((res: any) => {
      console.log(res);
      window.open(res.data[0].url);
    });
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
    //
    pageSize: any =10;
    onPageChange(event) {
      this.page.index = event.pageIndex;
      this.pageSize = event.pageSize
      let payload = {
        status: this.filterBy,
        page: this.page.index,
        size:  this.pageSize,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload);
    }
}
