import { AfterViewInit, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import {AuthService} from '../services/auth.service';






@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent  implements AfterViewInit{

  token:any;
  passwordChangeForm!:FormGroup;
  showNewPassword:boolean=false;
  showConfirmPassword:boolean=false;

  constructor(private authService:AuthService,
  private route:ActivatedRoute,
  private fb:FormBuilder,
  public dialog: MatDialog,){

  }
  ngAfterViewInit(): void {
    this.passwordChangeForm.controls['newPassword'].setValue('');
    this.passwordChangeForm.controls['confirmPassword'].setValue('')
  }


  ngOnInit(){
    this.route.queryParams.subscribe(params=>{
      console.log(params);
      this.token=params['token'];
      console.log(this.token);
    });

    // this.form = this.fb.group({
    //   password:new FormControl('',[Validators.required]),
    //   confirmPassword : new FormControl('',[Validators.required])
    // },
    // // {
    // //   validator: ConfirmPasswordValidator('password','confirmPasssword'),
    // // }
    // )

    this.passwordChangeForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])}
      , {
        validator: ConfirmPasswordValidator('newPassword', 'confirmPassword')
      }
    )
  }

  get password() { return this.passwordChangeForm.get('newPassword'); }
  get password2() { return this.passwordChangeForm.get('confirmPassword'); }

  get form(){
    return this.passwordChangeForm.controls;
  }

  onPasswordInput() {
    if (this.passwordChangeForm.hasError('passwordMismatch'))
      this.passwordChangeForm['confirmPassword'].setErrors([{'passwordMismatch': true}]);
    else
      this.passwordChangeForm['confirmPassword'].setErrors(null);
  }

  submit(){
    if(this.passwordChangeForm.value.newPassword==this.passwordChangeForm.value.confirmPassword){
      console.log('Passwords Match');
      this.authService.updatePassword(this.token,this.passwordChangeForm.value.newPassword,this.passwordChangeForm.value.confirmPassword).subscribe((res:any)=>{
        console.log(res);
        if(res.success){
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            data: {
              title: 'updatePwdSuccess',
              email: res.data[0].email,
            },
             disableClose: true
          });
        }
      })
    }
    else{
      console.log("Does not Match");
    }
  }

  togglePasswordVisibility1(){
    this.showNewPassword=!this.showNewPassword;
  }
  togglePasswordVisibility2(){
    this.showConfirmPassword=!this.showConfirmPassword;
  }
}

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors) {
        return;
    }
    if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
    } else {
        matchingControl.setErrors(null);
    }
}


}

