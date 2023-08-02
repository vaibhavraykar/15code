import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { CustomerServicesService } from '../services/customer-services.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {
  isOpen:boolean=false;
  hideElement: boolean = false;
  activeUrl: boolean;
  @ViewChild('sideNav') sidenav: MatSidenav;
  selectedMenu:any = 'New Transaction';
  isSubmenu:boolean = false;
  isSubmenuProfile:boolean = false;
  activeUrlQuote:boolean = false;
  userInfo:any;
  unApprovedUser:boolean = true;

  constructor(
    private router: Router,
    private as:AuthService,
    private cs:CustomerServicesService
  ) {
    console.log('version 0.0.7');
    this.router.events.subscribe((event) => {
     let routes = ['/customer/transactions/active'];
      if (event instanceof NavigationEnd) {
        this.hideElement = routes.includes(event.url) ? true : false;
        if(event.url == '/customer/transactions/active-transaction'  || event.url == '/customer/transactions/previous-transaction' || event.url == '/customer/transactions/saved-transaction' || event.url == '/customer/transactions/all-transaction' || event.url == '/customer/transactions/new/transaction-preview' ) {
        console.log(event.url);
        this.activeUrl = true;
          console.log(this.activeUrl , 'this.activeUrl');
        }
        if(event.url == '/customer/transactions/quote') {
          this.activeUrlQuote = true;
          console.log(event.url);
        }
      }
    });
  }



  ngOnInit(): void {
    // this.as.getUserDetails().subscribe({
    //   next:(res:any)=>{
    //     console.log(res)
    //     let orderType = res.data[0].orders.orderLines.find(ele=>ele.productDetails.productType==='SUBSCRIPTION_PLAN').productDetails?.planType;
    //     console.log(orderType,'order----')
    //     if(orderType === 'POSTPAID') {
    //       console.log('reached inside postpaid chekc')
    //       console.log(res.data[0]?.postpaidPaymentInfo?.paymentStatus);
    //       if (res.data[0]?.postpaidPaymentInfo?.paymentStatus === 'PENDING') {
    //         this.showBanner = true;
    //       } else {
    //         this.showBanner = false;
    //       }
    //     }
    //   }
    // })
    this.as.getUserDetails().subscribe({
      next:(res:any)=>{
        this.userInfo = res.data[0];
        if (
          this.userInfo?.isBusinessKycApproved &&
          this.userInfo?.isPersonalKycApproved &&
          this.userInfo?.isPaymentDone
        ) {
          this.unApprovedUser = false;
        } else {
          if (this.userInfo?.userType === 'PASSCODE_USER') {
            this.unApprovedUser = false;
          }
          else{
            this.unApprovedUser = true;
          }
        }

        if( this.userInfo.onboardingStepsStatus ===
          "ONBOARDING_COMPLETED"){
            this.unApprovedUser = false;
          }
      }
    })
  }



  goTo(paramText:string) {
    this.selectedMenu = paramText;

    if(paramText == 'Dashboard') {
      this.isSubmenu = false;
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/customer/transactions/dashboard');
    } else if(paramText == 'New Transaction') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/factoring/new-transact');
    }
    else if(paramText == 'Transactions') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/factoring/transaction');
    }
    else if(paramText == 'Transaction Preview') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/factoring/transaction-preview');
    }
    else if(paramText == 'Transaction Details') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/factoring/transaction-details');
    }
    else  if(paramText == 'Active Transaction') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/customer/transactions/active-transaction');
    } else  if(paramText == 'Previous Transaction') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/customer/transactions/previous-transaction');
    } else  if(paramText == 'Saved Transaction') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/customer/transactions/saved-transaction');
    }else  if(paramText == 'All Transactions') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/customer/transactions/all-transaction');
    }else  if(paramText == 'Customer Transactions') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('/customer/transactions/new');
    }
    this.isOpen=false
    // else
    // if(paramText == 'New Transactions') {
    //   this.isSubmenuProfile = false;
    //   this.router.navigateByUrl('/factoring/dashboard');
    // }
  }

  open() {
    this.isSubmenu = !this.isSubmenu;
  }
  openProfile() {
    this.isSubmenuProfile = !this.isSubmenuProfile;
  }
  openSidebar() {
    this.isOpen =  !this.isOpen;
  }
  closeSidebar() {
    this.isOpen = false;
  }
}
