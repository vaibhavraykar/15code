import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForgetPassPopupComponent } from 'src/app/components/forget-pass-popup/forget-pass-popup.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  userIdOrEmail:string = '';
  constructor(private router: Router, private dialog: Dialog, private authService : AuthService) {}

  ngOnInit(): void {}

  updateValueText(event : any) {
    this.userIdOrEmail = event;
  }

  submit() {
    if(this.userIdOrEmail != ''){
      this.authService.forgotPassword(this.userIdOrEmail).subscribe((res : any) => {
        if(res){        
          this.dialog.open(ForgetPassPopupComponent,{disableClose:true});
        }
      })
    }
    // this.router.navigateByUrl('auth/login');
  }
  back() {
    this.router.navigateByUrl('auth/login');
  }
}
