import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReferPopupComponent } from '../refer-popup/refer-popup.component';

export interface PeriodicElement {
  name: string;
  country: string;
  company: string;
  email: string;
  mobile: string;
  date: string;
  plan: string;
  amount: string;
  earnings: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'First name Last name', 
    country: 'India',
    company: 'ABC technologies', 
    email: 'name.surname@email.com', 
    mobile: 'XXXXXXXXXX',
    date: 'DD/MM/YYYY',
    plan: 'Gold',
    amount: '$123',
    earnings: '$123',
  }
];


@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.scss']
})
export class ReferComponent {
  displayedColumns: string[] = ['name', 'country', 'company', 'email', 'mobile',  'date', 'plan', 'amount', 'earnings'];
  dataSource = ELEMENT_DATA;

  constructor(
    public dialog: MatDialog,
  ) {}

  referPopup() {
    this.dialog.open(ReferPopupComponent);
  }
}
