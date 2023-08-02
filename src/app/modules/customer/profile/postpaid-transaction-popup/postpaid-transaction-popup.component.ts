import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PostpaidTransactionSuccessComponent } from '../postpaid-transaction-success/postpaid-transaction-success.component';

@Component({
  selector: 'app-postpaid-transaction-popup',
  templateUrl: './postpaid-transaction-popup.component.html',
  styleUrls: ['./postpaid-transaction-popup.component.scss']
})
export class PostpaidTransactionPopupComponent {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PostpaidTransactionPopupComponent>) {}

  close() {
    this.dialogRef.close(false);
  }
  yes() {
    this.dialogRef.close(true);
    // this.dialog.open(PostpaidTransactionSuccessComponent);
  }
}