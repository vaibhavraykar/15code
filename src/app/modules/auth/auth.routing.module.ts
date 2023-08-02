import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from 'src/app/modules/auth/auth.component';
import { UserDetailsComponent } from './login/user-details/user-details.component';
import { SendOtpComponent } from './login/send-otp/send-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  { 
    path: '', 
    component: AuthComponent
  },
  { 
    path: 'login',
    component:LoginComponent
  },
  { 
    path: 'signup',
    component:SignupComponent
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  },
  {
    path:'signup-form',
    component:SignupFormComponent
  },
  {
    path:'updatepassword',
    component:UpdatePasswordComponent
  },
  { 
    path: "**", 
    redirectTo: "login" 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
