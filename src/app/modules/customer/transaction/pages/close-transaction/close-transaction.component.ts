import { Component, Inject, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUnderwriterService } from 'src/app/modules/bank-underwriter/services/bank-underwriter.service';

@Component({
  selector: 'app-close-transaction',
  templateUrl: './close-transaction.component.html',
  styleUrls: ['./close-transaction.component.scss']
})
export class CloseTransactionComponent implements OnInit{

  form:FormGroup;
  quoteId:any;

  constructor(
    private transactionService:TransactionService,
    private bankService:BankUnderwriterService,
    private router:Router,
    public dialogRef: MatDialogRef<CloseTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}

    ngOnInit(): void {
      if(this.data){
        console.log(this.data.transactionId);
        let data={
          "page":0,
          "size":5,
          "transactionId":this.data.transactionId,
          "status":["ACCEPTED"]
        }
        // this.transactionService.findTransactions(data).subscribe((res:any)=>{
        //   console.log(res);
        //   this.quoteId=res.data[0].quotationId;
        // })
      }
      this.form=new FormGroup({
        comment: new FormControl('')
      })
    }
    closeTransaction(){
      let data={
        "transactionId": this.data.transactionId,
        "comments":this.form.controls['comment'].value
      }
      this.transactionService.closeTransaction(data).subscribe((res:any)=>{
        console.log(res);
      })
     this.close();
    
  }
  close(){
    this.dialogRef.close();
  }
}
