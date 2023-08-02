import { Component, Input, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AutomatedBaauService } from '../services/automated-baau.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable ,startWith,map} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-create-automated-baau',
  templateUrl: './create-automated-baau.component.html',
  styleUrls: ['./create-automated-baau.component.scss']
})
export class CreateAutomatedBaauViewComponent implements OnInit {

  routelocation: any;
  countries: any;
  allGoods: any;
  public manageSubFormArray: FormGroup;
  countryCodeList:any=[];
  rmList:any=[];
  currencies:any=[];
  public manageSubForm: FormGroup;
  newnamecountry: any;
  selectallCountry: boolean;
  selectallissuanceCountryList:boolean;
  isAllselected: boolean;
  isAllselectedissuanceCountryList:boolean;
  onlyall: any;
  filteredCountries:any;
  filteredCountryCodes:any;
  filteredCurrencies:any;
  filteredIssaunceCountries: any[] = [];
  filteredGoods: any[] = [];
  filteredBeneCountries:any[] = [];
    constructor(private route: ActivatedRoute, private automatedbaauService: AutomatedBaauService, private location: Location,
    private formBuilder: FormBuilder, private dialog: MatDialog,private router:Router) {

    this.routelocation = this.location;
    console.log(this.routelocation,'this.routelocation');
    console.log(this.location,'this.location')
    this.manageSubForm = this.formBuilder.group({
      bankName: ['', Validators.required],
      country: ['', Validators.required],
      swiftCode: ['',[Validators.required, Validators.maxLength(11)]],
      currency: ['',Validators.required],
      minLcValue: ['',Validators.required],
      countryExt: ['', Validators.required],
      landLineNumber: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      mobileNo: ['', [Validators.minLength(7), Validators.maxLength(13), Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      issuanceCountryList: [[], Validators.required],
      blklstedGoods: [[], Validators.required],
      beneficiaryCountryList: [[], Validators.required],
      rmUserId: ['',Validators.required],
      userType: ['MASTER_USER']
  
    });
    const items = [];
    items.push(this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: [''],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]],
      userType: ['PASSCODE_USER']
    }));
    this.manageSubFormArray = this.formBuilder.group({
      details: this.formBuilder.array(items),
    });
  }

  ngOnInit() {
    this.automatedbaauService.getAllCountryCode().subscribe((res: any) => {
      console.log(res,'res123')
      this.countries = res.data[0].countryList;
      this.filteredCountries = this.countries;
      this.countryCodeList = this.countries.map(x => x.countryCode);
      this.filteredCountryCodes = this.countryCodeList;
      this.currencies = res.data[0].currencies;
      this.filteredCurrencies = this.currencies;
      this.filteredIssaunceCountries =  this.countries;
      this.filteredBeneCountries =  this.countries;
    });


    this.automatedbaauService.getAllGoods().subscribe((res: any) => {
      this.allGoods = res.data[0];
      const removeOption = ['Others']
      this.allGoods = this.allGoods.filter(option => !removeOption.includes(option.name));
      this.filteredGoods =  this.allGoods;
      console.log(this.allGoods)
    });
  }
  countryValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    console.log(searchText);
    this.filteredCountries = this.countries.filter(item =>
      item.countryName.toLowerCase().includes(searchText)
    );
    console.log(this.filteredCountries);
  }
  issuanceCountryValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    const selectedCountries = this.manageSubForm.controls['issuanceCountryList'].value;

    this.filteredIssaunceCountries = this.countries;

    if (searchText) {
      this.filteredIssaunceCountries = this.filteredIssaunceCountries.filter(item =>
      item.countryName.toLowerCase().includes(searchText) || selectedCountries.includes(item.countryName)
      );
    }
  }
  onIssuanceCountrySelection(event: MatSelectChange){
    this.manageSubForm.get('issuanceCountryList').setValue(event.value);
    this.filteredIssaunceCountries = this.countries;
  }
  beneCountryValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    const selectedBeneCountries = this.manageSubForm.controls['beneficiaryCountryList'].value;

    this.filteredBeneCountries = this.countries;

    if (searchText) {
      this.filteredBeneCountries = this.filteredBeneCountries.filter(item =>
      item.countryName.toLowerCase().includes(searchText) || selectedBeneCountries.includes(item.countryName)
      );
    }
  }
  onBeneCountrySelection(event: MatSelectChange){
    this.manageSubForm.get('beneficiaryCountryList').setValue(event.value);
    this.filteredBeneCountries = this.countries;
  }
  goodsValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    const selectedGoods = this.manageSubForm.controls['blklstedGoods'].value;

    this.filteredGoods = this.allGoods;

    if (searchText) {
      this.filteredGoods = this.filteredGoods.filter(item =>
      item.name.toLowerCase().includes(searchText) || selectedGoods.includes(item.name)
      );
    }
  }
  onGoodsSelection(event: MatSelectChange){
    this.manageSubForm.get('blklstedGoods').setValue(event.value);
    this.filteredGoods = this.allGoods;
  }
  countryCodeValueChange(event: any) {
    const searchText = event.target.value;
    this.filteredCountryCodes = this.countryCodeList.filter(item =>
      item.toString().includes(searchText)
    );
  }
  currencyValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    this.filteredCurrencies = this.currencies.filter(item =>
      item.toLowerCase().includes(searchText)
    );
  }

  getAllRm(){
    const data ={
      countryName : this.manageSubForm.controls['country'].value,
      subscriberType : 'BANK_AS_UNDERWRITER'
    }
    this.automatedbaauService.getAllRM(data).subscribe((res:any)=>{
      this.rmList = res.data[0];
    });
  }
  onCatRemoved(cat: string,type) {
    if(type=='issuanceCountry'){
      const categories = this.manageSubForm.controls['issuanceCountryList'].value as string[];
    this.removeFirst(categories, cat);
    this.manageSubForm.controls['issuanceCountryList'].setValue(categories); 
    }else if (type=='beneCountry'){
      const categories = this.manageSubForm.controls['beneficiaryCountryList'].value as string[];
      this.removeFirst(categories, cat);
      this.manageSubForm.controls['beneficiaryCountryList'].setValue(categories); 
    }else if(type=='goods'){
      const categories = this.manageSubForm.controls['blklstedGoods'].value as string[];
      this.removeFirst(categories, cat);
      this.manageSubForm.controls['blklstedGoods'].setValue(categories); // To trigger change detection
    }
  }
  private removeFirst<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: [''],
      email: [''],
      userType: ['PASSCODE_USER']

    });
  }
  additionalUser() {
    const details = this.manageSubFormArray.get('details') as FormArray;
    //  let items = this.manageSubForm.get('details') as FormArray;
    if (details.length < 10) {
      details.push(this.createItem());
    }
  }
  deleteUser(i) {
    console.log(i);
    const details = this.manageSubFormArray.get('details') as FormArray;
    if (i >= 1) {
      details.removeAt(i);
    }
  }
  submit() {
    // this.selectallCountry ? (this.manageSubForm.get('issuanceCountryList').setValue(['ALL'])) : '';
    // this.selectallissuanceCountryList ? (this.manageSubForm.get('beneficiaryCountryList').setValue(['ALL'])) : '';
    console.log("onsubmit",this.manageSubForm);
    let additionDetailsList: any = this.manageSubFormArray.controls['details'];
    additionDetailsList = additionDetailsList.value;
    if (additionDetailsList.length >= 1) {
      additionDetailsList.forEach((element, index) => {
        if (element.firstName == '' && element.lastName == '' && element.email == '' && element.mobileNo == '') {
          additionDetailsList.splice(index, 1);
        }
      });
    }
    if (additionDetailsList.length >= 1) { this.manageSubFormArray.get('details').setValue(additionDetailsList); }
    if(this.manageSubForm.status == 'VALID' && this.manageSubFormArray.status == 'VALID'){
    let mainArray = [];
    const manageSubForm = {
      firstName: this.manageSubForm.controls['firstName'].value,
      lastName: this.manageSubForm.controls['lastName'].value,
      mobileNo: this.manageSubForm.controls['mobileNo'].value,
      email: this.manageSubForm.controls['email'].value,
      userType: 'MASTER_USER'
    }
    mainArray.push(manageSubForm);
    const data = additionDetailsList;
    data.forEach(element => {
      mainArray.push(element);
    });
    let finalData = {
      bankName: this.manageSubForm.controls['bankName'].value,
      country:  this.manageSubForm.controls['country'].value,
      swiftCode: this.manageSubForm.controls['swiftCode'].value ,
      currency: this.manageSubForm.controls['currency'].value,
      minLCValue:this.manageSubForm.controls['minLcValue'].value ,
      countryExt: this.manageSubForm.controls['countryExt'].value,
      landLineNumber:this.manageSubForm.controls['landLineNumber'].value ,
      issuanceCountryList: this.manageSubForm.controls['issuanceCountryList'].value,
      blklstedGoods: this.manageSubForm.controls['blklstedGoods'].value,
      beneficiaryCountryList: this.manageSubForm.controls['beneficiaryCountryList'].value,
      rmUserId: this.manageSubForm.controls['rmUserId'].value,
      bankType: "AUTOMATED",
      userList: mainArray
    }
    console.log('last line', finalData);
    this.automatedbaauService.createAutomatedBaau(finalData).subscribe(res=>{
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
      if(res['success']== true){
        this.router.navigateByUrl(`/adminv2/automated-baau/list`);
      }
    })
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

   isNumberKey(evt)
{
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode < 48 || charCode > 57)
    return false;
  return true;
}
numberOnly(evt){
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  if ((charCode < 48 || charCode > 57) && charCode !== 46)
    return false;
  return true;
}
stopPropagation(event: Event): void {
  event.stopPropagation();
}
selectAll(e,type) {
  this.newnamecountry = '';
  if(type == 'issuanceCountryList'){
    this.selectallissuanceCountryList = e;
    this.isAllselectedissuanceCountryList = e;
    var onlyAll = ['ALL'];
    // e ? (this.newnamecountry = (onlyAll.concat(this.countries.map(x => x.countryName))), this.onlyall = ['ALL']) : this.newnamecountry = [];
    e ? this.manageSubForm.get('issuanceCountryList').setValue(['ALL']) : this.manageSubForm.get('issuanceCountryList').setValue([]);
    ;
  }if(type == "beneficiaryCountryList"){
    this.selectallCountry = e;
    this.isAllselected = e;
    var onlyAll = ['ALL'];
    // e ? (this.newnamecountry = (onlyAll.concat(this.countries.map(x => x.countryName))), this.onlyall = ['ALL']) : this.newnamecountry = [];
    e ? this.manageSubForm.get('beneficiaryCountryList').setValue(['ALL']) : this.manageSubForm.get('beneficiaryCountryList').setValue([]);
  }
}
cancelForm(): void {
  this.router.navigateByUrl(`/adminv2/automated-baau/list`);
}
}
