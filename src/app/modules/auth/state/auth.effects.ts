import { Injectable } from '@angular/core';
import { Observable, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable()
export class AuthEffect {
    constructor(
        private actions$ : Actions,
        private authService : AuthService,
        private router:Router,
        ){ }

        Login$ = createEffect(() => this.actions$.pipe(
          ofType(AuthActions.LOGIN),
          switchMap((payload : any) => {
            
            console.log("Input",payload)
            return this.authService
              .getMasterCode(payload.userId, payload.password)
              .pipe(
                map((response: any) => {
                  console.log(response);
                  if (response != null && response.success) {
                    console.log('LogIn', response.data[0].user_info);
                    this.authService.setMasterTokens(response.data);
                    localStorage.setItem('userInfo',JSON.stringify(response.data[0].user_info));
                    /* this.authService.startTokenUpdateTimer(
                      response.data[0].expires_in / 60 - 5
                    ); */
                    // if(response.data[0].user_info.isPaymentDone&&response.data[0].user_info.isPersonalKycApproved&&response.data[0].user_info.isBusinessKycApproved){
                    //   this.authService.getGroupCompanySubsidiary().subscribe((res:any)=>{
                    //     console.log(res.data[0])
                    //     localStorage.setItem('groupCompany',JSON.stringify(res.data[0]))
                    //   })
                    // }
                    this.authService.Master_Token=response.data[0].access_token;
                    this.authService.getUserDetails().subscribe((res:any)=>{
                      this.authService.userDetails=res.data;
                      localStorage.setItem('userDetails', JSON.stringify(res.data[0].personalDetails))
                      localStorage.setItem('kycDetails', JSON.stringify(res.data[0].kycDetails))
                    });
                    return AuthActions.LOGINSUCCESS({response : response});
                  }else {
                    return AuthActions.LOGINFAILURE({
                      error: 'Incorrect user name and/or password.',
                    });
                  }
                }),
                catchError((error) => {
                  console.log('LogIn Error', error);
                
                  return observableOf(AuthActions.LOGINFAILURE({ error: error }));
                })
              );
          })
        ) 
      );

      PasscodeLogin$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.PASSCODELOGIN),
        switchMap((payload : any) => {
          console.log("INput",payload)
          return this.authService
            .getPassCodeToken(payload.userName,payload.empId,payload.otp, payload.email)
            .pipe(
              map((response: any) => {
                if (response != null && response.success) {
                  console.log('LogIn', response);
                  this.authService.setTokens(response.data);
                  localStorage.setItem('refreshToken', response.data[0].refresh_token);
                  /* this.authService.startTokenUpdateTimer(
                    response.data[0].expires_in / 60 - 5
                  ); */
                  return AuthActions.PASSCODESUCCESS({response : response});
                }else {
                  return AuthActions.PASSCODEFAILURE({
                    error: 'Incorrect user details.',
                  });
                }
              }),
              catchError((error) => {
                console.log('LogIn Error', error);
                return observableOf(AuthActions.PASSCODEFAILURE({ error: error }));
              })
            );
        })
      ) 
    );

    OTPGenerateLogin$ = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.OTPGENERATELOGIN),
      switchMap((payload : any) => {
        console.log("INput",payload)
        return this.authService
          .sendOTPEmail(payload.userEmail,payload.userName)
          .pipe(
            map((response: any) => {
              console.log(response,"OTP Login Resposne")
              if (response != null && response.success) {
                console.log('Generate OTP', response);
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                console.log(userInfo);
                if(userInfo.isPaymentDone&&userInfo.isPersonalKycApproved&&userInfo.isBusinessKycApproved){
                      if (
                        userInfo.subscriberType !== 'BANK' &&
                        userInfo.subscriberType !== 'BANK_AS_UNDERWRITER'
                      ) {
                        this.authService
                          .getGroupCompanySubsidiary()
                          .subscribe((res: any) => {
                            console.log(res.data[0]);
                            localStorage.setItem(
                              'groupCompany',
                              JSON.stringify(res.data[0])
                            );
                          });
                      }
                }    
                return AuthActions.OTPGENERATESUCCESS({response : response});
              }else {
                return AuthActions.OTPGENERATEFAILURE({
                  error: 'Incorrect user details.',
                });
              }
            }),
            catchError((error) => {
              console.log('LogIn Error', error);
              return observableOf(AuthActions.OTPGENERATEFAILURE({ error: error }));
            })
          );
      })
    ) 
  );
  
  // LoginSuccess =createEffect(() =>  this.actions$.pipe(
  //   ofType(AuthActions.LoginSuccess),
  //   tap((response:any) => {
  //     if(response.payload &&
  //       response.payload.IdToken &&
  //       response.payload.RefreshToken){
  //         // console.log("SUccess RESPOONSE",response,
  //         //   "PAYLOAD",response.payload,
  //         //   "REFRESH TOKEN",response.payload.RefreshToken);
  //         this.authService.setTokens(response.payload);
  //         localStorage.setItem('refreshToken', response.payload.RefreshToken);
  //         this.authService.startTokenUpdateTimer(
  //           response.payload.expires_in / 60 - 5
  //         );
  //       }
  //       else if (
  //         response.payload.ChallengeName === undefined ||
  //         response.payload.ChallengeName === 'NEW_PASSWORD_REQUIRED'
  //       ) 
  //       {
  //         this.router.navigate(['auth/login/user-details']);
  //       }
  //   })
  //   ));

    LoginFailure : Observable<any> = this.actions$.pipe(
      ofType(AuthActions.LOGINFAILURE),
      tap((error) => {})
    );

}
