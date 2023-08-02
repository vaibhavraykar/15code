import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  GET_ALL_COUNTRY = 'user-management/v2/country/all/names';

    constructor(private http: HttpClient) { }

    getAllCountryCode() {
      let respnse= this.http.get(`${environment.url}${this.GET_ALL_COUNTRY}`).pipe(
        map((response: any) => {
          let rep = response
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
          rep.data[0].countryNames.sort()
          rep.data[0].currencies.sort()
         return rep;
        })
      );
      return respnse
    }
    fetchTnc() {
      return this.http.get(
        `${environment.url}/user-management/v2/terms_and_policy/TERMS_AND_CONDITION/get/-1`
      );
    }
    fetchPrivacyPolicy() {
      return this.http.get(
        `${environment.url}/user-management/v2/terms_and_policy/PRIVATE_POLICY/get/-1`
      );
    }
}
