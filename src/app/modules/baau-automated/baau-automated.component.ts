import { Component } from '@angular/core';
import { CommonPopupComponent } from '../adminV2/components/common-popup/common-popup.component';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerFactoringService } from '../customer-factoring/customer-factoring.service';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-baau-automated',
  templateUrl: './baau-automated.component.html',
  styleUrls: ['./baau-automated.component.scss']
})
export class BaauAutomatedComponent {
  otp!: string;
  verifyOtp: boolean = false;
  otpError: boolean = false;
  errorMessage: string = '';
  config = {
    allowNumbersOnly: true,
    length: 5,
    inputStyles: {
      fontSize: '14px',
    },
  };
  error: any;
  paramEmailId: any;
  constructor(private store: Store, public dialogRef: MatDialogRef<BaauAutomatedComponent>, private router: Router,private authService:AuthService,
    private custService: CustomerFactoringService, private dialog: MatDialog
  ) {
    const urlSearchParams = new URLSearchParams(window.location.search);

    const params = Object.fromEntries(urlSearchParams.entries());
    this.paramEmailId = params['email'];
    localStorage.setItem('loginEmail', this.paramEmailId);
    // console.log(this.paramEmailId);
    this.send();
  }
  onMobileOtpChange(otp: string) {
    this.otp = otp;
    if (otp.length === 5) {
      this.verifyOtp = true;
    } else {
      this.verifyOtp = false;
    }
  }
  close() {
    // this.store.dispatch(clearState());
    this.dialogRef.close(false);
  }
  submit() {
    let data = {
      eotp: this.otp,
      email: this.paramEmailId,
      loginTypeEnum: "AUTOMATED_BAU"
    }
    this.custService.getToken(data).subscribe(res => {
      if (res['success']) {
        this.custService.setTokenData(res['data'][0]);
        this.authService.getUserDetails().subscribe((res:any)=>{
          localStorage.removeItem('userType')
          this.authService.userDetails=res.data;
          localStorage.setItem('userDetails', JSON.stringify(res.data[0].personalDetails))
          localStorage.setItem('kycDetails', JSON.stringify(res.data[0].kycDetails))
          localStorage.setItem('userType', JSON.stringify(res.data[0].userType));
          localStorage.setItem('bankType', res.data[0]?.bankType);
         if( res.data[0]?.bankType === 'AUTOMATED'){
          this.router.navigateByUrl('/bank-underwriter/new-transaction')
         }
         if(res.data[0]?.bankType === 'SECONDARY_AUTOMATED'){
          this.router.navigateByUrl('/bank-underwriter/secondary-new-transaction-qoute')
         }


        })
      } else {
        this.error = res['message'];
      }
    })
  }
  send() {
    if (this.paramEmailId) {
      let data = {
        email: this.paramEmailId
      }
      this.custService.sendOtpOnEmail(data).subscribe(res => {
        // const popup = this.dialog.open(CommonPopupComponent, {
        //   width: '450px',
        //   data: {
        //     title: 'isAllGood',
        //     message: res['message'],
        //     status: res['success']
        //   },
        // });
      })
    }
  }
}
