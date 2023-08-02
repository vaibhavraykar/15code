import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  Access_Token:string='';
  Refresh_Token:string='';
  userInfo:any;
  GET_CUSTOMER_LIST='/v2/customer/list';
  GET_CUSTOMER_BY_ID='/v2/customer/getById/';
  GET_ALL_RM_LIST ='/v2/rm/getAllRM';
  UPDATE_MAKER_KYC='/v2/customer/userKycUpdate';
  GET_SOURCE_LIST ='/v2/customer/getSourceList';
  UPDATE_FINANCIALS = '/v2/customer/updateFinancials';
  GET_PREFERRED_BANK_LIST='/v2/customer/getPreferredBanks';
  UPLOAD_PREFERRED_BANK ='/v2/customer/uploadOtherBanks/';
  GET_AGENCY_LIST = '/v2/customer/getAgency';
  GET_MASTER_RATING = '/v2/customer/getMasterRating';
  UPDATE_RATING= '/v2/customer/updateFinancials';
  GET_ORDERBY_ID = '/v2/customer/getOrderByUserId/';
  GET_QUOTATIONBY_ID_BAAU = '/v2/transaction/getQuotationByTxn';
  GET_QUOTE_BY_ID = '/v2/transaction/getQuotationById';
  GET_ALL_ORDER_BY_ID = '/v2/customer/getAllOrdersUserId';
  GET_PENDING_ORDER_BY_ID = '/v2/customer/getPendingOrdersUserId';
  UPDATE_ORDER='/v2/customer/userOrderUpdate';
  GET_LIST_USER_FOR_SEARCH = '/v2/customer/userIdSearch/';
  SEARCH_USERID = '/v2/customer/filter';
  public selectedUserForTxnView = new BehaviorSubject('');  
  selectedUserOncustomer = this.selectedUserForTxnView.asObservable();
  public orderClickName = new BehaviorSubject('');
  planData = this.orderClickName.asObservable();
  constructor(
    private http:HttpClient
  ) { }

  setAdminToken(data:any){
    this.Access_Token=data.data[0].access_token;
    this.Refresh_Token=data.data[0].refresh_token;
    localStorage.setItem('accessToken',this.Access_Token);
    localStorage.setItem('refreshToken',this.Refresh_Token);
  }
  
  getCustomerList(data){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_CUSTOMER_LIST}`,data,{headers});
  }

  getCustomerById(id){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_CUSTOMER_BY_ID}${id}`,{headers});
  }
  
  getAllRmList(data){
    const headers={'Authorization':`Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.GET_ALL_RM_LIST}`,data,{headers});
  }

  makerKycAction(data){
    const headers={'Authorization':`Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.UPDATE_MAKER_KYC}`,data,{headers});
  }
  getSourceList(){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_SOURCE_LIST}`,{headers});
  }
  updateFinancial(data){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPDATE_FINANCIALS}`,data,{headers});
  }
  getPreferredBankList(){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_PREFERRED_BANK_LIST}`,{headers});
  }
  uploadPreferredBankFile(id,data){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPLOAD_PREFERRED_BANK}${id}`,data,{headers});
  }
  getAgencyList(){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_AGENCY_LIST}`,{headers});
  }
  getMasterRatingList(data){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_MASTER_RATING}`,data,{headers});
  }
  updateRating(data){
    const headers={'Authorization':  `Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.UPDATE_RATING}`,data,{headers});
  }
  getOrderByUserId(id){
    const headers={'Authorization':  `Bearer ${this.Access_Token}`};
    return this.http.get(`${environment.admin_url}${this.GET_ORDERBY_ID}${id}`,{headers});
  }
  baauquotationById(data){
    const headers={'Authorization': `Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.GET_QUOTATIONBY_ID_BAAU}`,data,{headers});
  }
    getbaauquotationdetailsByid(id:any){
      const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.get(`${environment.admin_url}${this.GET_QUOTE_BY_ID}/${id}`,{headers});
    }
  getTotalOrderById(data){
    const headers={'Authorization': `Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.GET_ALL_ORDER_BY_ID}`,data,{headers});
  }
  getPendingOrderById(data){
    const headers = {'Authorization':`Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.GET_PENDING_ORDER_BY_ID}`,data,{headers});
  }
  updateOrder(data){
    const headers = {'Authorization':`Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.UPDATE_ORDER}`,data,{headers});
  }
  getUserListForSearch(data:any,userType:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_LIST_USER_FOR_SEARCH}${userType}/${data}`,{headers});
  }
  getListByUser(data){
    const headers = {'Authorization':`Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.SEARCH_USERID}`,data,{headers});
  }
 }
