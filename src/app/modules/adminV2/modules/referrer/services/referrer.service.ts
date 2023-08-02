import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReferrerService {

  GET_REFERRER_BY_ID = '/v2/customer/getReferrerListByUserId';

   
    public setSelectedUserForRefererView = new BehaviorSubject({});
    planData = this.setSelectedUserForRefererView.asObservable();

  constructor(private http: HttpClient) {}

  refererById(data){
    return this.http.post(`${environment.admin_url}${this.GET_REFERRER_BY_ID}`,data);
  }
  
}
