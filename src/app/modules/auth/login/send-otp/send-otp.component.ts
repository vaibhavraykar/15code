import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as LoginActions from '../../state/auth.actions';
import { AuthFacadeService } from '../../state/auth.facade.service';
import { MatDialogRef } from '@angular/material/dialog';
import { clearState } from '../../state/auth.actions';

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.scss'],
})
export class SendOtpComponent implements OnInit {
  otpError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService,
    private authFacadeService: AuthFacadeService,
    public dialogRef: MatDialogRef<SendOtpComponent>
  ) {}

  ngOnInit(): void {
    // this.authFacadeService.getPasscodeResult$.subscribe((store:any)=>{
    //   this.storeData=store;
    //   if(this.storeData&&this.storeData.stateCollection.passcodeResponse){
    //     this.router.navigateByUrl('/factoring/new-transact');
    //     this.dialogRef.close();
    //   }
    //   else if(this.storeData&&this.storeData.stateCollection.errorMessage){
    //     this.errorMessage = this.storeData.stateCollection.errorMessage.error.message
    //   }
    // })
  }

  storeData: any;
  otp!: string;
  verifyOtp: boolean = false;

  config = {
    allowNumbersOnly: true,
    length: 5,
    inputStyles: {
      fontSize: '14px',
    },
  };

  onMobileOtpChange(otp: string) {
    this.otp = otp;
    if (otp.length === 5) {
      this.verifyOtp = true;
    } else {
      this.verifyOtp = false;
    }
  }

  resendOTP(){
    this.authFacadeService.sendOTP(this.authService.email,this.authService.name);
  }

  verifyOTP() {
    this.authFacadeService.passcodeLogin(
      this.authService.name,
      this.authService.userId,
      this.otp,
      this.authService.email
    );

    // this.router.navigateByUrl('/factoring/new-transact');
  }
  close() {
    this.store.dispatch(clearState());
    this.dialogRef.close(false);
  }
}
