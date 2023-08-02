import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionMgmtServices {

    GET_PRODUCT_LIST = '/v2/product/list';
    UPDATE_PRODUCT_STATUS = '/v2/product/statusUpadtae';
    GET_ALL_COUNTRY = '/user-management/v2/country/all/names';
    GET_PRODUCT_BY_ID = '/v2/product/getById';
    CREATE_PRODUCT = '/v2/product/create';
    UPDATE_PRODUCT = '/v2/product/update';
    FILTER = '/v2/product/search';
    FILTER_PRODUCT = '/v2/pojoMeta/getPojoMeta/PRODUCT';
    
    public editAdminSubsId = new BehaviorSubject('');  
    user = this.editAdminSubsId.asObservable();
    public editProduct = new BehaviorSubject('');  
    prodMessage = this.editProduct.asObservable();
    callGetApi = new BehaviorSubject(true);
    callgetapi = this.callGetApi.asObservable();
    
  constructor(private http: HttpClient) {}

  getAllCountryCode() {
    return this.http.get(`${environment.url}${this.GET_ALL_COUNTRY}`);
  }
  getProductList(data:any){
    return this.http.post(`${environment.admin_url}${this.GET_PRODUCT_LIST}`,data);
  }
  updateProductStatus(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_PRODUCT_STATUS}`,data);
  }
  getProductById(id:any){
    return this.http.get(`${environment.admin_url}${this.GET_PRODUCT_BY_ID}/${id}`);
  }
  createNewProduct(data:any){
    return this.http.post(`${environment.admin_url}${this.CREATE_PRODUCT}`,data);
  }
  updateProduct(data:any){
    return this.http.post(`${environment.admin_url}${this.UPDATE_PRODUCT}`,data)
  }
  metaFilter(){
    return this.http.get(`${environment.admin_url}${this.FILTER_PRODUCT}`);
  }
  getFilterd(payload:any){
    return this.http.post(`${environment.admin_url}${this.FILTER}`,payload);
  }
  
}
