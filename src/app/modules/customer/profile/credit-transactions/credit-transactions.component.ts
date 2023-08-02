import { Component, OnInit } from '@angular/core';
import { CustomerServicesService } from '../../services/customer-services.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterTransactionsPopupComponent } from '../../transaction/pages/filter-transactions-popup/filter-transactions-popup.component';
import { CreditsFilterPopupComponent } from '../credits-filter-popup/credits-filter-popup.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export interface PeriodicElement {
  date: string;
  id: string;
  type: string;
  country: string;
  email: string;
  status: string;
  use: string;
  savings: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {id: 'CU231121BGDCONF1893', date: 'DD/MM/YYYY', type: 'Confirmation', country: 'India', email: 'name.surname@email.com', status:'', use: '1', savings: '0'},
//   {id: 'CU231121BGDCONF1893', date: 'DD/MM/YYYY', type: 'Confirmation', country: 'India', email: 'name.surname@email.com', status:'', use: '1', savings: '0'},
//   {id: 'CU231121BGDCONF1893', date: 'DD/MM/YYYY', type: 'Confirmation', country: 'India', email: 'name.surname@email.com', status:'', use: '1', savings: '0'},
// ];

@Component({
  selector: 'app-credit-transactions',
  templateUrl: './credit-transactions.component.html',
  styleUrls: ['./credit-transactions.component.scss'],
})
export class CreditTransactionsComponent implements OnInit {
  newData: any;
  searchInput: any = '';
  displayedColumns: string[] = [
    'date',
    'id',
    'type',
    'country',
    'status',
    'use',
    'savings',
    'ccy',
  ];
  dataSource: any = [];
  totalCredits: any;
  totalTransactions: any;
  userEmailID: any;
  subscriberType: any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  totalItems: any;
  totalPages: any;
  last: any;
  userType: any;
  subscribersId:any='';
  passcodeUserId:any='';

  constructor(
    private cs: CustomerServicesService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(JSON.parse(localStorage.getItem('userDetails')));
    // this.subscriberType = JSON.parse(
    //   localStorage.getItem('userDetails')
    // )?.subscriberType;
    // this.userType = JSON.parse(localStorage.getItem('userType'));
    this.authService.getUserDetails().subscribe((res: any) => {
      this.userType = res.data[0]?.userType;
      this.subscriberType = res.data[0]?.subscriberType;
      if (this.userType) {
        this.displayedColumns = this.updateDisplayColumns();
      }
    });
    this.userEmailID = JSON.parse(localStorage.getItem('userDetails'))?.email;
    let payload = {
      page: 0,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: this.subscribersId,
      passCodeUserId: this.passcodeUserId,
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.fetchApiData(payload);
  }

  fetchApiData(data: any) {
    this.cs.findCreditAndTransactions(data).subscribe((res: any) => {
      console.log(res);
      this.totalTransactions = res?.totaltransactions;
      this.totalCredits = res?.creditUsed;
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = res.data.map((ele: any) => {
        return {
          date: ele?.lCIssuingDate,
          id: ele?.transactionId,
          type: ele?.requirementType,
          country: ele?.lCIssuanceCountry,
          email: this.userEmailID,
          status: ele?.transactionStatus,
          use: ele?.creditUsed ? ele?.creditUsed : 0,
          savings: ele?.savings ? ele?.savings : 0,
          ccy: ele?.lCCurrency,
        };
      });
    });
  }

  search(e: any) {
    this.page.index = 0;
    this.searchInput = e.target.value;
    let payload = {
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: this.subscribersId,
      passCodeUserId: this.passcodeUserId,
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.fetchApiData(payload);
  }

  refresh() {
    this.page.index = 0;
    this.searchInput = '';
      this.subscribersId ='';
      this.passcodeUserId = '';
    let payload = {
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.fetchApiData(payload);
  }

  download() {
    this.page.index = 0;
    let payload = {
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: this.subscribersId,
      passCodeUserId: this.passcodeUserId,
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.cs.downloadCreditTransactions(payload).subscribe({
      next: (res) => {
        this.saveFile(res, 'partnerbanks.csv');
      },
    });
  }

  updateDisplayColumns() {
    console.log(this.userType);
    if (['CUSTOMER', 'BANK'].includes(this.subscriberType)) {
      console.log(this.userType);
      if (this.userType === 'MASTER_USER') {
        return [
          'date',
          'id',
          'type',
          'country',
          'email',
          'status',
          'use',
          'savings',
          'ccy',
        ];
      } else {
        return [
          'date',
          'id',
          'type',
          'country',
          'status',
          'use',
          'savings',
          'ccy',
        ];
      }
    } else {
      return [
        'date',
        'id',
        'type',
        'country',
        'email',
        'status',
        'use',
        'savings',
        'ccy',
      ];
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
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: this.subscribersId,
      passCodeUserId: this.passcodeUserId,
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.fetchApiData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: this.subscribersId,
      passCodeUserId: this.passcodeUserId,
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.fetchApiData(payload);
  }

  onPageChange(event) {
    console.log(event);
    this.page.index = event.pageIndex;
    this.page.size = event.pageSize;
    let payload = {
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.subscriberType,
      subsidaryId: this.subscribersId,
      passCodeUserId: this.passcodeUserId,
      transactionId: this.searchInput,
      calculateSavings: true,
      status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    };
    this.fetchApiData(payload);
  }

  convertToCSV(apiResponse) {
    let lines = apiResponse.split('\n');
    let csv = '';

    lines.forEach(function (line) {
      let values = line.split(',');
      let formattedLine = '';

      values.forEach(function (value, index) {
        if (index === values.length - 1) {
          formattedLine += value.trim();
        } else {
          formattedLine += value.trim() + ',';
        }
      });

      csv += formattedLine + '\n';
    });

    return csv;
  }
  async saveFile(res: any, name: any) {
    let link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
      this.convertToCSV(res)
    )}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // this.notifyService.showSuccess('Success',`${name} download successfully`)
  }

  filter() {
    const filterpopup = this.dialog.open(CreditsFilterPopupComponent, {
      data: {
        from: 'CREDIT_TRANSACTION',
      },
    });
    filterpopup.afterClosed().subscribe((res: any) => {
      console.log(res);
      this.page.index = 0;
      this.subscribersId = res.data.subsidaryId || '';
      this.passcodeUserId = res.data.passcodeUserId || '';
      let payload = {
        page: this.page.index,
        size: this.page.size,
        subscriberType: this.subscriberType,
        subsidaryId: this.subscribersId,
        passCodeUserId: this.passcodeUserId,
        transactionId: this.searchInput,
        calculateSavings: true,
        startDate: Date.parse(res.data?.date?.start),
        endDate: Date.parse(res.data?.date?.end),
        status: ['ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
      };
      this.fetchApiData(payload);
    });
  }
}
