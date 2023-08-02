import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterPopupComponent } from '../../popup/esgcomplaint/filter/filter-popup/filter-popup.component';
import { MoreOptionsPopupComponent } from '../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component';
import { EsgComplaintPopupComponent } from '../../popup/esgcomplaint/esg-complaint/esg-complaint-popup/esg-complaint-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';

  export interface PeriodicElement {
    transactionid: number;
    date: string;
    issuingbank: string;
    issuingcountry: string;
    product: string;
    amount: number;
    applicant: string;
    beneficiary: string;
    transactionvalidity: string;
    esgompliant: string;
    action: string;
  }

  @Component({
    selector: 'app-new-transaction',
    templateUrl: './new-transaction.component.html',
    styleUrls: ['./new-transaction.component.scss']
  })
  export class NewTransactionComponent implements OnInit{
    isFilterByBeneCountry=false
  displayedColumns: string[] = ['transactionid', 'date', 'issuingbank', 'issuingcountry', 'product','currency', 'amount', 'applicant', 'beneficiary', 'transactionvalidity', 'esgompliant', 'action' ];
  dataSource:PeriodicElement[]= [];
  activeTransactionData:any;
  totalItems:number;
  totalPages:number;
  dataLength: any = 0;
  pageIndex: any = 0;
  last:any;
  userDetails:any;
  groupCompanies:any;
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

  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };


  constructor(
    public dialog:MatDialog,
    private router: Router,
    private bankService: BankUnderwriterService,
    private transactionService:TransactionService,
    ) {
  }


  ngOnInit() {
    this.searchForm=new FormGroup({
      searchInput: new FormControl('')
    })
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    console.log(this.groupCompanies);
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userDetails);
    let data={
      "page":this.page.index,
      "size":this.page.size,
      "status":["ACTIVE"],
      "subscriberType": this.userDetails?.subscriberType,
      "userId":"",
      "transactionId":""
    }
    this.fetchData(data);

  }

  findProductName(name:any){
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value.toLowerCase()===name.toLowerCase()
    )
    console.log(product)
    return product?.name?.toUpperCase()||'';
  }

  fetchData(data:any){
    this.bankService.getQuotation(data).subscribe((res:any)=>{
      this.activeTransactionData=res.data;
      this.page.page=res.page;
      this.page.size=res.size;
      this.page.totalElements=res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems=res.totalElements;
      this.totalPages=res.totalPages;
      this.dataSource = this.activeTransactionData.map((item:any)=>{
        if(!item.applicantName){
          return {
            'transactionid':item?.transactionId,
            'currency': item?.lCCurrency,
            'amount':item?.lCValue,
            'applicant':'',
            'beneficiary':item?.beneName,
            'date':item?.insertedDate,
            'issuingbank':item?.lCIssuanceBank,
            'issuingcountry':item?.lCIssuanceCountry,
            'product':this.findProductName(item?.requirementType),
            'transactionvalidity':item?.validity,
            'esgompliant':item?.isESGComplaint,
            'action':''

          };
        }
        else if(!item.beneName){
          return {
            'transactionid':item?.transactionId,
            'currency': item?.lCCurrency,
            'amount':item?.lCValue,
            'applicant':item?.applicantName,
            'beneficiary':'',
            'date':item?.insertedDate,
            'issuingbank':item?.lCIssuanceBank,
            'issuingcountry':item?.lCIssuanceCountry,
            'product':this.findProductName(item?.requirementType),
            'transactionvalidity':item?.validity,
            'esgompliant':item?.isESGComplaint,
            'action':''

          };
        }
        else{
          return {
            'transactionid':item?.transactionId,
            'currency': item?.lCCurrency,
            'amount':item?.lCValue,
            'applicant':item?.applicantName?item?.applicantName:'',
            'beneficiary':item?.beneName?item?.beneName:'',
            'date':item?.insertedDate,
            'issuingbank':item?.lCIssuanceBank,
            'issuingcountry':item?.lCIssuanceCountry,
            'product':this.findProductName(item?.requirementType),
            'transactionvalidity':item?.validity,
            'esgompliant':item?.isESGComplaint,
            'action':''

          };
        }
      })
        this.bankService.getCreditUpdate.next(true);
    })
  }

  // Get Page Details for Pagination
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

  // To go to the previous page
  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
    "page": this.page.index,
    'size': this.page.size ,
    "status":["ACTIVE"],
    "subscriberType": this.userDetails.subscriberType,
    "userId":"",
    "transactionId":""
   };
    console.log(payload);
    this.fetchData(payload);
  }

  // To go to the next page
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
    'page': this.page.index,
    'size': this.page.size ,
    "status":["ACTIVE"],
    "subscriberType": this.userDetails.subscriberType,
    "userId":"",
    "transactionId":""
  };
    console.log(payload);
    this.fetchData(payload);
  }

  // To Got to Quote Place Quote
  placeQuote(id:any) {
    this.router.navigateByUrl(`/bank-underwriter/place-quote?transactionId=${id}`);
  }

  // View Details
  viewDetails(id:any){
    this.router.navigateByUrl(`/bank-underwriter/transaction-details?transactionId=${id}`)
  }

  filterpopup(){
   const dialog = this.dialog.open(FilterPopupComponent,{
      data:{
        from:'newReqeuest',
        isFilterByBeneCountry:this.isFilterByBeneCountry
      }
    })
    dialog.afterClosed().subscribe({
      next:(res:any)=>{
        let data={
          "page":this.page.index,
          "size":this.page.size,
          "status":["ACTIVE"],
          "subscriberType": this.userDetails?.subscriberType,
          "userId":"",
          "transactionId":"",

        }
        if(res.isFilterByBeneCountry){
          data['isFilterByBeneCountry']=res.isFilterByBeneCountry
        }
        this.fetchData(data);
        this.isFilterByBeneCountry=res.isFilterByBeneCountry
      }
    })
  }
  moreoptions(){
    this.dialog.open(MoreOptionsPopupComponent)
  }
  esgcomplaintpopup(){
    this.dialog.open(EsgComplaintPopupComponent)
  }
  // searchInput: FormControl;


  search(e: any) {
    console.log(e.target.value);
    let data={
      "page":this.page.index,
      "size":this.page.size,
      "status":["ACTIVE"],
      "subscriberType":this.userDetails.subscriberType,
      "userId":"",
      "transactionId":e.target.value
    }
    this.fetchData(data);
  }

  // Generate and download CSV
  downloadTransactions(){
    console.log(this.page);
      let payload={
        "page":this.page.index,
        "size":this.page.size,
        "status":["ACTIVE"],
        "subscriberType": this.userDetails.subscriberType,
        "subsidaryId":"",
        "passCodeUserId":"",
        "transactionId":""
      }

      if(this.isFilterByBeneCountry){
        payload['isFilterByBeneCountry']=this.isFilterByBeneCountry
      }
      this.bankService.generateCSV(payload).subscribe((res:any)=>{
        console.log(res.data);
        window.open(res.data[0].url)
      })
  }
  refresh(){this.page.index=0;
    let data={
      "page":this.page.index,
      "size":this.page.size,
      "status":["ACTIVE"],
      "subscriberType": this.userDetails?.subscriberType,
      "userId":"",
      "transactionId":""
    }
    this.fetchData(data);
    this.isFilterByBeneCountry=false
  }
  convertBoolean(e){
    if(e?.toLowerCase() == true || e?.toLowerCase() == 'true' ||e?.toLowerCase() == 'yes' ){
      return 'Yes'
    }else{
      return 'No'
    }
  }

  onPageChange(event:any){
      console.log(event)
      this.page.index = event.pageIndex;
      let payload = {
        page: this.page.index,
        size: event.pageSize,
        status: ['ACTIVE', 'PENDING'],
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload)
    }
}
