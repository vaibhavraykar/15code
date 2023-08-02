import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrantRequestsServices {

  GET_CUSTOMER_LIST = '/v2/customer/list';
  GET_CUSTOMER_LIST_PAYMENT = '/v2/customer/orderList';
  UPDATE_PAYMENT_STATUS = '/v2/customer/userOrderUpdate';
  GET_DETAILS_BY_ID = '/v2/customer/getById';
  UPDATE_KYC_STATUS_BUSINESS = '/v2/customer/userKycUpdate';
  RM_LIST = '/v2/rm/list';
  GRANT_RM_STATUS = '/v2/rm/statusUpadtae';
  GET_TRANSACTION_LIST = '/v2/transaction/list';
  UPDATE_STATUS_TRANSACTION = '/v2/transaction/statusUpadtae';
  GET_GC_KYC_LIST = '/v2/customer/getMakerGC';
  UPDATE_GC_KYC_STATUS_BUSINESS = '/v2/customer/gcKycUpdate';
  GET_GC_KYC = '/v2/customer/getGroupCompany';
  FILTER = '/v2/customer/search';
  FILTER_USER = '/v2/pojoMeta/getPojoMeta/USER';
BULK_LIST='/v2/transaction/uploaded/txn/list';
BUlk_APPROVE_DELETE ='/v2/transaction/uploaded/txn/update/status';
// BULK_DELETE =''



  public adminCouponId = new BehaviorSubject('');
  userMessage = this.adminCouponId.asObservable();
  private selectedTabSource = new BehaviorSubject<number>(0);
  selectedTab$ = this.selectedTabSource.asObservable();
  // public gcKycData = new BehaviorSubject([]);
  // data$ = this.gcKycData.asObservable();
  public selectedTabIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) { }

  getCustomerList(data: any) {
    return this.http.post(`${environment.admin_url}${this.GET_CUSTOMER_LIST}`, data);
  }
  getCustomerListPayment(data: any) {
    return this.http.post(`${environment.admin_url}${this.GET_CUSTOMER_LIST_PAYMENT}`, data);
  }
  updatePaymentStatus(data: any) {
    return this.http.post(`${environment.admin_url}${this.UPDATE_PAYMENT_STATUS}`, data);
  }
  getDetailsById(id: any) {
    return this.http.get(`${environment.admin_url}${this.GET_DETAILS_BY_ID}/${id}`);
  }
  updateKYCStatusBusiness(data: any) {
    return this.http.post(`${environment.admin_url}${this.UPDATE_KYC_STATUS_BUSINESS}`, data);
  }
  rmSelected(data: any) {
    return this.http.post(`${environment.admin_url}${this.RM_LIST}`, data);
  }
  grantRmStatus(data: any) {
    return this.http.post(`${environment.admin_url}${this.GRANT_RM_STATUS}`, data);
  }
  getTransactionList(data: any) {
    return this.http.post(`${environment.admin_url}${this.GET_TRANSACTION_LIST}`, data);
  }
  updateStatusTrans(data: any) {
    return this.http.post(`${environment.admin_url}${this.UPDATE_STATUS_TRANSACTION}`, data);
  }
  setSelectedTab(index: number) {
    this.selectedTabSource.next(index);
  }
  getGCKycList(data: any) {
    return this.http.post(`${environment.admin_url}${this.GET_GC_KYC_LIST}`, data);
  }
  updateGCKYCStatusBusiness(data: any) {
    return this.http.post(`${environment.admin_url}${this.UPDATE_GC_KYC_STATUS_BUSINESS}`, data);
  }
  getGcKycViewData(data){
    return this.http.post(`${environment.admin_url}${this.GET_GC_KYC}`,data);
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_USER}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
  getSelectedTabIndex(): Observable<number> {
    return this.selectedTabIndex.asObservable();
  }
  setSelectedTabIndex(index: number): void {
    this.selectedTabIndex.next(index);
  }

  getBulkTransactionList(data: any) {
    return this.http.post(`${environment.admin_url}${this.BULK_LIST}`, data);
  }

  bulkApproveDelete(data: any) {
    return this.http.post(`${environment.admin_url}${this.BUlk_APPROVE_DELETE}`, data);
  }
}