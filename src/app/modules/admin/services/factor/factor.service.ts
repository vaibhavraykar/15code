import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactorService {


  Access_Token:string='';
  Refresh_Token:string='';
  userInfo:any;
  CREATE_FACTOR='/v2/factoring/createFactoringEntity';
  GET_FACTOR_LIST='/v2/factoring/getfactoringEntity';
  GET_FACTOR_ALL_LIST = '/v2/factoring/factorEntitylist';
  UPDATE_FACTOR_STATUS='/v2/factoring/statusUpadtae';
  UPDATE_FACTOR ='/v2/factoring/updateFactoringEntity';
  viewFactorData = new BehaviorSubject({});
  viewfactdata = this.viewFactorData.asObservable();
  callGetApi = new BehaviorSubject(true);
  callgetapi = this.callGetApi.asObservable();
  constructor(
    private http:HttpClient
  ) { }

  setAdminToken(data:any){
    this.Access_Token=data.data[0].access_token;
    this.Refresh_Token=data.data[0].refresh_token;
    this.userInfo=data.data[0].user_info;
    localStorage.setItem('userDetails', JSON.stringify(this.userInfo))
    localStorage.setItem('accessToken',this.Access_Token);
    localStorage.setItem('refreshToken',this.Refresh_Token);
  }

  getFactorList(){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_FACTOR_LIST}`,{headers});
  }
  createFactor(data:any){
    const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.CREATE_FACTOR}`,data,{headers});
  }
  getAllFactorList(data:any){
    const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_FACTOR_ALL_LIST}`,data,{headers});
  }
  updateFactorStatus(data:any){
  const headers = {'Authorization': `Bearer ${this.Access_Token}`};
  return this.http.post(`${environment.admin_url}${this.UPDATE_FACTOR_STATUS}`,data,{headers});
  }
  updateFactor(data:any){
    const headers = {'Authorization': `Bearer ${this.Access_Token}`};
    return this.http.post(`${environment.admin_url}${this.UPDATE_FACTOR}`,data,{headers});
  }
}
