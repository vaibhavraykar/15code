import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomerServicesService } from '../../services/customer-services.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit ,AfterContentInit{
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  confirmPassword: boolean = false;
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.createForm();
  }
  constructor(
    private cs: CustomerServicesService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private store: Store,
    private dialog: MatDialog
  ) {}
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.passwordForm.setValue({
        currentPassword: '',
        newPassword: '',
        confNewPassword: ''
      })
    }, 300);
  }
  createForm() {
    this.passwordForm = new FormGroup(
      {
        currentPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        confNewPassword: new FormControl('', [Validators.required]),
      },
      { validators: passwordValidator }
    );
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.passwordForm.controls);
    console.log(this.passwordForm);
    this.passwordForm.markAllAsTouched()
    if (this.passwordForm.valid) {
      // BIND API
      let payload = {
        currentPassword: this.passwordForm.controls['currentPassword'].value,
        newPassword: this.passwordForm.controls['newPassword'].value,
        confNewPassword: this.passwordForm.controls['confNewPassword'].value,
      };
    this.cs.changePassword(payload).subscribe({
      next:(res:any)=>{
        // this.authService.logout().subscribe((res: any) => {
        //   console.log(res);
        //   localStorage.clear();
        //   this.store.dispatch(new Logout());
        //   this.store.dispatch(clearState());
        //   window.location.href = '/auth/login';
        // });
        if(res.success){
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            data: {
              title: 'changePassword',
              email:'',
            },
             disableClose: true
          });
          popup.afterClosed().subscribe(()=>{
             this.authService.logout().subscribe((res: any) => {
            console.log(res);
            localStorage.clear();
            this.store.dispatch(new Logout());
            this.store.dispatch(clearState());
            window.location.href = '/auth/login';
          });
          })
        }

      }
      ,complete:()=>{
        this.dialogRef.close()
      }
    })
    }
    if(this.passwordForm.hasError('pwdMismatch')){
      this.passwordForm.controls['confNewPassword'].setErrors({ pwdMismatch: true });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showNewPassword = !this.showNewPassword;
  }
  togglePasswordVisibility3() {
    this.confirmPassword = !this.confirmPassword;
  }
}

export const passwordValidator: ValidatorFn = (
  formGroup: FormGroup
): ValidationErrors | null => {
  if (
    formGroup.get('newPassword').value ===
    formGroup.get('confNewPassword').value
  ){
    return null;
  }
  else {
    return { pwdMismatch: true };
  }
};
