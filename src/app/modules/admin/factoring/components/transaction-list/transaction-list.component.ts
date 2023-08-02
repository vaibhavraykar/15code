import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FactoringService } from '../../services/factoring.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {

  @ViewChild('paginator') paginator: MatPaginator;
  @Input() pageData?: any;
  getData: any;
  tableDataSource: any;
  selectdID: any = [];
  noOfElements: any;
  approveBydata: any = [];
  loginuserName: any;
  last: any;
  data: any[] = [];
  selected?: any[];
  dialogRef: MatDialogRef<any, any>;
  clickData: any;
  commentValue: string;
  transactionId: string;
  startDate: Date;
  endDate: Date;
  userId: any;
  startDateEpoch: any;
  endDateEpoch: any;
  totalItems: number;
  totalPages: number;
  size: number = 10;
  pagesize: any = 5;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  displayColumns: string[] = [
    'User Id',
    'Mobile',
    'Email',
    'Beneficiary',
    'B. Country',
    'Applicant',
    'A. Country',
    'Trxn Id',
    'Date',
    'Trxn Validity',
    'IB',
    'Amount',
    'Currency',
    'Requirement',
    'Trxn Status',
    'Quotes',
    'Actions'
  ];
  dataSource: any = new MatTableDataSource<Element[]>();
  status: any = 'ALL';
  viewTranByCustId: any;
  payload: any;
  filterPayload: any;
  transactions: any;
  searchDataList = <any>[];
  searchTerm: FormControl = new FormControl();
  userType:any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private factorService: FactoringService, private customerservice: CustomerService) {

  }
  ngOnInit() {
    this.loginuserName = localStorage.getItem('userName');
    this.searchTerm.valueChanges.subscribe(
      term => {
        if (term.trim() === '') {
          // If search term is empty, reset the userType and the search data list
          this.userType = '';
          this.searchDataList = [];
          return;
        }
        const upperCaseTerm = term.toUpperCase();
        if (upperCaseTerm.startsWith('BC') && upperCaseTerm.length >= 2) {
          this.userType = 'BC';
        } else if (upperCaseTerm.startsWith('C')) {
          this.userType = 'CU';
        } else if (upperCaseTerm.startsWith('R')) {
          this.userType = 'RE';
        } else if (upperCaseTerm.startsWith('BA') && upperCaseTerm.length >= 2) {
          this.userType = 'BA';
        }else {
          // If search term doesn't match any of the above patterns, reset the userType and the search data list
          this.userType = '';
          this.searchDataList = [];
          return;
        }
                              
          this.customerservice.getUserListForSearch(upperCaseTerm, this.userType).subscribe(
            data => {
              this.searchDataList = data;
              console.log(this.searchDataList);  
              const firstSearchResult = this.searchDataList[0];
              this.userId = firstSearchResult;                                    
              console.log('uid',this.userId);                                    
            });
      });
    if (this.startDate && this.endDate) {
      if (this.userId) {
        this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
        console.log('filter payload line 89', this.filterPayload);
        this.searchTransactions(this.filterPayload);
      } else {
        this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch }
        console.log('filter payload line 94', this.filterPayload);
        this.searchTransactions(this.filterPayload);
      }
    } else {
      this.customerservice.selectedUserForTxnView.subscribe(res => {
        console.log(res);
        this.viewTranByCustId = res;
      })
      if (this.viewTranByCustId) {
        this.payload = { status: 'ALL', page: 0, size: this.pagesize, mid: this.viewTranByCustId };
      } else {
        this.payload = { status: 'ALL', page: 0, size: this.pagesize };
      }
      this.fetchData(this.payload);
    }
   
  }
  onStatusChange(target) {
    // let type = (target as HTMLSelectElement).value;
    this.status = target.value;
    if (this.startDate && this.endDate) {
      if (this.userId) {
        this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
        this.page.index=0;
        this.searchTransactions(this.filterPayload);
      } else {
        this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch }
        this.page.index=0; 
        this.searchTransactions(this.filterPayload);
      }
    } else {
      if (this.viewTranByCustId) {
        this.payload = { status: this.status, page: 0, size: this.pagesize, mid: this.viewTranByCustId };
      } else {
        this.payload = { status: this.status, page: 0, size: this.pagesize };
      }
      this.page.index=0;
      this.fetchData(this.payload);
    }
  }

  fetchData(payload: any) {
    //for testing
    this.factorService.getTransactionList(payload).subscribe((res: any) => {
      console.log('RES', res.content)
      this.data = res.content;
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = new MatTableDataSource(this.data);
      this.noOfElements = Math.ceil(
        Number(this.page.totalElements) / Number(this.page.size)
      );
      const startIndex = Number(this.page.page) * Number(this.page.size);
      const endIndex = startIndex + Number(this.page.size);
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
    })
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    // this.tableDataSource.paginator = this.paginator;
  }
  searchTransactions(filterPayload: any) {
    const startDate = this.range.controls.start.value;
    const endDate = this.range.controls.end.value;
    this.startDateEpoch = new Date(this.range.controls.start.value).getTime();
    this.endDateEpoch = new Date(this.range.controls.end.value).getTime();
    console.log(this.startDateEpoch);
    this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
    this.startDate = this.startDateEpoch;
    this.endDate = this.endDateEpoch;
    console.log('filter payload', this.filterPayload);
    this.searchFilter(this.filterPayload);
  }

  searchFilter(filterPayload) {
    this.factorService.filterTransactions(filterPayload).subscribe(
      (res: any) => {
        console.log('RES of Filter', res.content);
        this.data = res.content;
        this.page.page = res.page;
        this.page.size = res.size;
        this.page.totalElements = res.totalElements;
        this.page.totalPages = res.totalPages;
        this.totalItems = res.totalElements;
        this.totalPages = res.totalPages;
        this.dataSource = new MatTableDataSource(this.data);
        this.noOfElements = Math.ceil(
          Number(this.page.totalElements) / Number(this.page.size)
        );
        const startIndex = Number(this.page.page) * Number(this.page.size);
        const endIndex = startIndex + Number(this.page.size);
        this.dataLength = res.totalElements;
        this.pageIndex = res.pageIndex;
      },
    );
  }
  comment(mtransactionId: any, transactionStatus: any, approvedType: any) {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '350px',
    });
    this.clickData = {
      mtransactionId, transactionStatus, approvedType
    };
    console.log('comment', this.clickData);
  }
  submitComment() {
    console.log(this.commentValue);
    let data = {
      txnId: this.clickData.mtransactionId,
      txnStatus: this.clickData.transactionStatus,
      comment: this.commentValue,
      approvedType: this.clickData.approvedType
    }
    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '310px',
      data: {
        title: 'isConfirm',
        full_data: data,
      },
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        console.log('confirm status', data);
        this.factorService.updataStatusTrans(data).subscribe((res: any) => {
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
          });
          if (res['success'] == true) {
            this.dialogRef.close();
            this.router.navigateByUrl('/admin/factoring/transaction-list');
            if (this.startDate && this.endDate) {
              if (this.userId) {
                this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
                this.searchTransactions(this.filterPayload);
              } else {
                this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch }
                this.searchTransactions(this.filterPayload);
              }
            } else {
              if (this.viewTranByCustId) {
                this.payload = { status: this.status, page: 0, size: this.pagesize, mid: this.viewTranByCustId };
              } else {
                this.payload = { status: this.status, page: 0, size: this.pagesize };
              }
              this.fetchData(this.payload);
            }
          }
        })
      }
      this.dialogRef.close();
    });
    this.router.navigateByUrl('/admin/factoring/transaction-list');
  }
  closeComment() {
    this.dialogRef.close();
  }

  onPageChange(event) {
    this.pagesize = event.pageSize;
    this.page.index = 0;
    if (this.startDate && this.endDate) {
      if (this.userId) {
        this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
        this.searchTransactions(this.filterPayload);
      } else {
        this.filterPayload = { page: 0, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch }
        this.searchTransactions(this.filterPayload);
      }
    } else {
      if (this.viewTranByCustId) {
        this.payload = { status: this.status, page: 0, size: this.pagesize, mid: this.viewTranByCustId };
      } else {
        this.payload = { status: this.status, page: 0, size: this.pagesize };
      }
      this.fetchData(this.payload);
    }
  }

  pagePrevious() {
    console.log(this.startDate);
    this.page.index = this.page.index - 1;
    if (this.startDate && this.endDate) {
      if (this.userId) {
        this.filterPayload = { page: this.page.index, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
        this.searchTransactions(this.filterPayload);
      } else {
        this.filterPayload = { page: this.page.index, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch }
        this.searchTransactions(this.filterPayload);
      }
    } else {
      if (this.viewTranByCustId) {
        this.payload = { status: this.status, page: this.page.index, size: this.pagesize, mid: this.viewTranByCustId };
      } else {
        this.payload = { status: this.status, page: this.page.index, size: this.pagesize };
      }
      this.fetchData(this.payload);
    }
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    if (this.startDate && this.endDate) {
      if (this.userId) {
        this.filterPayload = { page: this.page.index, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch, userId: this.userId }
        this.searchTransactions(this.filterPayload);
      } else {
        this.filterPayload = { page: this.page.index, size: this.pagesize, startDate: this.startDateEpoch, endDate: this.endDateEpoch }
        this.searchTransactions(this.filterPayload);
      }
    } else {
      if (this.viewTranByCustId) {
        this.payload = { status: this.status, page: this.page.index, size: this.pagesize, mid: this.viewTranByCustId };
      } else {
        this.payload = { status: this.status, page: this.page.index, size: this.pagesize };
      }
      this.fetchData(this.payload);
    }
  }
  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) <
        this.page?.totalElements
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
  viewDetails(mtransactionId: any) {
    this.router.navigate(['admin/factoring/view-trans-list', mtransactionId]);
  }
  viewQuotation(mtransactionId: any) {
    this.router.navigate(['admin/factoring/quoatation-list', mtransactionId]);
  }
  getConvertedDate(date: any) {
    console.log(date);
    return '';
  }
}


