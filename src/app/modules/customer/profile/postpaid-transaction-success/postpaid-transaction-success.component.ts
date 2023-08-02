import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-postpaid-transaction-success',
  templateUrl: './postpaid-transaction-success.component.html',
  styleUrls: ['./postpaid-transaction-success.component.scss']
})
export class PostpaidTransactionSuccessComponent {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PostpaidTransactionSuccessComponent>) {}

  close() {
    this.dialogRef.close(false);
  }
  yes() {
    this.dialogRef.close(true);
  }
}
