import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerServicesService {
  UPDATE_PERSONAL_DETAILS = '/user-management/v2/details/personal';
  BUSINESS_DETAILS = '/user-management/v2/details/business';
  UPDATE_BUSINESS_DETAILS = '/user-management/v2/details/update/business';
  GET_DOCUMENT_TYPES = '/user-management/v2/documents/all';
  ALL_KYC_DETAILS = '/user-management/v2/kyc/save/all';
  GET_ALL_PRODUCTS = '/user-management/v2/product/ALL/available';
  GET_RECENT_ORDER = '/user-management/v2/orders/recent/order';
  GET_ALL_ORDER = '/user-management/v2/orders/all';
  CREATE_ORDER = '/user-management/v2/orders/create';
  COMPLETE_ORDER = '/user-management/v2/orders/complete';
  RETRY_ORDER = '/user-management/v2/orders/retry/payment';
  APPLY_COUPON = '/user-management/v2/discount/apply';
  GENERATE_PDF = '/user-management/v2/invoice/generate';
  GET_GROUP_COMPANY = '/user-management/v2/group_company/get/all';
  CREATE_GROUP_COMPANY = '/user-management/v2/group_company/create';
  GET_PLAN_CURRENT = '/user-management/v2/plan/current';
  UPDATE_PASSWORD = '/user-management/v2/user/user/update-password';
  CHANGE_PASSWORD = '/user-management/v2/user/changePassword';
  GET_TERMS = '/user-management/v2/terms_and_policy/ALL/get/0';
  FIND_CREDIT_AND_TRANSACTIONS =
    '/transaction-api/v2/transaction/findCreditAndTransactions';
  DOWNLOAD_CREDIT_AND_TRANSACTIONS =
    '/transaction-api/v2/transaction/findCreditAndTransactions/download';
  GET_ALL_INVOICE = '/user-management/v2/invoice/get/all/invoices';

  GET_PENDING_TRANSACTIONS = '/user-management/v2/postpaid/payment/pending';
  CREATE_ORDER_PENDING_TRANSACTIONS = '/user-management/v2/orders/create';
  APPLY_COUPON_PENDING_TRANSACTIONS = '/user-management/v2/discount/apply';

  GET_CURRENT_SUBSCRIPTION_PLANS =
    '/user-management/v2/plan/SUBSCRIPTION_PLAN/current';
  GET_CURRENT_VAAS_PLANS = '/user-management/v2/plan/VAAS_PLAN/current';
  getCreditUpdate = new Subject<any>();

  constructor(private http: HttpClient) {}

  updatePersonalDetails(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.UPDATE_PERSONAL_DETAILS}`,
      data,
      { headers }
    );
  }

  addBusinessDetails(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.BUSINESS_DETAILS}`, data, {
      headers,
    });
  }

  updateBusinessDetails(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.UPDATE_BUSINESS_DETAILS}`,
      data,
      { headers }
    );
  }

  getDocumentTypes() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_DOCUMENT_TYPES}`, {
      headers,
    });
  }

  saveAllKYCDetails(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.ALL_KYC_DETAILS}`, data, {
      headers,
    });
  }

  getAllProducts() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_ALL_PRODUCTS}`, {
      headers,
    });
  }

  getCurrentSubscriptionPlans() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      `${environment.url}${this.GET_CURRENT_SUBSCRIPTION_PLANS}`,
      {
        headers,
      }
    );
  }

  getCurrentVaasPlans() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      `${environment.url}${this.GET_CURRENT_VAAS_PLANS}`,
      {
        headers,
      }
    );
  }

  getRecentOrder() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_RECENT_ORDER}`, {
      headers,
    });
  }

  getAllOrder() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_ALL_ORDER}`, {
      headers,
    });
  }

  createOrder(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.CREATE_ORDER}`, data, {
      headers,
    });
  }

  completeOrder(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.COMPLETE_ORDER}`, data, {
      headers,
    });
  }

  repayOrder(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.RETRY_ORDER}`, data, {
      headers,
    });
  }

  getDiscount(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.APPLY_COUPON}`, data, {
      headers,
    });
  }

  generateInvoice(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.GENERATE_PDF}`, data, {
      headers,
    });
  }

  getGroupCompanySubsidiary() {
    console.log(
      localStorage.getItem('masterToken'),
      localStorage.getItem('accessToken')
    );
    const token = localStorage.getItem('masterToken');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers);
    return this.http.get(`${environment.url}${this.GET_GROUP_COMPANY}`, {
      headers,
    });
  }

  getCurrentPlan() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers);
    return this.http.get(`${environment.url}${this.GET_PLAN_CURRENT}`, {
      headers,
    });
  }

  findCreditAndTransactions(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers);
    return this.http.post(
      `${environment.url}${this.FIND_CREDIT_AND_TRANSACTIONS}`,
      data,
      { headers }
    );
  }

  downloadCreditTransactions(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.DOWNLOAD_CREDIT_AND_TRANSACTIONS}`,
      data,
      { headers, responseType: 'text' }
    );
  }

  updatePassword(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${environment.url}${this.UPDATE_PASSWORD}`, {
      headers,
    });
  }
  changePassword(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(
      `${environment.url}${this.CHANGE_PASSWORD}?old_password=${data.currentPassword}&password=${data.newPassword}&confirm_password=${data.confNewPassword}`,
      {
        headers,
      }
    );
  }

  getTerms() {
    const token = localStorage.getItem('masterToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_TERMS}`, {
      headers,
    });
  }

  getAllInvoice(data: any) {
    const token = localStorage.getItem('masterToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      `${environment.url}${this.GET_ALL_INVOICE}?page=${data.page}&size=${data.size}`,
      {
        headers,
      }
    );
  }

  createGroupCompany(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.CREATE_GROUP_COMPANY}`,
      data,
      { headers }
    );
  }

  getPendingTransactions(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      `${environment.url}${this.GET_PENDING_TRANSACTIONS}?page=${data.page}&size=${data.size}`,
      { headers }
    );
  }

  getPendingTransactionsDiscount(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.APPLY_COUPON_PENDING_TRANSACTIONS}`,
      data,
      {
        headers,
      }
    );
  }

  createPendingTransactionsOrder(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.CREATE_ORDER_PENDING_TRANSACTIONS}`,
      data,
      {
        headers,
      }
    );
  }
  private bannerDisplaySubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  bannerDisplay$ = this.bannerDisplaySubject.asObservable();

  updatebannerDisplay(res: any): void {
    let orderType = res.data[0].orders?.orderLines?.find(
      (ele) => ele.productDetails.productType === 'SUBSCRIPTION_PLAN'
    )?.productDetails?.planType;
    console.log(orderType, 'order----');
    if (orderType === 'POSTPAID') {
      if (res.data[0]?.postpaidPaymentInfo?.paymentStatus === 'PENDING'||
          res.data[0]?.postpaidPaymentInfo?.paymentStatus === 'PENDING_FOR_APPROVAL'
      ) {
        this.bannerDisplaySubject.next(true);
      } else {
        this.bannerDisplaySubject.next(false);
      }
    }
    // const currentValue = this.bannerDisplaySubject.getValue();
    // const newValue = !currentValue;
    // this.bannerDisplaySubject.next(newValue);
  }
}
