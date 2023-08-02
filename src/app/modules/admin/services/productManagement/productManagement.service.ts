import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {


  Access_Token:string='';
  Refresh_Token:string='';
  userInfo:any;
  GET_PRODUCT_LIST = '/v2/product/list';
  GET_PRODUCT_BY_ID = '/v2/product/getById';
  CREATE_PRODUCT = '/v2/product/create';
  UPDATE_PRODUCT_STATUS = '/v2/product/statusUpadtae';
  UPDATE_PRODUCT = '/v2/product/update';
  // public productDetails = new BehaviorSubject([]);
  // id = this.productDetails.asObservable();
  public productId = new BehaviorSubject('');  
  userMessage = this.productId.asObservable();
  public editProduct = new BehaviorSubject('');  
  prodMessage = this.editProduct.asObservable();
  callGetApi = new BehaviorSubject(true);
  callgetapi = this.callGetApi.asObservable();

  constructor(
    private http:HttpClient
  ) { }

  getProductList(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.GET_PRODUCT_LIST}`,data,{headers});
  }
  getProductById(id:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.get(`${environment.admin_url}${this.GET_PRODUCT_BY_ID}/${id}`,{headers});
  }
  createNewProduct(data:any){
    const headers = { 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.CREATE_PRODUCT}`,data,{headers});
  }
  updateProductStatus(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPDATE_PRODUCT_STATUS}`,data,{headers});
  }
  updateProduct(data:any){
    const headers={ 'Authorization': `Bearer ${this.Access_Token}` };
    return this.http.post(`${environment.admin_url}${this.UPDATE_PRODUCT}`,data,{headers})
  }
}
