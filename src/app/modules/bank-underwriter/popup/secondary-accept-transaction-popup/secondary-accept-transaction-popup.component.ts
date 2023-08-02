import { Component, Inject, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
// import { BankUnderwriterService } from '../../../services/bank-underwriter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { SellingQuoteAcceptedComponent } from '../selling-quote-accepted/selling-quote-accepted.component';

@Component({
  selector: 'app-secondary-accept-transaction-popup',
  templateUrl: './secondary-accept-transaction-popup.component.html',
  styleUrls: ['./secondary-accept-transaction-popup.component.scss'],
})
export class SecondaryAcceptTransactionPopupComponent implements OnInit {
  form: FormGroup;
  quoteId: any;

  constructor(
    // private transactionService:TransactionService,
    private router: Router,
    private bankService: BankUnderwriterService,
    public dialogRef: MatDialogRef<SecondaryAcceptTransactionPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      comment: new FormControl('', Validators.required),
    });
  }
  closeTransaction() {
    if (this.form.invalid) {
      // Handle form validation error
      return;
    }
    let data = {
      transactionId: this.data.transactionId,
      quotationId: this.data.quotationId,
      comments: this.form.controls['comment'].value,
    };
    this.bankService.acceptSecondryQuotation(data).subscribe((res: any) => {
      this.dialogRef.close(true);
      let quoteAcceptpop = this.dialog.open(SellingQuoteAcceptedComponent,{
        disableClose: true,
        data:{
          quotationId:res?.data[0].quotationList,
          res:res
        }
      
      // this.router.navigateByUrl('/bank-underwriter/secondary-transaction-details')
    });
    
    });
  }
  close() {
    this.dialogRef.close();
  }
}
