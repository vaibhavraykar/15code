import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn:'root'
})
export class TransactionService {


  TRASACTION_DRAFT="/transaction-api/v2/transaction/draft";
  GET_LOADING_PORT='/transaction-api/v2/getLoadingPort/';
  SAVE_AND_UPDATE='/transaction-api/v2/transaction/saveAndUpdate';
  UPDATE='/transaction-api/v2/transaction/saveAndUpdate';
  FIND_TRANSACTIONS='/transaction-api/v2/transaction/findTransactions';
  CANCEL_TRANSACTION='/transaction-api/v2/transaction/cancel';
  REJECT_TRANSACTION='/transaction-api/v2/transaction/reject';
  GET_QUOTATIONS_BY_TRANSACTION='/transaction-api/v2/transaction/findQuotations';
  COMPLETE_TRANSACTION='/transaction-api/v2/transaction/complete';
  GET_TRANSACTION_BY_ID='/transaction-api/v2/transaction';
  BG_TYPE='/transaction-api/v2/transaction/getBGType';
  GENERATE_CSV='/transaction-api/v2/transaction/generateCSV';
  GET_PASSCODE_USER='/transaction-api/v2/transaction/getPasscodeUser';
  ACCEPT_QUOTATION='/transaction-api/v2/transaction/accept';
  REJECT_QUOTATION='/transaction-api/v2/transaction/reject'
  GET_QUOTATION_BY_ID='/quotation-api/v2/quotation';
  GET_QUOTATIONS_BY_STATUS='/quotation-api/v2/quotation/findQuotationByStatus';
  QUOTATION_DRAFT='/quotation-api/v2/quotation/draft';
  QUOTATION_SAVE='/quotation-api/v2/quotation/saveAndUpdate';
  QUOTATION_UPDATE='/quotation-api/v2/quotation/saveAndUpdate';
  QUOTATION_WITHDRAWN='/quotation-api/v2/quotation/withdrawn';
  QUOTATION_REJECT='/quotation-api/v2/quotation/reject';
  CANCEL_QUOTATION='/quotation-api/v2/quotation/cancel';
  CLOSE_TRANSACTION='/transaction-api/v2/transaction/closed';
  REOPEN_TRANSACTION='/transaction-api/v2/transaction/reopen';
  REOPEN_SECONDRY_TRANSACTION='/transaction-api/v2/secondary/transaction/reopen/'
  //
  SECONDRY_TRASACTION_DRAFT='/transaction-api/v2/secondary/transaction/draft'
  GET_PARTNER_BANK='/transaction-api/v2/secondary/transaction/partnerBank'
  SECONDRY_TRASACTION_LIST='/transaction-api/v2/secondary/transaction/findTransactions';
  SECONDRY_TRASACTION_BY_ID='/transaction-api/v2/secondary/transaction/';
  SECONDRY_TRASACTION_BY_ID2='/transaction-api/v2/secondary/quotation/getTransaction/';
  SECONDRY_TRASACTION_SAVE='/transaction-api/v2/secondary/transaction/saveAndUpdate';
  SECONDRY_TRASACTION_DELETE='/transaction-api/v2/secondary/transaction/delete';
  SECONDRY_TRASACTION_CANCEL='/transaction-api/v2/secondary/transaction/cancel';
  //

  GET_GROUP_COMPANY='/user-management/v2/group_company/get/all';
  GET_GROUPCOMPANY_LIST = '/user-management/v2/group_company/profile/get/all'; 
  SEARCH_COMPANY_LIST = '/user-management/v2/group_company/search' 
  DOWNLOAD_COMPANY_LIST = '/user-management/v2/group_company/download'


  constructor(
    private http:HttpClient,
  ) { }

  access_token:any = localStorage.getItem('accessToken');

  // Transaction Draft
  transactionDraft(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.TRASACTION_DRAFT}`,data,{headers});
  }

  // Get Loading Port
  getLoadingPort(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.GET_LOADING_PORT}${data}`,{headers})
  }

  // Transaction Save
  transactionSave(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.SAVE_AND_UPDATE}`,data,{headers});
  }

  // Update Transaction
  update(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.put(`${environment.url}${this.UPDATE}`,data,{headers});
  }

  // Find Transactions
  findTransactions(data:any){

    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.FIND_TRANSACTIONS}`,data,{headers});
  }

  // Cancel Transactions
  cancelTransactions(data:any){

    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.CANCEL_TRANSACTION}`,data,{headers});
  }

  // Reject Transaction
  rejectTransaction(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.REJECT_TRANSACTION}`,data,{headers});
  }

  // Find Quotation
  findQuotations(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.GET_QUOTATIONS_BY_TRANSACTION}`,data,{headers});
  }

  // Complete Transaction
  completeTransactions(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.COMPLETE_TRANSACTION}`,data,{headers});
  }

  // Get Transaction By ID
  getTransactionByID(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.GET_TRANSACTION_BY_ID}/${data}`,{headers});
  }

  // GET BG Type
  getBGType(){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.BG_TYPE}`,{headers})
  }

  // Generate CSV
  generateCSV(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.GENERATE_CSV}`,data,{headers});
  }

  // Get Passcode Users for an Account
  getPasscodeUser(){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.GET_PASSCODE_USER}`,{headers})
  }

  // Accept Quotattion
  acceptQuotation(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.ACCEPT_QUOTATION}`,data,{headers});
  }

  // Close Transaction
  closeTransaction(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.CLOSE_TRANSACTION}`,data,{headers});
  }

  // Reopen Transaction
  reopenTransaction(id:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.REOPEN_TRANSACTION}/${id}`,{headers})
  }
  reopenSecondryTransaction(id:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.REOPEN_SECONDRY_TRANSACTION}/${id}`,{headers})
  }

  // Get quotation By ID
  getQuotationById(id:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.get(`${environment.url}${this.GET_QUOTATION_BY_ID}/${id}`,{headers})
  }

  // Get Quotation By Status
  getQuotationByStatus(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.GET_QUOTATIONS_BY_STATUS}`,data,{headers});
  }

  // Draft Quotation
  draftQuotation(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.QUOTATION_DRAFT}`,data,{headers});
  }

  // Quotatotion Save
  quotationSave(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.QUOTATION_SAVE}`,data,{headers});
  }

  // Quotayion Update
  quotationUpdate(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.put(`${environment.url}${this.QUOTATION_UPDATE}`,data,{headers});
  }

  // Quotation Withdrawn
  quotationWithdrawn(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.QUOTATION_WITHDRAWN}`,data,{headers});
  }

  // Quotation Reject
  quotationReject(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.QUOTATION_REJECT}`,data,{headers});
  }

  // Cancel Quotation
  cancelQuotation(data:any){
    const token = localStorage.getItem('accessToken')
    const headers = {'Authorization':`Bearer ${token}`}
    return this.http.post(`${environment.url}${this.CANCEL_QUOTATION}`,data,{headers});
  }
    /*Secondry transaction */
    secondryTransactionDraft(payload:any){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.post(`${environment.url}${this.SECONDRY_TRASACTION_DRAFT}`,payload,{headers});
    }
    getPartnerBankList () {
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.get(`${environment.url}${this.GET_PARTNER_BANK}`,{headers})
    }

    getSecondryTransactionList (payload){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.post(`${environment.url}${this.SECONDRY_TRASACTION_LIST}`,payload,{headers});
    }
    getSecondryTransactionByID (id){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.get(`${environment.url}${this.SECONDRY_TRASACTION_BY_ID}${id}`,{headers});
    }
    getSecondryTransactionByID2 (id){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.get(`${environment.url}${this.SECONDRY_TRASACTION_BY_ID2}${id}`,{headers});
    }

    saveSecondryTransaction (payload){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.post(`${environment.url}${this.SECONDRY_TRASACTION_SAVE}`,payload,{headers});
    }
    editSecondryTransaction (payload){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.put(`${environment.url}${this.SECONDRY_TRASACTION_SAVE}`,payload,{headers});
    }
     deleteSecondryTransaction (payload){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.post(`${environment.url}${this.SECONDRY_TRASACTION_DELETE}`,payload,{headers});
    }
    cancelSecondryTransaction (payload){
      const token = localStorage.getItem('accessToken')
      const headers = {'Authorization':`Bearer ${token}`}
      return this.http.post(`${environment.url}${this.SECONDRY_TRASACTION_CANCEL}`,payload,{headers});
    }
  // Reject Quotation
  rejectQuotation(data: any) {
    const token = localStorage.getItem("accessToken");
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${environment.url}${this.REJECT_QUOTATION}`, data, {
      headers,
    });
  }
  findTransactionsDashboard(data){
    return this.http.post(`${environment.url}${'/transaction-api/v2/transaction/findTransactions'}`, data);
  }

  getGroupCompanySubsidiary(){
    const token = localStorage.getItem('masterToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log(headers)
    return this.http.get(`${environment.url}${this.GET_GROUP_COMPANY}`,{headers});
  }

  getGroupCompanyList(data:any){
    return this.http.get(
      `${environment.url}${this.GET_GROUPCOMPANY_LIST}?page=${data.page}&size=${data.size}&entity_name=${data.searchInput}`
    );
  }

  searchGroupCompany(data:any){
    return this.http.get(
      `${environment.url}${this.SEARCH_COMPANY_LIST}?entity_name=${data.searchInput}&page=${data.page}&size=${data.size}`
    );
  }

  downloadGroupCompanies() {
    return this.http.get(`${environment.url}${this.DOWNLOAD_COMPANY_LIST}`, {
      responseType: 'text',
    });
  }
}
