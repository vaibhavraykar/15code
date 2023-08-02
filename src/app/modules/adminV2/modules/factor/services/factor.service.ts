import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FactorService {

  CREATE_FACTOR='/v2/factoring/createFactoringEntity';
  GET_FACTOR_LIST='/v2/factoring/getfactoringEntity';
  GET_FACTOR_ALL_LIST = '/v2/factoring/factorEntitylist';
  UPDATE_FACTOR_STATUS='/v2/factoring/statusUpadtae';
  UPDATE_FACTOR ='/v2/factoring/updateFactoringEntity';
  FILTER = '/v2/factoring/search';
  FILTER_FACTOR = '/v2/pojoMeta/getPojoMeta/MASTER_ENTITY';
  viewFactorData = new BehaviorSubject({});
  viewfactdata = this.viewFactorData.asObservable();
  constructor(private http: HttpClient) {}

  getFactorList(){
    return this.http.get(`${environment.admin_url}${this.GET_FACTOR_LIST}`);
  }
  createFactor(data:any){
    return this.http.post(`${environment.admin_url}${this.CREATE_FACTOR}`,data);
  }
  getAllFactorList(data:any){
    return this.http.post(`${environment.admin_url}${this.GET_FACTOR_ALL_LIST}`,data);
  }
  updateFactorStatus(data:any){
  return this.http.post(`${environment.admin_url}${this.UPDATE_FACTOR_STATUS}`,data);
  }
  updateFactor(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_FACTOR}`,data);
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_FACTOR}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }

 }
