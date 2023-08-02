import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-success',
  templateUrl: './transaction-success.component.html',
  styleUrls: ['./transaction-success.component.scss']
})
export class TransactionSuccessComponent {


  constructor(
    private router:Router,
    ){}

  
    gotoDashboard(){
      this.router.navigateByUrl('/customer/transactions/active-transaction')
    }
}
