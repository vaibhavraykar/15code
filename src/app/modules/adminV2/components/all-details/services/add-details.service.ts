import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddDetailsService {

  GET_TRANSACTOIN_BY_ID = '/v2/transaction/getById';

  constructor(
    private http:HttpClient
  ) {}

  // Get Transaction Details Data By ID
  getTransactionById(id:any){
    return this.http.get(
      `${environment.admin_url}${this.GET_TRANSACTOIN_BY_ID}/${id}`
    );
  }
}
