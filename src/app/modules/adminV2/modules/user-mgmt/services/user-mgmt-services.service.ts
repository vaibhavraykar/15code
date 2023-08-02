import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementServices {

    GET_ADMINUSER_LIST = '/v2/managementPortal/list';
    USER_ID = '/v2/managementPortal/getById';
    UPDATE_USER_STATUS = '/v2/managementPortal/statusUpdate';
    ADMIN_CREATE_USER = '/v2/managementPortal/create';
    UPDATE_USER_BY_ID = '/v2/managementPortal/update';
    GET_ALL_COUNTRY = '/user-management/v2/country/all/names';
    GET_ALL_ROLE='/v2/role/getAll';
    FILTER = '/v2/managementPortal/search';
    FILTER_USER = '/v2/pojoMeta/getPojoMeta/USER';

    public adminCouponId = new BehaviorSubject('');  
    userMessage = this.adminCouponId.asObservable();
    public editAdminUserId = new BehaviorSubject('');  
    user = this.editAdminUserId.asObservable();
    public selectedTransType = new BehaviorSubject('');
    dataOfTran = this.selectedTransType.asObservable();

  constructor(private http: HttpClient) {}

  getAllCountryCode() {
    return this.http.get(`${environment.url}${this.GET_ALL_COUNTRY}`);
  }
  getAllRole(){
    return this.http.get(`${environment.admin_url}${this.GET_ALL_ROLE}`);
  }
 
  getAdminUserList(data:any){
    return this.http.post(`${environment.admin_url}${this.GET_ADMINUSER_LIST}`,data);
  }

  getUserById(id:any){
    return this.http.get(`${environment.admin_url}${this.USER_ID}/${id}`);
  }

  updataAdminUserStatus(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_USER_STATUS}`,data)
  }
  createAdminUser(data:any){
    return this.http.post(`${environment.admin_url}${this.ADMIN_CREATE_USER}`,data);
  }
  updateAdminUserById(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_USER_BY_ID}`,data)
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_USER}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }

}
