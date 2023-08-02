import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactoringService {

  // CREATE_TRANSACTION='/factoring/v2/factoring/create';
  // ALL_LIST_BY_STATUS='/factoring/v2/factoring/list';
  // GET_TRANSACTION_BY_ID='/factoring/v2/factoring/getById/';
  GET_COMPANIES='/factoring/v2/groupCompanies/getGroupCompanies';
  // UPDATE_MULTIPLE='/factoring/v2/factoring/updateMultipleStatus';
  // UPLOAD_TRANSACTION='/factoring/v2/factoring/upload';
  GET_TRANSACTION_LIST = '/v2/transaction/list';
  GET_TRANSACTION_BY_ID = '/v2/transaction/getById';
  GET_QUOATATION_BY_ID = '/v2/transaction/getQuotationByTxnId';
  GET_QUOTE_BY_ID = '/v2/transaction/getQuotationById';
  UPDATE_STATUS_TRANSACTION = '/v2/transaction/statusUpadtae';
  FILTER_TRANSACTION = '/v2/transaction/filter';
  SEND_MAIL = '/v2/factoring/sendEmailToCustomer';
  SEND_MAIL_WITH_FEE = '/v2/factoring/sendEmailToCustomer';
  public transId = new BehaviorSubject('');  
  userMessage = this.transId.asObservable();
  public sendEmailData = new BehaviorSubject([]);
  approvebydata = this.sendEmailData.asObservable();
  SEND_EMAIL='/v2/factoring/sendEmail';
  UPDATE_TRANSACTION_STATUS='/v2/factoring/factorUpadtae';

  access_token:any = localStorage.getItem('accessToken');

  constructor(
    private http:HttpClient,
    ) { }


    getCompany(){


      const headers = {'Authorization':`Bearer ${this.access_token}`};
      return this.http.get(`${environment.url}${this.GET_COMPANIES}`,{headers});
    }
    sendemail(data:any){
      const headers = {'Authorization':`Bearer ${this.access_token}`};
      return this.http.post(`${environment.admin_url}${this.SEND_EMAIL}`,data,{headers});
    }
    updateTranStatus(data:any){
      const headers = {'Authorization':`Bearer ${this.access_token}`};
      return this.http.post(`${environment.admin_url}${this.UPDATE_TRANSACTION_STATUS}`,data,{headers});
    }
    getTransactionList(data:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.post(`${environment.admin_url}${this.GET_TRANSACTION_LIST}`,data,{headers});
    }
    transactionId(id:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.get(`${environment.admin_url}${this.GET_TRANSACTION_BY_ID}/${id}`,{headers});
    }
    quoatationById(id:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.get(`${environment.admin_url}${this.GET_QUOATATION_BY_ID}/${id}`,{headers});
    }
    getQuoteById(id:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.get(`${environment.admin_url}${this.GET_QUOTE_BY_ID}/${id}`,{headers});
    }
    updataStatusTrans(data:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.post(`${environment.admin_url}${this.UPDATE_STATUS_TRANSACTION}`,data,{headers});
    }
    filterTransactions(data:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.post(`${environment.admin_url}${this.FILTER_TRANSACTION}`,data,{headers});
    }
    sendMailWithoutFee(data:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.post(`${environment.admin_url}${this.SEND_MAIL}`,data,{headers});
    }
    sendMailWithFee(data:any){
      const headers={ 'Authorization': `Bearer ${this.access_token}` };
      return this.http.post(`${environment.admin_url}${this.SEND_MAIL_WITH_FEE}`,data,{headers});
    }
  
}
