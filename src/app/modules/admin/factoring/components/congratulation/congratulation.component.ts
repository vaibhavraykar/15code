import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-congratulation',
  templateUrl: './congratulation.component.html',
  styleUrls: ['./congratulation.component.scss']
})
export class CongratulationComponent {
  constructor( private router:Router) { }

  gotoTransact() {
    this.router.navigateByUrl('/factoring/new-transact');
  }
}
