import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrimaryTransactionServicesService {
  GET_ALL_PRIMARY_TRANSACTIONS = '/v2/transaction/list';
  STATUS_UPDATE = '/v2/transaction/statusUpadtae';
  FILTER_BY_DATE = '/v2/transaction/filter';
  GET_QUOATATION_BY_ID = '/v2/transaction/getQuotationByTxnId';
  GET_QUOTE_BY_ID = '/v2/transaction/getQuotationById';
  FILTER = '/v2/transaction/search';
  UPDATE_STATUS_TRANSACTION = '/v2/transaction/statusUpadtae';
  RELAY_TRANSACTION = '/v2/transaction/relayTxn';
  FILTER_USER = '/v2/pojoMeta/getPojoMeta/TRANSACTION';


  constructor(private http: HttpClient) {}

  // Get All Primary Transactions
  getAllPrimaryTransactions(data: any) {
    return this.http.post(
      `${environment.admin_url}${this.GET_ALL_PRIMARY_TRANSACTIONS}`,
      data
    );
  }

  updateStatus(data: any) {
    return this.http.post(
      `${environment.admin_url}${this.STATUS_UPDATE}`,
      data
    );
  }

  filterByDate(data:any){
    return this.http.post(
      `${environment.admin_url}${this.FILTER_BY_DATE}`,
      data
    );
  }
  quoatationById(id:any){
    return this.http.get(`${environment.admin_url}${this.GET_QUOATATION_BY_ID}/${id}`);
  }
  getQuoteById(id:any){
    return this.http.get(`${environment.admin_url}${this.GET_QUOTE_BY_ID}/${id}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
  updateStatusTrans(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_STATUS_TRANSACTION}`,data);
  }
  relayTransaction(data:any){
    return this.http.post(`${environment.admin_url}${this.RELAY_TRANSACTION}`,data);
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_USER}`);
  }
}
