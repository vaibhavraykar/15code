import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubscriptionMgmtServices } from '../services/subscription-services.services';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})
export class AddSubscriptionComponent {
  public manageBenifitArray: FormGroup;
  public manageDescription: FormGroup;
  form!: FormGroup;
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
  showPostpaidButton: boolean = true;
  months: number[] = Array.from(Array(12).keys()).map(i => i + 1);
  days: number[] = Array.from(Array(31).keys()).map(i => i + 1);
  years: number[] = Array.from(Array(100).keys()).map(i => i + 1);
  isAllselected: boolean;
  onlyall: any;
  filteredCountries: any[] = [];
  constructor(public dialogRef: MatDialogRef<AddSubscriptionComponent>, private formBuilder: FormBuilder, private location: Location,
     private subsMgmtService: SubscriptionMgmtServices,
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
      postpaidMinimumTransactionPercentage: [''],
      postpaidMinimumTransactionAmount: [''],
      postpaidMaximumAllowedTransations: [''],
      postpaidVisibilityLimit: [''],

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
    this.subsMgmtService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.filteredCountries = this.countries;
      console.log(res.data, 'res');
      this.countryNameList = this.countries.map(x => x.countryName);
    });
    console.log('days',this.days);
    console.log(this.manageDescription);
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      newBankListControl: new FormControl([], [Validators.required]),
    });
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

  countryValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    const selectedCountries = this.productForm.controls['productCountries'].value;

    this.filteredCountries = this.countries;

    if (searchText) {
      this.filteredCountries = this.filteredCountries.filter(item =>
      item.countryName.toLowerCase().includes(searchText) || selectedCountries.includes(item.countryName)
      );
    }
  }
  
  onCountrySelection(event: MatSelectChange) {
    this.productForm.get('productCountries').setValue(event.value);
    this.filteredCountries = this.countries;
  }
  onDurationTypeChange(e) {
    this.selectedDurationType = this.productForm.controls['durationType'].value;
  }
  selectAll(e){
    // for testing 
    this.selectallCountry = e;
    console.log(e);
    this.isAllselected = e;
    var onlyAll = ['ALL'];
    e ? (this.newCountryName = (onlyAll.concat(this.countries.map(x => x.countryName))), this.onlyall = ['ALL']) : this.newCountryName = [];
    console.log(this.productForm.value, 'this.personalForm');
    console.log(this.newCountryName, 'this.newCountryName');
    let countryNameValue = this.form.get('newBankListControl').setValue(this.newCountryName);
    this.productForm.get('productCountries').setValue(countryNameValue);
    console.log('line 80', this.productForm.value);
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
    if (this.productType === 'VAAS_PLAN') {
      this.showPostpaidButton = false; // Hide the "POSTPAID" button
      this.planType = 'PREPAID'; // Set the value of "planType" to "PREPAID"
    } else {
      this.showPostpaidButton = true; // Show the "POSTPAID" button for other product types
    }
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

  onCatRemoved(cat: string) {
    const categories = this.form.controls['newBankListControl'].value as string[];
    this.removeFirst(categories, cat);
    this.form.controls['newBankListControl'].setValue(categories); // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  
  onSubmit() {
    this.testValidators();
    this.productForm.get('productCountries').setValue(this.form.get('newBankListControl').value);
    this.productForm.get('applicableEntityType').setValue(this.applicableEntityType);
    this.productForm.get('productType').setValue(this.productType);
    this.productForm.get('planType').setValue(this.planType);
    console.log('productForm',this.productForm);
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
        postpaidMinimumTransactionPercentage: this.productForm.controls['postpaidMinimumTransactionPercentage'].value,
        postpaidMinimumTransactionAmount: this.productForm.controls['postpaidMinimumTransactionAmount'].value,
        postpaidMaximumAllowedTransations: this.productForm.controls['postpaidMaximumAllowedTransations'].value,
        postpaidVisibilityLimit: this.productForm.controls['postpaidVisibilityLimit'].value,
        productBenefits: mainArray,
        productDescriptions: subArray
      }
      console.log(finalData);
      Object.keys(finalData).forEach((key) => (finalData[key] == '') && delete finalData[key]);
      console.log("finalData",finalData);
      this.subsMgmtService.createNewProduct(finalData).subscribe(res => {
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
          this.router.navigateByUrl('adminv2/subscription-management/subscription-list');
        } else {
          this.productForm.get('productCountries').setValue(this.newCountryList);
        }

        this.close();
        this.subsMgmtService.callGetApi.next(true);
      })
    }

  }
  close() {
    this.dialogRef.close();
  }

  cancelForm(): void {
    this.router.navigateByUrl('adminv2/subscription-management/subscription-list');
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

  percentOnly(event,type):boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const decimalCount = inputValue.split('.').length - 1;

    if (charCode === 46 && decimalCount === 0) {
        return true;
    }
    if (charCode >= 48 && charCode <= 57) {
      const newValue = inputValue + String.fromCharCode(charCode);
      const numericValue = +newValue;
      if(type == 'percent'){
        if (numericValue > 100 || numericValue < 0) {
          return false;
        }
      } else if(type == 'reject'){
        if (numericValue > 5 || numericValue < 0) {
          return false;
        }
      }
      return true;
    }
    return false;
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
      this.productForm.get('postpaidMaximumAllowedTransations').clearValidators();
    }
    if (this.productType == 'SUBSCRIPTION_PLAN' && this.planType == 'POSTPAID'){
      this.productForm.get('postpaidMaximumAllowedTransations').setValidators(Validators.required);
      this.productForm.get('postpaidMaximumAllowedTransations').updateValueAndValidity();
    } else {
      this.productForm.get('postpaidMaximumAllowedTransations').clearValidators;
      this.productForm.get('postpaidMaximumAllowedTransations').updateValueAndValidity();
    }
    if (this.planType == 'POSTPAID' && this.productType == 'SUBSCRIPTION_PLAN' && this.applicableEntityType == 'BANK_AS_UNDERWRITER') {
      this.productForm.get('postpaidMinimumTransactionPercentage').setValidators(Validators.required);
      this.productForm.get('postpaidMinimumTransactionPercentage').updateValueAndValidity();
      this.productForm.get('postpaidMinimumTransactionAmount').setValidators(Validators.required);
      this.productForm.get('postpaidMinimumTransactionAmount').updateValueAndValidity();
    }
    else {
      this.productForm.get('postpaidMinimumTransactionPercentage').clearValidators();
      this.productForm.get('postpaidMinimumTransactionPercentage').updateValueAndValidity();
      this.productForm.get('postpaidMinimumTransactionAmount').clearValidators();
      this.productForm.get('postpaidMinimumTransactionAmount').updateValueAndValidity();
    }
    if (this.applicableEntityType == 'CUSTOMER' && this.productType == 'SUBSCRIPTION_PLAN') {
      this.productForm.get('allowedSubsidiaries').setValidators(Validators.required);
      this.productForm.get('allowedSubsidiaries').updateValueAndValidity();
    } else {
      this.productForm.get('allowedSubsidiaries').clearValidators();
      this.productForm.get('allowedSubsidiaries').updateValueAndValidity();
    }
    if ((this.applicableEntityType == 'CUSTOMER' || this.applicableEntityType == 'BANK') && this.productType == 'SUBSCRIPTION_PLAN' && this.planType == 'POSTPAID') {
      this.productForm.get('postpaidVisibilityLimit').setValidators(Validators.required);
      this.productForm.get('postpaidVisibilityLimit').updateValueAndValidity();
    } else {
      this.productForm.get('postpaidVisibilityLimit').clearValidators();
      this.productForm.get('postpaidVisibilityLimit').updateValueAndValidity();
    }
    if (this.productType == 'VAAS_PLAN' && this.planType == 'PREPAID') {
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
    if ((this.productType == 'SUBSCRIPTION_PLAN' || this.productType == 'VAAS_PLAN') && (this.planType == 'PREPAID')) {
      this.productForm.get('durationType').setValidators(Validators.required);
      this.productForm.get('durationType').updateValueAndValidity();
      this.productForm.get('duration').setValidators(Validators.required);
      this.productForm.get('duration').updateValueAndValidity();
    } else {
      this.productForm.get('durationType').clearValidators();
      this.productForm.get('durationType').updateValueAndValidity();
      this.productForm.get('duration').clearValidators();
      this.productForm.get('duration').updateValueAndValidity();
    }
    this.productForm.get('credits').updateValueAndValidity();
    this.productForm.get('customerSupport').updateValueAndValidity();
    this.productForm.get('relationshipManager').updateValueAndValidity();
    this.productForm.get('remark').updateValueAndValidity();
    this.productForm.get('maxTransactionRejectLimit').updateValueAndValidity();
  }
  
}
