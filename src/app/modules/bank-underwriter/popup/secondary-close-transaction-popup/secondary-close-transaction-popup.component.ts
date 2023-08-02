import { Component, Inject, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
// import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';

@Component({
  selector: 'app-secondary-close-transaction-popup',
  templateUrl: './secondary-close-transaction-popup.component.html',
  styleUrls: ['./secondary-close-transaction-popup.component.scss']
})
export class SecondaryCloseTransactionPopupComponent implements OnInit{

  form:FormGroup;
  quoteId:any;

  constructor(
    // private transactionService:TransactionService,
    private router:Router,
    private bankService:BankUnderwriterService,
    public dialogRef: MatDialogRef<SecondaryCloseTransactionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}

    ngOnInit(): void {

      this.form=new FormGroup({
        comment: new FormControl('')
      })
    }
    closeTransaction(){
        this.bankService
      .closeSecondryQuotation({
        transactionId: this.data.transactionId,
        quotationId: this.data.quotationId,
      })
      .subscribe({
        next: (res) => {
           this.close()
        },
      });
    
  }
  close(){
    this.dialogRef.close();
  }
}
