import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {

  }

  getTransAndQuotes (){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/customer_or_bank/count/transAndQuotes`);
  }
  getTransactionBifurcationFor({fromDate,toDate}:any){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/customer_or_bank/transaction_bifurication?startDateEpoch=${fromDate}&endDateEpoch=${toDate}`);

  }
  getProductAndCountywise({fromDate,toDate}:any){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/customer_or_bank/productandcountywise/transactions?startDateEpoch=${fromDate}&endDateEpoch=${toDate}`);

  }
  getlc_sum(year:any=''){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/customer_or_bank/cumulative/transactions/vs/lc_sum?year=${year}`);
  }
  fetchAvailableVasplan(){
    return this.http.get(`${environment.url}/user-management/v2/user/dashboard/customer_or_bank/available/vaas`);
  }
  submitUserIntrestedVas(payload:any){
    return this.http.post(`${environment.url}/user-management/v2/user/dashboard/customer_or_bank/interested/vaas`,payload);

  }
}
