import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-bank-details',
  templateUrl: './submit-bank-details.component.html',
  styleUrls: ['./submit-bank-details.component.scss']
})
export class SubmitBankDetailsComponent {
  constructor(
    private dialogRef: MatDialogRef<SubmitBankDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)public data:any
  ){

  }
  submit(){
    this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
