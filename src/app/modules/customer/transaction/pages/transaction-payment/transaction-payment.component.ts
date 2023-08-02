import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-payment',
  templateUrl: './transaction-payment.component.html',
  styleUrls: ['./transaction-payment.component.scss']
})
export class TransactionPaymentComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionPaymentComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
