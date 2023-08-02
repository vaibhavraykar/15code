import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import {RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component'
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthRoutingModule } from 'src/app/modules/auth/auth.routing.module';
import { AllMaterialModule } from 'src/app/material-module';
import { authReducer } from 'src/app/modules/auth/state/auth.reducers';
import { AuthEffect } from 'src/app/modules/auth/state/auth.effects';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserDetailsComponent } from './login/user-details/user-details.component';
import { SendOtpComponent } from './login/send-otp/send-otp.component';
import { AuthFacadeService } from 'src/app/modules/auth/state/auth.facade.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { NguCarouselModule } from '@ngu/carousel';
import { ComponentsModule } from 'src/app/components/components.module';
import { SliderComponent } from './slider/slider.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { SelectSignupComponent } from './select-signup/select-signup.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    UserDetailsComponent,
    SendOtpComponent,
    SignupFormComponent,
    SelectSignupComponent,
    UpdatePasswordComponent
  ],
  imports: [
    SliderComponent,
    CommonModule,
    NgOtpInputModule,
    RouterModule,
    AuthRoutingModule,
    AllMaterialModule,
    StoreModule.forFeature('AUTH', authReducer),
    EffectsModule.forFeature([AuthEffect]),
    // SharedModule,
    NgOtpInputModule,
    ComponentsModule
  ],
  providers: [
    AuthFacadeService
  ],
})
export class AuthModule { }
