import { Component } from '@angular/core';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FactoringService } from '../../../factoring/services/factoring.service';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-accept-reject-user',
  templateUrl: './accept-reject-user.component.html',
  styleUrls: ['./accept-reject-user.component.scss']
})
export class AcceptRejectUserComponent {
  data: any[] = [];
  selected?: any[];
  companies?: any[] = [];
  totalItems: number;
  totalPages: number;
  size: number = 10;
  approveBydata:any=[];
  loginuserName: any;
  noOfElements: any;
  pagesize: any = 5;
  last: any;
  dataSource:any = new MatTableDataSource<Element[]>();
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;

  displayColumns: string[] = [
    'EMP ID',
    'First Name',
    'Last Name',
    'Designation',
    'Mobile No',
    'Reporting Manager',
    'status',
    'Action'
  ]
  @Output() acceptReject: EventEmitter<any> = new EventEmitter();
  constructor(private factoringService: FactoringService,
    private router: Router,
    private adminService: AdminService,
    private dialog: MatDialog, 
    private userService: UserManagementService) {

  }
  ngOnInit() {
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
    let payload = { status: 'ALL', page: 0, size: 5, subscriberType: 'ADMIN' };
    this.fetchData(payload);

  }

  fetchData(payload: any) {

    this.userService.getAdminUserList(payload).subscribe((res: any) => {
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
  }


  commentSelected(event: any) {
    console.log(event);
    let choosenData = this.data.find(item => item.transactionId == event);
    let id = choosenData.id;
    console.log(id);
    // this.adminService.getFactoringById(id).subscribe((res:any)=>{
    //   let transactdata=res;
    //   console.log(transactdata)
    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '350px',
      data: {
        title: 'isInfo',
        full_data: choosenData,
      },
    });
    // })
  }
  editSelected(event: any) {
    console.log(event['EMP ID']);
    let choosenData = this.data.find(item => item.userId == event);
    let id = choosenData.id;
    console.log(id);
    // this.adminService.getFactoringById(id).subscribe((res:any)=>{
    //   let transactdata=res;
    //   console.log(transactdata)
    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '350px',
      data: {
        title: 'isInfo',
        full_data: choosenData,
      },
    });
    // })
  }

  ConfirmAdminStatus(id:any, status:any) {
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
        this.userService.updataAdminUserStatus(data).subscribe((res: any) => {
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
            let payload = { status: 'ALL', page: 0, size: this.pagesize, subscriberType: 'ADMIN' };
            this.fetchData(payload);
          }

        })

      }
    });
  }
  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: 'ALL', page: this.page.index, size: this.pagesize, subscriberType: 'ADMIN' };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: 'ALL', page: this.page.index, size: this.pagesize, subscriberType: 'ADMIN' };
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
  let payload = { status: 'ALL', page: 0, size: this.pagesize, subscriberType: 'ADMIN' };
  this.fetchData(payload);
} 
viewDetails(id:any){
  this.router.navigate(['admin/dsb/viewuser',id]);
}
}
