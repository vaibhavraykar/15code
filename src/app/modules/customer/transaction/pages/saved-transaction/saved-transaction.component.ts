import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterTransactionsPopupComponent } from '../filter-transactions-popup/filter-transactions-popup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { TransactionCommentComponent } from '../new-transaction/transaction-comment/transaction-comment.component';
import { CustomerServicesService } from '../../../services/customer-services.service';
import * as _moment from 'moment';
export interface PeriodicElement {
  Product: string;
  'Transaction ID': string;
  Date: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {Draft: 'CU231121BGDCONF1893', Product: 'Confirmation', Date: 'DD/MM/YYYY', },
//   {Draft: 'CU231121BGDCONF1893', Product: 'Confirmation', Date: 'DD/MM/YYYY', },
//   {Draft: 'CU231121BGDCONF1893', Product: 'Confirmation', Date: 'DD/MM/YYYY', },
 
// ];

@Component({
  selector: 'app-saved-transaction',
  templateUrl: './saved-transaction.component.html',
  styleUrls: ['./saved-transaction.component.scss']
})
export class SavedTransactionComponent  implements OnInit{
  displayColumns: string[] = ['Transaction ID', 'Product', 'Date' ];
  // dataSource = ELEMENT_DATA;
  dataSource:any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  newDataSource:PeriodicElement[];
  totalItems:number;
  totalPages:number;
  dataLength: any = 0;
  pageIndex: any = 0;
  userDetails:any;
  subsidiaryID:any;
  passcodeUserId:any;
  searchForm:FormGroup;

  productsTypes:any[] =[
    { name:'Confirmation',value:'CONFIRMATION'},
    { name:'Discounting',value:'DISCOUNTING'},
    { name:'Confirmation & Discounting',value:'CONFIRMANDDISCOUNT'},
    { name:'Refinancing',value:'REFINANCE'},
    { name:'Bankers Acceptance',value:'BANKER'},
    { name:'Bank Guarantee',value:'BANKGUARANTEE'},
    { name:'Avalisation',value:'BILLAVALISATION'}
  ]

  constructor(
    public dialog: MatDialog,
    private router:Router,
    private transactionService:TransactionService,
    private customerService:CustomerServicesService
  ) {}

  ngOnInit(){
    this.searchForm=new FormGroup({
      searchInput:new FormControl('')
    })
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userDetails);
      
    let data={
      "page":0,
      "size":5,
      "status":["DRAFT"],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
      }
      this.fetchData(data);
    }

    findProductName(name:any) {
      console.log(name)
      let product = this.productsTypes.find((item:any)=>
        item.value===name
      )
      console.log(product)
      return product.name.toUpperCase();
    }

  fetchData(payload:any){
    this.transactionService.findTransactions(payload).subscribe((res:any)=>{
      let response=res.data;
      this.page.page=res.page;
      this.page.size=res.size;
      this.page.totalElements=res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems=res.totalElements;
      this.totalPages=res.totalPages;
      console.log(response);
      this.newDataSource=response.map((item:any)=>{
      return {
        // 'ID':item?.id,
        'Transaction ID':item?.transactionId,
        "Product":this.findProductName(item?.requirementType),
        "Date":_moment(item?.insertedDate).format('DD-MM-YYYY'),
      };
      })
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
        this.customerService.getCreditUpdate.next(true);
    })
    console.log(this.newDataSource);
    // this.dataSource.push(this.newDataSource);
  }

  editSelected(e:any){
    console.log(e,`/customer/transactions/view?transactionId=${e}`);
    this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`);
  }

  deleteSelected(e:any){
    console.log(e);
    const popup = this.dialog.open(TransactionCommentComponent,{
      width: '500px',
      height: '350px',
      data:{
        'id':e
      }
    })
  }

  downloadSelected(e:any){
    console.log(e);
    let payload={
      "page":0,
      "size":5,
      "status":["DRAFT"],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":e
    }
    this.transactionService.generateCSV(payload).subscribe((res:any)=>{
      console.log(res.data);
      window.open(res.data[0].url)
    })
  }

  pagePrevious(e: any) {
    this.page.index = this.page.index - 1;
    let payload = { "status": ['DRAFT'], 
    "page": this.page.index,  
    'size': 5 ,
    "subscriberType": this.userDetails.subscriberType,
    "subsidaryId":"",
    "passCodeUserId":"",
    "transactionId":""
   };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext(e: any) {
    this.page.index = this.page.index + 1;
    let payload = { 'status': ['DRAFT'], 
    'page': this.page.index, 
    'size': 5 ,
    "subscriberType": this.userDetails.subscriberType,
    "subsidaryId":"",
    "passCodeUserId":"",
    "transactionId":""};
    console.log(payload);
    this.fetchData(payload);
  }

  downloadCSV(){
    console.log(this.page);
    let payload={
      "page":this.page.index,
      "size":5,
      "status":["DRAFT"],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
    }
    this.transactionService.generateCSV(payload).subscribe((res:any)=>{
      console.log(res.data);
      window.open(res.data[0].url)
    })
  }

  search(e:any){
    this.page.index=0;
    console.log(e.target.value)
    let data={
      "page":this.page.index,
      "size":5,
      "status":["DRAFT"],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":e.target.value
      }
      this.fetchData(data);
  }

  reset(){
    this.page.index=0;
    let data={
      "page":this.page.index,
      "size":5,
      "status":["DRAFT"],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
      }
      this.fetchData(data);
  }

  filter(){
    console.log("Enter")
    const filterpopup = this.dialog.open(FilterTransactionsPopupComponent,{
      data:{
        from:'SAVED_TRANSACTION'
      }
    });
    filterpopup.afterClosed().subscribe(res=>{
      console.log(res);
      this.subsidiaryID=res.data.subsidaryId;
      this.passcodeUserId=res.data.passcodeUserId;
      this.page.index=0;
      let data={
        "page":this.page.index,
        "size":5,
        "status":["DRAFT"],
        "subscriberType": this.userDetails.subscriberType,
        "subsidaryId":this.subsidiaryID?`${this.subsidiaryID}`:'',
        "passCodeUserId":this.passcodeUserId?this.passcodeUserId:'',
        "transactionId":""
        }
        this.fetchData(data);
    })
  }
}
