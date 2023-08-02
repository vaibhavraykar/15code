import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-comment',
  templateUrl: './transaction-comment.component.html',
  styleUrls: ['./transaction-comment.component.scss']
})
export class TransactionCommentComponent implements OnInit{

  form:FormControl;

  constructor(
    public dialogRef:MatDialogRef<TransactionCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{id:string},
    private router:Router,
    private transactionService:TransactionService,
  ){}

  ngOnInit(): void {
    console.log(this.data);
    this.form = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      
    ]);
  }

  cancelTransaction(){
    let data={
      "transactionId":this.data.id,
      "quotationId":"",
      "comments":this.form.value
    }
    console.log(data);
    this.transactionService.cancelTransactions(data).subscribe((res:any)=>{
        console.log(res);
        if(res.success){
          this.dialogRef.close();
          this.router.navigateByUrl('/customer/transactions/new');
        }
    })
  }

}
