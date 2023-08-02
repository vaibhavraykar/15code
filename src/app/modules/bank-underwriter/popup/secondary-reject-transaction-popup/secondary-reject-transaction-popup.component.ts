import { Component, Inject, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
// import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';

@Component({
  selector: 'app-secondary-accept-transaction-popup',
  templateUrl: './secondary-reject-transaction-popup.component.html',
  styleUrls: ['./secondary-reject-transaction-popup.component.scss'],
})
export class SecondaryRejectTransactionPopupComponent implements OnInit {
  form: FormGroup;
  quoteId: any;

  constructor(
    // private transactionService:TransactionService,
    private router: Router,
    private bankService: BankUnderwriterService,
    public dialogRef: MatDialogRef<SecondaryRejectTransactionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // if(this.data){
    //   console.log(this.data.transactionId);
    //   let data={
    //     "page":0,
    //     "size":5,
    //     "transactionId":this.data.transactionId,
    //     "status":"ACCEPTED"
    //   }
    //   this.bankService.getQuotation1(data).subscribe((res:any)=>{
    //     console.log(res);
    //     this.quoteId=res.data[0].quotationId;
    //   })
    // }
    this.form = new FormGroup({
      comment: new FormControl(''),
    });
  }
  closeTransaction() {
    let data = {
      transactionId: this.data.transactionId,
      quotationId: this.data.quotationId,
      comments: this.form.controls['comment'].value,
    };
    this.bankService.rejectSecondryQuotation(data).subscribe((res: any) => {
      this.dialogRef.close(true);
    });
  }
  close() {
    this.dialogRef.close();
  }
}
