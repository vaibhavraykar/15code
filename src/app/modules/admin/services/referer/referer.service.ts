import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefererService {
    Access_Token:string='';
    Refresh_Token:string='';
    userInfo:any;
    GET_CUSTOMER_LIST = '/v2/customer/list';
    UPDATE_MAKER_KYC = '/v2/customer/userKycUpdate';
    GET_REFERRER_BY_ID = '/v2/customer/getReferrerListByUserId';
    SEARCH_USERID = '/v2/customer/filter';
    GET_LIST_USER_FOR_SEARCH = '/v2/customer/userIdSearch/';
    // public selectedUserForRefererView = new BehaviorSubject('');  
    // selectedUserOnReferer = this.selectedUserForRefererView.asObservable();
    private selectedUserForRefererView = new BehaviorSubject({ id: '', status: '' });
    selectedUserOnReferer = this.selectedUserForRefererView.asObservable();


    constructor(
        private http:HttpClient
      ) { }

      getCustomerList(data:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.post(`${environment.admin_url}${this.GET_CUSTOMER_LIST}`,data,{headers});
      }
      makerKycAction(data){
        const headers={'Authorization':`Bearer ${this.Access_Token}`};
        return this.http.post(`${environment.admin_url}${this.UPDATE_MAKER_KYC}`,data,{headers});
      }
      refererById(data){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` }; 
        return this.http.post(`${environment.admin_url}${this.GET_REFERRER_BY_ID}`,data,{headers});
      }
      setSelectedUserForRefererView(id: any, status: any) {
      this.selectedUserForRefererView.next({ id: id, status: status });
      }
      getListByUser(data){
        const headers = {'Authorization':`Bearer ${this.Access_Token}`};
        return this.http.post(`${environment.admin_url}${this.SEARCH_USERID}`,data,{headers});
      }
      getUserListForSearch(data:any,userType:any){
        const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
        return this.http.get(`${environment.admin_url}${this.GET_LIST_USER_FOR_SEARCH}${userType}/${data}`,{headers});
      }
}