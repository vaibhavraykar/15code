import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../services/admin.service';
import { CustomerService } from '../../services/customer/customer.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit{

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
    dataSource = new MatTableDataSource<Element[]>();
    displayColumns:string[]=[
      'username',
      'firstName',
      'lastName',
      'mobileNumber',
      'email',
      'Business Country',
      'companyName',
      'pending order',
      'total order',
      'totaltxn',
      'kycStatus',
      'Action',
    ];
    noOfElements: any;
    last:any;
    loginuserName: string;
    pagesize: any = 5;
    payload:any;
    selectedUser:any;
    displayTable:boolean=false;
    status:any='ALL';
    searchDataList = <any>[];
    searchTerm: FormControl = new FormControl();
    userType:any;
  
  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private adminService:AdminService,private customerService:CustomerService){
  }
  ngOnInit(){
    this.loginuserName = localStorage.getItem('userName');

    if(localStorage.getItem('selectedSubscriberType')){
      this.selectedUser = localStorage.getItem('selectedSubscriberType');
      this.payload = {page: 0, size: this.pagesize, status: this.status, subscriberType: this.selectedUser };
      this.fetchData(this.payload);
      this.displayTable = true;
    }
    this.searchTerm.valueChanges.subscribe(
      term => {
        if(this.searchTerm.value != ''){
          if(term.startsWith('B') || term.startsWith('b')){
            this.userType='BC';
          }else if(term.startsWith('C') || term.startsWith('c')){
            this.userType='C';
          }          
          this.customerService.getUserListForSearch(term.toUpperCase(),this.userType).subscribe(
            data => {
              this.searchDataList = data;
              console.log(this.searchDataList);                                      
            });
        }
      });
  }
  getDataByUserId(event){
    if(this.searchTerm.value != ''){
      if(this.userType == 'C'){
        this.userType = 'CU';
      }
      const data={
        page:0,
        size:5,
        userId:event,
        userInitial:this.userType
      }
      this.customerService.getListByUser(data).subscribe(
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
        });
    }
  }
  fetchData(payload: any){
    this.customerService.getCustomerList(payload).subscribe((res:any)=>{
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
    this.payload = {page: this.page.index, size: this.pagesize, status: this.status, subscriberType: this.selectedUser};
    this.fetchData(this.payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.payload = {page: this.page.index, size: this.pagesize, status:this.status, subscriberType: this.selectedUser};
    this.fetchData(this.payload);
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
    this.payload = {page: 0, size: this.pagesize, status: this.status, subscriberType: this.selectedUser };
    this.fetchData(this.payload);

  }
   
  viewDetails(id){
    localStorage.setItem('selectedSubscriberType',this.selectedUser);
    this.router.navigate(['admin/dsb/customer-view',id])
}
getKycDetails(id){
  localStorage.setItem('selectedSubscriberType',this.selectedUser);
  this.router.navigate(['admin/dsb/customer-kyc',id])
}
getPlanAndPaymentDetails(status,id){
  localStorage.setItem('selectedSubscriberType',this.selectedUser);
  this.customerService.orderClickName.next(status);
  this.router.navigate(['admin/dsb/planPayment',id])
}
onChangeRadio(){
  this.payload = {page: 0, size: this.pagesize, status: this.status, subscriberType: this.selectedUser };
  this.fetchData(this.payload);
  this.page.index=0;
  this.getPage();
  this.displayTable = true;
  this.searchTerm.setValue('');

}
getTotalTxn(id){
  this.customerService.selectedUserForTxnView.next(id);
  this.router.navigate(['admin/factoring/transaction-list']);
}
onStatusChange(target) {
  this.status =  target.value;
  this.payload={page: 0, size: this.pagesize, status: this.status, subscriberType: this.selectedUser }
  this.page.index=0;
  this.getPage()
  this.fetchData(this.payload);
  this.searchTerm.setValue('');
}
}