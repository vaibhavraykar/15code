import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import * as LoginActions from '../state/auth.actions';
import { AuthFacadeService } from '../state/auth.facade.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { SendOtpComponent } from './send-otp/send-otp.component';
import { clearState } from '../state/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @HostListener('keyup.enter')
  onEnter(){
    this.submit()
  }

  destroy$: Subject<boolean> = new Subject<boolean>();
  loginForm!: FormGroup;
  userID: any;
  pwd: any;
  formSubmit = false;
  storeData: any;
  showError: string;
  dialogRef: any;
  dialogRefOtp: any;
  showPassword:boolean=false;
  password=new FormControl('',[Validators.required, NoWhitespaceValidator()]);
  constructor(
    private router: Router,
    private readonly store: Store,
    private formBuilder: FormBuilder,
    private authFacadeService: AuthFacadeService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      let kycDetails = localStorage.getItem('kycDetails');
      let userDetails: any = JSON.parse(localStorage.getItem('userDetails'));
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let onBoardingStatus = localStorage.getItem('onBoardingStatus');
      kycDetails = kycDetails ? JSON.parse(kycDetails) : [];

      if (
        userDetails?.accountStatus == 'ACTIVE' ||
        (userInfo?.isPersonalKycApproved && userInfo?.isBusinessKycApproved)
      ) {
        // this.router.navigateByUrl('/factoring/new-transact');
        if (userInfo.subscriberType === 'BANK_AS_UNDERWRITER') {
          this.router.navigateByUrl('/bank-underwriter/dashboard');
        } else {
          this.router.navigateByUrl('/customer/transactions/dashboard');
        }
      } else if (
        userDetails?.accountStatus == 'PENDING' &&
        onBoardingStatus == 'KYC_SUBMITTED'
      ) {
        this.router.navigateByUrl('/customer/profile/kyc-success');
      } else {
        if(onBoardingStatus != (null||undefined)){
        this.router.navigateByUrl('/customer/profile');
        }else if(userDetails.subscriberType === 'ADMIN'){
          this.router.navigateByUrl('/adminv2/dashboard');
          // this.router.navigateByUrl('/admin/dsb/dashboard');
        }
        else{
          this.router.navigateByUrl('/auth/login');
        }
      }
    }
    // this.authFacadeService.getAuthResult$.subscribe((store: any) => {
    //   this.storeData = store;
    //   console.log(this.storeData, 'data');
    //   if (
    //     this.storeData &&
    //     this.storeData.stateCollection.loginResponse?.success
    //   ) {
    //     const dialogRef = this.dialog.open(UserDetailsComponent);
    //     dialogRef.afterClosed().subscribe((result) => {
    //       console.log('The dialog was closed');
    //     });
    //   } else if (
    //     this.storeData &&
    //     this.storeData.stateCollection.errorMessage
    //   ) {
    //     console.log('Error');
    //     this.showError = this.storeData.stateCollection.errorMessage;
    //     const sPopup = this.dialog.open(CommonPopupComponent, {
    //       width: '500px',
    //       height: '300px',
    //     });
    //     sPopup.afterOpened().subscribe((res) => {
    //       setTimeout(() => {
    //         sPopup.close();
    //       }, 500);
    //     });
    //   }
    // });

    this.authFacadeService.getAuthResult$.subscribe((store: any) => {
      this.storeData = store;
      let sendDialogCount = document.querySelectorAll('#sendOtp').length
      let userDialogCount = document.querySelectorAll('#userDetailsVerify').length
      let loginElement = document.querySelector('.login-container')
      if (
        this.storeData &&
        this.storeData.stateCollection.loginResponse?.success &&
        !this.storeData.stateCollection.sendOtpEmailResponse?.success &&
        !this.storeData.stateCollection.passcodeResponse?.success
      ) {
        if(this.dialogRef){
          this.dialogRef.close();
        }
        let userInfo  = JSON.parse(localStorage.getItem('userInfo'));
        let userDetails:any = JSON.parse(localStorage.getItem('userDetails'));
        if(userInfo.subscriberType!='BANK_AS_UNDERWRITER' && userInfo.isPersonalKycApproved &&  userInfo.isBusinessKycApproved && userInfo.isPaymentDone){
          if(userDialogCount===0){
            this.dialogRef = this.dialog.open(UserDetailsComponent, {
              autoFocus: false,
            });
          }

        }
        else{

          this.dialogRef?.close();
          // this.dialogRefOtp?.close();
          // if(this.dialogRefOtp){
          //   this.dialogRefOtp.close();
          // }
          if(sendDialogCount===0){
            this.authFacadeService.sendOTP(userInfo.email,`${userInfo.firstName} ${userInfo.lastName}`);
            this.dialogRefOtp = this.dialog.open(SendOtpComponent);
          }
        }
      } else if (
        this.storeData &&
        this.storeData.stateCollection.loginResponse?.success &&
        this.storeData.stateCollection.sendOtpEmailResponse?.success &&
        !this.storeData.stateCollection.passcodeResponse?.success
      ) {

        this.dialogRef?.close();
        // this.dialogRefOtp?.close();
        // if(this.dialogRefOtp){
        //   this.dialogRefOtp.close();
        // }
        if(sendDialogCount===0){
          this.dialogRefOtp = this.dialog.open(SendOtpComponent);
        }
      } else if (
        this.storeData &&
        this.storeData.stateCollection.loginResponse?.success &&
        this.storeData.stateCollection.sendOtpEmailResponse?.success &&
        this.storeData.stateCollection.passcodeResponse?.success
      ) {
        let kycDetails = localStorage.getItem('kycDetails');
        kycDetails = kycDetails ? JSON.parse(kycDetails) : [];
        if(kycDetails && kycDetails.length > 0 ){
          this.router.navigateByUrl('/factoring/dashboard').then(()=>{
            // setTimeout(() => {
              loginElement.setAttribute('hidden','true')
              this.dialogRefOtp?.close();
            // }, 500);
          });
          }else{
            // this.dialogRefOtp?.close();
          this.router.navigateByUrl('/customer/profile').then(()=>{
            // setTimeout(() => {
              loginElement.setAttribute('hidden','true')
              this.dialogRefOtp?.close();
            // }, 500);
          });;
        }

      } else if (
        this.storeData &&
        this.storeData.stateCollection.errorMessage
      ) {
        this.showError = this.storeData.stateCollection.errorMessage?.error?.message;
        // const sPopup = this.dialog.open(CommonPopupComponent, {
        //   width: '500px',
        //   height: '300px',
        //   data: {
        //     title: 'isError',
        //   },
        // });
        // sPopup.afterOpened().subscribe((res) => {
        //   setTimeout(() => {
        //     sPopup.close();
        //   }, 500);
        // });
      }
    });
  }

  ngOnInit(): void {

    this.authFacadeService.getPasscodeResult$.subscribe((store: any) => {
      this.storeData = store;
      if (this.storeData && this.storeData.stateCollection.passcodeResponse) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          let kycDetails = localStorage.getItem('kycDetails');
          let userDetails: any = JSON.parse(
            localStorage.getItem('userDetails')
          );
          let onBoardingStatus = localStorage.getItem('onBoardingStatus');
          kycDetails = kycDetails ? JSON.parse(kycDetails) : [];
          let userInfo = JSON.parse(localStorage.getItem('userInfo'));
          if (
            userDetails?.accountStatus == 'ACTIVE' ||
            (userInfo?.isPersonalKycApproved && userInfo?.isBusinessKycApproved)
          ) {
            if (userInfo.subscriberType === 'BANK_AS_UNDERWRITER') {
              this.router.navigateByUrl('/bank-underwriter/dashboard');
            } else {
              this.router.navigateByUrl('/customer/transactions/dashboard');
            }
          } else if (
            userDetails?.accountStatus == 'PENDING' &&
            onBoardingStatus == 'KYC_SUBMITTED'
          ) {
            this.router.navigateByUrl('/customer/profile/kyc-success');
          } else {
            this.router.navigateByUrl('/customer/profile');
          }
        }
      } else if (
        this.storeData &&
        this.storeData.stateCollection.errorMessage
      ) {
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  togglePasswordVisibility(){
    this.showPassword=!this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.valid, 'this.loginForm.valid');
    }
  }
  submit() {
    localStorage.clear();
    if (this.userID && this.password.valid) {
      //   var data={
      //   password:this.pwd,
      //   userid:this.userID
      // }
      // this.router.navigateByUrl('auth/login/user-details')

      this.authFacadeService.loginUser(this.userID, this.password.value);

      // const dialogRef = this.dialog.open(UserDetailsComponent);
      //     dialogRef.afterClosed().subscribe(result => {
      //       console.log('The dialog was closed');
      //     });
    }
  }

  forgotPassword() {
    this.store.dispatch(clearState());
    this.router.navigateByUrl('auth/forgot-password');
  }

  signup() {
    this.router.navigateByUrl('auth/signup');
  }

  userIDHandler(event: any) {
    this.userID = event;
  }

  pwdHandler(event: any) {
    this.pwd = event;
    this.password.setValue(event)
  }
}

export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): any => {
    window.setTimeout(() => {
      if (control.value && control.value != '') {
        let trimedvalue = control.value.replace(/\s/g, '');
        control.setValue(trimedvalue);
      }
    }, 10);
  };
}
