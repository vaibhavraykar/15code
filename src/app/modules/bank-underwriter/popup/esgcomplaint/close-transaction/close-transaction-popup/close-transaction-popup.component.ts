import { Component, Inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-close-transaction-popup',
  templateUrl: './close-transaction-popup.component.html',
  styleUrls: ['./close-transaction-popup.component.scss']
})
export class CloseTransactionPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<CloseTransactionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}
  close(){
    {
      this.dialogRef.close();
    }
    
  }
}
