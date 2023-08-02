import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FactoringService {

  CREATE_TRANSACTION='/factoring/v2/factoring/create';
  ALL_LIST_BY_STATUS='/factoring/v2/factoring/list';
  GET_TRANSACTION_BY_ID='/factoring/v2/factoring/getById/';
  GET_COMPANIES='/factoring/v2/groupCompanies/getGroupCompanies';
  UPDATE_MULTIPLE='/factoring/v2/factoring/updateMultipleStatus';
  UPLOAD_TRANSACTION='/factoring/v2/factoring/uploadcsv';

  constructor(
    private http:HttpClient,
    private authService:AuthService,
    ) { }


  access_token:any = localStorage.getItem('accessToken');;

 
  createTransaction(data:any){
    const headers = {'Authorization':`Bearer ${this.access_token}`}
    return this.http.post(`${environment.url}${this.CREATE_TRANSACTION}`,data,{headers});
  }

  getListByStatus(data:any){
    // const body ={
    //   "page":0,
    //   "size":5,
    //   "status":"PENDING"
    // }

    
    const headers = {'Authorization':`Bearer ${this.access_token}`}

    return this.http.post(`${environment.url}${this.ALL_LIST_BY_STATUS}`,data,{headers})
  }

  getTransactionById(data:any){

    const headers = {'Authorization':`Bearer ${this.access_token}`}
    return this.http.get(`${environment.url}${this.GET_TRANSACTION_BY_ID}${data}`,{headers})
  }

  getCompany(){


    const headers = {'Authorization':`Bearer ${this.access_token}`};
    return this.http.get(`${environment.url}${this.GET_COMPANIES}`,{headers});
  }

  update(data:any){

    const headers = {'Authorization':`Bearer ${this.access_token}`}
    return this.http.post(`${environment.url}${this.UPDATE_MULTIPLE}`,data,{headers})
  }

  uploadTransaction(data:any){
    const headers = {'Authorization':`Bearer ${this.access_token}`}
    return this.http.post(`${environment.url}${this.UPLOAD_TRANSACTION}`,data,{headers, responseType: 'text'}).toPromise();
  }
  
}
