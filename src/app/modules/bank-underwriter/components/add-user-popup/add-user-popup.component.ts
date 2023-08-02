import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserConfirmationComponent } from "../user-confirmation/user-confirmation.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { BankUnderwriterService } from "../../services/bank-underwriter.service";

@Component({
  selector: "app-add-user-popup",
  templateUrl: "./add-user-popup.component.html",
  styleUrls: ["./add-user-popup.component.scss"],
})
export class AddUserPopupComponent implements OnInit {
  countryCode=''
  form!: FormGroup;
  selectCountryList = new Observable<string[]>();
  countryIntrestedLists = new Observable<string[]>();
  benificiaryCountryList = new Observable<string[]>();
  currencyList=[];
  currencyList$ = new Observable<string[]>();
  typesOfGoods = new Observable<string[]>();
  countryList = [];
  countryList2 = [];
  countryCodeList = [];
  typesOfGoodsList = [];
  displayOtherField:boolean=false;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddUserPopupComponent>,
    private apiService: ApiService,
    private bs :BankUnderwriterService
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.fetchApis();
  }
  fetchApis() {
    this.apiService.getAllCountryCode().subscribe({
      next: (response: any) => {
        try {
          this.currencyList=response.data[0].currencies
          this.countryCodeList=response.data[0].countryList
          this.countryList = response.data[0].countryNames.map((item) =>
            item.replace('\n', '')
          ).sort();
          this.countryList2 = response.data[0].countryNames.map((item) =>
            item.replace('\n', '')
          ).sort();
          this.matAutocompleteCountryObservers();
          this.filteredCountryList= this.countryList
          this.filteredCountryList2= this.countryList2
          this.matAutocompleteCountryCurrencyObservers()
        } catch (e) {
          this.countryList = [];
          this.countryList2 = [];
        }
      },
      error: (error: any) => {
        this.countryList = [];
        this.countryList2 = [];
      },
    });
    this.apiService.getAllGoods().subscribe({
      next: (response: any) => {
        try {
          this.typesOfGoodsList = response.data[0].filter(e=>(!['others','none'].includes(e.name.toLowerCase()))).map((item) => item.name);
          this.typesOfGoodsListfilter=  this.typesOfGoodsList
          // this.matAutocompleteCountryObservers();
        } catch (e) {
          this.typesOfGoodsList = [];
        }
      },
      error: (error: any) => {
        this.typesOfGoodsList = [];
      },
    });
  }
  namePattern = /^[A-Za-z]+$/;
  emailValidation = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  numberPattern = /^\d+$/;
  createForm() {
    this.form = new FormGroup({
      firstName: new FormControl("", [Validators.required,Validators.maxLength(25)]),
      lastName: new FormControl("", [Validators.required,Validators.maxLength(25)]),
      emailId: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailValidation),
      ]),
      selectCountry: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
      ]),
      landlineNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
      ]),
      minimumLcValue: new FormControl('', [Validators.required,this.amountValidator]),
      countryIntrested: new FormControl('', [Validators.required]),
      blacklistedGoods: new FormControl('', [Validators.required]),
      benificiaryCountry: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
    });
  }
  typeOnlyAlphabet(event: Event, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const alphabetsOnlyValue = value.replace(/[^A-Za-z ]/g, ""); // Remove non-alphabetic characters
    this.form.patchValue({ [controlName]: alphabetsOnlyValue }); // Update the form control value using dynamic property name
  }
  typeOnlyNumber(event: Event, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const numbersOnlyValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    this.form.patchValue({ [controlName]: numbersOnlyValue }); // Update the form control value using dynamic property name
  }

  close() {
    this.dialogRef.close();
  }

  telechecker(e: any) {
    let formValue = this.form.controls['landlineNumber'].value;
    if (formValue.length >= 7 && Number(formValue) == 0) {
      this.form.controls['landlineNumber'].setValue('');
    }
  }

  minLCHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode != 46 &&
      charCode == 101
    ) {
      return false;
    } else if (charCode == 43 || charCode == 45) {
      return false;
    }
    return true;
  }
  pasteHandler(e: ClipboardEvent) {
    // console.log(e.clipboardData.getData('text'))
    const data = e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

    // console.log(`${data === ''} || ${re.test(data)}`);

    if (data === '' || re.test(data)) {
      // console.log(true);
      return true;
    }

    // console.log(false);
    return false;
  }
  data: any;
  invite() {


    // this.close();
    // const dia = this.dialog.open(UserConfirmationComponent)
    // dia.afterClosed().subscribe((res) => {
    // });
    if (this.form.valid) {


      let payload ={
        "firstName":this.form.controls['firstName'].value,
        "lastName": this.form.controls['lastName'].value,
        "country" : this.form.controls['selectCountry'].value,
        "email": this.form.controls['emailId'].value,
        "countryExt" : this.countryCode,
        "termsAndPolicyVersion" : 1.0,
        "mobileNo":this.form.controls['mobileNumber'].value,
        "landLineNumber":  this.form.controls['landlineNumber'].value,
        "minLCValue" : this.parseAmount({target:{value:this.form.controls['minimumLcValue'].value}}),
        "blklstedGoods":  this.form.controls['blacklistedGoods'].value,
        "beneficiaryCountryList": this.form.controls['benificiaryCountry'].value.map(e=>e.toUpperCase()),
        "issuanceCountryList": this.form.controls['countryIntrested'].value.map(e=>e.toUpperCase()),
        "currency":this.form.controls['currency'].value,
        "subscriberType": "BANK_AS_UNDERWRITER"
    }
      this.bs.addmanageUser(payload).subscribe({next:()=>{
        this.close();
        const dia = this.dialog.open(UserConfirmationComponent);
        dia.afterClosed().subscribe((res) => {
          // Handle the dialog close event
        });
      }})



    }
    this.form.markAllAsTouched();
  }
  matAutocompleteCountryObservers() {
    this.selectCountryList = this.form.controls[
      'selectCountry'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filter(state,'country') : this.countryList.slice()))
    );
    // this.countryIntrestedLists = this.form.controls[
    //   'countryIntrested'
    // ].valueChanges.pipe(
    //   startWith(''),
    //   map((state) => (state ? this._filter(state,'country') : this.countryList.slice()))
    // );
    // this.benificiaryCountryList = this.form.controls[
    //   'benificiaryCountry'
    // ].valueChanges.pipe(
    //   startWith(''),
    //   map((state) => (state ? this._filter(state,'country') : this.countryList.slice()))
    // );
    // this.typesOfGoods = this.form.controls[
    //   'blacklistedGoods'
    // ].valueChanges.pipe(
    //   startWith(''),
    //   map((goods) => (goods ? this._filter(goods,'goods') : this.typesOfGoodsList.slice()))
    // );
  }

  private _filter(value: string, type: string): string[] {
    const filterValue = this._normalizeValue(value);
    if (type==='country') {
      return this.countryList.filter((country) =>
        this._normalizeValue(country).includes(filterValue)
      );
    }else if(type==='currency'){
      return this.currencyList.filter((currency) =>
      this._normalizeValue(currency).includes(filterValue)
    );
    }
    else {
      return this.typesOfGoodsList.filter((name) =>
        this._normalizeValue(name).includes(filterValue)
      );
    }
  }
  private _normalizeValue(value: string): string {

    return value.toLowerCase().replace(/\s/g, '');
  }
  checkCountry(e: any, formName: any) {
    if (formName === 'selectCountry' || formName === 'countryIntrested' || formName === 'benificiaryCountry') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryCodeList.find((ele: any) => {
        return ele.countryName.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
        this.countryCode=''
      } else {
        this.countryCode=`+${isExists.countryCode}`
        this.form.controls[formName].setErrors(null);
      }
    }
    if (formName === 'blacklistedGoods') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.typesOfGoodsList.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
    }
  }
  onToppingRemoved(c:any){
    this.selectedCountries.splice(0,1)
    this.form.controls['countryIntrested'].setValue(this.selectedCountries)
  }
  selectAllOptions(c:any){
    if(c.checked){
      this.selectedCountries=[...this.countryList];
      this.form.controls['countryIntrested'].setValue(this.countryList)
    }else{
      this.selectedCountries = [];
      this.form.controls['countryIntrested'].setValue([])
    }

  }
  selectAllOptions2(c:any){
    if(c.checked){
      this.selectedCountries2 = [...this.countryList2]
      this.form.controls['benificiaryCountry'].setValue(this.countryList2)
    }else{
      this.selectedCountries2 = [];
      this.form.controls['benificiaryCountry'].setValue([])
    }

  }
  onToppingRemoved2(c:any){
    this.selectedCountries2.splice(0, 1);
    this.form.controls['benificiaryCountry'].setValue(this.selectedCountries2)
  }
  selectAllOptions3(c:any){
    this.typesOfGoodsListselected = [];
    this.form.controls['blacklistedGoods'].setValue(['None'])

  }
  onToppingRemoved3(c:any){
    const selectedCountries = this.form.controls['blacklistedGoods'].value;
    selectedCountries.splice(0, 1);
    this.form.controls['blacklistedGoods'].setValue(selectedCountries)
  }
  filteredCountryList: string[] = [];
  filteredCountryList2: string[] = [];
  selectedCountries: string[] = [];
  selectedCountries2: string[] = [];
  typesOfGoodsListfilter: string[]=[]
  typesOfGoodsListselected: string[]=[]
  filterOptions(event: any) {
    const searchText = event.target.value.toLowerCase();

    if (searchText) {
      this.filteredCountryList = [...this.countryList].filter(country => {
        return (
          country.toLowerCase().includes(searchText)
        );
      });
    } else {
      this.filteredCountryList = [...this.countryList];
    }
  }
  filterOptions2(event: any) {
    const searchText = event.target.value.toLowerCase();

    if (searchText) {
      this.filteredCountryList2 = [...this.countryList2].filter(country => {
        return (
          country.toLowerCase().includes(searchText) 
        );
      });
    } else {
      this.filteredCountryList2 = [...this.countryList2];
    }
  }
  filterOptions3(event: any) {
    const searchText = event.target.value.toLowerCase();

    if (searchText) {
      this.typesOfGoodsListfilter = [...this.typesOfGoodsList].filter(good => {
        return (
          good.toLowerCase().includes(searchText)
        );
      });
    } else {
      this.typesOfGoodsListfilter = [...this.typesOfGoodsList];
    }
  }
  onSelectionChangeCountryInterest(event: any,country:any) {
    this.form.controls['countryIntrested'].setValue(
    this.form.controls['countryIntrested'].value);
    if (this.selectedCountries.includes(country)) {
      this.selectedCountries = [...this.selectedCountries].filter(
        (item: any) => {
          return item != country;
        }
      );
    }
    else {
      this.selectedCountries = [...this.selectedCountries,country]
    }
    this.form.controls['countryIntrested'].setValue(this.selectedCountries);
  }
  onSelectionChange2(event: any,country:any) {
    this.form.controls['benificiaryCountry'].setValue(
      this.form.controls['benificiaryCountry'].value
    );
    if (this.selectedCountries2.includes(country)) {
      this.selectedCountries2 = [...this.selectedCountries2].filter(
        (item: any) => {
          return item != country;
        }
      );
    }
    else {
      this.selectedCountries2 = [...this.selectedCountries2,country]
    }
    this.form.controls['benificiaryCountry'].setValue(this.selectedCountries2);
  }
  onSelectionChange3(event: any,good:any) {
    this.form.controls['blacklistedGoods'].setValue(this.typesOfGoodsListselected)
    if(this.typesOfGoodsListselected.includes(good)) {
      this.typesOfGoodsListselected = this.typesOfGoodsListselected.filter((item:any)=>item != good)
    }
    else{
      this.typesOfGoodsListselected = [...this.typesOfGoodsListselected,good]
    }
    this.form.controls['blacklistedGoods'].setValue(this.typesOfGoodsListselected)
  }


  closemenu2(e:any){
    e.value=''
    this.filteredCountryList2 = [...this.countryList2]
    // console.log( this.filteredCountryList2)
  }
  closemenu(e:any){
    e.value=''
    this.filteredCountryList = [...this.countryList]
  }
  closemenu3(e:any){
    e.value = '';
    this.typesOfGoodsListfilter = [...this.typesOfGoodsList]
  }
  matAutocompleteCountryCurrencyObservers() {
    this.currencyList$ = this.form.controls['currency'].valueChanges.pipe(
      startWith(''),
      map((state) => {
        return state
          ? this._filter(state, 'currency')
          : this.currencyList.slice();
      })
    );

  }
  checkCountryExistsPorts(e: any, formName: any) {
    let formValue = this.form.controls[formName].value;
    if (formValue.length === 0) {
      return;
    }

    let isExists = this.currencyList.find((ele: any) => {
      return ele.toLowerCase() === formValue?.toLowerCase();
    });
    if (!isExists) {
      this.form.controls[formName].setErrors({ required: true });
    } else {
      this.form.controls[formName].setErrors(null);
      this.form.controls[formName].setValue(
        this.currencyList.find(
          (ele: any) => ele.toLowerCase() === formValue?.toLowerCase()
        )
      );
    }

  }
  getC(){
    return this.countryCode
  }

  amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  // console.log(value)
  const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
  return isValid ? null : {invalid:true};
}

formatAmount(value: string) {
  const number = +value?.toString().replace(/[^0-9.]/g, '');
  return isNaN(number) ? '' :number>0? number.toLocaleString('en-US',{
    maximumFractionDigits:2,
  }):'';
}

parseAmount(e: any) {
  // console.log(e)
  let target=e.target.value||''
  return target.replace(/,/g, '');
}

onBlur(formName:any) {
  const value = this.parseAmount({ target: { value: this.form.controls[formName].value } });
  this.form.controls[formName].setValue(this.formatAmount(value));
  // console.log(this.form.controls[formName])
  // this.focusOutEvent.emit(value);
  // this.validField.emit(true);
}

onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window['clipboardData'];
  const pastedText = clipboardData.getData('text');
  const formattedText = this.formatAmount(pastedText);
  document.execCommand('insertText', false, formattedText);
}

onKeyDown(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End','.'];
  const key = event.key;
  const isValidKey = !isNaN(key as any) || allowedKeys.includes(key);
  if (!isValidKey) {
    event.preventDefault();
  }
}

}
