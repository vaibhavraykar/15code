import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-success',
  templateUrl: './reject-success.component.html',
  styleUrls: ['./reject-success.component.scss'],
})
export class RejectSuccessComponent {
  constructor(
    private location: Location,
    public dialogRef: MatDialogRef<RejectSuccessComponent>
  ) {}

  yes() {
    this.dialogRef.close();
    this.location.back();
  }
}
