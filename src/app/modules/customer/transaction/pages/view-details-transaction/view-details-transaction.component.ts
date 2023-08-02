import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-view-details-transaction',
  templateUrl: './view-details-transaction.component.html',
  styleUrls: ['./view-details-transaction.component.scss']
})
export class ViewDetailsTransactionComponent implements OnInit{

  transactionId:any;
  transactionDetails:any;
  groupCompanies:any;
  userDetails:any;
  subscriber:any;
  productName:any;

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
    private router:Router,
    private route:ActivatedRoute,
    private transactionService:TransactionService,
    private customerService:CustomerServicesService,
    private location:Location,
  ){}

  ngOnInit(): void {
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    this.subscriber = this.userDetails.subscriberType;
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    console.log(this.groupCompanies);
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    // })
    this.route.queryParams.subscribe(param=>{
      this.transactionId=param['transactionId'];
    });
    console.log(this.transactionId);
    this.transactionService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
      console.log(res);
      this.transactionDetails=res.data[0];
      this.findProductName(this.transactionDetails?.requirementType)
    })
  }

  findProductName(name:any) {
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value===name
    )
    console.log(product)
    this.productName= product.name.toUpperCase();
  }

  getGroupCompany(id:any){
    let companyName = this.groupCompanies?.businessDetails.find((item:any)=>item.id==id)
    // console.log(companyName);
    return companyName?.companyName;
  }

  openFile(){
    window.open(this.transactionDetails.invoiceUpload,'_blank');
  }

  back(): void {
    this.location.back();
  }

  clone() {
    this.router.navigateByUrl(`/customer/transactions/new`);
  }

  editTransaction(){
    console.log('Clicked Edit',this.transactionId);
    this.router.navigateByUrl(`/customer/transactions/new?transactionId=${this.transactionId}`);
    // this.router.navigateByUrl('/customer/transactions/new');
  }


  reopen(){
    this.transactionService.reopenTransaction(this.transactionId).subscribe((res:any)=>{
      console.log(res);
      if(res.success){
        this.router.navigateByUrl('/customer/transactions/active-transaction');
      }
    })
  }

  openMaturityDateFile(){
    window.open(this.transactionDetails.refinanceLcUpload,'_blank');
  }

  cancel(){
    let data = {
      "transactionId":this.transactionId
    }
    this.transactionService.cancelTransactions(data).subscribe((res:any)=>{
      if(res.success){
        this.location.back();
      }
    })
  }

  convertBoolean(e){
    // console.log(e)
    if(e?.toLowerCase() == true || e?.toLowerCase() == 'true' ||e?.toLowerCase() == 'yes' ){
      return 'Yes'
    }else{
      return 'No'
    }
  }

}
