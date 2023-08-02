import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class DiscountManagementService{

    Access_Token:string='';
    Refresh_Token:string='';
    DISCOUNT_COUPON = '/v2/discount/list';
    COUPON_ID = '/v2/discount/getById';
    UPDATE_COUPON_STATUS = '/v2/discount/statusUpadtae';
    GET_ALL_ACTIVE_PRODUCT ='/v2/product/getActiveSubscriptionProduct';
    CREATE_COUPON = '/v2/discount/create';
    public adminCouponId = new BehaviorSubject('');  
    userMessage = this.adminCouponId.asObservable();
    public approveByData = new BehaviorSubject([]);
    

    constructor(
    private http:HttpClient
  ) { }

  setAdminToken(data:any){
    this.Access_Token=data.data[0].access_token;
    this.Refresh_Token=data.data[0].refresh_token;
    localStorage.setItem('accessToken',this.Access_Token);
    localStorage.setItem('refreshToken',this.Refresh_Token);
  }

    discountCouponSelected(data:any){
      const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.post(`${environment.admin_url}${this.DISCOUNT_COUPON}`,data,{headers});
    }
    getDiscountById(id:any){
      const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.get(`${environment.admin_url}${this.COUPON_ID}/${id}`,{headers});
    }
    updateCouponStatus(data:any){
      const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.post(`${environment.admin_url}${this.UPDATE_COUPON_STATUS}`,data,{headers});
    }
    getAllActiveProduct(){
      const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.get(`${environment.admin_url}${this.GET_ALL_ACTIVE_PRODUCT}`,{headers});
    }
    createNewCoupon(data:any){
      const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
      return this.http.post(`${environment.admin_url}${this.CREATE_COUPON}`,data,{headers});
    }
  
  }