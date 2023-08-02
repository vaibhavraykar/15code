import { Component,Input,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute} from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-quoatation-list',
  templateUrl: './quoatation-list.component.html',
  styleUrls: ['./quoatation-list.component.scss']
})
export class QuoatationListComponent {
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
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;
  transactionId:any;
  viewData:any;

  displayColumns:string[]=[
    'Transaction Id',
    'Bank',
    'Total Quote',
    'Status',
    'Valid Till',
  ];
  dataSource:any = new MatTableDataSource<Element[]>();
  

  constructor(
    private router:Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location:Location,
    private factorService: FactoringService){

  }
  ngOnInit(){
      
    this.transactionId=this.route.snapshot.paramMap.get('id');
    console.log(this.transactionId);
    this.viewDetails();
    
  }
  
  viewDetails(){
    //for testing
    this.factorService.quoatationById(this.transactionId).subscribe((res:any)=>{
      if(res['success'] == true){
      console.log('RES',res.data);
      this.data = res.data;
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
      }
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
  viewQuotation(quotationId:any){
    this.router.navigate(['admin/factoring/view-quotation',quotationId]);
  }
  back(): void {
    this.location.back();
  } 
}
