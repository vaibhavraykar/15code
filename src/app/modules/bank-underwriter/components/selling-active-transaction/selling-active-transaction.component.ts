import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { FilterTransactionsPopupComponent } from 'src/app/modules/customer/transaction/pages/filter-transactions-popup/filter-transactions-popup.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';

@Component({
  selector: 'app-selling-active-transaction',
  templateUrl: './selling-active-transaction.component.html',
  styleUrls: ['./selling-active-transaction.component.scss'],
})
export class SellingActiveTransactionComponent implements OnInit {
  displayColumns = [
    'Transaction ID',
    'Obligor Bank',
    'Date',
    'Amount',
    'Currency',
    'Validity',
    'Product',
    'Quotes Received',
    'Action',
  ];
  selectedUser='';
  newDataSource: any;
  searchInput = new FormControl('');
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  };
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
  userDetails: any;
  payload: any = {};
  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService,
    private router: Router,
    public bankService: BankUnderwriterService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.payload = {
      page: 0,
      size: 10,
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };
  }
  ngOnInit(): void {
    this.fetchData(this.payload);
  }
  search(e: any) {
    this.page.index = 0;
    let payload = {
      page:this.page.index,
      size: this.pageSize,
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: e.target.value,
    };
    // console.log(e.target.value);
    this.fetchData(payload);
  }
  moreoptions() {
    // this.dialog.open(MoreOptionsPopupComponent);
  }
  filterpopup() {
    // this.dialog.open(FilterTransactionsPopupComponent);
  }

  refresh() {
    this.page.index = 0;
    this.searchInput.setValue('');
    let payload = {
      page: 0,
      size: this.pageSize,
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
  edit(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/new-secondary-transaction/edit?id=${id}`
    );
  }
  viewDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/secondry-transaction-details/${id}`,
      {
        state: {
          from: 'activetransaction',
        },
      }
    );
  }
  openQuotes(id: any, quoteCount: any) {
    if (quoteCount > 0) {
      this.router.navigateByUrl(
        `/bank-underwriter/secondary-transaction-qoute/?id=${id}`
      );
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
      status: ['ACTIVE'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };

    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: ['ACTIVE'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };

    this.fetchData(payload);
  }
  fetchData(data: any) {
    this.transactionService.getSecondryTransactionList(data).subscribe({
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

        let mappedArray = data.map((item: any) => {
          return {
            'Transaction ID': item.transactionId,
            'Obligor Bank': item.obligorBank,
            Date: item.lCBookingDate,
            Amount: item.lCValue.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            Currency: item.lCCurrency,
            Validity: item.validity,
            Product: this.findProductName(item?.requirementType),
            'Quotes Received': item.quotationList.filter(e=>e.quotationStatus!=='REJECTED')?.length || 0,
            Action: '',
          };
        });

        this.newDataSource = new MatTableDataSource(mappedArray);
        this.bankService.getCreditUpdate.next(true);
      },
    });
  }

  downloadCSV() {
    let payload = {
      page: this.page.index,
      size:  this.pageSize,
      status: ['ACTIVE'],
      subscriberType: 'BANK_AS_UNDERWRITER',
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };
    this.bankService.generateTransactionCSV(payload).subscribe((res: any) => {
      console.log(res);
      window.open(res.data[0].url);
    });
  }

  generateCSV(id: any) {
    console.log(id);
    let payload = {
      page: 0,
      size: 10,
      status: ['ACTIVE'],
      subscriberType: 'BANK_AS_UNDERWRITER',
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: id,
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

  filter() {
    const dialog = this.dialog.open(FilterPopupComponent, {
      data: {
        filterType: 'additional_user',
        user: this.selectedUser,
        from:'secondary_transaction'
      },
    });
    dialog.afterClosed().subscribe({
      next: (res) => {
        if (res?.user) {
          this.page.index = 0;
          let data = {
            page: this.page.index,
            size: this.page.size,
            status: ['ACTIVE'],
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
            status: ['ACTIVE'],
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

  //
  pageSize: any =10;
  onPageChange(event) {
    this.page.index = event.pageIndex;
    this.pageSize = event.pageSize;
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: this.selectedUser,
      transactionId: '',
    };
    // console.log(e.target.value);
    this.fetchData(payload);
  }
}
