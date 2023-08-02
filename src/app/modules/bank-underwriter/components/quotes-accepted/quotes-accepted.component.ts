import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';


export interface PeriodicElement {
 
  'Transaction ID':string;
  'Issuing Country': string;
  'Transaction Validity':string;
  'Amount':string;  
}

@Component({
  selector: 'app-quotes-accepted',
  templateUrl: './quotes-accepted.component.html',
  styleUrls: ['./quotes-accepted.component.scss']
})

export class QuotesAcceptedComponent {
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
