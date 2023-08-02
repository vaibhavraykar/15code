import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutomatedBaauService {

  GET_AUTOMATED_BAAU_LIST = '/v2/autoBaau/list';
  GET_ALL_COUNTRY = '/user-management/v2/country/all/names';
  GET_ALL_GOODS = '/user-management/v2/goods/all';
  CREATE_AUTOMATED_BAAU='/v2/autoBaau/create';
  GET_ALL_RM = '/v2/rm/getAllRM';
  UPDATE_STATUS = '/v2/autoBaau/statusUpdate'
  public viewDetails = new BehaviorSubject({});
  data = this.viewDetails.asObservable();


  constructor(private http: HttpClient) {}

  getAutomatedBaauList(data: any) {
    return this.http.post(
      `${environment.admin_url}${this.GET_AUTOMATED_BAAU_LIST}`,
      data
    );
  }
  getAllCountryCode() {
    let respnse= this.http.get(`${environment.url}${this.GET_ALL_COUNTRY}`).pipe(
      map((response: any) => {
        let rep = response
        console.log(rep,'rep old')
        rep.data[0].countryList.sort((a, b) => {
          const countryA = a.countryName.toUpperCase();
          const countryB = b.countryName.toUpperCase();
          if (countryA < countryB) {
            return -1;
          }
          if (countryA > countryB) {
            return 1;
          }
          return 0;
        });
console.log(rep,'rep')
        // rep.data[0].countryNames.sort()
        // rep.data[0].currencies.sort()
       return rep;
      })
    );
    console.log(respnse,'respnse')
    return respnse

    
  }
  getAllGoods() {
    return this.http.get(`${environment.url}${this.GET_ALL_GOODS}`);
  }
  createAutomatedBaau(data:any){
    return this.http.post(`${environment.admin_url}${this.CREATE_AUTOMATED_BAAU}`,data);
  }
  getAllRM(data:any) {
    return this.http.post(`${environment.admin_url}${this.GET_ALL_RM}`,data);
  }
  updateStatus(data:any) {
    return this.http.post(`${environment.admin_url}${this.UPDATE_STATUS}`,data);
  }


 }
