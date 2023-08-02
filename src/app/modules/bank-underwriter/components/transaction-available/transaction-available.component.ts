import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

export interface PeriodicElement {
  'Quotes recieved': string;
  'Transaction ID':string;
  'Amount':string;
  'Applicant':string;
  'Beneficiary':string;
}

@Component({
  selector: 'app-transaction-available',
  templateUrl: './transaction-available.component.html',
  styleUrls: ['./transaction-available.component.scss']
})
export class TransactionAvailableComponent {
  displayedCoulumns=[
  'Transaction ID',
  'Issuing Country',
  'Transaction Validity',
  'Amount',]
  dataSource:PeriodicElement[]=[];

  countryList: string[] = ['Algeria', 'Bahrain', 'Ghana', 'India'];
  productList: string[] = ['Product', 'Discounting', 'Confirmation & Discounting', 'Bankers Acceptance', 'Refinancing'];
}
