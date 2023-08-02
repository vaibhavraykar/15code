import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-email-popup',
  templateUrl: './send-email-popup.component.html',
  styleUrls: ['./send-email-popup.component.scss'],
})
export class SendEmailPopupComponent {
  constructor(private dialogRef: MatDialogRef<SendEmailPopupComponent>) {}

  closePopup() {
    this.dialogRef.close();
  }
}
