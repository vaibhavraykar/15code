import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../../services/bank-underwriter.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit{

  transactionId:any;
  transactionDetails:any;
  quoteDetails:any;
  userDetails:any;
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
    private route:ActivatedRoute,
    private transactionService:TransactionService,
    private location:Location,
    private bankService:BankUnderwriterService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    this.route.queryParams.subscribe(param=>{
      this.transactionId=param['transactionId'];
      this.transactionService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
        console.log(res,'restransdeta')
        this.transactionDetails=res.data[0];
        console.log(this.transactionDetails);
        this.findProductName(this.transactionDetails?.requirementType);
      })
      let data={
        "page":0,
        "size":5,
        "transactionId":this.transactionId,
        "status":["ACTIVE","ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED"]
      }
      this.bankService.getQuotation(data).subscribe((res:any)=>{
        console.log(res.data);
        this.quoteDetails=res.data[0].quotationsList[0];
      })
    });
  }

  findProductName(name:any) {
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value===name
    )
    console.log(product)
    this.productName= product.name.toUpperCase();
  }

  back(){
    this.location.back();
  }

  editTransaction(){}

  openFile(){
    window.open(this.transactionDetails.invoiceUpload,'_blank');
  }

  openMaturityDateFile(){
    window.open(this.transactionDetails.refinanceLcUpload,'_blank');
  }

  convertBoolean(e){
    if(e?.toLowerCase() == true || e?.toLowerCase() == 'true' ||e?.toLowerCase() == 'yes' ){
      return 'Yes'
    }else{
      return 'No'
    }
  }

}
