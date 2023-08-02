import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecondaryTransactionServices } from '../services/sec-transaction-services.services';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent {
  routelocation:any
  transactionId:any;
  transactionDetails:any;
  transactionAmount: number;
  lcValue: number;
  constructor( 
    private location:Location,
    private route:ActivatedRoute,
    private secTransServices: SecondaryTransactionServices,
    ){
    this.routelocation= this.location
  }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.transactionId = params['id'];
      this.secTransServices.getTransactionById(this.transactionId).subscribe((res:any)=>{
        console.log(res.data[0])
        this.transactionDetails=res?.data[0];
        this.transactionAmount = this.transactionDetails.transactionAmount;
        this.lcValue = this.transactionDetails.retentionAmt;
        console.log('line34',this.transactionAmount);
        console.log('line35',this.lcValue);
      })
    })
  }

  updateCalculatedValue(): void {
    this.secTransServices.setTransactionAmount(this.transactionAmount);
    this.secTransServices.setLcValue(this.lcValue);
  }

  


}
