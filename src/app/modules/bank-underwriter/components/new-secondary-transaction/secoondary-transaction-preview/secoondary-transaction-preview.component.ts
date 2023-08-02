import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-secoondary-transaction-preview',
  templateUrl: './secoondary-transaction-preview.component.html',
  styleUrls: ['./secoondary-transaction-preview.component.scss'],
})
export class SecoondaryTransactionPreviewComponent {
  panelOpenState = false;
  secondPanelOpenState = false;
  transactionDetails: any;
  constructor(public dialog: MatDialog) {}
  editTransaction() {}
  cancelTransaction() {}
  saveTransaction() {
   
  }
  getGroupCompany() {}
  openFile() {}
}
