import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { MatDialog } from '@angular/material/dialog';
import { TncComponent } from 'src/app/modules/customer/profile/tnc/tnc.component';
import { ChangePasswordComponent } from 'src/app/modules/customer/profile/change-password/change-password.component';
import { NotificationPopupComponent } from 'src/app/modules/customer/transaction/pages/notification-popup/notification-popup.component';
import { SubscriptionDetailPopupComponent } from 'src/app/modules/customer/profile/subscription-detail-popup/subscription-detail-popup.component';
import { CustomerServicesService } from 'src/app/modules/customer/services/customer-services.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('menu') menu: any;
  isLogout: boolean = false;
  userDetails: any = [];
  planDetails: any;
  subscriberType: any = 'Bank as Underwriter';
  showPostpaidBanner: boolean = false;
  postpaidPaymentStatus: any;
  orderType: any;
  userType:any;
  isMasterUser : boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private bs: BankUnderwriterService,
    private dialog: MatDialog,
    private customerService: CustomerServicesService
  ) {
    this.customerService.bannerDisplay$.subscribe((res: any) => {
      console.log(res)
      this.showPostpaidBanner = res;
    });
    this.bs.getCreditUpdate.subscribe({
      next: (res) => {
        if (res) {
          this.getCredits();
        }
      },
    });
  }
  userInfo: any = {};
  ngOnInit(): void {
    this.authService.getUserDetails().subscribe({
      next:(res:any)=>{
        this.userType = res.data[0]?.userType;
        if(this.userType === 'MASTER_USER'){
          this.isMasterUser = true;
        }
        else{
          this.isMasterUser = false;
        }
      }
    })
    this.getCredits();
  }
  logout() {
    this.isLogout = !this.isLogout;
  }
  getCredits() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails')); //this.authService.userDetails[0].personalDetails;
    console.log(this.userDetails);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userInfo);
    if (this.userInfo?.isPaymentDone) {
      this.bs.getCurrentPlan().subscribe((res: any) => {
        console.log(res);
        this.planDetails = res.data[0];
        console.log(this.planDetails?.availableCredits);
      });
    }
  }
  close() {
    this.isLogout = false;
    this.authService.logout().subscribe((res: any) => {
      localStorage.clear();
      this.store.dispatch(new Logout());
      this.store.dispatch(clearState());
      // this.router.navigateByUrl('/auth/login').then(()=>{
      //   window.location.href('/auth/login')
      // });
      window.location.href = '/auth/login';
    });
    // this.authService.appLogout();
  }
  myProfile() {
    this.router.navigateByUrl('/bank-underwriter/profile');
  }
  viewCreditTransaction() {
    this.router.navigateByUrl('/bank-underwriter/credits-transaction');
  }
  addBank() {
    this.router.navigateByUrl(`/bank-underwriter/add-bank`);
  }
  checkAutomatedBank() {
    let user = localStorage.getItem('bankType') || '';
    if (user == 'SECONDARY_AUTOMATED'||user == 'AUTOMATED') {
      return false;
    } else {
      return true;
    }
  }

  openSubscription() {
    this.router.navigateByUrl('/bank-underwriter/subscription');
  }
  refer() {
    this.router.navigateByUrl('/bank-underwriter/refer');
  }

  tnc() {
    this.dialog.open(TncComponent);
  }

  support() {
    this.router.navigateByUrl('/bank-underwriter/support');
  }

  cp() {
    // this.router.navigateByUrl('/bank-underwriter/change-password');
    const popup = this.dialog.open(ChangePasswordComponent);
  }
  manageUser() {
    this.router.navigateByUrl('/bank-underwriter/manage-user');
  }

  openNotification() {
    this.authService.getUserDetails().subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.orderType = res.data[0].orders.orderLines.find(
          (ele) => ele.productDetails.productType === 'SUBSCRIPTION_PLAN'
        ).productDetails?.planType;
        // console.log(orderType, 'order----');
        if (this.orderType === 'POSTPAID') {
          console.log('reached inside postpaid chekc');
          this.postpaidPaymentStatus =
            res.data[0]?.postpaidPaymentInfo?.paymentStatus;
          if (this.postpaidPaymentStatus === 'PENDING_FOR_APPROVAL') {
            const popup = this.dialog.open(SubscriptionDetailPopupComponent);
          } else {
            this.dialog.open(NotificationPopupComponent, {
              disableClose: true,
            });
          }
        } else {
        }
      },
    });
  }
}
