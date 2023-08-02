import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { CustomerFactoringService } from '../customer-factoring.service';

@Component({
  selector: 'app-Customer-send-otp',
  templateUrl: './customer-send-otp.component.html',
  styleUrls: ['./customer-send-otp.component.scss']
})
export class CustomerSendOtpComponent {

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
  error:any;
  paramEmailId:any;
  constructor(private store: Store, public dialogRef: MatDialogRef<CustomerSendOtpComponent>,private router: Router,
    private custService :CustomerFactoringService,private dialog: MatDialog
    ){
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      this.paramEmailId=params['email'];
      localStorage.setItem('loginEmail',this.paramEmailId);
      console.log(this.paramEmailId);
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
  submit(){
    let data ={
    eotp:  this.otp,
    email: this.paramEmailId,
    loginTypeEnum: "AUTOMATED_FACTOR"
    }
    this.custService.getToken(data).subscribe(res=>{
      if(res['success']){
        this.custService.setTokenData(res['data'][0]);
        this.router.navigateByUrl('cust/new-request');
      }else{
        this.error = res['message'];
      }
    })
  }
  send(){
    if(this.paramEmailId){
      let data = {
        email : this.paramEmailId
      }
      this.custService.sendOtpOnEmail(data).subscribe(res=>{
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '450px',
          data: {
            title: 'isAllGood',
            message:res['message'],
            status:res['success']
          },
        });    })
    }
  }
}
