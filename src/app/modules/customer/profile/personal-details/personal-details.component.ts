import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CustomerServicesService } from '../../services/customer-services.service';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileUpdatePopupComponent } from '../profile-update-popup/profile-update-popup.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, OnChanges {
  @Input() subscriber:any;
  @Input() editable:any;
  @Input() userDetails?:any;
  @Output() index:EventEmitter<any>=new EventEmitter;

  personalForm!:FormGroup;
  emailValidation = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  selectedValue: string;
  selectedValueCountry: string;
  countryCode:any;

  countries:any = [];
  goods:any=[];
  currencies:any=[];
  countriesSelect:any = [];
  additionalEmails:any=[];
  beneficiaryCountries:any=[];
  issuanceCountries:any=[];


  selectedGoods:any=[];
  selectedGoodsNames:any=[];
  selectedBeneficiaryCountries:any=[];
  selectedBeneficiaryCountryNames:any=[];
  selectedIssuanceCountries:any=[];
  selectedIssuanceCountryNames:any=[];

  countryOptions:any;
  currencyOptions:any;
  goodsOptions:any;
  beneficiaryCountryOptions:any;
  issuanceCountryOptions:any;
  issuanceCountryOptionsC:any
  countryCodeLength:any;
  countrySel:boolean=true;

  constructor(private titlecasePipe:TitleCasePipe,
    private fb:FormBuilder,
    private apiService:ApiService,
    private router:Router,
    private dialog:MatDialog,
    private customerService:CustomerServicesService) {
  }


  ngOnInit(): void {
    // console.log(this.subscriber);

    this.apiService.getAllCountryCode().subscribe((res:any)=>{
      console.log(res);
      if(res.data[0]){
        this.beneficiaryCountries.push(new MultiSelectCountries('All'))
        this.issuanceCountries.push(new MultiSelectCountries('All'))
        res.data[0].countryList.map((item:any)=>{
          if(item.countryName.includes('\n')){
            const index=item.countryName.indexOf('\n');
            console.log(index)
            item.countryName=item.countryName?.replace('\n','');
            console.log(item.countryName)
            return item
          }
          else{
              return item
          }
        })
        res.data[0].countryList.map((item:any)=>{
          this.beneficiaryCountries.push(new MultiSelectCountries(item.countryName))
          this.issuanceCountries.push(new MultiSelectCountries(item.countryName))
        });
      }
      this.beneficiaryCountryOptions=this.beneficiaryCountries;
      this.issuanceCountryOptions = this.issuanceCountries;
      this.issuanceCountryOptionsC = this.issuanceCountries;
      this.countries=res.data[0].countryList;
      this.countryOptions = this.countries;
      this.currencies=res.data[0].currencies;
      this.currencyOptions=this.currencies;

      if(this.beneficiaryCountryOptions){
        if(this.selectedBeneficiaryCountries.length > 0){
          this.selectbeneficiaryCountry()
        }
      }


      if(this.issuanceCountryOptions){
        if(this.selectedIssuanceCountries.length > 0){
          this.selectIssuanceCountry()
        }
      }

    })
    this.goods = [];
    this.apiService.getAllGoods().subscribe((res:any)=>{
      console.log(res);
      if(res.data[0]){
        // this.goods.push(new MultiSelectGoods('All'));
        res.data[0].map((item:any)=>{
          this.goods.push(new MultiSelectGoods(item.name));
        })
      }
      this.goodsOptions=this.goods;

      if(this.goodsOptions){
        if(this.selectedGoods.length > 0){
          this.selectGoods()
        }
      }
    });

    console.log(localStorage.getItem('userDetails'));
    this.userDetails = this.userDetails ? this.userDetails : JSON.parse(localStorage.getItem('userDetails'));
    this.additionalEmails = this.userDetails?.additionalEmail?this.userDetails?.additionalEmail:[];
    console.log(this.userDetails);
    this.createForm();

    if(this.userDetails){
      this.personalForm.controls['selectedCountry'].setValue(this.userDetails?.country);
      this.countryCode=this.userDetails.countryExt;

    }

    this.beneficiaryCountries = [];
    this.issuanceCountries  = [];



  }

  ngOnChanges(changes: SimpleChanges){
    if(this.subscriber || this.userDetails){
      this.countryCodeLength=this.userDetails.countryExt.length+1;
      console.log(this.countryCodeLength);
      this.createForm();
    }
  }

  phoneInputHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;
    if(charCode>31 && (charCode<48 || charCode>57)){
      return false;
    }
    return true;
  }

  telechecker(e:any){
    let formValue = this.personalForm.controls['lno'].value;
    if(formValue.length>=7&&Number(formValue)==0){
      this.personalForm.controls['lno'].setValue("");
    }
  }
  landlineHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;
    console.log(charCode);
    if(charCode>31 && (charCode<48 || charCode>57)){
      // console.log(false);
      return false;
    }
    // console.log(true);
    return true;
  }

  nonZeroHandlerData(e:any,control:any) {
    console.log(e.target.value);
    let input = e.target.value;
    // console.log(this.personalForm.controls[control].value.length,'value')
    if(this.personalForm.controls[control].value==0){
      console.log(this.personalForm.controls[control].value.length,'value')
      this.personalForm.controls[control].setValue('');
      console.log("true")
    }else{console.log("false");}
  }

  pasteHandler(e:ClipboardEvent){
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

  minLCHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;
    console.log(charCode);
    console.log(`${charCode>31}  ${charCode<48} || ${charCode>57}))`)
    if((charCode>31 && (charCode<48 || charCode>57)&&charCode!=46 && charCode ==101)){
      return false;
    }
    else if(charCode==43||charCode==45){
      return false
    }
    return true;
  }

  getMob(field:any,code:any) {
    console.log(field.includes(code))
    if(field.includes(code)){
      return field?.replace(`+${code}`,'')
    }
    return field
  }

  createForm(){
    this.selectedBeneficiaryCountries = [];
    this.selectedBeneficiaryCountryNames = [];
    this.selectedIssuanceCountries = [];
    this.selectedIssuanceCountryNames = [];
    this.selectedGoods=[];
    this.selectedGoodsNames=[];

    if(this.subscriber && this.subscriber == 'BANK_AS_UNDERWRITER'){
      this.personalForm = this.fb.group({
        selectedCountry: new FormControl(this.userDetails.country ?this.userDetails.country.toUpperCase() : '',[Validators.required]),
        issuanceCountry : new FormControl('',[Validators.required]),
        // beneficiaryCountry : new FormControl('',[Validators.required]),
        // minLCValue: new FormControl(this.userDetails.minLCValue ? this.userDetails.minLCValue : '' ,[Validators.required]),
        // blacklistedGoods :new FormControl('',[Validators.required]),
        // currency : new FormControl(this.userDetails.currency ? this.userDetails.currency : ''  ,[Validators.required]),
        fname : new FormControl(this.userDetails.firstName ? this.userDetails.firstName : '' ,[Validators.required,Validators.maxLength(25)]),
        lname : new FormControl(this.userDetails.lastName ? this.userDetails.lastName : '',[Validators.required,Validators.maxLength(25)]),
        emailId : new FormControl(this.userDetails.email ? this.userDetails.email : '', [Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        emailIdOne : new FormControl(this.userDetails.additionalEmails && this.userDetails.additionalEmails.length > 0 ? this.userDetails.additionalEmails[0].additionalEmail:'', [Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        emailIdTwo : new FormControl(this.userDetails.additionalEmails && this.userDetails.additionalEmails.length > 1 ? this.userDetails.additionalEmails[1].additionalEmail:'', [Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        emailIdThree : new FormControl(this.userDetails.additionalEmails && this.userDetails.additionalEmails.length > 2 ? this.userDetails.additionalEmails[2].additionalEmail:'', [Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        mno : new FormControl(this.userDetails?.mobileNumber ? this.getMob(this.userDetails?.mobileNumber,this.userDetails?.countryExt) : '', [
          Validators.required,
          Validators.minLength(7)
        ]),
        lno : new FormControl(this.userDetails.landLineNumber ? this.userDetails.landLineNumber : '', [Validators.required,Validators.pattern('[0-9{7}]+'),Validators.minLength(7)]),
      }, { validator: this.emailUniqueValidator })

      if(this.userDetails){
        this.personalForm.controls['issuanceCountry'].setValue(
          this.userDetails?.issuanceCountryList.map((e : any) => {
            let value = this.titlecasePipe.transform(e.value).toUpperCase();
            this.selectedIssuanceCountryNames.push(e);
            console.log(this.selectedIssuanceCountryNames);
            this.selectedIssuanceCountries.push(new MultiSelectCountries(value, true))
            console.log(this.selectedIssuanceCountries);
            return new MultiSelectCountries(value, true)
          }));
        // this.personalForm.controls['beneficiaryCountry'].setValue(
        //   this.userDetails?.beneficiaryCountryList.map((e : any) => {
        //     let value = this.titlecasePipe.transform(e.value);
        //     this.selectedBeneficiaryCountryNames.push(e);
        //     this.selectedBeneficiaryCountries.push(new MultiSelectCountries(value, true))
        //     return new MultiSelectCountries(value, true)
        //   }));

        // this.personalForm.controls['blacklistedGoods'].setValue(
        //   this.userDetails?.blklstedGoods.map((e : any) => {
        //     let value = this.titlecasePipe.transform(e.value);
        //     this.selectedGoodsNames.push(e);
        //     this.selectedGoods.push(new MultiSelectGoods(value, true));
        //     return new MultiSelectGoods(value, true)
        //   }));


          if(this.beneficiaryCountryOptions){
            if(this.selectedBeneficiaryCountries.length > 0){
              this.selectbeneficiaryCountry()
            }
          }

          if(this.issuanceCountryOptions){
            if(this.selectedIssuanceCountries.length > 0){
              this.selectIssuanceCountry()
            }
          }

          if(this.goodsOptions){
            if(this.selectedGoods.length > 0){
              this.selectGoods()
            }
          }

      }
    }
    else{

    this.personalForm = this.fb.group({
			selectedCountry: new FormControl(this.userDetails.country ? this.userDetails.country.toUpperCase() : '',[Validators.required]),
      fname : new FormControl(this.userDetails.firstName ? this.userDetails.firstName : '' ,[Validators.required,Validators.maxLength(25)]),
      lname : new FormControl(this.userDetails.lastName ? this.userDetails.lastName : '',[Validators.required,Validators.maxLength(25)]),
      emailId : new FormControl(this.userDetails.email ? this.userDetails.email : '', [Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
      emailIdOne : new FormControl(this.userDetails.additionalEmails && this.userDetails.additionalEmails.length > 0 ? this.userDetails.additionalEmails[0].additionalEmail:'', [Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
      emailIdTwo : new FormControl(this.userDetails.additionalEmails && this.userDetails.additionalEmails.length > 1 ? this.userDetails.additionalEmails[1].additionalEmail:'', [Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
      emailIdThree : new FormControl(this.userDetails.additionalEmails && this.userDetails.additionalEmails.length > 2 ? this.userDetails.additionalEmails[2].additionalEmail:'', [Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
      mno : new FormControl(this.userDetails?.mobileNumber ? this.getMob(this.userDetails?.mobileNumber,this.userDetails.countryExt) : '', [
        Validators.required,
        Validators.minLength(7)
      ]),
      lno : new FormControl(this.userDetails.landLineNumber ? this.userDetails.landLineNumber : '', [Validators.required,Validators.pattern('[0-9{7}]+'),Validators.minLength(7)]),
    }, { validator: this.emailUniqueValidator })
    }

    if(this.editable){
      if(this.subscriber === 'BANK_AS_UNDERWRITER'){
        this.personalForm.controls['issuanceCountry'].disable()
      }
    }

  }


  getCountryCode(e:any){
    console.log(e.option.value);
    this.countries.map((item)=>{
      if(item.countryName==e.option.value){
        console.log(item.countryCode)

        this.countryCode=item.countryCode
        // this.personalForm.controls['mno'].setValue(`+${this.countryCode}`);
        this.countryCodeLength=this.countryCode.length+1;
        this.personalForm.controls['mno'].setValidators([Validators.required,Validators.minLength(7)]);
      }
    })
  }
  getCountryCode2(e:any){

    console.log(e.target.value);
    this.countries.map((item)=>{
      if(item.countryName==e.target.value){
        console.log(item.countryCode)

        this.countryCode=item.countryCode
        // this.personalForm.controls['mno'].setValue(`+${this.countryCode}`);
        this.countryCodeLength=this.countryCode.length+1;
        this.personalForm.controls['mno'].setValidators([Validators.required,Validators.minLength(7)]);
      }
    })
  }

  selectbeneficiaryCountry(){
        this.beneficiaryCountryOptions.forEach((e : any) => {
          const res = this.selectedBeneficiaryCountries.find((i : any) => { return  i.name.toUpperCase() == e.name.toUpperCase()});
          if(res){
            e.selected = true;
          }
        })
  }


  selectIssuanceCountry(){
    this.issuanceCountryOptions.forEach((e : any) => {
      const res = this.selectedIssuanceCountries.find((i : any) => {
        // console.log(i.name,e.name)
        return  i.name.toUpperCase() == e.name.toUpperCase()});

      if(res){
        e.selected = true;
      }
    })
  }


  selectGoods(){
    this.goodsOptions.forEach((e : any) => {
      const res = this.selectedGoods.find((i : any) => { return  i.name == e.name});
      if(res){
        e.selected = true;
      }
    })
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
    this.toggleSelection(event, item);
  }

  toggleSelection(event : any, item: MultiSelectGoods) {
    item.selected = !item.selected;
    if (event.checked) {
      this.selectedGoods.push(item);
      this.selectedGoodsNames.push({value : item.name.toUpperCase()});
    } else {
      const i = this.selectedGoods.findIndex(e => e.name.toLowerCase() === item.name.toLowerCase());
      this.selectedGoods.splice(i, 1);
      this.selectedGoodsNames.splice(i, 1);
    }
    console.log(this.selectedGoods);
    this.personalForm.controls['blacklistedGoods'].setValue(this.selectedGoods);
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
      this.beneficiaryCountryOptions = this.beneficiaryCountries;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.beneficiaryCountryOptions = this.beneficiaryCountries.filter((option:any) =>
        option.name.toLowerCase().includes(filterValue)
      );

    }
  }

  optionClickedBeneCountry(event: Event, item:MultiSelectCountries) {
    event.stopPropagation();
    this.toggleBeneCountrySelection(event, item);
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

  toggleBeneCountrySelection(event : any, item: MultiSelectCountries) {
    item.selected = !item.selected;
    if (event.checked) {
      if(item.name == 'All'){
        this.selectedBeneficiaryCountries = [];
        this.selectedBeneficiaryCountryNames = [];
        this.beneficiaryCountryOptions.forEach((e :any)=> {
          e.selected = true;
          if(!(e.name.toLowerCase()=='all')){
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
        this.selectedBeneficiaryCountries.push(item);
        this.selectedBeneficiaryCountryNames.push({value : item.name.toUpperCase()});
      }
    } else {
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
        if(res){
          this.selectedBeneficiaryCountries.splice(res, 1);
          this.beneficiaryCountryOptions[0].selected = false;
        }

        const i = this.selectedBeneficiaryCountries.findIndex(e => e.name.toLowerCase() === item.name.toLowerCase());
        this.selectedBeneficiaryCountries.splice(i, 1);
        const j = this.selectedBeneficiaryCountryNames.findIndex(e => e.value.toLowerCase() === item.name.toLowerCase());
        this.selectedBeneficiaryCountryNames.splice(j, 1);
      }
    }
    this.personalForm.controls['beneficiaryCountry'].setValue(this.selectedBeneficiaryCountries);
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
    this.toggleIssuanceCountrySelection(event, item);
  }

  toggleIssuanceCountrySelection(event : any, item: MultiSelectCountries) {
    item.selected = !item.selected;
    console.log(this.selectedIssuanceCountries)
    if (event.checked) {
      if(item.name == 'All'){
        this.selectedIssuanceCountries = [];
        this.selectedIssuanceCountryNames = [];
        this.issuanceCountryOptions.forEach((e :any)=> {
          e.selected = true;
          if(!(e.name.toLowerCase()=='all')){
            this.selectedIssuanceCountries.push(e);
          }
        if(e.name != 'All')
          {
            const res = this.selectedIssuanceCountryNames.find((i : any) => { return i.value.toUpperCase() == e.name.toUpperCase()})
            if(!res)
            this.selectedIssuanceCountryNames.push({value : e.name.toUpperCase()});
          }
        })
        this.selectIssuanceCountry();
      }else{
        console.log(item)
        this.selectedIssuanceCountries.push(item);
        this.selectedIssuanceCountryNames.push({value : item.name.toUpperCase()});
        this.selectIssuanceCountry();
      }
    } else {
      if(item.name == 'All'){
        this.issuanceCountryOptions.forEach((e :any)=> {
          e.selected = false;
        })
        this.selectedIssuanceCountries = [];
        this.selectedIssuanceCountryNames = [];
        this.selectIssuanceCountry();

      }
      else
      {
        const res = this.selectedIssuanceCountries.findIndex((i : any) => i.name.toLowerCase() === item.name.toLowerCase())
        if(res>=0){
          this.selectedIssuanceCountries.splice(res, 1);
          this.selectedIssuanceCountryNames.splice(res, 1);
          // this.issuanceCountryOptions[res].selected = false;
          this.selectIssuanceCountry();
        }

        // const i = this.selectedIssuanceCountries.findIndex(e => e.name.toLowerCase() === item.name.toLowerCase());
        // this.selectedIssuanceCountries.splice(i, 1);
        // const j = this.selectedIssuanceCountryNames.findIndex(e => e.value.toLowerCase() === item.name.toLowerCase());
        // this.selectedIssuanceCountryNames.splice(j, 1);
      }
    }
    this.personalForm.controls['issuanceCountry'].setValue(this.selectedIssuanceCountries);
    if(this.selectedIssuanceCountries?.length==0){
      this.issuanceCountryOptions=this.issuanceCountryOptionsC
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

  submit(){

    if(this.personalForm.valid){

            this.countries.map((item)=>{
              if(item.countryName==this.personalForm.controls['selectedCountry'].value){
                console.log(item.countryCode)
                // return item
                this.countryCode=item.countryCode
              }
            })

            this.fillAdditionalEmails();

            var data = {
              "firstName":this.personalForm.controls['fname'].value,
              "lastName":this.personalForm.controls['lname'].value,
              "email":this.personalForm.controls['emailId'].value,
              "mobileNumber":this.personalForm.controls['mno'].value.toString(),
              "landLineNumber":this.personalForm.controls['lno'].value.toString(),
              "country":this.personalForm.controls['selectedCountry'].value,
              "additionalEmails":this.additionalEmails,
              "countryExt":this.countryCode
              }
              if(this.subscriber=="BANK_AS_UNDERWRITER"){
                // data['minLCValue']=this.personalForm.controls['minLCValue'].value;
                // data["blklstedGoods"]= this.selectedGoodsNames;
                // data["beneficiaryCountryList"]= this.selectedBeneficiaryCountryNames;
                data["issuanceCountryList"]= this.selectedIssuanceCountryNames;
                // data["currency"]= this.personalForm.controls['currency'].value;
              }
            this.customerService.updatePersonalDetails(data).subscribe((res:any)=>{
              console.log(res);
              if(res.success){
                console.log("Emitting")
                if(!this.editable){
                  this.index.emit(1);
                }
                else{
                  const popup = this.dialog.open(ProfileUpdatePopupComponent,{data:{from:'Personal'}})
                  popup.afterClosed().subscribe(res=>{
                    if (this.editable?.from === 'my-profile') {
                      this.router.navigateByUrl('/customer/transactions/profile');
                    } else if (this.editable?.from === 'bank-profile') {
                      this.router.navigateByUrl(
                        '/customer/transactions/bank-profile'
                      );
                    } else if (
                      this.editable?.from === 'bank-underwriter-profile'
                    ) {
                      this.router.navigateByUrl('/bank-underwriter/profile');
                    }
                  })
                }
              }
            })
        }
  }

  fillAdditionalEmails(){

    this.additionalEmails = [];
    if(this.personalForm.controls['emailIdOne'].value)
    {
      this.additionalEmails.push({additionalEmail : this.personalForm.controls['emailIdOne'].value})
    }
    if(this.personalForm.controls['emailIdTwo'].value)
    {
      this.additionalEmails.push({additionalEmail : this.personalForm.controls['emailIdTwo'].value})
    }
    if(this.personalForm.controls['emailIdThree'].value)
    {
      this.additionalEmails.push({additionalEmail : this.personalForm.controls['emailIdThree'].value})
    }
  }

  checkAutocomplete(e:any,formName:any){
    console.log(formName);
    console.log(this.personalForm.controls[formName].value)
    let formValue = this.personalForm.controls[formName].value;
    if(formName === 'selectedCountry'){
      let isExists = this.countries?.find((ele:any)=>{
        console.log(ele.countryName?.toLowerCase() === formValue?.toLowerCase());
        return ele.countryName?.toLowerCase() === formValue?.toLowerCase();
      })
      console.log(isExists);
      if(isExists){
        this.personalForm.controls[formName].setValue(this.countries.find((ele:any)=>ele?.countryName?.toLowerCase()===formValue?.toLowerCase()).countryName);
      }
      else{
        this.personalForm.controls[formName].setErrors({required: true});
      }
    }

    if(formName === 'issuanceCountry'){
      // console.log(formValue);
      console.log(e.target.value?.replace(/,\s+/g, ',')?.toLowerCase())
      let inputCountries = e.target.value?.replace(/,\s+/g, ',')?.toLowerCase()?.split(',');
      let existingCountryNames = this.countries.map((ele:any)=>ele.countryName);
      console.log(existingCountryNames);
      console.log(existingCountryNames.join(",")?.replace(/,\s+/g, ',')?.toLowerCase());
      let checkCountry = inputCountries.some((inputCountry) => {
        return !existingCountryNames.some((country) => {
          return country.toLowerCase() === inputCountry.toLowerCase();
        });
      });
      // let checkCountry=this.countries.some((ele:any)=>{
      //   console.log(ele.countryName)
      //   return !inputCountries.includes(ele.countryName.toLowerCase())
      // })
      console.log(checkCountry);
      if(checkCountry){
        this.personalForm.controls[formName].setErrors({required:true});
      }
      else{
        this.personalForm.controls[formName].setErrors(null);
      }

      // let isExists:any =  [...issuanceCountries].map((item:any)=>{
      //   return this.countries.find((ele:any)=>{
      //     console.log(ele?.countryName?.toLowerCase() === item?.toLowerCase(),item?.toLowerCase(),ele.countryName)
      //     return ele?.countryName?.toLowerCase() === item.toLowerCase();
      //   })?true:false;
      // })
      // console.log(isExists);
      // console.log(isExists.some((ele:any)=>ele==false))
      // let ifMismatch =isExists.some((ele:any)=>ele==false);
      // if(ifMismatch){
      //   this.personalForm.controls[formName].setErrors({required:true});
      // }
      // else{
      //   this.personalForm.controls[formName].setErrors(null);
      // }
    }
  }
  emailUniqueValidator(group: FormGroup) {
    const email1 = group.controls['emailId'].value;
    const email2 = group.controls['emailIdOne'].value;
    const email3 = group.controls['emailIdTwo'].value;
    const email4 = group.controls['emailIdThree'].value;

    const nonEmptyEmails = [email1, email2, email3, email4].filter(email => email !== "");
    const emailSet = new Set(nonEmptyEmails);

    // Check if email 1 domain is the same for all non-empty emails
    const email1Domain = email1?.split('@')[1];
    const sameDomain = nonEmptyEmails.every(email => email?.split('@')[1] === email1Domain);

    if (emailSet.size === nonEmptyEmails.length && sameDomain) {
      return null;
    } else {
      group.controls['emailId'].setErrors(null);

      if (email2 !== "" && emailSet.has(email2)) {
        if (email2 === email1) {
          group.controls['emailIdOne'].setErrors({ OfficialEmailDuplicate: true });
        } else if (email2 === email3 || email2 === email4) {
          group.controls['emailIdOne'].setErrors({ emailNotUnique: true });
        } else if (email2?.split('@')[1] !== email1Domain) {
          group.controls['emailIdOne'].setErrors({ invalidDomain: true });
        }
      } else {
        group.controls['emailIdOne'].setErrors(null);
      }

      if (email3 !== "" && emailSet.has(email3)) {
        if (email3 === email1) {
          group.controls['emailIdTwo'].setErrors({ OfficialEmailDuplicate: true });
        } else if (email3 === email2 || email3 === email4) {
          group.controls['emailIdTwo'].setErrors({ emailNotUnique: true });
        } else if (email3?.split('@')[1] !== email1Domain) {
          group.controls['emailIdTwo'].setErrors({ invalidDomain: true });
        }
      } else {
        group.controls['emailIdTwo'].setErrors(null);
      }

      if (email4 !== "" && emailSet.has(email4)) {
        if (email4 === email1) {
          group.controls['emailIdThree'].setErrors({ OfficialEmailDuplicate: true });
        } else if (email4 === email2 || email4 === email3) {
          group.controls['emailIdThree'].setErrors({ emailNotUnique: true });
        } else if (email4?.split('@')[1] !== email1Domain) {
          group.controls['emailIdThree'].setErrors({ invalidDomain: true });
        }
      } else {
        group.controls['emailIdThree'].setErrors(null);
      }

      return { emailNotUnique: true };
    }
  }

  resetCountry(){
    let selectedoptions:any= this.selectedIssuanceCountries
    let  originaloptions:any = this.issuanceCountryOptionsC
    selectedoptions.forEach(selectedOption => {
      const matchingOption = originaloptions.find(option => option.name === selectedOption.name);
      if (matchingOption) {
        matchingOption.selected = selectedOption.selected;
      }
    });

this.issuanceCountryOptions=originaloptions


  }

}

export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): any => {
      window.setTimeout(() => {
          if (control.value && control.value != '') {
              let trimedvalue = control.value?.replace(/\s/g, '');
              control.setValue(trimedvalue);
          }
      }, 10);
  };
}
