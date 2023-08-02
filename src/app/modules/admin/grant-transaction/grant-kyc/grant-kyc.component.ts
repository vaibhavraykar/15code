import { Component,Input,ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { GrantService } from '../../services/grant/grant.service';

@Component({
  selector: 'app-grant-kyc',
  templateUrl: './grant-kyc.component.html',
  styleUrls: ['./grant-kyc.component.scss']
})
export class GrantKycComponent {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() pageData?: any;
  getData: any;
  tableDataSource: any;
  selectdID: any = [];
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

  displayColumns:string[]=['User Id','First Name','Last Name','Email','Mobile','Plan and Payment','Actions'];
  dataSource:any = new MatTableDataSource<Element[]>();
  subscriberType: any = 'CUSTOMER';

  constructor(
    private router:Router,
    private dialog: MatDialog,
    private grantService: GrantService){

  }
  ngOnInit(){
    let payload = { status: 'MAKER_APPROVED', page: 0, size: this.pagesize, subscriberType: 'CUSTOMER'};
    this.fetchData(payload);
    
  }
  onSubscriberTypeChange(target) {
    this.subscriberType = target.value;
    let payload = { status: 'MAKER_APPROVED', page: 0, size: 5, subscriberType: this.subscriberType };
    this.page.index = 0;
    this.fetchData(payload);
    if(this.subscriberType == 'CUSTOMER' || this.subscriberType == 'BANK' || this.subscriberType == 'BANK_AS_UNDERWRITER'){
      this.displayColumns = ['User Id','First Name','Last Name','Email','Mobile','Plan and Payment','Actions'];
    }else{
      this.displayColumns = ['User Id','First Name','Last Name','Email','Mobile','Actions'];
    }
  }
  
  fetchData(payload: any){
    //for testing
    this.grantService.getCustomerList(payload).subscribe((res:any)=>{
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

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: 'MAKER_APPROVED', page: this.page.index, size: this.pagesize, subscriberType: this.subscriberType};
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: 'MAKER_APPROVED', page: this.page.index, size: this.pagesize, subscriberType: this.subscriberType};
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
    let payload = { status: 'MAKER_APPROVED', page: 0, size: this.pagesize, subscriberType: this.subscriberType };
    this.fetchData(payload);

  }
  
  getConvertedDate(date: any) {
    console.log(date);
    return '';
  }
  
  viewDetails(username:any){
    this.router.navigate(['admin/dsb/view-kyc',username]);
  }
}
