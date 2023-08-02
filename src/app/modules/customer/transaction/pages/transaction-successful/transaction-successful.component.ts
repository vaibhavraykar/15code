import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-successful',
  templateUrl: './transaction-successful.component.html',
  styleUrls: ['./transaction-successful.component.scss']
})
export class TransactionSuccessfulComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionSuccessfulComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
