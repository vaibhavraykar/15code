import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getBauStatus(){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/bau/status`);
  }
  getProductAndCounty({product,country}:any){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/bau/countrywise/transactions?requirementType=${product}&country=${country}`);
  }
  getAcceptedTransaction(index:any){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/bau/latest/transactions?page=${index}&size=5`);
  }

}
