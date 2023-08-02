import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-more-options-popup',
  templateUrl: './more-options-popup.component.html',
  styleUrls: ['./more-options-popup.component.scss']
})
export class MoreOptionsPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<MoreOptionsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)  {}
  close(){
    {
      this.dialogRef.close();
    }
    
  }
}
