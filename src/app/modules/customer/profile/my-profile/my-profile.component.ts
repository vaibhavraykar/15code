import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit{
  countries:any=['India','Australia'];

  subscriberType:any;
  selectedIndex:any;
  isKYCDisabled:boolean;
  isBusinessDisabled:boolean;
  isSubscriptionDisabled:boolean;
  personalDisabled:boolean;
  personalDetails:any;
  businessDetails:any;
  subDetails:any;
  onBoardingStatus:any;
  routeState:any;

  constructor(private router:Router,
    private authService:AuthService,) {
      this.routeState = this.router.getCurrentNavigation()?.extras?.state;
      console.log(this.routeState)
    }

  ngOnInit() {
    this.selectedIndex=0;
	this.onBoardingStatus =localStorage.getItem('onBoardingStatus');
    this.isSubscriptionDisabled = true;
    this.isKYCDisabled = true;
    this.isBusinessDisabled = false;
    console.log('selected Index',this.selectedIndex);
    let onBoardingStatus=localStorage.getItem('onBoardingStatus');
    if (
      this.routeState?.from !== 'my-profile' &&
      this.routeState?.from !== 'bank-profile' &&
      this.routeState?.from !== 'bank-underwriter-profile' &&
      this.routeState?.from !== 'sub-details'
    ) {
      if (onBoardingStatus == 'KYC_SUBMITTED') {
        this.router.navigateByUrl('/customer/profile/kyc-success');
      }
      this.authService.getUserDetails().subscribe((res: any) => {
        this.personalDetails = res.data[0].personalDetails;
        localStorage.setItem(
          'userDetails',
          JSON.stringify(this.personalDetails)
        );
        this.businessDetails = res.data[0].businessDetails;
        localStorage.setItem(
          'businessDetails',
          JSON.stringify(res.data[0].businessDetails)
        );
        this.subDetails = res.data[0].orders;
        let kycDetails = res.data[0].kycDetails;
        console.log(this.subDetails.status != '' ? true : false);

        if (
          this.businessDetails.default &&
          this.personalDetails.subscriberType !== 'REFERRER'
        ) {
          this.selectedIndex = 2;
          this.isSubscriptionDisabled = false;

          this.isKYCDisabled = true;
          if (this.subDetails.status ? true : false) {
            if (
              this.subDetails.paymentDetails[0]?.modeOfPayment == 'PAYPAL' &&
              this.subDetails.status != 'COMPLETED'
            ) {
              this.isKYCDisabled = true;
              console.log('Enter true1');
            } else {
              if (kycDetails.length > 0) {
                this.selectedIndex = 3;
                this.isKYCDisabled = false;
                console.log('Enter false');
              } else {
                this.selectedIndex = 2;
                this.isKYCDisabled = false;
              }
            }
          }
          if (onBoardingStatus == 'PAYMENT_REJECTED') {
            this.selectedIndex = 2;
            this.isKYCDisabled = true;
          }
        } else {
          console.log('going');
          this.selectedIndex = 0;
          this.isBusinessDisabled = false;
          this.isSubscriptionDisabled = true;
          this.isKYCDisabled = true;
        }

        if (
          this.onBoardingStatus == 'PERSONAL_KYC_REJECTED' ||
          this.onBoardingStatus == 'BUSINESS_KYC_REJECTED'
        ) {
          if (kycDetails) {
            this.personalDisabled = true;
            this.isBusinessDisabled = true;
            this.isKYCDisabled = false;
            if (this.subDetails?.status == 'REJECTED') {
              this.isSubscriptionDisabled = false;
            } else {
              this.isSubscriptionDisabled = true;
            }
          }
        }

        localStorage.setItem(
          'businessDetails',
          JSON.stringify(res.data[0]?.businessDetails)
        );
        this.subscriberType = res.data[0]?.personalDetails?.subscriberType;
        console.log('-----------', this.subscriberType);
      });
    } else {
      this.editableProfile();
    }

  }

  editableProfile(){
    this.authService.getUserDetails().subscribe((res: any) => {
      // console.log('hi');
      this.personalDetails = res?.data[0]?.personalDetails;
      this.subscriberType = res?.data[0]?.subscriberType;
      console.log(this.subscriberType,'From Profile')
      localStorage.setItem('userDetails', JSON.stringify(this.personalDetails));
      this.businessDetails = res?.data[0]?.businessDetails;
      localStorage.setItem('businessDetails', JSON.stringify(res.data[0].businessDetails))
      this.subDetails = res?.data[0]?.orders;
      let kycDetails = res?.data[0]?.kycDetails;
      localStorage.setItem(
        'businessDetails',
        JSON.stringify(res?.data[0]?.businessDetails)
      );
    });
    if (this.routeState?.editable === 'personal-details') {
      this.isBusinessDisabled = true;
      this.isSubscriptionDisabled = true;
      this.isKYCDisabled = true;
    } else if (this.routeState?.editable === 'business-details') {
      this.personalDisabled = true;
      this.isBusinessDisabled = false;
      this.isSubscriptionDisabled = true;
      this.isKYCDisabled = true;
      this.changedIndex(1);
    } else if (this.routeState?.editable === 'kyc-details') {
      this.personalDisabled = true;
      this.isBusinessDisabled = true;
      this.isSubscriptionDisabled = true;
      this.isKYCDisabled = false;
      this.changedIndex(3);
    } else if(this.routeState?.editable === 'subscription-details') {
      this.personalDisabled = true;
      this.isBusinessDisabled = true;
      this.isSubscriptionDisabled = false;
      this.isKYCDisabled = true;
      this.changedIndex(2);
    }

  }


  selectedTab(event:any){
    console.log(event.index)
    this.selectedIndex=event.index
    this.changedIndex(event.index)
  }

  getVisited() {
    if (this.isBusinessDisabled) {
      return { visited_one: true };
    } else if (!this.isBusinessDisabled) {
      return { visited_both: true, visited_one: true };
    }

    return {};
  }


  changedIndex(event:any){
    console.log(event);
    this.authService.getUserDetails().subscribe((res:any)=>{
      this.personalDetails = res.data[0].personalDetails
      localStorage.setItem('userDetails', JSON.stringify(this.personalDetails))
      this.businessDetails=res.data[0].businessDetails;
      this.subDetails=res.data[0].orders;
      console.log(this.subDetails.status!=''?true:false)

      // if(this.businessDetails.default && this.personalDetails.subscriberType!=='REFERRER'){
      //   this.selectedIndex=2;
      //   this.isSubscriptionDisabled=false;
      //   this.isKYCDisabled=true;
      //   if(this.subDetails.status?true:false){
      //     this.selectedIndex=3;
      //     this.isKYCDisabled=false;
      //   }
      // }
      // else{
      //   console.log('going')
      //   this.selectedIndex=0;
      //   this.isBusinessDisabled=false;
      //   this.isSubscriptionDisabled=true;
      //   this.isKYCDisabled=true;
      // }


      localStorage.setItem('businessDetails', JSON.stringify(res.data[0].businessDetails))
      this.subscriberType=res.data[0].personalDetails.subscriberType;
      console.log('-----------',this.subscriberType);
    })
    this.selectedIndex=event;
    if(event == 1){
      this.isBusinessDisabled = false;
    }
    if(event == 2){
      this.isSubscriptionDisabled = false;
      this.isKYCDisabled = true;
    }
    if(event == 3){
      console.log("Entered")
      this.isKYCDisabled = false;
    }
    console.log('-----------',this.selectedIndex);
  }
}
