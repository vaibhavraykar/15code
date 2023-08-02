import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paypal-cancel',
  templateUrl: './paypal-cancel.component.html',
  styleUrls: ['./paypal-cancel.component.scss']
})
export class PaypalCancelComponent {

  constructor(
    private router:Router,
  ){}

  gotoDetails(){
    this.router.navigateByUrl('/customer/profile')
  }

}
