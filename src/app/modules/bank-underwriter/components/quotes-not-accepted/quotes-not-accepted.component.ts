import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
 
  'Transaction ID':string;
  'Issuing Country': string;
  'Transaction Validity':string;
  'Amount':string;  
}


@Component({
  selector: 'app-quotes-not-accepted',
  templateUrl: './quotes-not-accepted.component.html',
  styleUrls: ['./quotes-not-accepted.component.scss']
})
export class QuotesNotAcceptedComponent {
  displayedCoulumns=[
    'Transaction ID',
    'Issuing Country',
    'Transaction Validity',
    'Amount'
  ];

  dataSource:PeriodicElement[]=[];
  searchInput: FormControl;
  
  search(e: any) {
    console.log(e.target.value);
  }
}
