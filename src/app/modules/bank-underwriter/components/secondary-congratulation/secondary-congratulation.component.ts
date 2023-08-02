import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secondary-congratulation',
  templateUrl: './secondary-congratulation.component.html',
  styleUrls: ['./secondary-congratulation.component.scss']
})
export class SecondaryCongratulationComponent implements OnInit{
  from:any=''
  constructor( private router:Router) {
    let navigation = this.router.getCurrentNavigation();
    this.from = navigation?.extras?.state?.['from'] ||  '' ;
    console.log(navigation?.extras?.state)
   }
  ngOnInit(): void {

  }

  gotoTransact() {
    if(this.from==='buying'){
      this.router.navigateByUrl('/bank-underwriter/active-transaction-qoute')
    }else{
      this.router.navigateByUrl('/bank-underwriter/active-secondary-transaction')
    }

  }
}
