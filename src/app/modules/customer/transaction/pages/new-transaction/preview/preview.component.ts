import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

  constructor(
    private router:Router,
  ){}

  back(){
    this.router.navigateByUrl('/customer/transactions/new/transaction-preview');
  }

  editTransaction(){    
    // this.router.navigateByUrl('/customer/transactions/new');
  }
}
