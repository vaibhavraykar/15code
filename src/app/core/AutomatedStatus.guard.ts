import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AutomatedStatusGuard implements CanActivate {
  constructor(private router: Router,private sharedService:SharedService) {}

  canActivate(): boolean {
    let user = localStorage.getItem('bankType') || '';

    if (user === 'SECONDARY_AUTOMATED' || user === 'AUTOMATED') {
      this.sharedService.openRestrictPopup();
      if(user ==='SECONDARY_AUTOMATED'){
        this.router.navigateByUrl('/bank-underwriter/secondary-new-transaction-qoute')
      }
      if(user === 'AUTOMATED'){
        this.router.navigateByUrl('/bank-underwriter/new-transaction')
      }

      return false;
    } else {
      return true;
    }
  }
}
