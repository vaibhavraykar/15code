import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class BulkUploadservice {
    GET_ALL_COUNTRY = '/user-management/v2/country/all/names';
    GET_ALL_GOODS = '/user-management/v2/goods/all';
    GET_PORT_LIST ='/transaction-api/v2/getLoadingPort ';
    UPLOAD_BULK_FILE= '/v2/transaction/upload';
    SAMPLE_DOWNLOAD='/admin/v2/transaction/download/sample/excel/'

    constructor(private http: HttpClient){

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
      getAllPortList() {
        return this.http.get(`${environment.url}${this.GET_PORT_LIST}`);
      }

      UploadbulkTrxn(data){
        return this.http.post(`${environment.admin_url}${this.UPLOAD_BULK_FILE}`,data,{  responseType: 'blob'});
      }
      sampleDownload(id) {
        return this.http.get(`${environment.url}${this.SAMPLE_DOWNLOAD}${id}`,{  responseType: 'blob'});
      }
}
