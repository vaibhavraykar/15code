import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../services/auth.service';
import { TncComponent } from '../tnc/tnc.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';


export class MultiSelectGoods {
  constructor(public name: string ,public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

export class MultiSelectCountries {
  constructor(public name: string ,public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements  OnChanges {
  @Input()userDetails:any;
  @ViewChild('fname')fnameRef:any
  @ViewChild('lname')lnameRef:any
  @ViewChild('email')emailRef:any
  businessTypes:any=[
    {name:'BANK',value:'BANK'},
    {name:'CA FIRM',value:'CA_FIRM'},
    {name:'LAW  FIRM',value:'LAW_FIRM'},
    {name:'CORPORATE',value:'CORPORATE'},
    {name:'CONSULTANT',value:'CONSULTANT'},
    {name:'OTHER',value:'OTHER'}
  ]

  @Input() subscriber:any;

  countryOriginOptions: any;
  data:any={};
  selectedValue: string;
  countryCode?:any='';


  firstName:any;
  lastName:any;
  email:any;
  mobile:any;
  landline:any;
  companyName:any;
  designation:any;
  otherBusinessType:any;
  getbutton:boolean=true;
  termsAcccepted:boolean=true;
  countrySel:boolean=false;
  selectedOtherBusinesssType:boolean=false;
  buttonClicked:boolean=false;
  formFilled:boolean = false;
  showTermsAcceptedError: boolean = false;
  showFormError:boolean = false;

  countrySelected=new FormControl('',[Validators.required]);
  mobileNo=new FormControl('',[Validators.required,Validators.minLength(7)]);
  issuanceCountry = new FormControl('',[Validators.required]);
  beneficiaryCountry = new FormControl('',[Validators.required]);
  minLCValue= new FormControl('',[Validators.required]);
  blacklistedGoods =new FormControl('',[Validators.required]);
  businessType=new FormControl('',[Validators.required]);
  currency = new FormControl('',[Validators.required]);
  landlineNumber = new FormControl('',[Validators.required,Validators.minLength(7)]);

  countries:any = [];
  beneficiaryCountries:any=[];
  issuanceCountries:any=[];
  goods:any=[];
  currencies:any=[];

  selectedGoods:any=[];
  selectedGoodsNames:any=[];
  selectedBeneficiaryCountries:any=[];
  selectedBeneficiaryCountryNames:any=[];
  selectedIssuanceCountries:any=[];
  selectedIssuanceCountryNames:any=[];

  countryOptions:any;
  currencyOptions:any;
  businessTypeOptions:any;
  goodsOptions:any;
  beneficiaryCountryOptions:any;
  issuanceCountryOptions:any;

  firstNameValid:boolean=false;
  lastNameValid:boolean=false;
  emailValid:boolean=false;
  mobileValid:boolean=false;
  landlineValid:boolean=false;
  companyNameValid:boolean=false;
  designationValid:boolean=false;
  minLCValid:boolean=false;
  otherBusinessTypeValid:boolean=false;

  constructor(public dialog: MatDialog,
    private authService:AuthService,
    private apiService:ApiService,
    private router:Router) {
  }
  ngOnChanges(changes: SimpleChanges): void {
  if(Object.keys(changes['userDetails']?.currentValue||{}).length>0){
    // changes['userDetails'].currentValue
    let val = changes['userDetails']?.currentValue
    this.fnameRef.form.patchValue(val?.firstName)
    this.firstName=val?.firstName
    this.lnameRef.form.patchValue(val?.lastName)

    this.emailRef.form.patchValue(val?.email)
    this.countrySelected.patchValue(val?.country?.toUpperCase())
    this.mobileNo.patchValue(val?.mobileNo)
    this.landlineNumber.patchValue(val?.mobileNo)
    this.lastName=val?.firstName
    this.email=val?.email
    this.mobile=val?.mobileNo
    this.landline=val?.mobileNo
    this.firstNameValid=true
    this.lastNameValid=true
    this.emailValid=true
    this.data.thirdPartyReferById=val?.thirdPartyReferrerId
    this.removeCountry()
  }
  }



  ngOnInit(): void {
    // this.getButtonStatus()
    this.termsAcccepted=false;
    console.log(this.subscriber);
    this.apiService.getAllCountryCode().subscribe((res:any)=>{
      console.log(res);
      if(res.data[0]){
        this.beneficiaryCountries.push(new MultiSelectCountries('All'))
        this.issuanceCountries.push(new MultiSelectCountries('All'))
        res.data[0].countryList.map((item:any)=>{
          this.beneficiaryCountries.push(new MultiSelectCountries(item.countryName))
          this.issuanceCountries.push(new MultiSelectCountries(item.countryName))
        });
      }
      this.beneficiaryCountryOptions=this.beneficiaryCountries?.sort();
      this.issuanceCountryOptions = this.issuanceCountries;
      // console.log('---------',this.beneficiaryCountries)
      this.countries=res.data[0].countryList;
      this.currencies=res.data[0].currencies;
      this.countryOptions = this.countries;
      this.currencyOptions=this.currencies;
      this.countryOptions.sort((a, b) => {
        const countryA = a.countryName.toUpperCase();
        const countryB = b.countryName.toUpperCase();
        if (countryA < countryB) {
          return -1;
        }
        if (countryA > countryB) {
          return 1;
        }
        return 0;
      });
      this.currencyOptions.sort()


    })
    this.apiService.getAllGoods().subscribe((res:any)=>{
      console.log(res);
      if(res.data[0]){
        res.data[0].map((item:any)=>{
          // console.log(item);
          this.goods.push(new MultiSelectGoods(item.name));
        })
      }
      // this.goods=res.data[0].name;
      // console.log(this.goods)
      this.goodsOptions=this.goods;
    });
    this.businessTypeOptions=this.businessTypes;




  }

  success() {
  }

  firstNameHandler(e:any){
    this.firstName = e;
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if(this.showTermsAcceptedError){

    this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  firstNameValidity(e:any){
    this.firstNameValid=e;
  }

  lastNameHandler(e:any){
    this.lastName = e;
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if (this.showTermsAcceptedError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =
        this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  lastNameValidity(e:any){
    this.lastNameValid=e;
  }

  emailHandler(e:any){
    this.email = e;
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if (this.showTermsAcceptedError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =
        this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  emailValidity(e:any){
    this.emailValid=e;
  }

  companyNameHandler(e:any){
    this.companyName = e;
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if (this.showTermsAcceptedError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =
        this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  companyNameValidity(e:any){
    this.companyNameValid=e;
  }

  designationHandler(e:any){
    this.designation = e;
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if (this.showTermsAcceptedError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =
        this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  designationValidity(e:any){
    this.designationValid=e;
  }

  mobileHandler(e:any){
    this.mobile = e;
  }

  mobileValidity(e:any){
    this.mobileValid=e;
  }

  landlineHandler(e:any){
    this.landline = e;
  }

  landlineValidity(e:any){
    this.landlineValid=e;
  }

  minLCValueHandler(e:any){
    this.minLCValue = e;
  }

  minLCValidity(e:any){
    this.minLCValid=e;
  }

  countryChange(e: any) {
    if (e.target.value === '') {
      this.countryOptions = this.countries;
    } else {
      console.log(e);
      const filterValue3 = e.target.value.toLowerCase();

      this.countryOptions = this.countries.filter((option:any) =>
        option.countryName.toLowerCase().includes(filterValue3)
      );
      console.log("SEarched",filterValue3, "Answer",this.countryOptions);
    }
  }

  otherBusinessTypeHandler(e:any){
    console.log(e);
    this.otherBusinessType=e;
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if (this.showTermsAcceptedError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =
        this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  otherBusinessTypeValidity(e:any){
    console.log(e)
    this.otherBusinessTypeValid=e;
  }

  mobileNumberValidation(event:any){
    const charCode = event.which?event.which:event.keyCode;
      console.log(charCode)
      if(charCode>31 && (charCode<48 || charCode>57)){
        console.log(false);
        if (this.showFormError) {
          this.getButtonStatus();
          this.showFormError = !this.getbutton ? false : true;
        }
        if (this.showTermsAcceptedError) {
          this.getButtonStatus();
          this.showFormError = !this.getbutton ? false : true;
          this.showTermsAcceptedError =
            this.termsAcccepted || this.getbutton ? false : true;
        }
        return false;
      }
      console.log(true);
      if (this.showFormError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
      }
      if (this.showTermsAcceptedError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
        this.showTermsAcceptedError =
          this.termsAcccepted || this.getbutton ? false : true;
      }
      return true;
  }

  numberNopaste(e:any){
      console.log(e.clipboardData.getData('text'))
    const data=e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

      console.log(`${data === ''} || ${re.test(data)}`)

    if (data === '' || re.test(data)) {
      console.log(true)
      return true
    }

    console.log(false)
    return false;

  }

  landlineValidityCheck(e:any){
    let formValue = this.landlineNumber.value;
    if(formValue.length>=7&&Number(formValue)==0){
      // this.landlineNumber.setValue("");
      this.landlineNumber.setErrors({invalid:true})
    }
    if (this.showFormError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
    }
    if (this.showTermsAcceptedError) {
      this.getButtonStatus();
      this.showFormError = !this.getbutton ? false : true;
      this.showTermsAcceptedError =
        this.termsAcccepted || this.getbutton ? false : true;
    }
  }

  getCountryCode(e:any){
    if(e){
      console.log(e.option.value);
      this.countrySel=true;
      this.countries.map((item)=>{
        if(item.countryName==e.option.value){
          console.log(item.countryCode)

          this.countryCode=item.countryCode
        }
      })
      if (this.showFormError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
      }
      if (this.showTermsAcceptedError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
        this.showTermsAcceptedError =
          this.termsAcccepted || this.getbutton ? false : true;
      }
    }
    else {
      this.countryCode = ''
      this.countrySel=false;
    }
  }

  getSelectedBusinessType(e:any){
    const selectedBusinessType = e.option.value.toUpperCase();

      if (this.showFormError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
      }
      if (this.showTermsAcceptedError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
        this.showTermsAcceptedError =
          this.termsAcccepted || this.getbutton ? false : true;
      }
    console.log(selectedBusinessType);
    if(selectedBusinessType=='OTHER'){
      this.selectedOtherBusinesssType=true;
      this.otherBusinessType=''
    }
    else{
      this.selectedOtherBusinesssType=false;
    }
  }

  currencyChange(e: any) {
    if (e.target.value === '') {
      this.currencyOptions = this.currencies;
    } else {
      console.log(e);
      const filterValue4 = e.target.value.toLowerCase();

      this.currencyOptions = this.currencies.filter((option:any) =>
        option.toLowerCase().includes(filterValue4)
      );
    }
  }


  businessTypeChange(e: any) {
    if (e.target.value === '') {
      this.businessTypeOptions = this.businessTypes;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.businessTypeOptions = this.businessTypes.filter((option:any) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  goodsChange(e: any) {
    if (e.target.value === '') {
      this.goodsOptions = this.goods;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.goodsOptions = this.goods.filter((option:any) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  optionClicked(event: Event, item:MultiSelectGoods) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(item: MultiSelectGoods) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedGoods.push(item);
      this.selectedGoodsNames.push(item.name);
    } else {
      const i = this.selectedGoods.findIndex(value => value.name === item.name);
      this.selectedGoods.splice(i, 1);
      this.selectedGoodsNames.splice(i, 1);
    }
    console.log(this.selectedGoods);
    this.blacklistedGoods.setValue(this.selectedGoods);
  }

  displayGoods(value: MultiSelectGoods[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.name ;
        } else {
          displayValue += ', ' + user.name ;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  beneCountryChange(e:any){
    if (e.target.value === '') {
      this.goodsOptions = this.goods;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.goodsOptions = this.goods.filter((option:any) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  optionClickedBeneCountry(event: Event, item:MultiSelectCountries) {
    event.stopPropagation();
    this.toggleBeneCountrySelection(event,item);
  }

  displayBeneCountries(value: MultiSelectCountries[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (index === 0) {
          displayValue = item.name ;
        } else {
          displayValue += ', ' + item.name ;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  toggleBeneCountrySelection(event : any,item: MultiSelectCountries) {

    item.selected = !item.selected;
    if (event.checked) {
      if(item.name == 'All'){
        console.log("CLICKED ALL")
        this.selectedBeneficiaryCountries = [];
        this.selectedBeneficiaryCountryNames = [];
        this.beneficiaryCountryOptions.forEach((e :any)=> {
          e.selected = true;

          if(!(e.name.toUpperCase()=='ALL')){
        this.selectedBeneficiaryCountries.push(e);
          }
        if(e.name != 'All')
          {
            const res = this.selectedBeneficiaryCountryNames.find((i : any) => { return i.value == e.name.toUpperCase()})
            if(!res)
            this.selectedBeneficiaryCountryNames.push({value : e.name.toUpperCase()});
          }
        })
      }else{
        console.log('clicked something else');
        this.selectedBeneficiaryCountries.push(item);
        this.selectedBeneficiaryCountryNames.push({value : item.name.toUpperCase()});
      }
    } else {
      console.log(item.name)
      if(item.name == 'All'){
        this.beneficiaryCountryOptions.forEach((e :any)=> {
          e.selected = false;
        })
        this.selectedBeneficiaryCountries = [];
        this.selectedBeneficiaryCountryNames = [];
      }
      else
      {
        const res = this.selectedBeneficiaryCountries.findIndex((i : any) => i.name.toLowerCase() === 'all')

        if(res>=0){
          this.selectedBeneficiaryCountries.splice(res, 1);
          this.beneficiaryCountryOptions[0].selected = false;
        }
        if(this.beneficiaryCountryOptions[0].name.toLowerCase() === 'all'){
          this.beneficiaryCountryOptions[0].selected = false;
        }

        const i = this.selectedBeneficiaryCountries.findIndex(e => e.name.toLowerCase() === item.name.toLowerCase());
        this.selectedBeneficiaryCountries.splice(i, 1);
        const j = this.selectedBeneficiaryCountryNames.findIndex(e => e.value.toLowerCase() === item.name.toLowerCase());
        this.selectedBeneficiaryCountryNames.splice(j, 1);
      }
    }
    this.beneficiaryCountry.setValue(this.selectedBeneficiaryCountries);
  }

  issuanceCountryChange(e:any){
    if (e.target.value === '') {
      this.issuanceCountryOptions = this.issuanceCountries;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.issuanceCountryOptions = this.issuanceCountries.filter((option:any) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  optionClickedIssuanceCountry(event: Event, item:MultiSelectCountries) {
    event.stopPropagation();
    this.toggleIssuanceCountrySelection(event,item);
  }

  toggleIssuanceCountrySelection(event:any,item: MultiSelectCountries) {

    item.selected = !item.selected;
    if (event.checked) {
      if(item.name == 'All'){
        this.selectedIssuanceCountries = [];
        this.selectedIssuanceCountryNames = [];
        this.issuanceCountries.forEach((e :any)=> {
          e.selected = true;
          console.log(e.name.toUpperCase()=='ALL')
          if(!(e.name.toUpperCase()=='ALL')){
        this.selectedIssuanceCountries.push(e);
          }
        if(e.name != 'All')
          {
            const res = this.selectedIssuanceCountryNames.find((i : any) => { return i.value == e.name.toUpperCase()})
            if(!res)
            this.selectedIssuanceCountryNames.push({value : e.name.toUpperCase()});
          }
        })
      }else{
        this.selectedIssuanceCountries.push(item);
        this.selectedIssuanceCountryNames.push({value : item.name.toUpperCase()});
      }
    } else {
      if(item.name == 'All'){
        this.issuanceCountryOptions.forEach((e :any)=> {
          e.selected = false;
        })
        this.selectedIssuanceCountries = [];
        this.selectedIssuanceCountryNames = [];
      }
      else
      {
        const res = this.selectedIssuanceCountries.findIndex((i : any) => i.name.toLowerCase() === 'all')
        if(res>=0){
          this.selectedIssuanceCountries.splice(res, 1);
          this.issuanceCountryOptions[0].selected = false;
        }
        if(this.issuanceCountryOptions[0].name.toLowerCase()=='all'){
          this.issuanceCountryOptions[0].selected = false;

        }

        const i = this.selectedIssuanceCountries.findIndex(e => e.name.toLowerCase() === item.name.toLowerCase());
        this.selectedIssuanceCountries.splice(i, 1);
        const j = this.selectedIssuanceCountryNames.findIndex(e => e.value.toLowerCase() === item.name.toLowerCase());
        this.selectedIssuanceCountryNames.splice(j, 1);
      }
    }
    this.issuanceCountry.setValue(this.selectedIssuanceCountries);


      if (this.showFormError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
      }
      if (this.showTermsAcceptedError) {
        this.getButtonStatus();
        this.showFormError = !this.getbutton ? false : true;
        this.showTermsAcceptedError =
          this.termsAcccepted || this.getbutton ? false : true;
      }
  }

  displayIssuanceCountries(value: MultiSelectCountries[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (index === 0) {
          displayValue = item.name ;
        } else {
          displayValue += ', ' + item.name ;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  getButtonStatus(){
    console.log(`${this.firstNameValid}&&${this.lastNameValid}&&${this.countrySelected.value}&&
    ${this.mobileNo.valid}&&${this.emailValid}&&${this.landlineNumber.valid}`)
    if(
      (this.firstNameValid&&this.firstName)&&(this.lastNameValid&&this.lastName)&&this.countrySelected.value&&
      this.mobileNo.valid&&(this.emailValid&&this.email)  && (this.landlineNumber.valid)
      ){
        console.log("FUllfiled")
        this.showFormError=false;
        if(this.subscriber==='Bank (As an Underwriter)'){
          if(
              (this.selectedIssuanceCountryNames.length>=1)
          ){
            this.getbutton=false;
          }
          else{
            this.getbutton=true;
          }
        }
        else if(this.subscriber==='Referrer'){
          if(
              (this.companyNameValid&&this.companyName)&&(this.designationValid&&this.designation)&&this.businessType.value
          ){
            // console.log("Referrer Completed")
            // console.log('business Type',this.businessType.value);
            if(this.businessType.value.toUpperCase()==="OTHER"){
              if(this.otherBusinessType){
                this.getbutton = false;
              }
              else{
                this.getbutton = true;
              }
            }
            else{
              this.getbutton=false;
            }
          }
          else{
            // console.log('Referrer Error');
            this.getbutton=true;
          }
        }
        else{
          this.getbutton=false;
        }
    }
    else{
      console.log("Not FUllfiled")
      this.getbutton=true;
    }

  }

  terms(e:any){
    console.log(e);
    this.termsAcccepted=e.checked;
    this.buttonClicked=false;
    this.showTermsAcceptedError = false;
  }

  signup(){
    localStorage.clear();
    this.buttonClicked=true;
    this.getButtonStatus()


    this.showFormError = !this.getbutton ? false : true;
    this.showTermsAcceptedError = this.termsAcccepted||this.getbutton? false : true;
    if(this.getbutton==false && this.termsAcccepted)
   {

    this.countries.map((item)=>{
      if(item.countryName==this.countrySelected.value){
        console.log(item.countryCode)
        // return item
        this.countryCode=item.countryCode
      }
    })

    // if subscriber is BANK AS Underwriter
    if(this.subscriber==='Bank (As an Underwriter)'){
      console.log(this.subscriber)
      let beneCountry=this.selectedBeneficiaryCountryNames.map(i=>{
        // kosovo country(api issue) issue 07/03/2023 Sreejesh Pillai
        return i.value?.replace(/[\r\n]+/g, "")?.toUpperCase()
      //   if(i.value!='KOSOVO\n'){
      //   return i.value
      // }
      // else{
      //   return "KOSOVO"
      // }
    })
      console.log(beneCountry)
      let  issueCountry =this.selectedIssuanceCountryNames.map(i=>{

        // kosovo country(api issue) issue 07/03/2023 Sreejesh Pillai
        // if(i.value!='KOSOVO\n'){
        //   return i.value
        // }
        // else{
        //   return "KOSOVO"
        // }
        return i.value?.replace(/[\r\n]+/g, "")?.toUpperCase()
      })
      console.log(issueCountry)
      this.data={
        "firstName": this.firstName,
        "lastName": this.lastName,
        "country" : this.countrySelected.value?.replace(/[\r\n]+/g, "")?.toUpperCase(), //=='Kosovo\n'?'KOSOVO':this.countrySelected.value,
        "email": this.email,
        "mobileNo": "+"+this.countryCode+this.mobileNo.value,
        "landLineNumber": this.landlineNumber.value,
        // "minLCValue" : this.minLCValue,
        // "blklstedGoods": this.selectedGoodsNames,
        // "beneficiaryCountryList": beneCountry,
        "issuanceCountryList": issueCountry,
        // "currency": this.currency.value,
        "roles": [
            {
                "name": "MASTER_USER"
            }
        ],
        "subscriberType": "BANK_AS_UNDERWRITER",
        "termsAndPolicyVersion" : '1.0',
        "countryExt" : this.countryCode      }
      console.log("Data",this.data)
    }

    // if subscriber type= BANK AS A Customer
    else if(this.subscriber==='Bank (As a Customer)'){
      console.log(this.subscriber)

      this.data={
        "firstName": this.firstName,
        "lastName": this.lastName,
        "country" : this.countrySelected.value?.replace(/[\r\n]+/g, "")?.toUpperCase(),//=='KOSOVO\n'?'KOSOVO':this.countrySelected.value,
        "email": this.email,
        "mobileNo": "+"+this.countryCode+this.mobileNo.value,
        "landLineNumber": this.landlineNumber.value,
        "subscriberType": "BANK",
        "termsAndPolicyVersion" : '1.0',
        "countryExt" : this.countryCode
      }
      console.log("Data",this.data)
    }
    // subscriber type is CUSTOMER
    else if(this.subscriber=='Customer'){
      console.log(this.subscriber)
      this.data={
        "firstName":this.firstName,
        "lastName": this.lastName,
        "mobileNo": "+"+this.countryCode+this.mobileNo.value,
        "email" :this.email,
        "country": this.countrySelected.value?.replace(/[\r\n]+/g, "")?.toUpperCase(),//=='Kosovo\n'?'Kosovo':this.countrySelected.value,
        "landLineNumber": this.landlineNumber.value,
        "subscriberType": "CUSTOMER",
        "termsAndPolicyVersion" : '1.0',
        "countryExt" : this.countryCode
      }
      console.log("Data",this.data)

    }
    // subscriber type is Referrer
    else if(this.subscriber=='Referrer'){
      console.log(this.subscriber)
      if(this.businessType.value.toUpperCase()=='OTHER'){
        this.data={
          "firstName":this.firstName,
          "lastName": this.lastName,
          "mobileNo": "+"+this.countryCode+this.mobileNo.value,
          "email" :this.email,
          "country": this.countrySelected.value?.replace(/[\r\n]+/g, "")?.toUpperCase(),//=='KOSOVO\n'?'KOSOVO':this.countrySelected.value,
          "landLineNumber": this.landlineNumber.value,
          "subscriberType": "REFERRER",
          "businessType": this.businessType.value,
          "otherBusinessTypeName":this.otherBusinessType,
          "designation":this.designation,
          'companyName':this.companyName,

          "termsAndPolicyVersion" : '1.0',
          "countryExt" : this.countryCode
        }
        if(!this.otherBusinessType){
          this.data=undefined
        }
      }
      else{
        this.data={
          "firstName":this.firstName,
          "lastName": this.lastName,
          "mobileNo": "+"+this.countryCode+this.mobileNo.value,
          "email" :this.email,
          "country": this.countrySelected.value?.replace(/[\r\n]+/g, "")?.toUpperCase(),//=='KOSOVO\n'?'KOSOVO':this.countrySelected.value,
          "landLineNumber": this.landlineNumber.value,
          "subscriberType": "REFERRER",
          "businessType": this.businessType.value,

          "designation":this.designation,
          'companyName':this.companyName,

          "termsAndPolicyVersion" : '1.0',
          "countryExt" : this.countryCode
        }
      }
      console.log("Data",this.data)
      // this.authService.createUser(data).subscribe((res:any)=>{
      //   console.log(res);
      // })
    }

    if(this.data){
      this.authService.createUser(this.data).subscribe((res:any)=>{
        console.log(res);
        if(res.success){
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            // height: '300px',
            data: {
              title: 'signupCongrats',
              email: this.email,
            },
             disableClose: true
          });
        }
      });
    }

  }
  }
  openPopup(open: string) {
    if (open == 'tnc') {
      this.apiService.fetchTnc().subscribe((res: any) => {

        this.dialog.open(TncComponent,{data: res.data[0]['termsAndCondition']});
      });

    } else {
      this.apiService.fetchPrivacyPolicy().subscribe((res: any) => {
        this.dialog.open(PrivacyPolicyComponent,{
          data:res.data[0]['privatePloicy']
        });

      });

    }
  }

  back() {
    this.router.navigateByUrl('auth/login');
  }

  checkAutocomplete(event:any,formName:any,type:any){
    console.log(formName);
    let formValue = formName.value;
    console.log(formValue)
    if(type==="countrySelected"){
      let isExists = this.countries.find((ele:any)=>{
        console.log(ele.countryName.toLowerCase()==formValue.toLowerCase());
        return ele.countryName.toLowerCase()==formValue.toLowerCase();
      })
      console.log(isExists);
      if(isExists){
        formName.setValue(this.countries.find((ele:any)=>ele.countryName.toLowerCase()===formValue.toLowerCase()).countryName);
        this.getCountryCode({
          option: {
            value: this.countries.find(
              (ele: any) =>
                ele.countryName.toLowerCase() === formValue.toLowerCase()
            ).countryName,
          },
        });
      }
      else{
        formName.status="INVALID";
        this.getCountryCode(null)
      }

    }
    if(type==="businessType"){
      console.log("business type");
      let isExists = this.businessTypes.find((ele:any)=>{
        console.log(ele.value.toLowerCase() === formValue.toLowerCase())
        return ele.value.toLowerCase() === formValue.toLowerCase();
      })
      console.log(isExists);
      if(isExists){
        formName.setValue(this.businessTypes.find((ele:any)=>ele.value.toLowerCase()===formValue.toLowerCase()).value);
      }
      else{
        formName.status = "INVALID";
      }
    }
    if(type=="issuanceCountry"){
      console.log(event.target.value?.replace(/,\s+/g, ',')?.toLowerCase())
      let inputCountries = event.target.value?.replace(/,\s+/g, ',')?.toLowerCase()?.split(',');
      let existingCountryNames = this.countries.map((ele:any)=>ele.countryName);
      console.log(existingCountryNames);
      console.log(existingCountryNames.join(",")?.replace(/,\s+/g, ',')?.toLowerCase());
      let checkCountry = inputCountries.some((inputCountry) => {
        return !existingCountryNames.some((country) => {
          return country.toLowerCase() === inputCountry.toLowerCase();
        });
      });
      console.log(checkCountry);
      if(checkCountry){
        formName.setErrors({required:true});
      }
      else{
        formName.setErrors(null);
      }
    }
  }
  removeCountry(){
    this.getCountryCode({option:{value:this.countrySelected.value}})
    this.mobile= this.mobile.replace(`+${this.countryCode}`,'')
    this.landline=this.landline.replace(`+${this.countryCode}`,'')
    this.mobileNo.patchValue( this.mobile)
    this.landlineNumber.patchValue( this.landline)
    console.log(this.mobile)
  }
}
