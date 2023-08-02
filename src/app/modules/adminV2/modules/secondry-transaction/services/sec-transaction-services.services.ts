import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable  } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecondaryTransactionServices {
  GET_ALL_SECONDARY_TRANSACTIONS = '/v2/secondaryTransactions/list';
  STATUS_UPDATE = '/v2/transaction/statusUpadtae';
  FILTER_BY_DATE = '/v2/transaction/filter';
  GET_QUOATATION_BY_ID = '/v2/secondaryTransactions/getQuotationByTxnId';
  GET_QUOTE_BY_ID = '/v2/secondaryTransactions/getQuotationById';
  UPDATE_STATUS_TRANSACTION = '/v2/transaction/statusUpadtae';
  GET_TRANSACTOIN_BY_ID = '/v2/secondaryTransactions/details';
  FILTER = '/v2/secondaryTransactions/search';
  FILTER_SEC_TRANS = '/v2/pojoMeta/getPojoMeta/TRANSACTION';


  private transactionAmount: number;
  private lcValue: number;
  private calculatedValue: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  // Get All Primary Transactions
  getAllSecondaryTransactions(data: any) {
    return this.http.post(
      `${environment.admin_url}${this.GET_ALL_SECONDARY_TRANSACTIONS}`,
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
  updateStatusTrans(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_STATUS_TRANSACTION}`,data);
  }
  getTransactionById(id:any){
    return this.http.get(`${environment.admin_url}${this.GET_TRANSACTOIN_BY_ID}/${id}`);
  }
  setTransactionAmount(amount: number): void {
    this.transactionAmount = amount;
    this.updateCalculatedValue();
  }

  setLcValue(value: number): void {
    this.lcValue = value;
    this.updateCalculatedValue();
  }

  private updateCalculatedValue(): void {
    const calculatedValue = this.transactionAmount - this.lcValue;
    this.calculatedValue.next(calculatedValue);
    console.log('value',calculatedValue);
  }
  getCalculatedValue(): Observable<number> {
    return this.calculatedValue.asObservable();
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_SEC_TRANS}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
}
