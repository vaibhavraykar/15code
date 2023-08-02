import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { MatTableDataSource } from '@angular/material/table';
export interface savedTransactionElement {
  Draft: string;
  Product: string;
  Date: string;
}
@Component({
  selector: 'app-buying-saved-transaction',
  templateUrl: './buying-saved-transaction.component.html',
  styleUrls: ['./buying-saved-transaction.component.scss'],
})
export class BuyingSavedTransactionComponent {
  payload: any = {};
  displayColumns = ['Draft', 'Product', 'Date', 'Action'];
  newDataSource: any;
  last: any;
  searchInput = new FormControl('');
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
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private bankService: BankUnderwriterService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.payload = {
      page: 0,
      size: 10,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
  }
  downloadAll() {
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['DRAFT'],
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
  search(e: any) {
    console.log(e.target.value);
    this.page.index = 0;
    this.payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: e.target.value,
    };
    this.fetchData(this.payload);
  }
  ngOnInit(): void {
    this.fetchData(this.payload);
  }
  refresh() {
    this.page.index = 0;
    this.payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(this.payload);
  }
  // filterpopup(){
  // }
  edit(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/secondry/buying-quote-details/${id.quatationId}`,
      {
        state: { from: 'save' },
      }
    );
  }
  deleteSaved(id: any, qId: any) {
    this.bankService
      .deleteSecondryQuotation({
        transactionId: id,
        quotationId: qId,
      })
      .subscribe({
        next: (res) => {
          this.page.index = 0;
          this.fetchData({
            page: this.page.index,
            size: 10,
            status: ['DRAFT'],
            subscriberType: this.userDetails?.subscriberType,
            userId: '',
            transactionId: '',
          });
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
    console.log(payload);
    this.fetchData(payload);
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
    console.log(payload);
    this.fetchData(payload);
  }
  fetchData(data: any) {
    this.bankService.getSecondryQuatationList(data).subscribe((res: any) => {
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
        console.log(item);
        return {
          Draft: item?.transactionId,
          Product: this.findProductName(item?.requirementType),
          Date: item?.lCBookingDate,
          quatationId: item.quotationList[0]?.quotationId,
          Action: '',
        };
      });
      this.newDataSource = new MatTableDataSource(mappedArray);
      this.bankService.getCreditUpdate.next(true);
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
      this.pageSize = event.pageSize
      let payload = {
        status: ['DRAFT'],
        page: this.page.index,
        size:this.pageSize,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload);
    }
}
