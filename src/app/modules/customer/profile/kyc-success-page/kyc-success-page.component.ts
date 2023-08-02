import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';


@Component({
  selector: 'app-kyc-success-page',
  templateUrl: './kyc-success-page.component.html',
  styleUrls: ['./kyc-success-page.component.scss']
})
export class KycSuccessPageComponent implements OnInit{

	private unsubscriber : Subject<void> = new Subject<void>()

  constructor(private router:Router,
    private store:Store,
    private authService:AuthService){}

  ngOnInit(): void {
		history.pushState(null, '');

		fromEvent(window, 'popstate').pipe(
			takeUntil(this.unsubscriber)
		).subscribe((_) => {
			history.pushState(null, '');
		});
    let accStatus = localStorage.getItem('onBoardingStatus');
    let accType = JSON.parse(
      localStorage.getItem('userDetails')
    ).subscriberType;
    console.log(accType);
    if (accStatus === 'ONBOARDING_COMPLETED') {
      if (accType === 'BANK_AS_UNDERWRITER') {
        this.router.navigateByUrl('/bank-underwriter/dashboard');
        return;
      } else {
        this.router.navigateByUrl('/customer/transactions/dashboard');
        return;
      }
    }else if(accStatus === 'PERSONAL_KYC_REJECTED'){
      this.router.navigateByUrl('/customer/profile')

    }
    else if(accStatus === 'BUSINESS_KYC_REJECTED'){
      this.router.navigateByUrl('/customer/profile')

    }
    setTimeout(()=>{
      this.authService.logout().subscribe((res:any)=>{
        console.log(res);
        localStorage.clear();
        this.store.dispatch(new Logout());
        this.store.dispatch(clearState());
        window.location.href='/auth/login';
      })
    },60000);
      // this.authService.appLogout();
  }


	ngOnDestroy(): void {
		this.unsubscriber.next();
		this.unsubscriber.complete();
	  }

}
