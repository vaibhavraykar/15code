import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FactoringService } from '../../factoring/services/factoring.service';

@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss']
})
export class GrantComponent {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() pageData?: any;
  getData: any;
  tableDataSource: any;
  selectdID: any = [];
  dialogRef: MatDialogRef<any, any>;
  clickData: any;
  commentValue: string;
  noOfElements: any;
  approveBydata:any=[];
  loginuserName: any;
  last: any;
  data:any[]=[];
  selected?:any[];
  totalItems:number;
  totalPages:number;
  size:number=10;
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

  displayColumns:string[]=[
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
    'Actions'
  ];
  dataSource:any = new MatTableDataSource<Element[]>();
  

  constructor(
    private router:Router,
    private dialog: MatDialog,
    private factorService: FactoringService){

  }
  ngOnInit(){
      
    let payload = { status: 'MAKER_APPROVED', page: 0, size: 5};
    this.fetchData(payload);
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
    
  }
  
  fetchData(payload: any){
    //for testing
    this.factorService.getTransactionList(payload).subscribe((res:any)=>{
      console.log('RES',res.content)
      this.data = res.content;
      this.page.page=res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems=res.totalElements;
      this.totalPages=res.totalPages;
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

  commentSelected(event:any){
    console.log(event);
    let choosenData=this.data.find(item=>item.transactionId==event);
    let id=choosenData.id;
    console.log(id);
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isInfo',
          full_data:choosenData,
        },
      });

  }

  onPageChange(event) {
    this.pagesize = event.pageSize;
    this.page.index =0;
    let payload = { status: 'MAKER_APPROVED', page: 0, size: this.pagesize };
    this.fetchData(payload);
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: 'MAKER_APPROVED', page: this.page.index, size: this.pagesize};
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: 'MAKER_APPROVED', page: this.page.index, size: this.pagesize};
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
  
  getConvertedDate(date: any) {
    console.log(date);
    return '';
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
    console.log('confirm status', data);
    // popup.afterClosed().subscribe(dialogResult => {
    //   let result = dialogResult;
      // if (dialogResult) {
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
            this.page.index = 0;
            let payload = { status: 'MAKER_APPROVED', page: 0, size: this.pagesize };
            this.fetchData(payload);
          }
          this.closeComment();
        })
      // }
    // });
    this.router.navigateByUrl('admin/dsb/grant');
  }
  closeComment() {
    this.dialogRef.close();
  }
  
}
