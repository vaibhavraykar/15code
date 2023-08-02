import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-refer-congratulation-popup',
  templateUrl: './refer-congratulation-popup.component.html',
  styleUrls: ['./refer-congratulation-popup.component.scss']
})
export class ReferCongratulationPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ReferCongratulationPopupComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    
  }
}
