import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionMgmtServices } from '../services/subscription-services.services';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-edit-subscription',
  templateUrl: './edit-subscription.component.html',
  styleUrls: ['./edit-subscription.component.scss']
})
export class EditSubscriptionComponent {
  public manageBenifitArray: FormGroup;
  public manageDescription: FormGroup;
  form!: FormGroup;
  planType: any;
  productType: any;
  applicableEntityType: any;
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
  updatedData: any = {};
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
  selectallCountry: boolean;
  months: number[] = Array.from(Array(12).keys()).map(i => i + 1);
  days: number[] = Array.from(Array(31).keys()).map(i => i + 1);
  years: number[] = Array.from(Array(100).keys()).map(i => i + 1);
  countryNameSet: any = [];
  isAllselected: boolean;
  onlyall: any;
  filteredCountries: any[] = [];
  countrySearchText: any;
  constructor(public dialogRef: MatDialogRef<EditSubscriptionComponent>, private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
    private dialog: MatDialog, private subsMgmtService: SubscriptionMgmtServices,) {
    this.subsMgmtService.editProduct.subscribe((res: any) => {
      if (res) {
        this.id = res;
      }
    })
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.id = params['id'];
      console.log('id', this.id);
    })


    this.subsMgmtService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.filteredCountries = this.countries;
      this.countryNameList = this.countries.map(x => x.countryName);
      this.viewProduct();
    });
    this.productForm = fb.group({
      productType: ['VAAS_PLAN'],
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
      postpaidMinimumTransactionPercentage: [''],
      postpaidMinimumTransactionAmount: [''],
      postpaidMaximumAllowedTransations: [''],
      id: [''],
      postpaidVisibilityLimit: ['']
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

    if (this.productForm.get('productType').value === 'VAAS_PLAN') {
      this.productForm.get('planType').setValue('PREPAID');
    }
  }
  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      newBankListControl: new FormControl([], [Validators.required]),
    });
  }
  selectAll(e) {
    this.selectallCountry = e;
    var onlyAll = ['ALL'];
    this.isAllselected = e;

    if (e) {
      this.productForm.get('productCountries').setValue(['ALL']);
    } else {
      this.productForm.get('productCountries').setValue([]);
    }
    const searchText = this.countrySearchText.toLowerCase();
    const selectedCountries = this.productForm.controls['productCountries'].value;

    this.filteredCountries = this.countries;
    if (searchText) {
      this.filteredCountries = this.filteredCountries.filter(item =>
        item.countryName.toLowerCase().includes(searchText) || selectedCountries.includes(item.countryName)
      );
    }
    // this.selectallCountry = e;
    // var onlyAll = ['ALL'];
    // this.isAllselected = e;

    // e ? (this.newCountryName = onlyAll.concat(this.countries.map(x => x.countryName)), this.onlyall = ['ALL']) : this.newCountryName = [];
    // let countryNameValue = this.form.get('newBankListControl').setValue(this.newCountryName);
    // this.productForm.get('productCountries').setValue(countryNameValue);
  }
  viewProduct() {
    this.subsMgmtService.getProductById(this.id).subscribe((res: any) => {
      this.viewData = res['data'][0];
      this.selectedPlan = this.viewData.productType;
      this.selectedApplicableType = this.viewData.applicableEntityType;
      this.selectedProductPlan = this.viewData.planType;
      this.selectedDuration = this.viewData.durationType;
      if (this.selectedPlan === 'SUBSCRIPTION_PLAN') {
        this.selectedRM = (this.viewData.relationshipManager).toString();
        console.log('prod details', this.selectedRM);
      }
      this.productBenefitList = this.viewData['productBenefits'];
      if (this.selectedPlan === 'VAAS_PLAN') {
        this.productDescriptionList = this.viewData['productDescriptions'];
      }
      if (this.selectedPlan === 'VAAS_PLAN') {
        this.diffArray = this.manageDescription.get('details') as FormArray;
        this.productDescriptionList.forEach(e => {
          this.diffArray.push(this.fb.group({
            id: e.id,
            description: e.description
          }));
        });
        this.diffArray.removeAt(0);
      }
      if (this.selectedPlan === 'SUBSCRIPTION_PLAN') {
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
        postpaidMinimumTransactionPercentage: this.viewData.postpaidMinimumTransactionPercentage,
        postpaidMinimumTransactionAmount: this.viewData.postpaidMinimumTransactionAmount,
        postpaidMaximumAllowedTransations: this.viewData.postpaidMaximumAllowedTransations,
        postpaidVisibilityLimit: this.viewData.postpaidVisibilityLimit,
        productDescriptions: this.viewData.productDescriptions,
        productBenefits: this.viewData.productBenefits,
        id: this.viewData.id,
      }
      );
      var AllSelected = this.countryNameSet.filter(x => x == "ALL");
      if (AllSelected.length > 0) {
        this.onlyall = ['ALL'];
        this.isAllselected = true;
        this.form.get('newBankListControl').setValue(this.onlyall)
      } else {
        this.isAllselected = false;
        this.newCountryName = this.countryNameSet;
        this.form.get('newBankListControl').setValue(this.newCountryName)
      }
    })
    this.updatedData = this.viewData;
  }
  back() {
    this.router.navigateByUrl('adminv2/subscription-management/subscription-list');
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
    if (this.viewData.productType != e.value) {
      this.viewData.productType = e.value;
    }
  }
  onApplicableEntityTypeChange(e) {
    if (this.viewData.applicableEntityType != e.value) {
      this.viewData.applicableEntityType = e.value;
    }
  }
  onPlanTypeChange(e) {
    if (this.viewData.planType != e.value) {
      this.viewData.planType = e.value;
    }
  }

  countryValueChange(event: any) {
    this.countrySearchText = event.target.value.toLowerCase();
    const selectedCountries = this.productForm.controls['productCountries'].value;

    this.filteredCountries = this.countries;

    if (this.countrySearchText) {
      this.filteredCountries = this.filteredCountries.filter(item =>
        item.countryName.toLowerCase().includes(this.countrySearchText) || selectedCountries.includes(item.countryName)
      );
    }
  }

  onCountrySelection(event: MatSelectChange) {
    this.productForm.get('productCountries').setValue(event.value);

    const searchText = this.countrySearchText.toLowerCase();
    const selectedCountries = event.value;

    this.filteredCountries = this.countries;

    if (searchText) {
      this.filteredCountries = this.filteredCountries.filter(item =>
        item.countryName.toLowerCase().includes(searchText) || selectedCountries.includes(item.countryName)
      );
    }
    // this.productForm.get('productCountries').setValue(event.value);
    // this.filteredCountries = this.countries;
  }

  onDurationTypeChange(e) {
    if (this.viewData.durationType != e.value) {
      this.viewData.durationType = e.value;
    }
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

  submitEditUser() {
    this.productForm.get('productCountries').setValue(this.form.get('newBankListControl').value);
    console.log('productForm', this.productForm);
    if (this.productForm.status == 'VALID' && (this.manageBenifitArray.status == 'VALID' || this.manageDescription.status == 'VALID')) {
      let mainArray = [];
      if (this.viewData.productType == 'SUBSCRIPTION_PLAN') {
        const data = this.manageBenifitArray.value.details;
        data.forEach(element => {
          mainArray.push(element);
        });
      }
      let subArray = [];
      if (this.viewData.productType == 'VAAS_PLAN') {
        const subData = this.manageDescription.value.details;
        subData.forEach(element => {
          subArray.push(element);
        });
      }
      this.selectallCountry ? (this.productForm.get('productCountries').setValue(['ALL'])) : '';
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
      let finalData: any = {
        productType: this.productForm.controls['productType'].value,
        applicableEntityType: this.productForm.controls['applicableEntityType'].value,
        planType: this.productForm.controls['planType'].value,
        productCountries: newName,
        planName: this.productForm.controls['planName'].value,
        price: this.productForm.controls['price'].value,
        currency: this.productForm.controls['currency'].value,
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

        };
        if (this.viewData.planType == 'PREPAID') {
          finalData = {
            ...finalData,
            duration: this.productForm.controls['duration'].value,
            durationType: this.productForm.controls['durationType'].value,
          }
        };
        if (this.viewData.planType == 'POSTPAID') {
          finalData = {
            ...finalData,
            postpaidMaximumAllowedTransations: this.productForm.controls['postpaidMaximumAllowedTransations'].value,
          }
        };
        if (this.viewData.planType == 'POSTPAID' && this.viewData.applicableEntityType == 'BANK_AS_UNDERWRITER') {
          finalData = {
            ...finalData,
            postpaidMinimumTransactionPercentage: this.productForm.controls['postpaidMinimumTransactionPercentage'].value,
            postpaidMinimumTransactionAmount: this.productForm.controls['postpaidMinimumTransactionAmount'].value,
          }
        };
        if (this.viewData.planType == 'POSTPAID' && (this.viewData.applicableEntityType == 'BANK' || this.viewData.applicableEntityType == 'CUSTOMER')) {
          finalData = {
            ...finalData,
            postpaidVisibilityLimit: this.productForm.controls['postpaidVisibilityLimit'].value,
          }
        };
        if (this.viewData.applicableEntityType == 'CUSTOMER') {
          finalData = {
            ...finalData,
            allowedSubsidiaries: this.productForm.controls['allowedSubsidiaries'].value,
          }
        }
      } else if (this.productForm.controls['productType'].value === 'VAAS_PLAN') {
        finalData = {
          ...finalData,
          productDescriptions: subArray,
          id: this.productForm.controls['id'].value,
        };
        if (this.viewData.planType == 'PREPAID') {
          finalData = {
            ...finalData,
            duration: this.productForm.controls['duration'].value,
            durationType: this.productForm.controls['durationType'].value,
          }
        }
      }
      Object.keys(finalData).forEach((key) => (finalData[key] == '') && delete finalData[key]);

      this.subsMgmtService.updateProduct(finalData).subscribe((res: any) => {
        const popup = this.dialog.open(GeneralPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
          disableClose: true
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
  numberonly(event): boolean {
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

  percentOnly(event, type): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const decimalCount = inputValue.split('.').length - 1;

    if (charCode === 46 && decimalCount === 0) {
      return true;
    }
    if (charCode >= 48 && charCode <= 57) {
      const newValue = inputValue + String.fromCharCode(charCode);
      const numericValue = +newValue;
      if (type == 'percent') {
        if (numericValue > 100 || numericValue < 0) {
          return false;
        }
      } else if (type == 'reject') {
        if (numericValue > 5 || numericValue < 0) {
          return false;
        }
      }
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
