import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secondary-congratulation',
  templateUrl: './congratulation.component.html',
  styleUrls: ['./congratulation.component.scss']
})
export class CongratulationComponent {
  constructor( private router:Router) { }
  gotoTransact() {
    if(this.router.url.indexOf('/secondry/success')>0){
      this.router.navigateByUrl('/bank-underwriter/active-secondary-transaction')
    }else{
      this.router.navigateByUrl('/bank-underwriter/active-transaction');
    }

  }
}
