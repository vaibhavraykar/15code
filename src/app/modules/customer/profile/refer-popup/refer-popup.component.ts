import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReferCongratulationPopupComponent } from '../refer-congratulation-popup/refer-congratulation-popup.component';

@Component({
  selector: 'app-refer-popup',
  templateUrl: './refer-popup.component.html',
  styleUrls: ['./refer-popup.component.scss']
})
export class ReferPopupComponent {
  countries = [
    {
      name: "Maharashtra"
    },
    {
      name: 'Gujarat'
    },
    {
      name: 'Madhya Pradesh'
    }
  ]
  constructor(
    public dialogRef: MatDialogRef<ReferPopupComponent>,
    public dialog: MatDialog,
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.close();
    this.dialog.open(ReferCongratulationPopupComponent);
  }
}

