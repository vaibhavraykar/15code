import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-pending',
  templateUrl: './transaction-pending.component.html',
  styleUrls: ['./transaction-pending.component.scss']
})
export class TransactionPendingComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionPendingComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
