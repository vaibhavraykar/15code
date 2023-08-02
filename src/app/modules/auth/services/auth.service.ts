import {HttpClient} from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Subject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { Logout } from 'src/app/store/actions/logout.action';
import { CustomerServicesService } from '../../customer/services/customer-services.service';

@Injectable({
    providedIn: 'root'
  })
export class AuthService
{
    Token: string = "";
    Master_Token = "";
    private readonly REFRESH_TOKEN: string = 'refreshToken';
    Access_Token: string = "";
    GET_MASTER_TOKEN = '/user-management/v2/user/master/token';
    GET_PASSCODE_TOKEN = '/user-management/v2/user/user/token';
    SEND_OTP_EMAIL = '/user-management/v2/user/send/email/accesscode';
    UPDATE_PASSWORD = '/user-management/v2/user/user/update-password';
    CREATE_USER = '/user-management/v2/user/create';
    GET_USER_DETAILS='/user-management/v2/details/user';
    LOGOUT='/user-management/v2/user/logout';
    FORGOT_PASSWORD='/user-management/v2/user/forgotPassword';
    GET_GROUP_COMPANY='/user-management/v2/group_company/get/all';
    GET_THIRD_PARTY='/user-management/v2/refer/thirdparty'
    userId:string='';
    email:string='';
    name:string='';
    userDetails:any=[];
    public onBoardingStatus:any;

    constructor(private http: HttpClient,
      private router:Router,
      private customerService:CustomerServicesService,
      private store:Store) {}
    token() {
      return this.Token;
    }

    public setMasterTokens(data: any) {
      this.Token = data[0].IdToken;
      this.Master_Token = data[0].access_token;
      localStorage.setItem('refreshToken', data[0].refresh_token);
      localStorage.setItem('masterToken', data[0].access_token);
      localStorage.setItem('onBoardingStatus',data[0].on_boarding_status);
      // this.getGroupCompanySubsidiary().subscribe((res:any)=>{
      //   console.log(res.data[0])
      //   localStorage.setItem('groupCompany',JSON.stringify(res.data[0]))
      // })
      console.log("Done setting tokens");
    }

    public setTokens(data: any) {
      this.Token = data[0].IdToken;
      this.Access_Token = data[0].access_token;
      localStorage.setItem('refreshToken', data[0].refresh_token);
      localStorage.setItem('accessToken', data[0].access_token);
      localStorage.setItem('onBoardingStatus',data[0].on_boarding_status);
      console.log("Done setting tokens");
    }


    getTokens(refresh_token: string): Observable<any> {
      const data = {
        refresh_token: refresh_token,
      };
      return this.http.post(environment.url, data);
    }

    createUser(data: any) {
      return this.http.post(`${environment.url}${this.CREATE_USER}`, data);
    }

    getMasterCode(userId: string, password: string) {
      this.userId=userId;
      const data = {
        userName: userId,
        password: password,
        loginTypeEnum: "MASTER_USER"
      };

      console.log(this.http.post(`${environment.url}${this.GET_MASTER_TOKEN}`, data), 'check');
      return this.http.post(`${environment.url}${this.GET_MASTER_TOKEN}`, data);
    }

    getPassCodeToken(userName: string, empId: string, eotp : string, email : string) {
      const data = {
        firstName: userName,
        empId: empId,
        eotp: eotp,
        email: email,
        loginTypeEnum: "PASSCODE_USER"
      };

      const token = localStorage.getItem('masterToken');

      // const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
      const headers = { 'Authorization': `Bearer ${token}` };

      return this.http.post(`${environment.url}${this.GET_PASSCODE_TOKEN}`, data,{headers});

    }

    sendOTPEmail(userEmail: string, userName: string) {
      this.name = userName;
      this.email=userEmail;
      const data = {
        email: userEmail,
        userName: userName,
        empId:this.userId
      };

      const token = localStorage.getItem('masterToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // const headers = { 'Authorization': `Bearer ${this.Access_Token}` };

      return this.http.put(`${environment.url}${this.SEND_OTP_EMAIL}`, data,{headers});
    }

    updatePassword(token: string, password: string, confirm_password : string) {
      const data = {
        "token":token,
        "password":password,
        "confirmPassword":confirm_password
      };
      return this.http.put(`${environment.url}${this.UPDATE_PASSWORD}`, data);
    }

    getUserDetails(){
      const headers = { 'Authorization': `Bearer ${this.Master_Token}` };
      return this.http.get(`${environment.url}${this.GET_USER_DETAILS}`,{headers}).pipe(tap((res:any)=>{
        localStorage.setItem('userDetails', JSON.stringify(res.data[0].personalDetails))
        localStorage.setItem('kycDetails', JSON.stringify(res.data[0].kycDetails))
        localStorage.setItem('onBoardingStatus', res.data[0].onboardingStepsStatus)
        localStorage.setItem('postpaidPaymentInfo',JSON.stringify(res.data[0].postpaidPaymentInfo||{}) )
        this.customerService.updatebannerDisplay(res)
      }));
    }



    appLogout(url:any=''){
      if(url.indexOf('user/changePassword') > 0){

      }else{
        if(!(url.indexOf('user/token') > 0)){
          localStorage.clear();
          this.store.dispatch(new Logout());
          this.store.dispatch(clearState());
        }
          this.router.navigateByUrl('/auth/login');
      }


    }
    logout(){
      const data = {

      }
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      // const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.post(`${environment.url}${this.LOGOUT}`,data,{headers});
    }

    public startTokenUpdateTimer(time: number) {
      this.refreshToken(time).subscribe((data) => {

        this.setTokens(data);
      });
    }

    public refreshToken(minutes: number) {
      return new Observable<any>((subscriber) => {
        interval(1000 * 60 * minutes).subscribe((x) => {
          const refreshToken: any = localStorage.getItem(this.REFRESH_TOKEN);

          this.getTokens(refreshToken).subscribe((response) => {
            subscriber.next(response);
          });
        });
      });
    }


    forgotPassword(userIdOrMail : any){
      let data :any  = {}
      // const token = localStorage.getItem('accessToken');
      // const headers = { 'Authorization': `Bearer ${token}` };
      return this.http.post(`${environment.url}${this.FORGOT_PASSWORD}?forgotAttribute=${userIdOrMail}`, data);
    }

    getGroupCompanySubsidiary(){
      console.log(localStorage.getItem('masterToken'),localStorage.getItem('accessToken'))
      const token = localStorage.getItem('masterToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      console.log(headers)
      return this.http.get(`${environment.url}${this.GET_GROUP_COMPANY}`,{headers});
    }
    getThirdPartyDetails({token,name}:any){

      return this.http.post(`${environment.url}${this.GET_THIRD_PARTY}?token=${token}&third_party_name=${name}`,{});
    }
}
