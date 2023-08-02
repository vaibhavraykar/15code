import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as LoginActions from '../../state/auth.actions';
import { AuthService } from '../../services/auth.service';
import { AuthFacadeService } from '../../state/auth.facade.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendOtpComponent } from '../send-otp/send-otp.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { clearState } from '../../state/auth.actions';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  form!: FormGroup;
  email: string;
  name: string;
  formSubmit = false;
  formBuilder: any;
  storeData;
  any;
  errorMessage: string = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private authFacadeService: AuthFacadeService,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.authFacadeService.getOTPResult$.subscribe((store:any)=>{
    //   console.log(store,"From UserDetails");
    //   this.storeData = store;
    //   if(this.storeData&&this.storeData.stateCollection.sendOtpEmailResponse){
    //     this.dialogRef.close();
    //     const dialogRefOtp = this.dialog.open(SendOtpComponent);
    //     dialogRefOtp.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //     });
    //   }
    //   else if(this.storeData&&this.storeData.stateCollection.errorMessage){
    //     this.errorMessage = this.storeData.stateCollection.errorMessage.error.message
    //   }
    // })
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.valid, 'this.loginForm.valid');
    }
  }

  sendOTP() {
    if (this.email && this.name) {
      console.log(this.email, 'Email\n', this.name, 'Name');
      var data = {
        email: this.email,
        name: this.name,
      };
      this.authFacadeService.sendOTP(this.email, this.name);

      // this.router.navigateByUrl('auth/login/send-otp');
    }
  }

  emailIDHandler(event: any) {
    this.email = event;
  }

  nameHandler(event: any) {
    this.name = event;
  }
  close() {
    this.store.dispatch(clearState());
    this.dialogRef.close();
  }
}
