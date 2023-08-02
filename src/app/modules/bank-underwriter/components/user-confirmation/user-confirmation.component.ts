import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-confirmation',
  templateUrl: './user-confirmation.component.html',
  styleUrls: ['./user-confirmation.component.scss']
})
export class UserConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<UserConfirmationComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
  ok() {
    this.close();
  }
}