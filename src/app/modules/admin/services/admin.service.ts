import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  Access_Token:string='';
  Refresh_Token:string='';
  userInfo:any;
  ADMIN_GET_TOKEN='/v2/auth/login/token';
  GET_FACTORING_LIST='/v2/factoring/list';
  GET_FACTORING_BY_ID='/v2/factoring/getById';
  UPDATE_COMMENT='/v2/factoring/updateComment';
  GET_ALL_ROLE='/v2/role/getAll';
  GET_ALL_COUNTRY = '/user-management/v2/country/all/names';
  GET_ALL_GOODS = '/user-management/v2/goods/all';
  GET_RIGHTS_BY_ROLE_NAME = '/v2/role/getRights/';

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

  getAdminToken(userID:any,pwd:any){
    var data={
      "userName":userID.toUpperCase(),
      "password":pwd,
      "loginTypeEnum" : "ADMIN_USER"
    }
    localStorage.setItem('userName',userID.toUpperCase());
    return this.http.post(`${environment.admin_url}${this.ADMIN_GET_TOKEN}`,data);
  }

  getAllCountryCode() {
    return this.http.get(`${environment.url}${this.GET_ALL_COUNTRY}`);
  }

  getAllGoods(){
    return this.http.get(`${environment.url}${this.GET_ALL_GOODS}`);
  }
  getFactoringList(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_FACTORING_LIST}`,data,{headers});
  }

  getFactoringById(id:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_FACTORING_BY_ID}/${id}`,{headers});
  }
  updateComment(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPDATE_COMMENT}`,data,{headers});
  }
  getAllRole(){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_ALL_ROLE}`,{headers});
  }
  getRightByRoleName(id){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_RIGHTS_BY_ROLE_NAME}${id}`,{headers});
  }
}
