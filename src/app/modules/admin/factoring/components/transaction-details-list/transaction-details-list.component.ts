import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { AdminService } from '../../../services/admin.service';
import { FactorService } from '../../../services/factor/factor.service';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-transaction-details-list',
  templateUrl: './transaction-details-list.component.html',
  styleUrls: ['./transaction-details-list.component.scss']
})
export class TransactionDetailsListComponent {
  @Output() editSelected: EventEmitter<any> = new EventEmitter();
  @Output() commentSelected: EventEmitter<any> = new EventEmitter();
  data: any[] = [];
  selected?: any[];
  companies?: any[] = [];
  totalItems: number;
  totalPages: number;
  size: number = 10;
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

  displayColumns: string[] = [
    'User ID',
    'Assignor/Seller',
    'Debtor/Buyer',
    'Invoice Number',
    'Amount',
    'Financing Period',
    'Transaction ID',
    'Transaction Status',
    'Select Factor',
    'Factor Pricing',
    'Action',
    'Submit'

  ]
  dataSource = new MatTableDataSource<Element[]>();
  selectFactorList: any = [];
  selectFactor: any;
  factorEntity = [];
  selectedPeople: any;
  transctionListForm: FormGroup;
  checkvaule: any;
  newvaule: any[];
  factorEntityOldSelectedList: any[];
  finalFilteredIdList: any = [];
  noOfElements: any;
  last: any;
  pagesize: any = 5;
  form!: FormControl;
  clickData: any;
  dialogRef: MatDialogRef<any, any>;
  constructor(private factoringService: FactoringService,
    private router: Router,
    private adminService: AdminService,
    private dialog: MatDialog, private factorService: FactorService, private fb: FormBuilder,) {
  }

  ngOnInit() {

    let payload = { status: 'ACTIVE', page: 0, size: this.pagesize };
    this.fetchData(payload);
    this.getSelectFactorList();
    this.form = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),

    ]);
  }

  fetchData(payload: any) {

    this.adminService.getFactoringList(payload).subscribe((res: any) => {
      this.data = res.content;
      //.filter(a => a != undefined)  
      // console.log(this.factorEntity, 'this.factorEntity')
      this.factorEntity = this.data.map(x => x.factorEntity)
      console.log(this.factorEntity, 'this.factorEntity next')
      // console.log(this.factorEntity.map(x => x.companyName), 'companyName')
      let newObs = []
      this.factorEntity.forEach((e) => {
        if (e) 
        {
          newObs.push(e.map(x => x.companyName))
        }else{
          newObs.push(undefined);
        }
      })
      this.factorEntity = newObs;
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
      this.noOfElements = Math.ceil(
        Number(this.page.totalElements) / Number(this.page.size)
      );
      const startIndex = Number(this.page.page) * Number(this.page.size);
      const endIndex = startIndex + Number(this.page.size);
    })
  }

  selectedTransaction(event: any) {
    console.log(event);
    let choosenData = this.data.find(item => item.transactionId == event);
    let id = choosenData.id;
    console.log(id, 'id');
    this.router.navigate(['admin/factoring/view-transaction', id])
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: 'ACTIVE', page: this.page.index, size: this.pagesize };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: 'ACTIVE', page: this.page.index, size: this.pagesize };
    console.log(payload);
    this.fetchData(payload);
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
  onPageChange(event) {
    this.pagesize = event.pageSize;
    this.page.index =0;
    let payload = { status: 'ACTIVE', page: 0, size: this.pagesize };
    this.fetchData(payload);

  }
  edit(id: any) {
    this.router.navigate(['admin/factoring/view-transaction/' + id])
  }
  comment(e: any) {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '350px',
    });
    this.clickData = e;
  }
  public errorHandling = (error: string) => {
    return this.form.hasError(error);
  };
  updateComment() {
    let data = [{
      message: this.form.value
    }]
    this.clickData['comment'] = data;
    if (this.form.value != '') {
      this.adminService.updateComment(this.clickData).subscribe((res: any) => {
        console.log(res, 'res');
        this.form.reset();
        this.dialogRef.close();
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '300px',
          data: {
            title: 'isSuccess',
          },
        });

        setTimeout(() => {
          popup.close();
        }, 1000);
      })
    }
  }
  closeComment() {
    this.form.reset();
    this.dialogRef.close();
  }
  getSelectFactorList() {
    this.factorService.getFactorList().subscribe((res: any) => {
      this.selectFactorList = res.data;
    })
  }
  selectedFactor(e, index) {
    console.log(e, 'selector1')
    this.newvaule = [];
    this.finalFilteredIdList = [];
    this.newvaule = e;
    let factorEntityOldSelectedList = this.factorEntity[index];
    if (this.factorEntity[index] != undefined) {
      this.newvaule = this.newvaule.filter(val => !factorEntityOldSelectedList.includes(val));
    }
    this.selectFactorList.forEach(element => {
      this.newvaule.forEach(e => {
        if (element.companyName == e) {
          this.finalFilteredIdList.push(element.id);
        }
      })
    });
  }

  send(id, e, i, factorList) {
    this.newvaule = e;
    this.finalFilteredIdList = [];
    if (factorList != undefined) {
      factorList = factorList.map(x => x.companyName);
    }
    if (factorList != undefined) {
      this.newvaule = this.newvaule.filter(x => factorList.findIndex(lu => lu === x) === -1), 'new vaule';
    }
    this.selectFactorList.forEach(element => {
      this.newvaule.forEach(e => {
        if (element.companyName == e) {
          this.finalFilteredIdList.push(element.id);
        }
      })
      console.log(this.finalFilteredIdList, 'finalFilteredIdList');
    });
    let data = {
      factoringTransactionId: id,
      masterEntityId: this.finalFilteredIdList
    }
    console.log(data);
    if (this.finalFilteredIdList.length > 0) {
      this.factoringService.sendemail(data).subscribe(res => {
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
        });
        this.page.index = 0;
        let payload = { status: 'ACTIVE', page: 0, size: this.pagesize };
        this.fetchData(payload);
        this.getSelectFactorList();
      })
    }


  }
  transactionStatusChange(status, id) {
    let data = {
      id: id,
      factorStatus: status
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
        this.factoringService.updateTranStatus(data).subscribe((res: any) => {
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
          });
          this.page.index = 0;
          let payload = { status: 'ACTIVE', page: 0, size: this.pagesize };
          this.fetchData(payload);
        })
      } else {
        let payload = { status: 'ACTIVE', page: this.page.index, size: this.pagesize };
        this.fetchData(payload);
      }
    });
  }

  // countEligibleTransactions(transactions: any[]): number {
  //   let count = 0;
  //   for (const transaction of transactions) {
  //     if (transaction.price) {
  //       count++;
  //     }
  //   }
  //   return count;
  // }
  countEligibleTransactions(transactions: any[]): number {
    if (transactions) {
      return transactions.reduce((count, transaction) => {
        if (transaction.price) {
          return count + 1;
        }
        return count;
      }, 0);
    }
    return 0;
  }

  viewDetailsFact(id:any){
    this.router.navigate(['admin/factoring/details-factoring/' + id]);
  }
}
