import { Component ,Input,OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-banUnderwriter-quotation',
  templateUrl: './banUnderwriter-quotation.component.html',
  styleUrls: ['./banUnderwriter-quotation.component.scss']
})
export class BankUnderwriterQuotationComponent implements OnInit{

  transactionId: any;
  data:any[]=[];
  selected?:any[];
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
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() pageData?: any;
  getData: any;
  tableDataSource: any;
  selectdID: any = [];
  noOfElements: any;
  displayColumns:string[]=[
    'Transaction Id',
    // 'Bank',
    'Total Quote',
    'Status',
    'Valid Till',
    'Action'
  ];
  dataSource:any = new MatTableDataSource<Element[]>();
  payload:any;
  pagesize: any = 5;
  last:any;



  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService){
  }
  ngOnInit(){
    this.transactionId=this.route.snapshot.paramMap.get('id');
    this.payload = {page:0, size: 5 ,status : 'ALL', mid : this.transactionId}
    this.viewDetails(this.payload);
  }

  viewDetails(payload){

    this.customerService.baauquotationById(payload).subscribe((res:any)=>{
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
    })
  }
  back(): void {
    this.location.back()
  } 
  viewQuotation(quotationId:any){
    this.router.navigate(['admin/dsb/baau/quotation/view',quotationId]);
  }
  
  pagePrevious() {
    this.page.index = this.page.index - 1;
    this.payload = {page: 0, size: this.pagesize, status: "ALL",  mid : this.transactionId };
    this.viewDetails(this.payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.payload = {page: 0, size: this.pagesize, status: "ALL",  mid : this.transactionId };
    this.viewDetails(this.payload);
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
    this.payload = {page: 0, size: this.pagesize, status: "ALL",  mid : this.transactionId };
    this.viewDetails(this.payload);

  }
  viewDetailsOfQuotation(mtransactionId:any){
    this.router.navigate(['admin/factoring/view-trans-list',mtransactionId]);
  }
}