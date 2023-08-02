import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {


  Access_Token:string='';
  Refresh_Token:string='';
  userInfo:any;
  GET_ADMINUSER_LIST='/v2/managementPortal/list';
  ADMIN_CREATE_USER='/v2/managementPortal/create';
  GET_USER_BY_ID='/v2/managementPortal/getById';
  UPDATE_USER_BY_ID = '/v2/managementPortal/update';
  UPDATE_USER_STATUS = '/v2/managementPortal/statusUpdate';
  public adminUserId = new BehaviorSubject('');  
  userMessage = this.adminUserId.asObservable();
  public editAdminUserId = new BehaviorSubject('');  
  user = this.editAdminUserId.asObservable();
  public approveByData = new BehaviorSubject([]);
  approvebydata = this.adminUserId.asObservable();

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


  getAdminUserList(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_ADMINUSER_LIST}`,data,{headers});
  }
  createAdminUser(data:any){
    const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.ADMIN_CREATE_USER}`,data,{headers});
  }
  getAdminUserById(id:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_USER_BY_ID}/${id}`,{headers});
  }
  updateAdminUserById(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPDATE_USER_BY_ID}`,data,{headers})
  }
  updataAdminUserStatus(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPDATE_USER_STATUS}`,data,{headers})
  }
}
