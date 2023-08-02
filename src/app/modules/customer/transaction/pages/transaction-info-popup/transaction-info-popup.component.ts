import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-info-popup',
  templateUrl: './transaction-info-popup.component.html',
  styleUrls: ['./transaction-info-popup.component.scss']
})
export class TransactionInfoPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<TransactionInfoPopupComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
