import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FilterTransactionsPopupComponent } from 'src/app/modules/customer/transaction/pages/filter-transactions-popup/filter-transactions-popup.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
export interface savedTransactionElement {
  Draft: string;
  Product: string;
  Date: string;
}
@Component({
  selector: 'app-selling-saved-transaction',
  templateUrl: './selling-saved-transaction.component.html',
  styleUrls: ['./selling-saved-transaction.component.scss'],
})
export class SellingSavedTransactionComponent implements OnInit {
  searchInput = new FormControl('');
  userDetails: any;
  payload: any;
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
  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService,
    private router: Router,
    private bankService: BankUnderwriterService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.payload = {
      page: 0,
      size: 10,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
  }

  downloadAllCSV() {
    let payload = {
      page: 0,
      size: this.pageSize,
      status: ['DRAFT'],
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

  search(e: any) {
    this.page.index = 0;
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: e.target.value,
    };
    this.fetchTableList(payload);
  }
  refresh() {
    this.page.index = 0;
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId:'',
    };
    this.fetchTableList(payload);
  }
  filterpopup() {
    this.dialog.open(FilterTransactionsPopupComponent);
  }
  edit(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/new-secondary-transaction/edit?id=${id}`,
      { state: { from: 'draft' } }
    );
  }
  deleteID(id: any) {
    console.log(id);
    let payload = {
      transactionId: id,
      quotationId: '',
    };
    this.transactionService.deleteSecondryTransaction(payload).subscribe({
      next: (res) => {
        this.page.index = 0;
        this.fetchTableList(this.payload);
      },
    });
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
      status: ['DRAFT'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchTableList(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: ['DRAFT'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchTableList(payload);
  }

  displayColumns = ['Draft', 'Product', 'Date', 'Action'];
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  };

  dataSource: MatTableDataSource<any>;
  ngOnInit(): void {
    this.fetchTableList(this.payload);
  }

  fetchTableList(body: any) {
    this.transactionService.getSecondryTransactionList(body).subscribe({
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

        let mappedArray = data.map((item: any) => {
          return {
            Draft: item.transactionId,
            Product: this.findProductName(item?.requirementType),
            Date: item.lCBookingDate,
            Action: '',
          };
        });

        this.dataSource = new MatTableDataSource(mappedArray);
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
    pageSize: any =10;
    onPageChange(event) {
      this.page.index = event.pageIndex;
      this.pageSize = event.pageSize;
      let payload = {
        status: ['DRAFT'],
        page: this.page.index,
        size: this.pageSize,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchTableList(payload);
    }
}
