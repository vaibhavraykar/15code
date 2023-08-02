import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { CustomerServicesService } from '../services/customer-services.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TncComponent } from '../profile/tnc/tnc.component';
import { ChangePasswordComponent } from '../profile/change-password/change-password.component';
import { NotificationPopupComponent } from '../transaction/pages/notification-popup/notification-popup.component';
import { SubscriptionDetailPopupComponent } from '../profile/subscription-detail-popup/subscription-detail-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userDetails: any;
  userInfo: any;
  planDetails: any;
  getUserType: any;
  isPassCodeUser: boolean = false;
  isMasterCodeUser: boolean = false;
  getUserDetails: any;
  isMasterBankCustomer: boolean = false;
  isPassCodeBankCustomer: boolean = false;
  isUnapprovedUser: boolean = false;
  isMasterCodeBankUnderwriter: boolean = false;
  subscriberType: any;
  showPostpaidBanner: boolean = false;
  postpaidPaymentStatus:any;
  orderType:any;
  isPostpaid:boolean = false;
  isPassCodeBankUnderwriter:boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private customerService: CustomerServicesService,
    private dialog: MatDialog
  ) {
    this.customerService.bannerDisplay$.subscribe((res: any) => {
      this.showPostpaidBanner = res;
    });
    this.customerService.getCreditUpdate.subscribe({
      next: (res) => {
        if (res) {
          this.getCredits();
        }
      },
    });
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.authService.getUserDetails().subscribe((res: any) => {
      this.isPostpaid = res.data[0]?.postpaidPaymentInfo?true:false;
      this.orderType = res.data[0]?.orders?.orderLines?.find(
        (ele) => ele.productDetails?.productType === 'SUBSCRIPTION_PLAN'
      )?.productDetails?.planType;
      this.getUserType = res.data[0]?.userType;
      this.getUserDetails = res.data[0]?.subscriberType;
      if (this.getUserDetails === 'CUSTOMER') {
        this.subscriberType = 'Customer';
      } else if (this.getUserDetails === 'BANK') {
        this.subscriberType = 'Bank as Customer';
      } else if (this.getUserDetails === 'BANK_AS_UNDERWRITER') {
        this.subscriberType = 'Bank as Underwriter';
      } else if (this.getUserDetails === 'REFERER') {
        this.subscriberType = 'Referer';
      }
      if (
        res.data[0]?.isBusinessKycApproved &&
        res.data[0]?.isPersonalKycApproved &&
        res.data[0]?.isPaymentDone
      ) {
        if (this.getUserType == 'PASSCODE_USER') {
          if (this.getUserDetails == 'BANK') {
            this.isPassCodeBankCustomer = true;
          } else if (this.getUserDetails == 'BANK_AS_UNDERWRITER') {
            this.isPassCodeBankUnderwriter = true;
          } else {
            this.isPassCodeUser = true;
          }
        } else if (this.getUserType == 'MASTER_USER') {
          if (this.getUserDetails == 'BANK') {
            this.isMasterBankCustomer = true;
          } else if (this.getUserDetails == 'BANK_AS_UNDERWRITER') {
            this.isMasterCodeBankUnderwriter = true;
          } else {
            this.isMasterCodeUser = true;
          }
        }
      } else {
        if (this.getUserType == 'PASSCODE_USER') {
          if (this.getUserDetails == 'BANK') {
            this.isPassCodeBankCustomer = true;
          } else if (this.getUserDetails == 'BANK_AS_UNDERWRITER') {
            this.isPassCodeBankUnderwriter = true;
          } else {
            this.isPassCodeUser = true;
          }
        } else {
          this.isUnapprovedUser = true;
        }
      }
      if (res.data[0]?.onboardingStepsStatus === 'ONBOARDING_COMPLETED') {
        switch (this.getUserType) {
          case 'MASTER_USER':
            if (this.getUserDetails == 'BANK') {
              this.isMasterBankCustomer = true;
            } else if (this.getUserDetails == 'BANK_AS_UNDERWRITER') {
              this.isMasterCodeBankUnderwriter = true;
            } else {
              this.isMasterCodeUser = true;
            }
            break;
          case 'PASSCODE_USER':
            if (this.getUserDetails == 'BANK') {
              this.isPassCodeBankCustomer = true;
            } else if (this.getUserDetails == 'BANK_AS_UNDERWRITER') {
              this.isMasterCodeBankUnderwriter = true;
            } else {
              this.isPassCodeUser = true;
            }
            break;
        }
        this.isUnapprovedUser = false;
      }
    });
    this.getCredits();
  }

  getCredits() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userInfo);
    if (
      this.userInfo?.isPaymentDone &&
      this.userInfo?.isPersonalKycApproved &&
      this.userInfo?.isBusinessKycApproved
    ) {
      this.customerService.getCurrentPlan().subscribe((res: any) => {
        console.log(res);
        this.planDetails = res.data[0];
        console.log(this.planDetails?.availableCredits);
      });
    }
  }

  logout() {
    this.authService.logout().subscribe((res: any) => {
      console.log(res);
      localStorage.clear();
      this.store.dispatch(new Logout());
      this.store.dispatch(clearState());
      window.location.href = '/auth/login';
    });
  }

  openUnderwriterProfile() {
    this.router.navigateByUrl('/bank-underwriter/profile');
  }

  myProfile() {
    this.router.navigateByUrl('/customer/transactions/profile');
  }

  openBankprofile() {
    this.router.navigateByUrl('/customer/transactions/bank-profile');
  }

  addBank() {
    this.router.navigateByUrl(`/bank-underwriter/add-bank`);
  }

  openSubscription() {
    if (this.getUserDetails === 'BANK_AS_UNDERWRITER') {
      this.router.navigateByUrl('/bank-underwriter/subscription');
    } else {
      this.router.navigateByUrl('/customer/transactions/subscription');
    }
  }

  vas() {
    this.router.navigateByUrl('/customer/transactions/vas-plan');
  }

  credit() {
    if (this.getUserDetails === 'BANK_AS_UNDERWRITER') {
      this.router.navigateByUrl('/bank-underwriter/credits-transaction');
    } else {
      this.router.navigateByUrl('/customer/transactions/credits-transaction');
    }
  }

  manage() {
    this.router.navigateByUrl('/customer/transactions/manage-group');
  }

  refer() {
    if (this.getUserDetails === 'BANK_AS_UNDERWRITER') {
      this.router.navigateByUrl('/bank-underwriter/refer');
    } else {
      this.router.navigateByUrl('/customer/transactions/refer');
    }
  }

  tnc() {
    const popup = this.dialog.open(TncComponent);
  }

  manageUser() {
    this.router.navigateByUrl('/bank-underwriter/manage-user');
  }

  support() {
    if (this.getUserDetails === 'BANK_AS_UNDERWRITER') {
      this.router.navigateByUrl('/bank-underwriter/support');
    } else {
      this.router.navigateByUrl('/customer/transactions/support');
    }
  }

  cp() {
    // if (this.getUserDetails === 'BANK_AS_UNDERWRITER') {
    //   this.router.navigateByUrl('/bank-underwriter/change-password');
    // } else {
    //   this.router.navigateByUrl('/customer/transactions/change-password');
    // }
    const popup = this.dialog.open(ChangePasswordComponent, {
      disableClose: true,
    });
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
