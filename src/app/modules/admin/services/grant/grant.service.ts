import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrantService {

    Access_Token:string='';
    Refresh_Token:string='';
    userInfo:any;
    public grantId = new BehaviorSubject('');  
    userMessage = this.grantId.asObservable();
    GET_CUSTOMER_LIST = '/v2/customer/list';
    UPDATE_PAYMENT_STATUS = '/v2/customer/userOrderUpdate';
    GET_DETAILS_BY_ID = '/v2/customer/getById';
    UPDATE_KYC_STATUS_PERSONAL = '/v2/customer/userKycUpdate';
    UPDATE_KYC_STATUS_BUSINESS = '/v2/customer/userKycUpdate';
    GET_CUSTOMER_LIST_PAYMENT = '/v2/customer/orderList'

    constructor(
        private http:HttpClient
      ) { }

      getCustomerList(data:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.post(`${environment.admin_url}${this.GET_CUSTOMER_LIST}`,data,{headers});
      }
      updatePaymentStatus(data:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.post(`${environment.admin_url}${this.UPDATE_PAYMENT_STATUS}`,data,{headers});
      }
      getDetailsById(id:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.get(`${environment.admin_url}${this.GET_DETAILS_BY_ID}/${id}`,{headers});
      }
      updataKYCStatusPersoanl(data:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.post(`${environment.admin_url}${this.UPDATE_KYC_STATUS_PERSONAL}`,data,{headers});
      }
      updateKYCStatusBusiness(data:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.post(`${environment.admin_url}${this.UPDATE_KYC_STATUS_BUSINESS}`,data,{headers});
      }
      getCustomerListPayment(data:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.post(`${environment.admin_url}${this.GET_CUSTOMER_LIST_PAYMENT}`,data,{headers});
      }
}