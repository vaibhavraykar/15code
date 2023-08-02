import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beneficiary-preview',
  templateUrl: './beneficiary-preview.component.html',
  styleUrls: ['./beneficiary-preview.component.scss']
})
export class BeneficiaryPreviewComponent {

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
