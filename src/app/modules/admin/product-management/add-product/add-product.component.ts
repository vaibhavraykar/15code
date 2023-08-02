import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { Router } from '@angular/router';
import { ProductManagementService } from '../../services/productManagement/productManagement.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  public manageBenifitArray: FormGroup;
  public manageDescription: FormGroup;
  planType: any ;
  productType: any ;
  applicableEntityType: any ;
  countries: any = [];
  countryNameList: any = [];
  newCountryList: any = [];
  showError: any;
  productForm: FormGroup;
  durationType: any;
  selectedDurationType: string;
  newCountryName: any;
  selectallCountry:boolean;
  months: number[] = Array.from(Array(12).keys()).map(i => i + 1);
  days: number[] = Array.from(Array(31).keys()).map(i => i + 1);
  years: number[] = Array.from(Array(100).keys()).map(i => i + 1);
  isAllselected: boolean;
  onlyall: any;
  constructor(public dialogRef: MatDialogRef<AddProductComponent>, private formBuilder: FormBuilder, private location: Location,
    private apiService: ApiService, private productService: ProductManagementService,
    private dialog: MatDialog, private router: Router) {
    this.productForm = this.formBuilder.group({
      productType: [''],
      applicableEntityType: [''],
      planType: [''],
      productCountries: ['', Validators.required],
      planName: ['', Validators.required],
      credits: [''],
      allowedSubsidiaries: [''],
      customerSupport: [''],
      relationshipManager: [''],
      price: ['', Validators.required],
      currency: ['USD', Validators.required],
      duration: ['',Validators.required],
      durationType: ['',Validators.required],
      remark: [''],
      maxTransactionRejectLimit: [''],
      postpaidTransactionPercentage: [''],
      postpaidMaximumTransactionAmount: [''],
      postpaidMaximumAllowedTransations: [''],
    });

    const items = [];
    items.push(this.formBuilder.group({
      benefit: ['', [Validators.required]],
      value: ['', [Validators.required]],
    }));
    this.manageBenifitArray = this.formBuilder.group({
      details: this.formBuilder.array(items),
    });

    const sub = [];
    sub.push(this.formBuilder.group({
      description: ['', [Validators.required]]
    }));
    this.manageDescription = this.formBuilder.group({
      details: this.formBuilder.array(sub),
    });
    console.log('95', this.manageDescription);
  }
  
  ngOnInit() {
    this.apiService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      console.log(res.data, 'res');
      this.countryNameList = this.countries.map(x => x.countryName);
    });
    console.log('days',this.days);
    console.log(this.manageDescription);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      benefit: ['', [Validators.required]],
      value: ['', [Validators.required]],
    });
  }

  createSub(){
    return this.formBuilder.group({
      description: ['', [Validators.required]]
    })
  }

  addDescription(){
    const details = this.manageDescription.get('details') as FormArray;
    if (details.length < 10) {
      details.push(this.createSub());
    }
  }

  addBenifit() {
    const details = this.manageBenifitArray.get('details') as FormArray;
    if (details.length < 10) {
      details.push(this.createItem());
    }
  }

  onDurationTypeChange(e) {
    this.selectedDurationType = this.productForm.controls['durationType'].value;
  }
  selectAll(e){
    // for testing 
    this.selectallCountry=e;
    this.isAllselected = e;
    console.log(e);
    var onlyAll =['ALL'];
    e ? (this.newCountryName  = onlyAll.concat(this.countries.map(x => x.countryName)), this.onlyall =['ALL']): this.newCountryName= [];
    console.log(this.productForm.value, 'this.productForm');
    console.log(this.newCountryName, 'this.newCountryName');
  }

  pasteHandler(e: ClipboardEvent) {
    console.log(e.clipboardData.getData('text'))
    const data = e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

    console.log(`${data === ''} || ${re.test(data)}`)
    if (data === '' || re.test(data)) {
      console.log(true)
      return true
    }
    console.log(false)
    return false;
  }

  back(): void {
    this.location.back()
  }

  onPlanChange(e) {
    this.productType = e.value;
    this.testValidators();
    console.log(this.productType);
  }

  onApplicableEntityTypeChange(e) {
    this.applicableEntityType = e.value;
    this.testValidators();
    console.log(this.applicableEntityType);
  }

  onPlanTypeChange(e) {
    this.planType = e.value;
    this.testValidators();
    console.log(this.planType);
  }
  
  onSubmit() {
    // this.testValidators();
    console.log('form',this.productForm);
    console.log('benefit array',this.manageBenifitArray);
    console.log('desc array',this.manageDescription);
    if (this.productForm.status == 'VALID' && (this.manageBenifitArray.status == 'VALID' || this.manageDescription.status == 'VALID')) {
      let mainArray = [];
      console.log('type', this.productType);
      let productTypeValue = this.productForm.controls['productType'].value;
      if(productTypeValue == 'SUBSCRIPTION_PLAN'){
        const data = this.manageBenifitArray.value.details;
        data.forEach(element => {
        mainArray.push(element);
      });
      }
      let subArray = [];
      if(productTypeValue == 'VAAS_PLAN'){
        const subData = this.manageDescription.value.details;
        subData.forEach(element =>{
        subArray.push(element);
      });
      }
      this.selectallCountry ? (this.productForm.get('productCountries').setValue(['ALL'])):'';
      this.newCountryList = this.productForm.controls['productCountries'].value;
      let newName = [];
      this.newCountryList.forEach(e => {
        if (e) {
          let data = { 
            country: e
           }
          newName.push(data);
        }
        console.log(newName, 'newName');
      })
      this.productForm.get('productCountries').setValue(newName);
      // let productTypeValue = this.productForm.controls['productType'].value;
      console.log(productTypeValue);
      let finalData = {
        productType: productTypeValue,
        applicableEntityType: this.productForm.controls['applicableEntityType'].value,
        planType: this.productForm.controls['planType'].value,
        productCountries: this.productForm.controls['productCountries'].value,
        planName: this.productForm.controls['planName'].value,
        credits: this.productForm.controls['credits'].value,
        allowedSubsidiaries: this.productForm.controls['allowedSubsidiaries'].value,
        customerSupport: this.productForm.controls['customerSupport'].value,
        relationshipManager: this.productForm.controls['relationshipManager'].value,
        price: this.productForm.controls['price'].value,
        currency: this.productForm.controls['currency'].value,
        duration: this.productForm.controls['duration'].value,
        durationType: this.productForm.controls['durationType'].value,
        remark: this.productForm.controls['remark'].value,
        maxTransactionRejectLimit: this.productForm.controls['maxTransactionRejectLimit'].value,
        postpaidTransactionPercentage: this.productForm.controls['postpaidTransactionPercentage'].value,
        postpaidMaximumTransactionAmount: this.productForm.controls['postpaidMaximumTransactionAmount'].value,
        postpaidMaximumAllowedTransations: this.productForm.controls['postpaidMaximumAllowedTransations'].value,
        productBenefits: mainArray,
        productDescriptions: subArray
      }
      console.log(finalData);
      Object.keys(finalData).forEach((key) => (finalData[key] == '') && delete finalData[key]);
      console.log("finalData",finalData);
      this.productService.createNewProduct(finalData).subscribe(res => {
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
          this.router.navigateByUrl('admin/dsb/product-list');
        } else {
          this.productForm.get('productCountries').setValue(this.newCountryList);
        }

        this.close();
        this.productService.callGetApi.next(true);
      })
    }

  }
  close() {
    this.dialogRef.close();
  }
  deleteUser(i) {
    console.log(i);
    const details = this.manageBenifitArray.get('details') as FormArray;
    if (i >= 1) {
      details.removeAt(i);
    }
  }
  deleteDescription(i){
    console.log(i);
    const details = this.manageDescription.get('details') as FormArray;
    if (i >= 1) {
      details.removeAt(i);
    }
  }

  textOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 64 || charCode > 91) || charCode == 32) {
      return true;
    }
    return false;
  }

  numberonly(event): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
        return true;
    }
    return false;
  }

  isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  testValidators() {

    if (this.productType == 'SUBSCRIPTION_PLAN') {
      this.productForm.get('credits').setValidators(Validators.required);
      this.productForm.get('customerSupport').setValidators(Validators.required);
      this.productForm.get('relationshipManager').setValidators(Validators.required);
      this.productForm.get('remark').setValidators(Validators.required);
      this.productForm.get('maxTransactionRejectLimit').setValidators(Validators.required);
    } else {
      this.productForm.get('credits').clearValidators();
      this.productForm.get('customerSupport').clearValidators();
      this.productForm.get('relationshipManager').clearValidators();
      this.productForm.get('remark').clearValidators();
      this.productForm.get('maxTransactionRejectLimit').clearValidators();
    }
    if (this.planType == 'POSTPAID' && this.productType == 'SUBSCRIPTION_PLAN') {
      this.productForm.get('postpaidTransactionPercentage').setValidators(Validators.required);
      this.productForm.get('postpaidTransactionPercentage').updateValueAndValidity();
      this.productForm.get('postpaidMaximumTransactionAmount').setValidators(Validators.required);
      this.productForm.get('postpaidMaximumTransactionAmount').updateValueAndValidity();
      this.productForm.get('postpaidMaximumAllowedTransations').setValidators(Validators.required);
      this.productForm.get('postpaidMaximumAllowedTransations').updateValueAndValidity();
    }
    else {
      this.productForm.get('postpaidTransactionPercentage').clearValidators();
      this.productForm.get('postpaidTransactionPercentage').updateValueAndValidity();
      this.productForm.get('postpaidMaximumTransactionAmount').clearValidators();
      this.productForm.get('postpaidMaximumTransactionAmount').updateValueAndValidity();
      this.productForm.get('postpaidMaximumAllowedTransations').clearValidators();
      this.productForm.get('postpaidMaximumAllowedTransations').updateValueAndValidity();
    }
    if (this.applicableEntityType == 'CUSTOMER' && this.productType == 'SUBSCRIPTION_PLAN') {
      this.productForm.get('allowedSubsidiaries').setValidators(Validators.required);
      this.productForm.get('allowedSubsidiaries').updateValueAndValidity();
    } else {
      this.productForm.get('allowedSubsidiaries').clearValidators();
      this.productForm.get('allowedSubsidiaries').updateValueAndValidity();
    }
    if (this.productType == 'VAAS_PLAN') {
      this.manageDescription.get('details').setValidators(Validators.required);
      this.manageDescription.get('details').updateValueAndValidity();
    } else {
      this.manageDescription.get('details').clearValidators();
      this.manageDescription.get('details').updateValueAndValidity();
    }
    if (this.productType == 'SUBSCRIPTION_PLAN') {
      this.manageBenifitArray.get('details').setValidators(Validators.required);
      this.manageBenifitArray.get('details').updateValueAndValidity();
    } else {
      this.manageBenifitArray.get('details').clearValidators();
      this.manageBenifitArray.get('details').updateValueAndValidity();
    }
    // if (this.productType == 'SUBSCRIPTION_PLAN' || (this.productType == 'VAAS_PLAN' && this.planType == 'POSTPAID')) {
    //   this.productForm.get('durationType').setValidators(Validators.required);
    //   this.productForm.get('durationType').updateValueAndValidity();
    //   this.productForm.get('duration').setValidators(Validators.required);
    //   this.productForm.get('duration').updateValueAndValidity();
    // } else {
    //   this.productForm.get('durationType').clearValidators();
    //   this.productForm.get('durationType').updateValueAndValidity();
    //   this.productForm.get('duration').clearValidators();
    //   this.productForm.get('duration').updateValueAndValidity();
    // }
    this.productForm.get('credits').updateValueAndValidity();
    this.productForm.get('customerSupport').updateValueAndValidity();
    this.productForm.get('relationshipManager').updateValueAndValidity();
    this.productForm.get('remark').updateValueAndValidity();
    this.productForm.get('maxTransactionRejectLimit').updateValueAndValidity();
  }
}
