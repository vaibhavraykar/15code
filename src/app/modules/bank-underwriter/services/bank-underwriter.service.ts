import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class BankUnderwriterService {
  WITHDRAW_QUOTATION = '/quotation-api/v2/quotation/withdrawn';
  DRAFT_QUOTATION = '/quotation-api/v2/quotation/draft';
  GET_QUOTATION = '/quotation-api/v2/quotation/findTransactions';
  CANCEl_QUOTATION = '/quotation-api/v2/quotation/cancel';
  SAVE_QUOTATION = '/quotation-api/v2/quotation/saveAndUpdate';
  REJECT_QUOTATION = '/quotation-api/v2/quotation/reject';
  GET_QUOTATION_BY_ID = '/quotation-api/v2/quotation';
  GET_SECONDRY_QUOTATION_BY_ID = '/quotation-api/v2/secondary/quotation/';
  UPDATE_QUOTATION = '/quotation-api/v2/quotation/saveAndUpdate';
  GET_QUOTATION_1 = '/transaction-api/v2/transaction/findQuotations';
  CLOSE_QUOTATION = '/quotation-api/v2/quotation/closed';
  GET_SECONDRY_QUOTATION =
    '/quotation-api/v2/secondary/quotation/findTransactions';
  DRAFT_SECONDRY_QUOTATION = '/quotation-api/v2/secondary/quotation/draft';
  SAVE_SECONDRY_QUOTATION =
    '/quotation-api/v2/secondary/quotation/saveAndUpdate';
  GET_PLAN_CURRENT = '/user-management/v2/plan/current';
  GENERATE_CSV = '/quotation-api/v2/quotation/generateCSV';

  UPDATE_BANK = '/user-management/v2/group_company/updateSecondaryBank';
  ADD_BANK = '/user-management/v2/group_company/addbank';
  GET_BANK = '/user-management/v2/group_company/get/all/partnerbanks';
  GET_BANK_ID = '/user-management/v2/group_company/getbank';
  GENERATE_QUOTATION_CSV = '/quotation-api/v2/secondary/quotation/generateCSV';
  GENERATE_TRANSACTION_CSV =
    '/quotation-api/v2/secondary/transaction/generateCSV';
  WITHDRAW_SECONDARY_QUOTATION =
    '/quotation-api/v2/secondary/quotation/withdrawn';
  DOWNLOAD_BANK_CSV = '/user-management/v2/group_company/download/partnerbanks';
  GET_USER_DETAILS = '/user-management/v2/user/bau/get/all/users';
  DOWNLOAD_USER_DETAILS='/user-management/v2/user/bau/users/download'

  constructor(private http: HttpClient) {}
  getCreditUpdate = new Subject<any>();
  // Withdraw Quotation
  withdrawQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.WITHDRAW_QUOTATION}`,
      data,
      { headers }
    );
  }

  // Cancel Quotation
  cancelQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.CANCEl_QUOTATION}`, data, {
      headers,
    });
  }

  // Save Quotation
  saveQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.SAVE_QUOTATION}`, data, {
      headers,
    });
  }

  // Draft Quotation
  draftQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.DRAFT_QUOTATION}`, data, {
      headers,
    });
  }

  // Reject Quotation
  rejectQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.REJECT_QUOTATION}`, data, {
      headers,
    });
  }

  // Get Quotaion
  getQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.GET_QUOTATION}`, data, {
      headers,
    });
  }
  getQuotation1(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.GET_QUOTATION_1}`, data, {
      headers,
    });
  }

  // Get Quotation By Id
  getQuotationById(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      `${environment.url}${this.GET_QUOTATION_BY_ID}/${data}`,
      { headers }
    );
  }
  getSecondryQuotationById(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      `${environment.url}${this.GET_SECONDRY_QUOTATION_BY_ID}/${data}`,
      { headers }
    );
  }

  // Update Quotation
  updateQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${environment.url}${this.UPDATE_QUOTATION}`, data, {
      headers,
    });
  }

  // Close Quotation
  closeQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.CLOSE_QUOTATION}`, data, {
      headers,
    });
  }

  //secondry
  getSecondryQuatationList(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.GET_SECONDRY_QUOTATION}`,
      data,
      {
        headers,
      }
    );
  }
  draftSecondryTransaction(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.DRAFT_SECONDRY_QUOTATION}`,
      data,
      {
        headers,
      }
    );
  }
  saveSecondryTransaction(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.SAVE_SECONDRY_QUOTATION}`,
      data,
      {
        headers,
      }
    );
  }
  updateSecondryTransaction(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(
      `${environment.url}${this.SAVE_SECONDRY_QUOTATION}`,
      data,
      {
        headers,
      }
    );
  }
  withdrawSecondryTransaction(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}/quotation-api/v2/secondary/quotation/withdrawn`,
      data,
      {
        headers,
      }
    );
  }
  closeSecondryQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}/quotation-api/v2/secondary/quotation/closed`,
      data,
      {
        headers,
      }
    );
  }
  deleteSecondryQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}/quotation-api/v2/secondary/quotation/delete`,
      data,
      {
        headers,
      }
    );
  }
  rejectSecondryQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}/quotation-api/v2/secondary/quotation/reject`,
      data,
      {
        headers,
      }
    );
  }
  acceptSecondryQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}/quotation-api/v2/secondary/transaction/accept`,
      data,
      {
        headers,
      }
    );
  }
  generateTransactionSecondryCSV(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}/transaction-api/v2/secondary/transaction/generateCSV`,
      data,
      {
        headers,
      }
    );
  }
  getCurrentPlan() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers);
    return this.http.get(`${environment.url}${this.GET_PLAN_CURRENT}`, {
      headers,
    });
  }

  generateCSV(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.GENERATE_CSV}`, data, {
      headers,
    });
  }

  addBank(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.ADD_BANK}`, data, {
      headers,
    });
  }
  updateBank(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.UPDATE_BANK}`, data, {
      headers,
    });
  }

  getBank(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_BANK}?${data}`);
  }
  getBankById(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.url}${this.GET_BANK_ID}/${data}`);
  }

  generateQuotationCSV(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.GENERATE_QUOTATION_CSV}`,
      data,
      {
        headers,
      }
    );
  }

  generateTransactionCSV(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.GENERATE_TRANSACTION_CSV}`,
      data,
      {
        headers,
      }
    );
  }
  withdrawSecondaryQuotation(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `${environment.url}${this.WITHDRAW_SECONDARY_QUOTATION}`,
      data,
      {
        headers,
      }
    );
  }
  downloadBankCSV() {
    return this.http.get(`${environment.url}${this.DOWNLOAD_BANK_CSV}`, {
      responseType: 'text',
    });
  }
  addmanageUser(payload: any) {
    return this.http.post(
      `${environment.url}/user-management/v2/user/adduser`,
      payload
    );
  }

  getUser({ page, size, searchInput }: any) {
    return this.http.get(
      `${environment.url}${this.GET_USER_DETAILS}?page=${page}&size=${size}&email=${searchInput}`
    );
  }

  downloadBankUser() {
    return this.http.get(
      `${environment.url}${this.DOWNLOAD_USER_DETAILS}`,{responseType:'text'}
    );
  }
}
