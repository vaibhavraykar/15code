import { Component } from '@angular/core';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../admin/services/admin.service';
import { FactoringService } from '../../../factoring/services/factoring.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  // dataSource:any[]=[];
  data:any[]=[];
  selected?:any[];
  companies?:any[]=[];
  totalItems:number;
  totalPages:number;
  noOfElements: any;
  last: any;
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


  displayColumns:string[]=[
    'EMP ID',
    'First Name',
    'Last Name',
    'Designation',
    'Mobile No',
    'Reporting Manager',
    'Status',
    'Action'
  ];
  myRights:any;
  dataSource:any = new MatTableDataSource<Element[]>();
  myRole:any;
  status:any='ALL';
  payload:any;
  constructor(private factoringService:FactoringService, 
    private router:Router, private adminService:AdminService, private dialog: MatDialog,private userService:UserManagementService){
  }
  ngOnInit(){
      
    this.payload = { status: this.status, page: 0, size: 5 ,subscriberType:'ADMIN'};
    this.fetchData(this.payload);
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
  }
  
  fetchData(payload: any){
    //for testing
    this.userService.getAdminUserList(payload).subscribe((res:any)=>{
      console.log('RES',res.content)
      this.data = res.content;
      // this.transferSelectedData();
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
  }

    pagePrevious() {
      this.page.index = this.page.index - 1;
      this.payload = { status: this.status, page: this.page.index, size: this.pagesize,subscriberType:'ADMIN' };
      console.log(this.payload);
      this.fetchData(this.payload);
    }
    pageNext() {
      this.page.index = this.page.index + 1;   
      this.payload = { status: this.status, page: this.page.index, size: this.pagesize ,subscriberType:'ADMIN'};
      console.log(this.payload);
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
      let payload = { status: this.status, page: this.pageIndex, size: this.pagesize, subscriberType: 'ADMIN' };
      this.fetchData(payload);
    }    

  selectedUser(event:any){
    console.log(event);
    // let choosenData=this.data.find(item=>item.userId==event);
    // let id=choosenData.id;
    console.log(event,'id');
    this.userService.adminUserId.next(event);
    this.router.navigate(['admin/dsb/view-user']);
  }

  commentSelected(event:any){
    console.log(event);
    let choosenData=this.data.find(item=>item.transactionId==event);
    let id=choosenData.id;
    console.log(id);
    // this.adminService.getFactoringById(id).subscribe((res:any)=>{
    //   let transactdata=res;
    //   console.log(transactdata)
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isInfo',
          full_data:choosenData,
        },
      });
    // })
  }
  addUser(){
    this.router.navigateByUrl('admin/dsb/add-user');
  }
  viewDetails(id:any){
    this.router.navigate(['admin/dsb/viewuser',id],{ queryParams: { showEditButton: true } });
  }
  onStatusChange(target) {
    this.status =  target.value;
    this.payload={page: 0, size: this.pagesize, status: this.status, subscriberType: 'ADMIN' }
    this.page.index=0;
    this.getPage()
    this.fetchData(this.payload);
  }
  
}
