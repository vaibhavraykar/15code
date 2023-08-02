import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { AdminService } from '../../services/admin.service';
import { Location, NgIf } from '@angular/common';
import { DiscountManagementService } from '../../services/discount-management/discountManagement.service';


@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.scss']
})
export class NewCouponComponent {
  personalForm!: FormGroup;
  planName: any = [];
  productlist: any = [];
  countryCodeList: any = [];
  productsNewList: any;
  showError: any;
  @Input() fixDiscount: boolean;
  @Input() percentDiscount: boolean;


  constructor(
    private fb: FormBuilder, public adminService: AdminService,
    private dialog: MatDialog, private userService: DiscountManagementService,
    private router: Router, private location: Location) {
    this.personalForm = fb.group({
      currency: ['USD', Validators.required],
      discountPercentage: [''],
      maxDiscount: ['',Validators.required],
      quantity: ['', Validators.required],
      // consumedCoupons: ['', Validators.required],
      couponCode: ['', Validators.required],
      product: ['', Validators.required],
      fixAmount: [''],
    });
  }
  ngOnInit() {
    this.userService.getAllActiveProduct().subscribe((res: any) => {
      this.productlist = res.data;
      console.log(res.data, 'res');
      
    });

  }
  checkValidation(){
    if(this.fixDiscount){
      this.personalForm.get('fixAmount').setValidators(Validators.required);
      this.personalForm.get('fixAmount').updateValueAndValidity();
      this.personalForm.get('discountPercentage').clearValidators()
      this.personalForm.get('discountPercentage').updateValueAndValidity();
      this.personalForm.get('maxDiscount').clearValidators();
      this.personalForm.get('maxDiscount').updateValueAndValidity();
      console.log(this.personalForm);
    }else{
      this.personalForm.get('fixAmount').clearValidators()
      this.personalForm.get('fixAmount').updateValueAndValidity();
      this.personalForm.get('discountPercentage').setValidators(Validators.required);
      this.personalForm.get('discountPercentage').updateValueAndValidity();
    }
  }
  submitNewCoupon() {
    this.checkValidation();
    console.log(this.personalForm);

    if (this.personalForm.status == 'VALID') {
      this.showError = false;
      let productFinalList = [];
      let productList = this.personalForm.controls['product'].value;
      this.productsNewList = this.personalForm.controls['product'].value;
      console.log(productList, 'productList');
          let data = {
            id: productList.id
          }
      this.personalForm.get('product').setValue(data);
      console.log(productFinalList);
      console.log(this.personalForm.value);
  
      this.newCoupon();
    } else {
      this.showError = true;

    }
    
  }


  newCoupon() {
    if (this.personalForm.status == 'VALID') {
      this.showError = false;
     Object.keys(this.personalForm.value).forEach((key) => (this.personalForm.value[key] == '') && delete this.personalForm.value[key]);
      console.log("finalData",this.personalForm.value);
      this.userService.createNewCoupon(this.personalForm.value).subscribe((res: any) => {
        console.log(res);
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
        });
        if (res['success'] == true) {
          this.router.navigateByUrl('admin/dsb/discount-coupons');
        } else {
          this.personalForm.get('product').setValue(this.productsNewList);
        }
      }, (error) => {
        this.personalForm.get('product').setValue(this.productsNewList);
      });
    }
  }


  back(): void {
    this.location.back()
  }

  numberonly(event): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 48 && charCode <= 57) {

        return true;

    }

    return false;
  }
  
  onChangeRadio(e){
    if(e.value == 'fix'){
      this.fixDiscount = true;
      this.percentDiscount = false;
    }else{
      this.percentDiscount = true;
      this.fixDiscount = false;
    }
  }

}
