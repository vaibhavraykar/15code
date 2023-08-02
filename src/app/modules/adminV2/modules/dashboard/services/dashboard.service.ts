import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUserStatus() {
    return this.http.get(`${environment.admin_url}/v2/managementPortal/users/status`).pipe(
      map((res: any) => res.data[0]), catchError((error: any) => {
        throw error;
      }))
  }
  getActionNeeded() {
    return this.http.get(`${environment.admin_url}/v2/managementPortal/action/needed`).pipe(
      map((res: any) => res.data[0]), catchError((error: any) => {
        throw error;
      }))
  }
}
