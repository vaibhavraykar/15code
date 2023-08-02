import { Component, Inject, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-transaction-popup',
  templateUrl: './close-transaction-popup.component.html',
  styleUrls: ['./close-transaction-popup.component.scss']
})
export class CloseTransactionPopupComponent implements OnInit{

  form:FormGroup;
  quoteId:any;

  constructor(
    private transactionService:TransactionService,
    private router:Router,
    private bankService:BankUnderwriterService,
    public dialogRef: MatDialogRef<CloseTransactionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}

    ngOnInit(): void {
      if(this.data){
        console.log(this.data.transactionId);
        let data={
          "page":0,
          "size":5,
          "transactionId":this.data?.transactionId,
          "status":["ACCEPTED"]
        }
        this.bankService.getQuotation(data).subscribe((res:any)=>{
          console.log(res);
          this.quoteId = res.data[0]?.quotationsList[0]?.quotationId;
        })
      }
      this.form=new FormGroup({
        comment: new FormControl('')
      })
    }
    closeTransaction(){
      let data={
        "transactionId": this.data?.transactionId,
        "quotationId": this.quoteId || '',
        "comments":this.form.controls['comment'].value
      }
      this.bankService.closeQuotation(data).subscribe((res:any)=>{
        console.log(res);
      })
     this.close();
    
  }
  close(){
    this.dialogRef.close();
  }
}
