import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CustomerFactoringService {


  GET_ALL_TRANSACTION = '/factoring/v2/eligibleFactoring/list';
  GET_DETAILS_BY_ID = '/factoring/v2/eligibleFactoring/getById';
  UPDATE_STATUS_TRANSACTION = '/factoring/v2/eligibleFactoring/statusUpadtae';
  SEND_OTP_EMAIL='/user-management/v2/user/send/email/verificationCode';
  SEND_OTP_FOR_TOKEN='/user-management/v2/user/master/token';
  public isLogout = new BehaviorSubject(false);
  islogout = this.isLogout.asObservable();

  constructor(
    private http:HttpClient,
  ) { }

  setTokenData(data){
    localStorage.setItem('refreshToken', data.refresh_token);
    localStorage.setItem('accessToken', data.access_token);
    console.log("Done setting tokens");

  }

  getAllTransactionList(data){
    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}`};
    return this.http.post(`${environment.url}${this.GET_ALL_TRANSACTION}`,data,{headers});
  }

  viewDataById(id){
    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}`};
    return this.http.get(`${environment.url}${this.GET_DETAILS_BY_ID}/${id}`,{headers});
  }
  updateTranStatus(data){
    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.UPDATE_STATUS_TRANSACTION}`,data,{headers});
  }
  sendOtpOnEmail(data){
    return this.http.put(`${environment.url}${this.SEND_OTP_EMAIL}`,data);
  }
  getToken(data){
    return this.http.post(`${environment.url}${this.SEND_OTP_FOR_TOKEN}`,data);
  }


}
