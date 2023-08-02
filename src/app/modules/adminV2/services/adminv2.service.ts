import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Adminv2Service {
  FILTER = '/v2/managementPortal/search';
  CHANGE_PASSWORD = '/user-management/v2/user/changePassword';

  constructor(private http: HttpClient) {}
  filterData(data:any){
    return this.http.post(
      `${environment.admin_url}${this.FILTER}`,
      data
    );
  }
  changePassword(data: any) {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${environment.url}${this.CHANGE_PASSWORD}?old_password=${data.currentPassword}&password=${data.newPassword}&confirm_password=${data.confNewPassword}`,{headers,});
  }
}
