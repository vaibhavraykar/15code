import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationPopupComponent } from '../transaction/pages/notification-popup/notification-popup.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  constructor(    
    private dialog: MatDialog,
  ) {
    
  }

  openNotification() {
    this.dialog.open(NotificationPopupComponent);
  }
  
}

