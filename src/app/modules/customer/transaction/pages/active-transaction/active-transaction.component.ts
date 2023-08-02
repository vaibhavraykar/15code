import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { TransactionService } from '../../services/transaction.service';
import { AddVasPopupComponent } from '../add-vas-popup/add-vas-popup.component';
import { TransactionInfoPopupComponent } from '../transaction-info-popup/transaction-info-popup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterTransactionsPopupComponent } from '../filter-transactions-popup/filter-transactions-popup.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export interface PeriodicElement {
  'Quotes recieved': string;
  'Transaction ID':string;
  'Amount':string;
  'Applicant':string;
  'Beneficiary':string;
}

@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.scss']
})
export class ActiveTransactionComponent implements OnInit {
  displayColumns:string[]=['Transaction ID','Currency','Amount','Applicant','Beneficiary','Product','Quotes recieved','Actions']
  // dataSource:any;
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
  last=0;
  groupCompanies:any;
  userDetails:any;
  subsidiaryID:any;
  passcodeUserId:any;
  searchInputValue:any;
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
    private customerService:CustomerServicesService,
    private authService:AuthService
  ) {}

  ngOnInit(){
    this.searchForm=new FormGroup({
      searchInput:new FormControl('')
    })
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userDetails);
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    // })
    let data={
      "page":this.page.index,
      "size":this.page.size,
      "status":["ACTIVE","PENDING",'MAKER_APPROVED'],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
      }
      this.fetchData(data);
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
          if(this.userDetails.subscriberType!='BANK'){
            if(item?.userType=='Applicant'){
            console.log(item.userType,this.getGroupCompanyName(item?.subsidaryId))
        return {
          'Transaction ID':item?.transactionId,
          'Currency':item?.lCCurrency,
          'Amount':item?.lCValue,
          'Applicant':this.getGroupCompanyName(item?.subsidaryId),
          'Beneficiary':item?.beneName,
          'Quotes recieved':item?.quotationCount,
          'Product':this.findProductName(item?.requirementType),
          'Actions':item?.reopen
        };
      }
      else if(!(item?.userType=='Applicant')){
        console.log(item.userType)
        return {
          'Transaction ID':item?.transactionId,
          'Currency':item?.lCCurrency,
          'Amount':item?.lCValue,
          'Applicant':item?.applicantName,
          'Beneficiary':this.getGroupCompanyName(item?.subsidaryId),
          'Quotes recieved':item?.quotationCount,
          'Product':this.findProductName(item?.requirementType)
        };

      }
      else{
        console.log("ELSE")
        return {
          'Transaction ID':item?.transactionId,
          'Currency':item?.lCCurrency,
          'Amount':item?.lCValue,
          'Applicant':(item?.userType!='Applicant')?item?.applicantName:this.getGroupCompanyName(item?.subsidaryId),
          'Beneficiary':(item?.userType!='Applicant')?item?.beneName:this.getGroupCompanyName(item?.subsidaryId),
          'Quotes recieved':item?.quotationCount,
          'Product':this.findProductName(item?.requirementType)
        };
      }
    }
    else{
      return {
        'Transaction ID':item?.transactionId,
          'Currency':item?.lCCurrency,
          'Amount':item?.lCValue,
          'Applicant':item.applicantName,
          'Beneficiary':item?.beneName,
          'Quotes recieved':item?.quotationCount,
          'Product':this.findProductName(item?.requirementType)
      }
    }
        })
        this.dataLength = res.totalElements;
        this.pageIndex = res.pageIndex;
        console.log(this.newDataSource);
        this.customerService.getCreditUpdate.next(true);
        this.authService.getUserDetails().subscribe();
      })

    }


    findProductName(name:any){
      console.log(name)
      let product = this.productsTypes.find((item:any)=>
        item.value===name
      )
      console.log(product)
      return product?.name?.toUpperCase();
    }

    getGroupCompanyName(id:any){
      console.log(this.groupCompanies)
      let companyName = this.groupCompanies?.businessDetails.find((item:any)=>item.id==id)
      console.log(companyName)
      return companyName?.companyName;
    }

    editSelected(e:any){
      console.log(e,`/customer/transactions/view?transactionId=${e}`);
      this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`);
    }

    downloadSelected(e:any){
      console.log(e);
      let payload={
        "page":this.page.index,
        "size":this.page.size,
        "status":["ACTIVE","PENDING",'MAKER_APPROVED'],
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

    pagePrevious() {
      this.page.index = this.page.index - 1;
      let payload = { "status": ["ACTIVE","PENDING",'MAKER_APPROVED'],
      "page": this.page.index,
      'size': this.page.size,
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
     };
      console.log(payload);
      this.fetchData(payload);
    }
    pageNext() {
      this.page.index = this.page.index + 1;
      let payload = { 'status': ["ACTIVE","PENDING",'MAKER_APPROVED'],
      'page': this.page.index,
      'size': this.page.size ,
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""};
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

    downloadCSV(){
      console.log(this.page);
      let payload={
        "page":this.page.index,
        "size":this.page.size,
        "status":["ACTIVE","PENDING",'MAKER_APPROVED'],
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
      console.log(e.target.value)
      this.searchInputValue=e.target.value;
      this.page.index=0;
      let data={
        "page":this.page.index,
        "size":this.page.size,
        "status":["ACTIVE","PENDING",'MAKER_APPROVED'],
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
        "size":this.page.size,
        "status":["ACTIVE","PENDING",'MAKER_APPROVED'],
        "subscriberType": this.userDetails.subscriberType,
        "subsidaryId":"",
        "passCodeUserId":"",
        "transactionId":""
        }
        this.fetchData(data);
    }

    filter(){
      console.log("Enter")
      const filterpopup = this.dialog.open(FilterTransactionsPopupComponent,{data:{
        from:"ACTIVE_TRANSACTION"
      }});
      filterpopup.afterClosed().subscribe(res=>{
        console.log(res);
        this.subsidiaryID=res.data.subsidaryId;
        this.passcodeUserId=res.data.passcodeUserId;
        this.page.index=0;
        let data={
          "page":this.page.index,
          "size":this.page.size,
          "status":["ACTIVE","PENDING",'MAKER_APPROVED'],
          "subscriberType": this.userDetails.subscriberType,
          "subsidaryId":this.subsidiaryID?`${this.subsidiaryID}`:'',
          "passCodeUserId":this.passcodeUserId?this.passcodeUserId:'',
          "transactionId":""
          }
          this.fetchData(data);
      })
    }

    openQuotes(id:any,quoteCount:any){
      if(quoteCount>0){
        console.log(id);
        this.router.navigateByUrl(`/customer/transactions/quote?transactionId=${id}`)
      }
    }

    onPageChange(event:any){
      console.log(event)
      this.page.index = event.pageIndex;
      let payload = {
        page: this.page.index,
        size: event.pageSize,
        status: ['ACTIVE', 'PENDING','MAKER_APPROVED'],
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload)
    }
}
