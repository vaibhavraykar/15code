import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { AdminService } from '../../services/admin.service';
import { ProductManagementService } from '../../services/productManagement/productManagement.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  public manageBenifitArray: FormGroup;
  public manageDescription: FormGroup;
  planType: any = 'PREPAID';
  productType: any = 'SUBSCRIPTION_PLAN';
  applicableEntityType: any = 'CUSTOMER';
  id: any;
  productForm: FormGroup;
  countries: any = [];
  countryCodeList: any = [];
  viewData?: any;
  rolelist: any = [];
  editedList1: any;
  selectedPlan: any;
  selectedApplicableType: any;
  selectedProductPlan: any;
  selectedDuration: any;
  selectedRM: any;
  updatedData:any={};
  countryNameList: any = [];
  newCountryList: any = [];
  productBenefitList: any = [];
  productDescriptionList: any = [];
  formArray: FormArray = new FormArray([]);
  diffArray: FormArray = new FormArray([]);
  countryData: any = [];
  selectedDurationType: string;
  durationType: any;
  newCountryName: any;
  countryNameFetch: any;
  selectallCountry:boolean;
  months: number[] = Array.from(Array(12).keys()).map(i => i + 1);
  days: number[] = Array.from(Array(31).keys()).map(i => i + 1);
  years: number[] = Array.from(Array(100).keys()).map(i => i + 1);
  countryNameSet:any=[];
  isAllselected: boolean;
  onlyall: any;
  constructor(public dialogRef: MatDialogRef<EditProductComponent>, private route: ActivatedRoute, private router: Router, public adminService: AdminService, private fb: FormBuilder,
    private apiService: ApiService, private dialog: MatDialog, private productService: ProductManagementService) {
    this.productService.editProduct.subscribe((res: any) => {
      if (res) {
        this.id = res;
      }
    })
    this.id = this.route.snapshot.paramMap.get('id');

    this.apiService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.countryNameList = this.countries.map(x => x.countryName);
      this.viewProduct();
    });
    this.productForm = fb.group({
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
      duration: [''],
      durationType: [''],
      remark: [''],
      maxTransactionRejectLimit: [''],
      postpaidTransactionPercentage: [''],
      postpaidMaximumTransactionAmount: [''],
      postpaidMaximumAllowedTransations: [''],
      id: [''],
    });
    const items = [];
    items.push(this.fb.group({
      benefit: ['', [Validators.required]],
      value: ['', [Validators.required]],
    }));
    this.manageBenifitArray = this.fb.group({
      details: this.fb.array(items),
    });

    const sub = [];
    sub.push(this.fb.group({
      description: ['', [Validators.required]]
    }));
    this.manageDescription = this.fb.group({
      details: this.fb.array(sub),
    });
  }
  ngOnInit() {
    
  }
  selectAll(e){
    this.selectallCountry=e;
    var onlyAll =['ALL'];
    this.isAllselected = e;

    e ? (this.newCountryName  = onlyAll.concat(this.countries.map(x => x.countryName)),this.onlyall =['ALL']): this.newCountryName= [];
  }
  viewProduct() {
    this.productService.getProductById(this.id).subscribe((res: any) => {
      this.viewData = res['data'][0];
      this.selectedPlan = this.viewData.productType;
      this.selectedApplicableType = this.viewData.applicableEntityType;
      this.selectedProductPlan = this.viewData.planType;
      this.selectedDuration = this.viewData.durationType;
      if(this.selectedPlan === 'SUBSCRIPTION_PLAN'){
        this.selectedRM = (this.viewData.relationshipManager).toString();
        console.log('prod details',this.selectedRM);
      }
      this.productBenefitList = this.viewData['productBenefits'];
      if(this.selectedPlan==='VAAS_PLAN'){
        this.productDescriptionList = this.viewData['productDescriptions'];
      }
      if(this.selectedPlan==='VAAS_PLAN'){
        this.diffArray = this.manageDescription.get('details') as FormArray;
        this.productDescriptionList.forEach(e =>{
          this.diffArray.push(this.fb.group({
            id: e.id,
            description: e.description
          }));
        });
        this.diffArray.removeAt(0);
      }
      if(this.selectedPlan === 'SUBSCRIPTION_PLAN'){
        this.formArray = this.manageBenifitArray.get('details') as FormArray;
        this.productBenefitList.forEach(element => {
        this.formArray.push(this.fb.group({
          id: element.id,
          benefit: element.benefit,
          value: element.value,
        }));
      });
      this.formArray.removeAt(0);
    }
      this.countryNameSet = this.viewData.productCountries.map(x => x.country);
      this.productForm.patchValue({
        productType: this.viewData.productType,
        applicableEntityType: this.viewData.applicableEntityType,
        planType: this.viewData.planType,
        productCountries: this.countryNameSet,
        planName: this.viewData.planName,
        credits: this.viewData.credits,
        allowedSubsidiaries: this.viewData.allowedSubsidiaries,
        customerSupport: this.viewData.customerSupport,
        relationshipManager: this.viewData.relationshipManager,
        price: this.viewData.price,
        currency: this.viewData.currency,
        duration: this.viewData.duration,
        durationType: this.viewData.durationType,
        remark: this.viewData.remark,
        maxTransactionRejectLimit: this.viewData.maxTransactionRejectLimit,
        postpaidTransactionPercentage: this.viewData.postpaidTransactionPercentage,
        postpaidMaximumTransactionAmount: this.viewData.postpaidMaximumTransactionAmount,
        postpaidMaximumAllowedTransations: this.viewData.postpaidMaximumAllowedTransations,
        productDescriptions: this.viewData.productDescriptions,
        productBenefits: this.viewData.productBenefits,
        id: this.viewData.id,
      }
      );
      var AllSelected = this.countryNameSet.filter(x => x == "ALL");
      if(AllSelected.length > 0){
        this.onlyall =['ALL'];
        this.isAllselected = true;
      }else{
        this.isAllselected = false;
        this.newCountryName = this.countryNameSet;
      }
    })
    this.updatedData=this.viewData;
  }
  back() {
    this.router.navigateByUrl('admin/dsb/product-list');
  }
  createItem(): FormGroup {
    return this.fb.group({
      benefit: ['', [Validators.required]],
      value: ['', [Validators.required]],
    });
  }
  createSub() {
    return this.fb.group({
      description: ['', [Validators.required]]
    })
  }
  addDescription() {
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
  pasteHandler(e: ClipboardEvent) {
    const data = e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

    if (data === '' || re.test(data)) {
      return true
    }
    return false;
  }

  onPlanChange(e) {
    if(this.viewData.productType!= e.value){
      this.viewData.productType= e.value;
    }
  }
  onApplicableEntityTypeChange(e) {
    if(this.viewData.applicableEntityType!= e.value){
      this.viewData.applicableEntityType= e.value;
    }
  }
  onPlanTypeChange(e) {
    if(this.viewData.planType!= e.value){
      this.viewData.planType= e.value;
    }
  }

  onDurationTypeChange(e) {
    if(this.viewData.durationType!= e.value){
      this.viewData.durationType= e.value;
    }
  }

  submitEditUser() {
    if (this.productForm.status == 'VALID' && (this.manageBenifitArray.status == 'VALID' || this.manageDescription.status == 'VALID')) {
      let mainArray = [];
      if(this.viewData.productType =='SUBSCRIPTION_PLAN'){
        const data = this.manageBenifitArray.value.details;
        data.forEach(element => {
        mainArray.push(element);
      });
    }
      let subArray = [];
      if(this.viewData.productType == 'VAAS_PLAN'){
        const subData = this.manageDescription.value.details;
        subData.forEach(element => {
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
      })
      this.productForm.get('productCountries').setValue(newName);
      let finalData: any  = {
        productType: this.productForm.controls['productType'].value,
        applicableEntityType: this.productForm.controls['applicableEntityType'].value,
        planType: this.productForm.controls['planType'].value,
        productCountries: newName,
        planName: this.productForm.controls['planName'].value,
        price: this.productForm.controls['price'].value,
        currency: this.productForm.controls['currency'].value,
        duration: this.productForm.controls['duration'].value,
        durationType: this.productForm.controls['durationType'].value,
        id: this.productForm.controls['id'].value,
      };
      if (this.productForm.controls['productType'].value === 'SUBSCRIPTION_PLAN') {
        finalData = {
          ...finalData,
        credits: this.productForm.controls['credits'].value,
        customerSupport: this.productForm.controls['customerSupport'].value,
        relationshipManager: this.productForm.controls['relationshipManager'].value,
        remark: this.productForm.controls['remark'].value,
        maxTransactionRejectLimit: this.productForm.controls['maxTransactionRejectLimit'].value,
        productBenefits: mainArray,
        id: this.productForm.controls['id'].value,
        // duration: this.productForm.controls['duration'].value,
        // durationType: this.productForm.controls['durationType'].value,
        };
        if(this.viewData.planType == 'POSTPAID'){
          finalData = {
            ...finalData,
            postpaidTransactionPercentage: this.productForm.controls['postpaidTransactionPercentage'].value,
            postpaidMaximumTransactionAmount: this.productForm.controls['postpaidMaximumTransactionAmount'].value,
            postpaidMaximumAllowedTransations: this.productForm.controls['postpaidMaximumAllowedTransations'].value,
          }
        }
        if(this.viewData.applicableEntityType == 'CUSTOMER'){
          finalData = {
            ...finalData,
            allowedSubsidiaries: this.productForm.controls['allowedSubsidiaries'].value,
          }
        }
      }else if(this.productForm.controls['productType'].value === 'VAAS_PLAN'){
        finalData = {
          ...finalData,
        productDescriptions: subArray,
        id: this.productForm.controls['id'].value,
        };
        // if(this.viewData.planType == 'POSTPAID'){
        //   finalData = {
        //     ...finalData,
        //     productDescriptions: subArray,
        //   id: this.productForm.controls['id'].value,
        //   duration: this.productForm.controls['duration'].value,
        //   durationType: this.productForm.controls['durationType'].value,
        //   }
        // }
      }
      Object.keys(finalData).forEach((key) => (finalData[key] == '') && delete finalData[key]);

      this.productService.updateProduct(finalData).subscribe((res: any) => {
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

  textOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 64 || charCode > 91) || charCode == 32) {
      return true;
    }
    return false;
  }
  numberonly(event): boolean {
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
  deleteDescription(i) {
    const details = this.manageDescription.get('details') as FormArray;
    if (i >= 1) {
      details.removeAt(i);
    }
  }
  deleteUser(i) {
    const details = this.manageBenifitArray.get('details') as FormArray;
    if (i >= 1) {
      details.removeAt(i);
    }
  }
  isBenefitProtected(benefitName: string): boolean {
    return this.selectedPlan === 'SUBSCRIPTION_PLAN' && (benefitName === 'Credits' || benefitName === 'Customer Support' || benefitName === 'Relationship Manager');
  }
}