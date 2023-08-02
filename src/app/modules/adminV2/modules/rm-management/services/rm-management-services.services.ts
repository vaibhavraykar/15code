import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RMManagementServices {

    RM_LIST = '/v2/rm/list';
    GET_RM_LIST = '/v2/rm/getAllRM';
    ASSIGN_RM = '/v2/rm/updateRM';
    ASSIGN_MULTIPLE_RM = '/v2/rm/updateMultiUser';
    FILTER = '/v2/rm/search';
    FILTER_RM = '/v2/pojoMeta/getPojoMeta/USER';
    
    public adminCouponId = new BehaviorSubject('');  
    userMessage = this.adminCouponId.asObservable();
  constructor(private http: HttpClient) {}

  rmSelected(data:any){
    return this.http.post(`${environment.admin_url}${this.RM_LIST}`,data);
  }
  getRMList(data){
    return this.http.post(`${environment.admin_url}${this.GET_RM_LIST}`,data);
  }
  submitAssignRM(data:any){
    return this.http.post(`${environment.admin_url}${this.ASSIGN_RM}`,data);
  }
  submitMultiAssignRM(data:any){
    return this.http.post(`${environment.admin_url}${this.ASSIGN_MULTIPLE_RM}`,data);
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_RM}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
}
