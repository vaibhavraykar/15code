import { Component, EventEmitter,Input,OnInit,Output,ViewChild, } from '@angular/core';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {DiscountManagementService} from '../../services/discount-management/discountManagement.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-accept-reject-coupons',
  templateUrl: './accept-reject-coupons.component.html',
  styleUrls: ['./accept-reject-coupons.component.scss']
})
export class AcceptRejectCouponsComponent {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() pageData?: any;
  tableDataSource: any;
  selectdID: any = [];
  noOfElements: any;
  approveBydata:any=[];
  loginuserName: any;
  data:any[]=[];
  selected?:any[];
  totalItems:number;
  totalPages:number;
  size:number=10;
  pagesize: any = 5;
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;

  displayColumns:string[]=[
    'more',
    'Coupon Code',
    'Currency',
    'Quantity',
    'Fix Amount',
    'Discount Percentage',
    'Max. Discount',
    'Consumed Coupons',
    'Status',
    'Action'
  ];
  dataSource:any = new MatTableDataSource<Element[]>();
  status: any = 'ALL';

  constructor(
    private router:Router,  
    private dialog: MatDialog,
    private userService:DiscountManagementService){

  }
  ngOnInit(){
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
    let payload = { status: 'ALL', page: 0, size: this.pagesize ,subscriberType:'ADMIN'};
    this.fetchData(payload); 
  }
  
  fetchData(payload: any){
    //for testing
    this.userService.discountCouponSelected(payload).subscribe((res:any)=>{
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
    this.tableDataSource.paginator = this.paginator;
  }
  onStatusChange(target) {
    // let type = (target as HTMLSelectElement).value;
      this.status =  target.value;
      let payload = { status: this.status, page: 0, size: this.pagesize, subscriberType: 'ADMIN'};
      this.page.index = 0;
      this.fetchData(payload);
  }

  
  confirmCouponStatus(id:any, status:any) {
    console.log(id);
    let data = {
      id: id,
      status: status
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
        this.userService.updateCouponStatus(data).subscribe((res: any) => {
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
            let payload = { status: this.status, page: this.page.index, size: this.pagesize, subscriberType: 'ADMIN' };
            this.fetchData(payload);
          }
        })
      }
    });
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: this.status, page: this.page.index, size: this.pagesize ,subscriberType:'ADMIN'};
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: this.status, page: this.page.index, size: this.pagesize ,subscriberType:'ADMIN'};
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
  let payload = { status: this.status, page: 0, size: this.pagesize, subscriberType: 'ADMIN' };
  this.fetchData(payload);
}
viewDetails(id:any){
  this.router.navigate(['admin/dsb/view-details',id]);
}
}
