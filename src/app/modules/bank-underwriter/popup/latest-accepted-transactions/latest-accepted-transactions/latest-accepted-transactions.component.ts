import { Component, Inject  } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-latest-accepted-transactions',
  templateUrl: './latest-accepted-transactions.component.html',
  styleUrls: ['./latest-accepted-transactions.component.scss']
})
export class LatestAcceptedTransactionsComponent {
  constructor(
    public dialogRef: MatDialogRef<LatestAcceptedTransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}
  close(){
    {
      this.dialogRef.close();
    }
    
  }

}
