import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscountManagementServices {

    GET_COUPONS_LIST = '/v2/discount/list';
    COUPON_ID = '/v2/discount/getById';
    GET_ALL_ACTIVE_PRODUCT = '/v2/product/getActiveSubscriptionProduct';
    CREATE_COUPON = '/v2/discount/create';
    UPDATE_COUPON_STATUS = '/v2/discount/statusUpadtae';
    FILTER = '/v2/discount/search';
    FILTER_COUPON = '/v2/pojoMeta/getPojoMeta/DISCOUNT';
    public adminCouponId = new BehaviorSubject('');  
    userMessage = this.adminCouponId.asObservable();
  constructor(private http: HttpClient) {}

  // Get All Primary Transactions
  getDiscountCouponsList(data: any) {
    return this.http.post(`${environment.admin_url}${this.GET_COUPONS_LIST}`,data);
  }

  getDiscountById(id:any){
    return this.http.get(`${environment.admin_url}${this.COUPON_ID}/${id}`);
  }
  getAllActiveProduct(prepaidValue:any,applicableEntityType:any){
    return this.http.get(`${environment.admin_url}${this.GET_ALL_ACTIVE_PRODUCT}/${prepaidValue}/${applicableEntityType}`);
  }
  createNewCoupon(data:any){
    return this.http.post(`${environment.admin_url}${this.CREATE_COUPON}`,data);
  }
  updateCouponStatus(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_COUPON_STATUS}`,data);
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_COUPON}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
}
