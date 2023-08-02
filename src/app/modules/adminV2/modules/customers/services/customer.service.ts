import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

    GET_CUSTOMER_LIST='/v2/customer/list';
    GET_CUSTOMER_BY_ID='/v2/customer/getById/';
    GET_ALL_ORDER_BY_ID = '/v2/customer/getAllOrdersUserId';
    GET_PENDING_ORDER_BY_ID = '/v2/customer/getPendingOrdersUserId';
    UPDATE_ORDER='/v2/customer/userOrderUpdate';
    GET_ALL_RM_LIST ='/v2/rm/getAllRM';
    GET_SOURCE_LIST ='/v2/customer/getSourceList';
    UPDATE_MAKER_KYC='/v2/customer/userKycUpdate';
    UPDATE_FINANCIALS = '/v2/customer/updateFinancials';
    UPLOAD_PREFERRED_BANK ='/v2/customer/uploadOtherBanks/';
    GET_PREFERRED_BANK_LIST='/v2/customer/getPreferredBanks';
    GET_AGENCY_LIST = '/v2/customer/getAgency';
    GET_MASTER_RATING = '/v2/customer/getMasterRating';
    UPDATE_RATING= '/v2/customer/updateFinancials';
    GET_QUOTATIONBY_ID_BAAU = '/v2/transaction/getQuotationByTxn';
    GET_QUOTE_BY_ID = '/v2/transaction/getQuotationById';
    FILTER = '/v2/customer/search';
    FILTER_USER = '/v2/pojoMeta/getPojoMeta/USER';
    GET_GC_KYC = '/v2/customer/getGroupCompany';
    UPDATE_GC_MAKER_KYC='/v2/customer/gcKycUpdate';
    UPLOAD_PREFERRED_BANK_FOR_GC = '/v2/customer/uploadOtherBanksForGC/';
    GET_ADDUSER_KYC_FOR_BAAU = '/v2/customer/getBaauPendingUser';
    // public orderClickName = new BehaviorSubject('');
    // planData = this.orderClickName.asObservable();
    public selectedUserTypeForTable = new BehaviorSubject('');
    data = this.selectedUserTypeForTable.asObservable();
    public selectedTransactionType = new BehaviorSubject('');
    dataOfTran = this.selectedTransactionType.asObservable();
    // public clickGroupCompany = new BehaviorSubject('');
    // gc = this.clickGroupCompany.asObservable();
    // public userClickName = new BehaviorSubject('');
    // userData = this.userClickName.asObservable();
    public totalQuoteCount = new BehaviorSubject('');
    count = this.totalQuoteCount.asObservable();
  constructor(private http: HttpClient) {}

  // Get All Customer List
  getCustomerList(data: any) {
    return this.http.post(
      `${environment.admin_url}${this.GET_CUSTOMER_LIST}`,
      data
    );
  }
  getCustomerById(data:any){
    return this.http.get(
      `${environment.admin_url}${this.GET_CUSTOMER_BY_ID}${data}`
    );
  }
  getTotalOrderById(data){
    return this.http.post(`${environment.admin_url}${this.GET_ALL_ORDER_BY_ID}`,data);
  }
  getPendingOrderById(data){
    return this.http.post(`${environment.admin_url}${this.GET_PENDING_ORDER_BY_ID}`,data);
  }
  updateOrder(data){
    return this.http.post(`${environment.admin_url}${this.UPDATE_ORDER}`,data);
  }
  getAllRmList(data){
    return this.http.post(`${environment.admin_url}${this.GET_ALL_RM_LIST}`,data);
  }
  getSourceList(){
    return this.http.get(`${environment.admin_url}${this.GET_SOURCE_LIST}`);
  }
  makerKycAction(data){
    return this.http.post(`${environment.admin_url}${this.UPDATE_MAKER_KYC}`,data);
  }
  updateFinancial(data){
    return this.http.post(`${environment.admin_url}${this.UPDATE_FINANCIALS}`,data);
  }
  uploadPreferredBankFile(id,data){
    return this.http.post(`${environment.admin_url}${this.UPLOAD_PREFERRED_BANK}${id}`,data);
  }
  getPreferredBankList(){
    return this.http.get(`${environment.admin_url}${this.GET_PREFERRED_BANK_LIST}`);
  }
  getAgencyList(){
    return this.http.get(`${environment.admin_url}${this.GET_AGENCY_LIST}`);
  }
  getMasterRatingList(data){
    return this.http.post(`${environment.admin_url}${this.GET_MASTER_RATING}`,data);
  }
  updateRating(data){
    return this.http.post(`${environment.admin_url}${this.UPDATE_RATING}`,data);
  }
  baauquotationById(data){
    return this.http.post(`${environment.admin_url}${this.GET_QUOTATIONBY_ID_BAAU}`,data);
  }
  getbaauquotationdetailsByid(id:any){
    return this.http.get(`${environment.admin_url}${this.GET_QUOTE_BY_ID}/${id}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_USER}`);
  }
  getGcKyc(data){
    return this.http.post(`${environment.admin_url}${this.GET_GC_KYC}`,data);
  }
  makerGCKycAction(data){
    return this.http.post(`${environment.admin_url}${this.UPDATE_GC_MAKER_KYC}`,data);
  }
  uploadPreferredBankFileForGc(id,data){
    return this.http.post(`${environment.admin_url}${this.UPLOAD_PREFERRED_BANK_FOR_GC}${id}`,data);
  }
  getUserKycDetailsForbaau(data){
    return this.http.post(`${environment.admin_url}${this.GET_ADDUSER_KYC_FOR_BAAU}`,data);
  }
}
