import { Component, ViewChild } from '@angular/core';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AdminService } from '../../services/admin.service';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
import { AddFactorComponent } from '../add-factor/add-factor.component';
import { Output, EventEmitter } from '@angular/core';
import { FactorService } from '../../services/factor/factor.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-factor-list',
  templateUrl: './factor-list.component.html',
  styleUrls: ['./factor-list.component.scss']
})
export class FactorListComponent {
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
    'Factor ID',
    'Factor Name',
    'Factor Country',
    'Status',
    'Action',
    'Action1'
  ];
  noOfElements: any;
  last:any;
  loginuserName: string;
  pagesize: any = 5;
  payload:any;

  constructor( 
    private router:Router, private adminService:AdminService, private dialog: MatDialog,private userService:UserManagementService,private factorService:FactorService){

  }
  ngOnInit(){
    this.factorService.callGetApi.subscribe(res=>{
      console.log(res);
      this.payload = {page: 0, size: this.pagesize};
      this.fetchData(this.payload);
    })
    this.loginuserName = localStorage.getItem('userName');  

  }
  fetchData(payload: any){
      this.factorService.getAllFactorList(payload).subscribe((res:any)=>{
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
    this.payload = {page: this.page.index, size: this.pagesize};
    this.fetchData(this.payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.payload = {page: this.page.index, size: this.pagesize};
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
    this.payload = {page: 0, size: this.pagesize };
    this.fetchData(this.payload);

  }
  openModel() {
    const popup = this.dialog.open(AddFactorComponent, {
      width: '800px',
      height: '450px',
      data :{
        edit :false
      },
      disableClose: true
    });  }

    view(ele){
      console.log(ele);
      this.factorService.viewFactorData.next(ele);
      this.router.navigate(['admin/dsb/view-factor']);
    }
    actionFactor(status,id){
      let data= {
        status: status,
        id: id,
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
          this.factorService.updateFactorStatus(data).subscribe(res=>{
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
              this.payload = {page: this.page.index, size: this.pagesize};
              this.fetchData(this.payload);
            }
          })
        }
      });
    }
}