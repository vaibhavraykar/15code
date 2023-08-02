import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../services/admin.service';
import { RefererService } from '../../services/referer/referer.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-referer-list',
  templateUrl: './referer-list.component.html',
  styleUrls: ['./referer-list.component.scss']
})
export class RefererListComponent implements OnInit{
  data:any[]=[];
    selected?:any[];
    companies?:any[]=[];
    totalItems:number;
    totalPages:number;
    size:number=10;
    page = {
      index: 0,
      page: 0,
      size: 5,
      totalElements: 0,
      totalPages: 0,
    };
    dataLength: any = 0;
    pageIndex: any = 0;
    searchTerm: FormControl = new FormControl();
    searchDataList = <any>[];
    dataSource = new MatTableDataSource<Element[]>();
    displayColumns:string[]=[
      'username',
      'firstName',
      'lastName',
      'mobileNumber',
      'email',
      'Country',
      'companyName',
      'KYC',
      'Total Reference',
      'Approved Reference',
      'Rejected Reference',
      'Pending Reference',
      'Action',
    ];
    isLogoutClick:boolean;
    noOfElements: any;
    last:any;
    loginuserName: string;
    pagesize: any = 5;
    payload:any;
    selectedUser:any;
    displayTable:boolean=false;
    status: any = 'ALL';
    userType:any;
  
  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private adminService:AdminService,private refererService:RefererService){
  }
  ngOnInit(){
    // this.adminService.isLogout.subscribe((res:any)=>{
    //     this.isLogoutClick=res;
    //    })
    this.loginuserName = localStorage.getItem('userName');
    let payload = { status: 'ALL', page: 0, size: this.pagesize, subscriberType: 'REFERRER'};
    this.fetchData(payload);
    this.searchTerm.valueChanges.subscribe(
      term => {
          this.userType='RE';        
          this.refererService.getUserListForSearch(term.toUpperCase(),this.userType).subscribe(
            data => {
              this.searchDataList = data;
              // console.log(this.searchDataList);                                      
            });
      });

    // if(localStorage.getItem('selectedSubscriberType')){
    //   this.selectedUser = localStorage.getItem('selectedSubscriberType');
    //   this.payload = {page: 0, size: this.pagesize, status: "PENDING", subscriberType: this.selectedUser };
    //   this.fetchData(this.payload);
    //   this.displayTable = true;
    // }
  }
  onStatusChange(target) {
    // let type = (target as HTMLSelectElement).value;
    this.status =  target.value;
    this.payload = {page: 0, size: this.pagesize, status: this.status, subscriberType: 'REFERRER'};
    this.page.index = 0;
    this.fetchData(this.payload);
  }
  fetchData(payload: any){
    this.refererService.getCustomerList(payload).subscribe((res:any)=>{
      this.data = res.content;
      console.log(this.data);
      this.page.page=res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems=res.totalElements;
      this.totalPages=res.totalPages;
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
  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: this.status, page: this.page.index, size: this.pagesize ,subscriberType: 'REFERRER'};
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: this.status, page: this.page.index, size: this.pagesize ,subscriberType: 'REFERRER'};
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
    this.page.index = 0;
    let payload = { status: this.status, page: 0, size: this.pagesize, subscriberType: 'REFERRER' };
    this.fetchData(payload);
  } 
   
  viewDetails(id){
    // this.customerService.selectedUserOnCustomerListPage.next(this.selectedUser);
    // localStorage.setItem('selectedSubscriberType',this.selectedUser);
    this.router.navigate(['admin/dsb/view-referer',id])
}
getKycDetails(id){
  // localStorage.setItem('selectedSubscriberType',this.selectedUser);
  this.router.navigate(['admin/dsb/referer-kyc',id])
}
getTotalReference(id: any, status: any){
  this.refererService.setSelectedUserForRefererView(id, status);
  this.router.navigate(['admin/dsb/view-reference'])
}
getApprovedReference(id: any, status: any){
  this.refererService.setSelectedUserForRefererView(id, status);
  this.router.navigate(['admin/dsb/view-reference'])
}
getRejectedReference(id: any, status: any){
  this.refererService.setSelectedUserForRefererView(id, status);
  this.router.navigate(['admin/dsb/view-reference'])
}
getPendingReference(id: any, status: any){
  this.refererService.setSelectedUserForRefererView(id, status);
  this.router.navigate(['admin/dsb/view-reference'])
}
getDataByUserId(event){
  const data={
    page:0,
    size:5,
    userId:event,
    userInitial:'RE'
  }
  this.refererService.getListByUser(data).subscribe(
    (res:any) => {
      this.data = res.content;
      console.log(this.data);
      this.page.page=res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems=res.totalElements;
      this.totalPages=res.totalPages;
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
}
