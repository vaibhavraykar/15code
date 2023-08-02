import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent {
title=''
type=''
mode='cancel'
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}

    ngOnInit(): void {
this.title=this.data.title
this.type=this.data.type,
this.mode=this.data.mode||'cancel'
    }

  close(res){
    this.dialogRef.close(res);
  }
}
