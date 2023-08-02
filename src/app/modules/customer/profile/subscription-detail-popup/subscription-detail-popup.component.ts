import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-detail-popup',
  templateUrl: './subscription-detail-popup.component.html',
  styleUrls: ['./subscription-detail-popup.component.scss'],
})
export class SubscriptionDetailPopupComponent {
  
  constructor(
    private dialogRef:MatDialogRef<SubscriptionDetailPopupComponent>
  ) {}

  closePopup(){
    this.dialogRef.close();
  }
}
