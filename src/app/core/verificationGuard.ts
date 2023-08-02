import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VerificationGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let userInfo = JSON.parse(localStorage.getItem('userInfo')||'{}');
      let status =localStorage.getItem('onBoardingStatus')
      const {subscriberType,isBusinessKycApproved,isPaymentDone,isPersonalKycApproved}=userInfo

     if(status === 'ONBOARDING_COMPLETED'){
      return true;
     }
     if(status === 'KYC_SUBMITTED'){
      if(isBusinessKycApproved && isPaymentDone && isPersonalKycApproved){
        return true
      }else{
        this.router.navigateByUrl('/customer/profile/kyc-success')
        return false;
      }
     }else if (status === 'PAYMENT_REJECTED') {
      this.router.navigateByUrl('/customer/profile');
      return false;
    }
     else if (status === 'PAYMENT_INITIATED') {
      this.router.navigateByUrl('/customer/profile');
      return false;
    }
    else{
     return true
    }

  }
}
