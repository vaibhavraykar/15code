import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { MatTableDataSource } from '@angular/material/table';
import { FilterComponent } from '../../popup/esgcomplaint/filter-second/filter/filter.component';

@Component({
  selector: 'app-buying-new-request',
  templateUrl: './buying-new-request.component.html',
  styleUrls: ['./buying-new-request.component.scss'],
})
export class BuyingNewRequestComponent implements OnInit {
  payload: any = {};
  displayColumns = [
    'Transaction ID',
    'Obligor Bank',
    'Date',
    'Product',
    'Amount',
    'Currency',
    'Valid Till',
    'Tenor',
    'Offered Price',
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
      page: this.page.index,
      size: 10,
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
  }
  ngOnInit(): void {
    this.fetchData(this.payload);
  }
  fetchData(data: any) {
    this.bankService.getSecondryQuatationList(data).subscribe({
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
            'Transaction ID': item?.transactionId,
            'Obligor Bank': item?.obligorBank,
            Date: item?.insertedDate,
            Product: this.findProductName(item?.requirementType),
            Amount: Number(item?.lCValue)?.toFixed(2),
            Currency: item?.lCCurrency,
            'Valid Till': item?.validity,
            Tenor: Number(item?.usanceDays)?.toFixed(),
            'Offered Price':this.convertString (item?.offeredPrice),
            Action: '',
          };
        });
        this.newDataSource = new MatTableDataSource(mappedArray);
        this.bankService.getCreditUpdate.next(true);
      },
    });
  }
convertString(text){
let converted_string = ''
let convert_to_number = Number(text);
if(isNaN(convert_to_number)){
  converted_string=text
}else{
  converted_string= convert_to_number?.toLocaleString("en-US",{minimumFractionDigits: 2})
}
return converted_string
}
  downloadAll() {
    let payload = {
      page: this.page.index,
      size:this.pageSize,
      status: ['ACTIVE'],
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
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: e.target.value,
    };
    this.fetchData(payload);
  }
  refresh() {
    this.page.index = 0;
    let payload = {
      page: this.page.index,
      size: this.pageSize,
      status: ['ACTIVE'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
  filterpopup() {
    this.dialog.open(FilterComponent);
  }
  placeQuote(id: any) {
    console.log(id)
    this.router.navigateByUrl(
      `/bank-underwriter/secondry/buying-quote-details/${id}`,
      {
        state: { from: 'newRequest' },
      }
    );
  }
  viewDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/buying-transaction-details/${id}`,
      { state: { from: 'active' } }
    );
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
      status: ['ACTIVE'],
      page: this.page.index,
      size: this.pageSize,
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
      status: ['ACTIVE'],
      page: this.page.index,
      size: this.pageSize,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
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
    onPageChange(event: any) {
      this.page.index = event.pageIndex;
      this.pageSize = event.pageSize
      const payload = {
        status: ['ACTIVE'],
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
