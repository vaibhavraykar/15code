import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankQuotePopupComponent } from './bank-quote-popup/bank-quote-popup.component';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bank-quote-details',
  templateUrl: './bank-quote-details.component.html',
  styleUrls: ['./bank-quote-details.component.scss']
})
export class BankQuoteDetailsComponent implements OnInit{

  transactionId:any;
  transactionDetails:any;
  groupCompanies:any;
  quoteId:any;
  quoteDetails:any;

  constructor(
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public transactinService:TransactionService,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));

    this.route.queryParams.subscribe(param=>{
      this.transactionId=param['transactionId'];
      this.transactinService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
        this.transactionDetails=res.data[0];
        this.transactionId=res.data[0].transactionId;
      })
      let data ={
        "page":0,
        "size":5,
        "transactionId":this.transactionId,
        "status":["PLACED",'FREEZE']
      }
      this.transactinService.findQuotations(data).subscribe((res:any)=>{
        this.quoteDetails=res.data;
        console.log(this.quoteDetails);
      })

    })
    // this.transactinService.getQuotationById(this.transactionId).subscribe((res:any)=>{
    //   this.transactionDetails=res.data[0];
    //   this.transactionId=res.data[0].transactionId;
    // })
  }

  getGroupCompany(id:any){
    let companyName = this.groupCompanies?.businessDetails.map((item:any)=>{
      if(item.id=id){
        return item.companyName;
      }
    })
    return companyName;
  }

  open(id:any) {
    console.log(this.transactionDetails)
    const popup = this.dialog.open(BankQuotePopupComponent,{
      data:{
        transactionId:this.transactionId,
        details:this.transactionDetails,
        quoteId:id
      }
    });
  }

  goBack(){
    this.location.back();
  }

}
