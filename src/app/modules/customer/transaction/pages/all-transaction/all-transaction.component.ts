import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { TransactionService } from '../../services/transaction.service';
import { FilterTransactionsPopupComponent } from '../filter-transactions-popup/filter-transactions-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { CloseTransactionComponent } from '../close-transaction/close-transaction.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export interface PeriodicElement {
  'Quotes': string;
  'Transaction ID': string;
  'Amount': string;
  'Applicant': string;
  'Beneficiary': string;
}



// export interface PeriodicElementPreviousTransaction {
//   'Transaction ID':string;
//   'Amount':string;
//   'Applicant':string;
//   'Beneficiary':string;
//   'Quotes': string;
//   'Status':string;
// }

export interface PeriodicElementPreviousTransaction {
  transactionID: string;
  amount: string;
  applicant: string;
  beneficiary: string;
  quotes: string;
  status: string;
}



@Component({
  selector: 'app-all-transaction',
  templateUrl: './all-transaction.component.html',
  styleUrls: ['./all-transaction.component.scss'],
})
export class AllTransactionComponent implements OnInit {
  customPayload = {}
  displayColumnsActiveTransaction: string[] = [
    'Transaction ID',
    'Amount',
    'Applicant',
    'Beneficiary',
    'Quotes',
    'Actions',
  ];
  viewType = 'default'
  dataSource: any;
  pageActiveTransaction = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  pagePreviousTransaction = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  subscriberType: any;
  selected: any;
  // displayColumnsPreviousTransaction: string[] = ['Transaction ID', 'Amount', 'Applicant', 'Beneficiary', 'Quotes', 'Status'];
  displayColumnsPreviousTransaction: string[] = [
    'transactionID',
    'currency',
    'amount',
    'applicant',
    'beneficiary',
    'quotes',
    'status',
    'actions',
  ];
  dataSource1: any;
  newActiveDataSource: PeriodicElement[];
  newPreviousDataSource: PeriodicElementPreviousTransaction[];
  totalItems: number;
  totalPages: number;
  dataLengthActiveTransaction: any = 0;
  pageIndex: any = 0;
  dataLength: any = 0;
  groupCompanies: any;
  last: any;
  lastActive: any;
  userDetails: any;
  // searchInput:any;
  subsidiaryID: any;
  passcodeUserId: any;
  searchForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private customerService: CustomerServicesService,
    private authService:AuthService
  ) {
    this.route.queryParams
      .subscribe((params: any) => {
        // this.viewType=
        if (params.from === 'dashboard') {
          this.viewType = 'dashboard'
          let navigation = this.router.getCurrentNavigation();
          const routerState: any = navigation?.extras?.state || {};
          if (routerState.from == 'tile') {
            this.customPayload = routerState
          } else if (routerState.from == 'countryPie') {
            this.customPayload = routerState
          } else if(routerState.from=='productPie'){
            this.customPayload = routerState
          }else {
            this.router.navigateByUrl('/customer/transactions/dashboard')
            return
          }


        } else {
          this.viewType = 'default'
        }
      }
      );
  }
  transStatus: any[] = [
    'ACTIVE',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED',
    'CLOSED',
    'PENDING',
    'MAKER_APPROVED'
  ];
  ngOnInit() {

    this.searchForm = new FormGroup({
      searchInput: new FormControl(''),
    });
    this.groupCompanies = JSON.parse(localStorage.getItem('groupCompany'));
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userDetails);
    this.subscriberType = this.userDetails?.subscriberType;
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    // })





    this.selected = 'Open';

    if (this.viewType == 'dashboard') {
      let payload = {
        ...this.customPayload,
        "page": 0,
        "size": 5,
        "subscriberType": this.userDetails.subscriberType,
        "subsidaryId": "",
        "passCodeUserId": "",
        "transactionId": "",
      }
      delete payload['from']
      // "isFindQuoteReceivedTransactions": true
      this.fetchDatafromDashboard(payload)
    } else {
      let dataPrevious = {
        page: this.pagePreviousTransaction.index,
        size: this.pagePreviousTransaction.size,
        status: [
          'ACTIVE',
          'ACCEPTED',
          'REJECTED',
          'EXPIRED',
          'CANCELLED',
          'CLOSED',
          'PENDING',
          'MAKER_APPROVED'
        ],
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchDataPrevious(dataPrevious);
    }
  }

  fetchDataActive(payload: any) {
    this.transactionService.findTransactions(payload).subscribe((res: any) => {
      let response = res.data;
      this.pageActiveTransaction.page = res.page;
      this.pageActiveTransaction.size = res.size;
      this.pageActiveTransaction.totalElements = res.totalElements;
      this.pageActiveTransaction.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      console.log(response);
      this.newActiveDataSource = response.map((item: any) => {
        if (this.userDetails?.subscriberType != 'BANK') {
          return {
            'Transaction ID': item?.transactionId,
            Amount: item?.lCValue,
            Applicant:
              item?.userType != 'Applicant'
                ? item?.applicantName
                : this.getGroupCompanyName(item?.subsidaryId),
            Beneficiary:
              item?.userType == 'Applicant'
                ? item?.beneName
                : this.getGroupCompanyName(item?.subsidaryId),
            Quotes: item?.quotationCount,
          };
        } else {
          return {
            'Transaction ID': item?.transactionId,
            Amount: item?.lCValue,
            Applicant: item?.applicantName,
            Beneficiary: item?.beneName,
            Quotes: item?.quotationCount,
          };
        }
      });

      this.dataLengthActiveTransaction = res.totalElements;
      this.pageIndex = res.pageIndex;
    });
  }

  fetchDataPrevious(data: any) {
    console.log('---------------------------------------');
    this.transactionService.findTransactions(data).subscribe((res: any) => {
      let response = res.data;
      this.pagePreviousTransaction.page = res.page;
      this.pagePreviousTransaction.size = res.size;
      this.pagePreviousTransaction.totalElements = res.totalElements;
      this.pagePreviousTransaction.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      console.log(response);
      this.newPreviousDataSource = response.map((item: any) => {
        console.log(item);
        return {
          transactionID: item?.transactionId,
          currency:item?.lCCurrency,
          amount: item?.lCValue,
          applicant: item?.applicantName
            ? item?.applicantName
            : this.getGroupCompanyName(item?.subsidaryId),
          beneficiary: item?.beneName
            ? item?.beneName
            : this.getGroupCompanyName(item?.subsidaryId),
          quotes: item?.quotationCount,
          status: item?.transactionStatus,
          count: item?.quotationCount,
          quotationList: item?.quotationsList,
          transDetail: item,
        };
      });
      console.log(this.newPreviousDataSource);
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
      this.customerService.getCreditUpdate.next(true);

        this.authService.getUserDetails().subscribe();
    });
  }

  getGroupCompanyName(id: any) {
    let companyName = this.groupCompanies?.businessDetails.find(
      (item: any) => item.id == id
    );
    return companyName?.companyName;
  }

  // editActiveSelectedTransaction(e:any){
  //   console.log(e,`/customer/transactions/view?transactionId=${e}`);
  //   this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`);
  // }

  // downloadSelected(e: any) {
  //   console.log(e);
  //   let payload = {
  //     page: 0,
  //     size: 5,
  //     status: 'ACTIVE',
  //     subscriberType: this.userDetails?.subscriberType,
  //     subsidaryId: '',
  //     passCodeUserId: '',
  //     transactionId: e,
  //   };
  //   this.transactionService.generateCSV(payload).subscribe((res: any) => {
  //     console.log(res.data);
  //     window.open(res.data[0].url);
  //   });
  // }

  getActivePage() {
    this.lastActive =
      this.pageActiveTransaction.size * (this.pageActiveTransaction.index + 1) <
        this.pageActiveTransaction?.totalElements
        ? this.pageActiveTransaction.size *
        (this.pageActiveTransaction.index + 1)
        : this.pageActiveTransaction?.totalElements;
    if (this.pageActiveTransaction.index == 0) {
      if (
        this.pageActiveTransaction.size >=
        this.pageActiveTransaction.totalElements
      ) {
        console.log(this.pageActiveTransaction.totalElements);
        return `1 - ${this.pageActiveTransaction.totalElements}`;
      } else {
        // console.log(this.pageActiveTransaction.size)
        return `1 - ${this.pageActiveTransaction.size}`;
      }
    } else {
      return `${this.pageActiveTransaction.index * this.pageActiveTransaction.size + 1
        } - ${this.lastActive} `;
    }
  }
  pagePreviousActiveTransaction() {
    this.pageActiveTransaction.index = this.pageActiveTransaction.index - 1;
    let payload = {

      status: this.transStatus,
      page: this.pageActiveTransaction.index,
      size: 5,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    console.log(payload);
    this.fetchDataActive(payload);
  }
  pageNextActiveTransaction() {
    this.pageActiveTransaction.index = this.pageActiveTransaction.index + 1;
    let payload = {
      status: this.transStatus,
      page: this.pageActiveTransaction.index,
      size: 5,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    console.log(payload);
    this.fetchDataActive(payload);
  }

  editSelected(e: any) {
    console.log(e, `/customer/transactions/view?transactionId=${e}`);
    this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`);
  }

  pagePrevious() {
    this.pagePreviousTransaction.index = this.pagePreviousTransaction.index - 1;
    if (this.viewType === 'dashboard') {
      let payload = {
        ...this.customPayload,
        page: this.pagePreviousTransaction.index,
        size: this.pagePreviousTransaction.size,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      console.log(payload);
      this.fetchDatafromDashboard(payload);
    } else {
      let payload = {
        status: this.transStatus,
        page: this.pagePreviousTransaction.index,
        size: this.pagePreviousTransaction.size,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      console.log(payload);
      this.fetchDataPrevious(payload);
    }
  }
  pageNext() {
    this.pagePreviousTransaction.index = this.pagePreviousTransaction.index + 1;
    if (this.viewType === 'dashboard') {
      let payload = {
        ...this.customPayload,
        page: this.pagePreviousTransaction.index,
        size: this.pagePreviousTransaction.size,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
        // "isFindQuoteReceivedTransactions": true
      };
      console.log(payload);
      this.fetchDatafromDashboard(payload);
    } else {
      let payload = {
        status: this.transStatus,
        page: this.pagePreviousTransaction.index,
        size: this.pagePreviousTransaction.size,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      console.log(payload);
      this.fetchDataPrevious(payload);
    }


  }

  getPage() {
    this.last =
      this.pagePreviousTransaction.size *
        (this.pagePreviousTransaction.index + 1) <
        this.pagePreviousTransaction?.totalElements
        ? this.pagePreviousTransaction.size *
        (this.pagePreviousTransaction.index + 1)
        : this.pagePreviousTransaction?.totalElements;
    if (this.pagePreviousTransaction.index == 0) {
      if (
        this.pagePreviousTransaction.size >=
        this.pagePreviousTransaction.totalElements
      ) {
        return `1 - ${this.pagePreviousTransaction.totalElements}`;
      } else {
        return `1 - ${this.pagePreviousTransaction.size}`;
      }
    } else {
      return `${this.pagePreviousTransaction.index * this.pagePreviousTransaction.size +
        1
        } - ${this.last} `;
    }
  }

  search(e: any) {
    console.log(e.target.value);
    this.pagePreviousTransaction.index = 0;
    let dataPrevious = {
      page: this.pagePreviousTransaction.index,
      size: this.pagePreviousTransaction.size,
      status: [
        'ACTIVE',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CLOSED',
        'PENDING',
        'MAKER_APPROVED'
      ],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: e.target.value,
    };
    this.fetchDataPrevious(dataPrevious);
  }

  downloadCSV() {


    let dataPrevious = {
      page: this.pagePreviousTransaction.index,
      size: this.pagePreviousTransaction.size,
      status: [
        'ACTIVE',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CLOSED',
        'PENDING',
        'MAKER_APPROVED'
      ],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.transactionService.generateCSV(dataPrevious).subscribe((res: any) => {
      console.log(res.data);
      window.open(res.data[0].url);
    });
  }

  resetFilter() {
    this.pagePreviousTransaction.index = 0;
    this.transStatus = [
      'ACTIVE',
      'ACCEPTED',
      'REJECTED',
      'EXPIRED',
      'CANCELLED',
      'CLOSED',
      'PENDING',
      'MAKER_APPROVED'
    ];
    let dataPrevious = {
      page: this.pagePreviousTransaction.index,
      size: this.pagePreviousTransaction.size,
      status: [
        'ACTIVE',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CLOSED',
        'PENDING',
        'MAKER_APPROVED'
      ],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchDataPrevious(dataPrevious);
  }

  filter() {
    console.log('Enter');
    const filterpopup = this.dialog.open(FilterTransactionsPopupComponent);
    filterpopup.afterClosed().subscribe((res) => {
      console.log(res);
      this.subsidiaryID = res.data.subsidaryId;
      this.passcodeUserId = res.data.passcodeUserId;
      this.transStatus =
        res.data.status !== ''
          ? res.data.status == 'ACTIVE'
            ? [res.data.status,'PENDING','MAKER_APPROVED']
            : [res.data.status]
          : this.transStatus;
      this.pagePreviousTransaction.index = 0;
      let dataPrevious = {
        page: this.pagePreviousTransaction.index,
        size: this.pagePreviousTransaction.size,
        status: this.transStatus || [
          'ACTIVE',
          'ACCEPTED',
          'REJECTED',
          'EXPIRED',
          'CANCELLED',
          'CLOSED',
          'PENDING',
          'MAKER_APPROVED'
        ],
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: this.subsidiaryID ? `${this.subsidiaryID}` : '',
        passCodeUserId: this.passcodeUserId ? this.passcodeUserId : '',
        transactionId: '',
      };
      this.fetchDataPrevious(dataPrevious);
    });
  }
  openQuotes(id: any, quoteCount: any) {
    if (quoteCount > 0) {
      console.log(id);
      this.router.navigateByUrl(
        `/customer/transactions/quote?transactionId=${id}`
      );
    }
  }
  quoteDetails(e: any, quote: any, transDetail: any) {
    this.getQuoteId(transDetail?.transactionId, transDetail?.transactionStatus);
  }
  getQuoteId(id: any, status: any) {
    let payload = {
      page: 0,
      size: 100,
      transactionId: id,
      status: [status],
    };
    this.transactionService.findQuotations(payload).subscribe({
      next: (res: any) => {
        const { data } = res;
        if (data?.length > 0) {
          this.router.navigateByUrl(
            `/customer/transactions/quotes-details?quoteId=${data[0].quotationId}`
          );
        }
      },
    });
  }

  editActiveSelectedTransaction(e: any, status: any) {
    if (status == 'ACTIVE') {
      console.log(e, `/customer/transactions/view?transactionId=${e}`, status);
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'active' } }
      );
    } else if (status == 'ACCEPTED') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'accepted' } }
      );
    } else if (status == 'REJECTED') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'rejected' } }
      );
    } else if (status == 'EXPIRED') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'expired' } }
      );
    } else if (status == 'CLOSED') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'close' } }
      );
    } else if (status == 'CANCELLED') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'cancelled' } }
      );
    } else if (status == 'PENDING') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'pending' } }
      );
    }
    else if (status == 'MAKER_APPROVED') {
      this.router.navigateByUrl(
        `/customer/transactions/view-details?transactionId=${e}`,
        { state: { from: 'maker_approved' } }
      );
    }
    // console.log(e,`/customer/transactions/view?transactionId=${e}`);
    // this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`,{state:{type:'active'}});
  }
  downloadCSVInv(id: any) {
    let dataPrevious = {
      page: this.pagePreviousTransaction.index,
      size: this.pagePreviousTransaction.size,
      status: this.transStatus || [
        'ACTIVE',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CLOSED',
        'PENDING',
        'MAKER_APPROVED'
      ],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: this.subsidiaryID ? `${this.subsidiaryID}` : '',
      passCodeUserId: this.passcodeUserId ? this.passcodeUserId : '',
      transactionId: id,
    };
    this.transactionService.generateCSV(dataPrevious).subscribe((res: any) => {
      console.log(res.data);
      window.open(res.data[0].url);
    });
  }

  closeTransaction(e: any, id: any) {
    console.log(e.value);
    if (e.value == 'Close') {
      console.log('hi', id);
      const popup = this.dialog.open(CloseTransactionComponent, {
        data: {
          transactionId: id,
        },
      });

      popup.afterClosed().subscribe((res: any) => {
        this.transStatus = [
          'ACTIVE',
          'ACCEPTED',
          'REJECTED',
          'EXPIRED',
          'CANCELLED',
          'CLOSED',
          'PENDING',
          'MAKER_APPROVED'
        ];
        this.selected = 'Open';
        let data = {
          status: [
            'ACTIVE',
            'ACCEPTED',
            'REJECTED',
            'EXPIRED',
            'CANCELLED',
            'CLOSED',
            'PENDING',
            'MAKER_APPROVED'
          ],
          page: this.pagePreviousTransaction.index,
          size: this.pagePreviousTransaction.size,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: '',
          passCodeUserId: '',
          transactionId: '',
        };
        this.fetchDataPrevious(data);
        this.fetchDataActive(data);
      });
    }
  }


  fetchDatafromDashboard(payload) {
    if (!this.customPayload['from']) {
      return
    }
    this.transactionService.findTransactionsDashboard(payload).subscribe({
      next: (res: any) => {
        let response = res.data;
        this.pagePreviousTransaction.page = res.page;
        this.pagePreviousTransaction.size = res.size;
        this.pagePreviousTransaction.totalElements = res.totalElements;
        this.pagePreviousTransaction.totalPages = res.totalPages;
        this.totalItems = res.totalElements;
        this.totalPages = res.totalPages;
        console.log(response);
        this.newPreviousDataSource = response.map((item: any) => {
          console.log(item);
          return {
            transactionID: item?.transactionId,
            amount: item?.lCValue,
            applicant: item?.applicantName
              ? item?.applicantName
              : this.getGroupCompanyName(item?.subsidaryId),
            beneficiary: item?.beneName
              ? item?.beneName
              : this.getGroupCompanyName(item?.subsidaryId),
            quotes: item?.quotationCount,
            status: item?.transactionStatus,
            count: item?.quotationCount,
            quotationList: item?.quotationsList,
            transDetail: item,
            currency:item?.lCCurrency
          };
        });
        console.log(this.newPreviousDataSource);
        this.dataLength = res.totalElements;
        this.pageIndex = res.pageIndex;
        this.customerService.getCreditUpdate.next(true);

      }
    })
  }

  onPageChange(event:any){
      console.log(event)
      this.pagePreviousTransaction.index = event.pageIndex;
      let payload = {
        page: this.pagePreviousTransaction.index,
        size: event.pageSize,
        status: this.transStatus,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchDataPrevious(payload);
    }

}
