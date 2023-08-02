import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
@Component({
  selector: 'app-buying-transaction-detail',
  templateUrl: './buying-transaction-detail.component.html',
  styleUrls: ['./buying-transaction-detail.component.scss']
})
export class BuyingTransactionDetailComponent implements OnInit{

  transactionDetails:any ={}
  buttonShow:boolean = false;
  constructor(
    private location:Location,
    private route : ActivatedRoute,
    private bs :BankUnderwriterService,
    private ts :TransactionService,
    private router: Router,
  ) {
    let navigation = this.router.getCurrentNavigation();
    const routerState: any = navigation?.extras?.state || { from: '' };
    this.route.params.subscribe({
      next:(value:any) =>{
        this.fetchData(value.id)
      },
    })
    if(routerState?.from==='active'){
      this.buttonShow =true;
    }else if(routerState?.from==='viewDetails'){
      this.buttonShow =false;
    } 
    else {
      this.location.back();
    }
  }
  ngOnInit(): void {}
  back(){
    this.location.back();
  }

  fetchData(id:string){
    this.ts.getSecondryTransactionByID(id).subscribe({
      next:(value:any)=> {
        const {data} = value
        this.transactionDetails= data[0]

      },
    })
  }
  viewQuote(transactionId:any){
    console.log("checkiing",transactionId)
    this.router.navigateByUrl(`/bank-underwriter/buying-quote/${transactionId}`);
  }
}
