import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bank-underwriter-quote-accepted',
  templateUrl: './bank-underwriter-quote-accepted.component.html',
  styleUrls: ['./bank-underwriter-quote-accepted.component.scss']
})
export class BankUnderwriterQuoteAcceptedComponent {
  constructor(public router:Router,){}

  continue(){
    // this.router.navigateByUrl('/bank-underwriter/secondary-transaction-details')
    this.router.navigate(['/customer/transactions/pending-payment']);
  }
}
