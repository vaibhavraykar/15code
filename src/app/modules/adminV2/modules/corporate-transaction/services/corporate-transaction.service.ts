import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CorporateTransactionService {

  GET_FACTORING_LIST = '/v2/factoring/list';
  GET_FACTORING_BY_ID='/v2/factoring/getById';
  UPDATE_COMMENT='/v2/factoring/updateComment';
  UPDATE_TRANSACTION_STATUS='/v2/factoring/factorUpadtae';
  GET_FACTOR_LIST='/v2/factoring/getfactoringEntity';
  SEND_EMAIL='/v2/factoring/sendEmail';
  factorEntity = new BehaviorSubject([]);
  dataFactor = this.factorEntity.asObservable();
  SEND_MAIL = '/v2/factoring/sendEmailToCustomer';
  SEND_MAIL_WITH_FEE = '/v2/factoring/sendEmailToCustomer';
  constructor(private http: HttpClient) {}

    getTransactionList(data:any){
      return this.http.post(`${environment.admin_url}${this.GET_FACTORING_LIST}`,data);
    }
    getFactoringById(id:any){
      return this.http.get(`${environment.admin_url}${this.GET_FACTORING_BY_ID}/${id}`);
    }
    updateComment(data:any){
      return this.http.post(`${environment.admin_url}${this.UPDATE_COMMENT}`,data);
    }
    updateTranStatus(data:any){
      return this.http.post(`${environment.admin_url}${this.UPDATE_TRANSACTION_STATUS}`,data);
    }
    getFactorList(){
      return this.http.get(`${environment.admin_url}${this.GET_FACTOR_LIST}`);
    }
    sendemail(data:any){
      return this.http.post(`${environment.admin_url}${this.SEND_EMAIL}`,data);
    }
    sendMailWithoutFee(data:any){
      return this.http.post(`${environment.admin_url}${this.SEND_MAIL}`,data);
    }
    sendMailWithFee(data:any){
      return this.http.post(`${environment.admin_url}${this.SEND_MAIL_WITH_FEE}`,data);
    }

}
