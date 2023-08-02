import { Component, Inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-esg-complaint-popup',
  templateUrl: './esg-complaint-popup.component.html',
  styleUrls: ['./esg-complaint-popup.component.scss']
})
export class EsgComplaintPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<EsgComplaintPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}
  close(){
    {
      this.dialogRef.close();
    }
    
  }
}
