import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { FilterComponent } from '../../popup/esgcomplaint/filter-second/filter/filter.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
export interface activeTransactionElemen {
  'Transaction ID': string;
  'Obligor Bank': string;
  Amount: string;
  currency: string;
  'Potential Income': string;
  'Transaction Valid Till': string;
  'Quote Valid Till': string;
  Product: string;
  'Quotes Rank': string;
}
@Component({
  selector: 'app-buying-active-transaction',
  templateUrl: './buying-active-transaction.component.html',
  styleUrls: ['./buying-active-transaction.component.scss'],
})
export class BuyingActiveTransactionComponent implements OnInit {
  payload: any = {};
  selectedUser = '';
  displayColumns = [
    'Transaction ID',
    'Obligor Bank',
    'Amount',
    'Currency',
    'Potential Income',
    'Transaction Valid Till',
    'Quote Valid Till',
    'Product',
    'Quotes Rank',
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
    public bankService: BankUnderwriterService,
    private router: Router
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.payload = {
      page: 0,
      size: 10,
      status: ['PLACED'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
  }
  ngOnInit(): void {
    this.fetchData(this.payload);
  }

  downloadAll() {
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['PLACED'],
      subscriberType: 'BANK_AS_UNDERWRITER',
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };
    this.bankService.generateQuotationCSV(payload).subscribe((res: any) => {
      console.log(res);
      window.open(res.data[0].url);
    });
  }
  search(e: any) {
    this.page.index = 0;
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['PLACED'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: e.target.value,
    };
    this.fetchData(payload);
  }
  refresh() {
    this.page.index;
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['PLACED'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
  // filterpopup() {
  //   this.dialog.open(FilterComponent);
  // }
  placeQuote(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/secondry/buying-quote-details/${id.quoteDetails.quotationId}`,
      {
        state: { from: 'active' },
      }
    );

  }
  viewDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/buying-transaction-details/${id}`,
      { state: { from: 'viewDetails' } }
    );
  }
  openQuotes(id: any, quoteCount: any) {
    if (quoteCount > 0) {
      console.log(id);
      // this.router.navigateByUrl(`/bank-underwriter/secondry/buying-quote-details/${id}`,{state:{from:'active'}});
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
      status: ['PLACED'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: ['PLACED'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
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
          // if (item?.quotationList?.length > 0) {
          //   for (let i of item?.quotationList) {
          //     if (i.bankId === userDetails?.username) {
          //       quoteDetails = i;
          //     }
          //   }
          // }
          return {
            'Transaction ID': item.transactionId,
            'Obligor Bank': item.obligorBank,
            Amount: item.lCValue.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            Currency: item.lCCurrency,
            'Potential Income': item.offeredPrice,
            'Transaction Valid Till': item.validity,
            'transaction Valid No Of Days': item.transactionValidTill,
            'Quote Valid Till': quoteDetails?.validity,
            'Quote Valid No Of Days': quoteDetails?.quotationValidTill,
            Product: this.findProductName(item?.requirementType),
            'Quotes Rank': quoteDetails?.quotationRank,
            quoteDetails:quoteDetails,
            Action: '',
          };
        });

        this.newDataSource = new MatTableDataSource(mappedArray);
        this.bankService.getCreditUpdate.next(true);
      },
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
  pageSize: any = 10;
  onPageChange(event) {
    this.page.index = event.pageIndex;
    this.pageSize = event.pageSize;
    let payload = {
      status: ['PLACED'],
      page: this.page.index,

      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };
    this.fetchData(payload);
  }

  filterpopup() {
    const dialog = this.dialog.open(FilterPopupComponent, {
      data: {
        filterType: 'additional_user',
        user: this.selectedUser,
        from: 'secondary_transaction',
      },
    });
    dialog.afterClosed().subscribe({
      next: (res) => {
        if (res?.user) {
          this.page.index = 0;
          let data = {
            page: this.page.index,
            size: this.page.size,
            status: ['PLACED'],
            subscriberType: this.userDetails?.subscriberType,
            passCodeUserId: res.user,
            transactionId: '',
          };

          this.fetchData(data);
          this.selectedUser = res.user;
        } else {
          let data = {
            page: this.page.index,
            size: this.page.size,
            status: ['PLACED'],
            subscriberType: this.userDetails?.subscriberType,
            passCodeUserId: '',
            transactionId: '',
          };
          this.fetchData(data);
          this.selectedUser = '';
        }
      },
    });
  }
}
