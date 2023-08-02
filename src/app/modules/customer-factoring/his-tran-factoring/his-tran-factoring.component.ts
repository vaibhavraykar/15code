import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomerFactoringService } from '../customer-factoring.service';
export interface PeriodicElement {
  Assignor_Seller: String;
  Debotr_Buyer:string;
  Amount:Number;
  Due_Date:String;
  Invoice_Date:String;
  Status:String;
}
@Component({
  selector: 'app-his-tran-factoring',
  templateUrl: './his-tran-factoring.component.html',
  styleUrls: ['./his-tran-factoring.component.scss']
})
export class HisTranFactoringComponent {
  public pagerConfig: any;
  public pageSizeOptions = [5, 10, 20, 30];
  // ,'View','Select','Submit'
  public selectedCheckboxes = [];
  value:any = 'Interested';
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
  displayColumns:string[];
  noOfElements: any;
  data:any=[];
  last:any;  constructor(private store: Store,private router: Router,private custFactService:CustomerFactoringService
    ){
      this.displayColumns=['Assignor_Seller','Debotr_Buyer','Amount','Invoice_Date','Due_Date','Status','Comment','View'];
      let payload = { status: 'INACTIVE', page: 0, size: 5};
      this.getList(payload);
    }
  onSelect(e){
    console.log(e.value);
    this.value = e.value;
  }
  viewDetails(id){
    this.router.navigate(['cust/view-tran/',id]);
  }
  getList(payload){
    this.custFactService.getAllTransactionList(payload).subscribe((res:any)=>{
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
    let payload = {page: this.page.index, size: 5,status:'INACTIVE'};
    console.log(payload);
    this.getList(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {page: this.page.index, size: 5,status:'INACTIVE'};
    console.log(payload);
    this.getList(payload);
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
}
