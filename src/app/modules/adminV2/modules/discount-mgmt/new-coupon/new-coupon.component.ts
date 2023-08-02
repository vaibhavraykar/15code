import { Component, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { Location, NgIf } from '@angular/common';
import { DiscountManagementServices } from '../services/discount-mgmt-services.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.scss']
})
export class NewCouponComponent {
  form!: FormGroup;
  routelocation: any
  personalForm!: FormGroup;
  planName: any = [];
  productlist: any = [];
  countryCodeList: any = [];
  productsNewList: any;
  showError: any;
  selectedDiscountType: string;
  state: any;
  applicableEntityType: any;
  planType: any;
  prepaidValue = 'PREPAID';
  postpaid = false;
  prepaid = false
  @Input() customer: boolean;
  @Input() bank: boolean;
  @Input() bankasunderwriter: boolean;


  constructor(
    private fb: FormBuilder, public adminService: AdminService,
    private dialog: MatDialog, private discountmgmtService: DiscountManagementServices,
    private router: Router, private location: Location) {
    this.personalForm = fb.group({
      currency: ['USD', Validators.required],
      discountPercentage: ['',Validators.required],
      maxDiscount: ['', Validators.required],
      quantity: ['', Validators.required],
      // consumedCoupons: ['', Validators.required],
      couponCode: ['', Validators.required],
      product: ['', Validators.required],
      fixAmount: ['',Validators.required],
    });
  }
  ngOnInit() {


  }

  onChangeTypeRadio(e) {
    this.prepaidValue = e.checked ? 'POSTPAID' : 'PREPAID';
    console.log('Type Value', this.prepaidValue);
    if (this.prepaidValue) {
      if (this.applicableEntityType) {
        this.callingProduct();
      }
    } else {
      this.showError = true;
    }
  }
  callingProduct() {
    this.discountmgmtService.getAllActiveProduct(this.prepaidValue, this.applicableEntityType).subscribe((res: any) => {
      this.productlist = res.data;
      console.log(res.data, 'res');
      console.log('data of product', this.productlist);

    });
  }

  onDiscountTypeChange(e) {
    this.selectedDiscountType = e.value;

    console.log('DiscountType FP', this.selectedDiscountType);

    if (this.selectedDiscountType === 'FIXED') {

      this.personalForm.get('discountPercentage').setValue(null);

      this.personalForm.get('maxDiscount').setValue(null);

    } else if (this.selectedDiscountType === 'PERCENTAGE') {

      this.personalForm.get('fixAmount').setValue(null);

    }
  }

  checkValidation() {
    if (this.selectedDiscountType == 'FIXED') {
      this.personalForm.get('fixAmount').setValidators(Validators.required);
      this.personalForm.get('fixAmount').updateValueAndValidity();
      this.personalForm.get('discountPercentage').clearValidators()
      this.personalForm.get('discountPercentage').updateValueAndValidity();
      this.personalForm.get('maxDiscount').clearValidators();
      this.personalForm.get('maxDiscount').updateValueAndValidity();
      console.log(this.personalForm);
    } else {
      this.personalForm.get('fixAmount').clearValidators()
      this.personalForm.get('fixAmount').updateValueAndValidity();
      this.personalForm.get('discountPercentage').setValidators(Validators.required);
      this.personalForm.get('discountPercentage').updateValueAndValidity();
      this.personalForm.get('maxDiscount').setValidators(Validators.required);
      this.personalForm.get('maxDiscount').updateValueAndValidity();
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
  cancelForm(): void {
    this.router.navigateByUrl('adminv2/discount-management/discount-coupons');
  }


  newCoupon() {
    if (this.personalForm.status == 'VALID') {
      this.showError = false;
      Object.keys(this.personalForm.value).forEach((key) => (this.personalForm.value[key] == '') && delete this.personalForm.value[key]);
      console.log("finalData", this.personalForm.value);
      this.discountmgmtService.createNewCoupon(this.personalForm.value).subscribe((res: any) => {
        console.log(res);
        const popup = this.dialog.open(GeneralPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
          disableClose:true
        });
        if (res['success'] == true) {
          this.router.navigateByUrl('adminv2/discount-management/discount-coupons');
        } else {
          this.personalForm.get('product').setValue(this.productsNewList);
        }
      }, (error) => {
        this.personalForm.get('product').setValue(this.productsNewList);
      });
    }
  }
  // onToppingRemoved(topping: string) {
  //   const toppings = this.personalForm.controls['product'].value as string[];
  //   this.removeFirst(toppings, topping);
  //   this.personalForm.controls['product'].setValue(toppings); // To trigger change detection
  // }
  // private removeFirst<T>(array: T[], toRemove: T): void {
  //   const index = array.indexOf(toRemove);
  //   if (index !== -1) {
  //     array.splice(index, 1);
  //   }
  // }
  // getbankName(name){
  //   let bankName=''
  //   bankName=  this.productlist.find((e)=>e.id === name)?.id
  //   return bankName
  // }


  back(): void {
    this.location.back()
  }

  numberonly(event): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const decimalCount = inputValue.split('.').length - 1;

    if (charCode === 46 && decimalCount === 0) {
        return true;
    }
    if (charCode >= 48 && charCode <= 57) {
        return true;
    }
    return false;
  }

  percentOnly(event):boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const decimalCount = inputValue.split('.').length - 1;

    if (charCode === 46 && decimalCount === 0) {
        return true;
    }
    if (charCode >= 48 && charCode <= 57) {
      const newValue = inputValue + String.fromCharCode(charCode);
      const numericValue = +newValue;
      if (numericValue > 100 || numericValue < 0) {
        return false;
      }
      return true;
    }
    return false;
  }
  textOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (
      (charCode >= 33 && charCode <= 59) || 
      charCode === 61 || 
      (charCode >= 63 && charCode <= 90) || 
      charCode === 92 || 
      charCode === 95 || 
      (charCode >= 97 && charCode <= 122) || 
      charCode === 124 
    ) {
      return true;
    }
    return false;
  }

  onApplicableEntityTypeChange(e) {
    this.applicableEntityType = e.value;
    this.callingProduct();
  }

  onPlanTypeChange(e) {
    this.planType = e.value;
    console.log(this.planType);
  }

  onChangeRadio(e) {
    if (e.value == 'cust') {
      this.customer = true;
      this.bank = false;
      this.bankasunderwriter = false;
    } else if (e.value == 'bank') {
      this.bank = true;
      this.customer = false;
      this.bankasunderwriter = false;
    } else if (e.value == 'bau') {
      this.bankasunderwriter = true;
      this.customer = false;
      this.bank = false;
    }
  }

}
