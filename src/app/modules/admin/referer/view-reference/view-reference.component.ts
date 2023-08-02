import { Component,Input,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute} from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { RefererService } from '../../services/referer/referer.service';

@Component({
  selector: 'app-view-reference',
  templateUrl: './view-reference.component.html',
  styleUrls: ['./view-reference.component.scss']
})
export class ViewReferenceComponent {
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
  viewTransByRefererId: any;
  viewStatus: any;

  displayColumns:string[]=[
    'First Name',
    'Last Name',
    'Mobile',
    'Email',
    'Company',
    'Country',
    'Account Status',
    'Actions'
  ];
  dataSource:any = new MatTableDataSource<Element[]>();
  

  constructor(
    private router:Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location:Location,
    private refererService: RefererService ){

  }
  ngOnInit(){
    this.refererService.selectedUserOnReferer.subscribe((res: any) => {
      this.viewTransByRefererId = res.id;
      this.viewStatus = res.status;
      console.log(this.viewTransByRefererId, this.viewStatus); // Example usage
    });
    let payload = {page: 0, size: 5, status: this.viewStatus, userId: this.viewTransByRefererId};
    this.fetchData(payload);
    console.log('payload',payload);
    
  }
  
  fetchData(payload: any){
    //for testing
    this.refererService.refererById(payload).subscribe((res:any)=>{
      // if(res['success'] == true){
      console.log('RES',res.content);
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
      // }
    })
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    // this.tableDataSource.paginator = this.paginator;
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { status: this.viewStatus, page: this.page.index, size: this.pagesize, userId: this.viewTransByRefererId};
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { status: this.viewStatus, page: this.page.index, size: this.pagesize, userId: this.viewTransByRefererId};
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
    let payload = { status: this.viewStatus, page: 0, size: this.pagesize, userId: this.viewTransByRefererId};
    this.fetchData(payload);
  }
  viewDetails(id){
    this.router.navigate(['admin/dsb/view-details-ref',id]);
  }
}
