import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class RMService{

    Access_Token:string='';
    Refresh_Token:string='';
    RM_LIST = '/v2/rm/list';
    GET_RM_LIST = '/v2/rm/getAllRM';
    GRANT_RM_STATUS = '/v2/rm/statusUpadtae';
    ASSIGN_RM = '/v2/rm/updateRM';
    ASSIGN_MULTIPLE_RM = '/v2/rm/updateMultiUser';
    public rmEdit = new BehaviorSubject('');  
    prodMessage = this.rmEdit.asObservable();

    constructor(
    private http:HttpClient
  ) { }

  setAdminToken(data:any){
    this.Access_Token=data.data[0].access_token;
    this.Refresh_Token=data.data[0].refresh_token;
    localStorage.setItem('accessToken',this.Access_Token);
    localStorage.setItem('refreshToken',this.Refresh_Token);
  }
  rmSelected(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.RM_LIST}`,data,{headers});
  }
  getRMList(data){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_RM_LIST}`,data,{headers});
  }
  grantRmStatus(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GRANT_RM_STATUS}`,data,{headers});
  }
  submitAssignRM(data:any){
    const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.ASSIGN_RM}`,data,{headers});
  }
  submitMultiAssignRM(data:any){
    const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.ASSIGN_MULTIPLE_RM}`,data,{headers});
  }
    
}