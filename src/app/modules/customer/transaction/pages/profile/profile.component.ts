import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  personalDetails: any;
  businessDetails: any;
  addressDetails: any;
  kycDetails: any;
  personalKYCDetails: any;
  businessKYCDetails: any;
  employeeDetails: any[];
  userInfo: any;
  unApprovedUser: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserDetails().subscribe((res: any) => {
      if (res.success) {
        // console.log(res.data[0]);
        let userData = res?.data[0];
        this.personalDetails = userData?.personalDetails;
        this.businessDetails = userData?.businessDetails;
        this.employeeDetails = userData?.businessDetails?.emplyeeDetails;
        this.kycDetails = userData?.kycDetails;
        let personalKYC = this.kycDetails?.find(
          (ele) => ele.documentType === 'PERSONAL'
        )?.documentList;
        this.personalKYCDetails = personalKYC?.find(
          (ele) => ele.status === 'ACTIVE'
        );
        let businessKYC = this.kycDetails?.find(
          (ele) => ele.documentType === 'BUSINESS'
        )?.documentList;
        this.businessKYCDetails = businessKYC?.find(
          (ele) => ele.status === 'ACTIVE'
        );
        if (
          userData?.isBusinessKycApproved &&
          userData?.isPersonalKycApproved &&
          userData?.isPaymentDone
        ) {
          this.unApprovedUser = false;
        } else {
          this.unApprovedUser = false;
        }
        if( this.userInfo.onboardingStepsStatus ===
          "ONBOARDING_COMPLETED"){
            this.unApprovedUser = false;
          }
      }
    });
  }

  openPersonalKYCDocument() {
    window.open(this.personalKYCDetails?.url, '_blank');
  }

  openBusinessKYCDocument() {
    window.open(this.businessKYCDetails?.url, '_blank');
  }

  editPersonalDetails() {
    if(this.unApprovedUser){
      this.router.navigateByUrl('customer/profile');
    }
    else{
      this.router.navigate(['customer/profile'], {
        state: {
          from: 'my-profile',
          editable: 'personal-details',
        },
      });
    }
  }

  editBusinessDetails() {
    if (this.unApprovedUser) {
      this.router.navigateByUrl('customer/profile');
    }
    else{
      this.router.navigate(['customer/profile'], {
        state: {
          from: 'my-profile',
          editable: 'business-details',
        },
      });
    }
  }

  editKYCDetails() {
    this.router.navigate(['customer/profile'], {
      state: {
        from: 'my-profile',
        editable: 'kyc-details',
      },
    });
  }
}
