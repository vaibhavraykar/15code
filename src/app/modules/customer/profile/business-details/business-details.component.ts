import { TitleCasePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { CustomerServicesService } from '../../services/customer-services.service';
import { Router } from '@angular/router';
import { ProfileUpdatePopupComponent } from '../profile-update-popup/profile-update-popup.component';
import { MatDialog } from '@angular/material/dialog';

export class MultiSelectGoods {
  constructor(public name: any, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

export class MultiSelectCountries {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})
export class BusinessDetailsComponent implements OnChanges, OnInit {
  NO_SPECIAL_CHAR = new RegExp(/^[a-zA-Z0-9-]+$/);
  @Input() subscriber: string;
  @Input() businessDetails: any;
  @Input() editable: any;
  @Output() index: EventEmitter<any> = new EventEmitter();

  registerType = [
    {
      name: 'Exporter',
      value: 'EXPORTER',
    },
    {
      name: 'Importer',
      value: 'IMPORTER',
    },
    {
      name: 'Both',
      value: 'EXPORTER_AND_IMPORTER',
    },
  ];

  getbutton: boolean = false;
  selectedOtherTypeGoods: boolean = false;
  beneficiaryCountryOptionsC: any = [];
  otherGoods: FormControl;

  countries: any = [];
  users: any = [];
  currencies: any = [];
  goods: any = [];
  selectedGoods: any = [];
  selectedGoodsNames: any = [];
  beneficiaryCountries: any = [];
  selectedBeneficiaryCountries: any = [];
  selectedBeneficiaryCountryNames: any = [];

  selectedRegisterType: any;
  businessForm!: FormGroup;
  busniessDetials?: any;
  userDetails: any;
  personalDetails: any;
  businessId: any;

  countryOptions: any;
  currencyOptions: any;
  goodsOptions: any;
  beneficiaryCountryOptions: any;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private customerService: CustomerServicesService,
    private titlecasePipe: TitleCasePipe,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.editable) {
      this.businessDetails = JSON.parse(
        localStorage.getItem('businessDetails')
      );
      console.log(this.subscriber, 'subscriber');
      if (this.editable.from === 'bank-profile') {
        this.subscriber = 'BANK';
        this.createForm();
      } else if (this.editable.from === 'my-profile') {
        this.subscriber = 'CUSTOMER';
        this.createForm();
      } else if (this.editable.from === 'bank-underwriter-profile') {
        this.subscriber = 'BANK_AS_UNDERWRITER';
        this.createForm();
      }
    } else {
      this.createForm();
    }
    this.users.push({
      id: 1,
      firstName: '',
      lastName: '',
      designation: '',
    });
    // console.log(JSON.parse(localStorage.getItem('businessDetails')))
    // this.authService.getUserDetails().subscribe((res:any)=>{
    //   this.businessDetails=res.data[0].businessDetails;
    // })
    // this.busniessDetials=JSON.parse(localStorage.getItem('businessDetails'));

    this.apiService.getAllCountryCode().subscribe((res: any) => {
      // console.log(res);
      if (res.data[0]) {
        this.beneficiaryCountries.push(new MultiSelectCountries('All'));
        res.data[0].countryList.map((item: any) => {
          if (item.countryName.includes('\n')) {
            const index = item.countryName.indexOf('\n');
            // console.log(index)
            item.countryName = item.countryName.replace('\n', '');
            // console.log(item.countryName)
            return item;
          } else {
            return item;
          }
        });
        res.data[0].countryList.map((item: any) => {
          this.beneficiaryCountries.push(
            new MultiSelectCountries(item.countryName)
          );
        });
      }
      this.countries = res.data[0].countryList;
      this.countryOptions = this.countries;
      this.currencies = res.data[0].currencies;
      this.currencies = res.data[0].currencies.sort();
      this.currencyOptions = this.currencies;
      console.log('sorted', this.currencyOptions);
      this.beneficiaryCountryOptions = this.beneficiaryCountries;
      this.beneficiaryCountryOptionsC = this.beneficiaryCountries;
      if (this.beneficiaryCountryOptions) {
        if (this.selectedBeneficiaryCountries.length > 0) {
          this.selectbeneficiaryCountry();
        }
      }
    });
    this.apiService.getAllGoods().subscribe((res: any) => {
      console.log(res);
      if (res.data[0]) {
        // this.goods.push(new MultiSelectGoods('All'));
        res.data[0].map((item: any) => {
          if (item.name?.toLowerCase() === 'none') {
            this.goods.unshift(new MultiSelectGoods(item.name));
          } else {
            this.goods.push(new MultiSelectGoods(item.name));
          }
        });
      }
      this.goodsOptions = this.goods?.filter(
        (item: any) => item.name.toLowerCase() != 'others'
      );

      if (this.goodsOptions) {
        if (this.selectedGoods.length > 0) {
          this.selectGoods();
        }
      }
    });
    // console.log('--------------------',this.subscriber)
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    // if(this.subscriber){
    //   console.log(this.subscriber)
    //   this.createForm();
    // }
    if (changes['businessDetails']) {
      this.businessDetails = changes['businessDetails'].currentValue;
      // this.createForm();
      this.setForm(changes['businessDetails'].currentValue);
    }
  }
  pasteHandler(e: ClipboardEvent) {
    // console.log(e.clipboardData.getData('text'))
    const data = e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

    console.log(`${data === ''} || ${re.test(data)}`);

    if (data === '' || re.test(data)) {
      console.log(true);
      return true;
    }

    console.log(false);
    return false;
  }

  nonZeroHandlerData(e: any, control: any) {
    // console.log(e.target.value);
    let input = e.target.value;
    if (this.businessForm.controls[control].value == 0) {
      this.businessForm.controls[control].setValue('');
      // console.log("true")
    } else {
      console.log('false');
    }
  }

  minLCHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    // console.log(charCode);
    // console.log(`${charCode>31}  ${charCode<48} || ${charCode>57}))`)
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

  swiftCodeHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // console.log(false);
      return false;
    }
    // console.log(true);
    return true;
  }

  pincodeHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // console.log(false);
      return false;
    }
    // console.log(true);
    return true;
  }

  telephoneHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // console.log(false);
      return false;
    }
    // console.log(true);
    return true;
  }

  telechecker(e: any) {
    let formValue = this.businessForm.controls['telephone'].value;
    if (formValue.length >= 7 && Number(formValue) == 0) {
      this.businessForm.controls['telephone'].setValue('');
    }
  }

  setForm(value: any) {
    this.personalDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (value) {
      if (this.subscriber && this.subscriber == 'BANK_AS_UNDERWRITER') {
        console.log('Creating underwriter form');
        this.businessForm?.patchValue({
          bankName: this.businessDetails?.bankName,
          branchName: this.businessDetails?.branchName,
          swiftCode: this.businessDetails?.swiftCode,
          designation: this.businessDetails?.designation,
          minLCValue: this.formatAmount(this.businessDetails?.minLCValue),
          currency: this.businessDetails?.currency,
          blacklistedGoods: '',
          beneficiaryCountry: '',
          selectedCountry:  this.businessDetails?.addressDetails?.registeredCountry
            ? this.businessDetails?.addressDetails?.registeredCountry.toUpperCase():this.personalDetails?.country.toUpperCase(),
          state: this.businessDetails?.addressDetails?.province,
          city: this.businessDetails?.addressDetails?.city,
          addressLine1: this.businessDetails?.addressDetails?.address1,
          addressLine2: this.businessDetails?.addressDetails?.address2,
          addressLine3: this.businessDetails?.addressDetails?.address3,
          pincode: this.businessDetails?.addressDetails?.pincode,
          telephone: this.businessDetails?.addressDetails?.telephone,
        });
        if (this.businessDetails&& Object.keys(this.businessDetails)[0]!=='default') {
          this.businessId = this.businessDetails?.id;
          this.businessForm?.controls['selectedCountry'].disable();
          console.log(this.businessId);
          // this.businessForm?.controls['blacklistedGoods'].setValue([
          //   ...new Set(
          //     this.businessDetails?.blklstedGoods?.map((e: any) => {
          //       let value = this.titlecasePipe.transform(e.value);
          //       this.selectedGoodsNames.push(e);
          //       this.selectedGoods.push(new MultiSelectGoods(value, true));
          //       return new MultiSelectGoods(value, true);
          //     })
          //   ),
          // ]);
          let goodsList = this.businessDetails?.blklstedGoods?.map((e) => {
            return new MultiSelectGoods(e.value, true);
          });

          this.businessForm?.controls['blacklistedGoods'].setValue(goodsList);
          this.selectedGoodsNames = goodsList?.map((e) => e.value);
          this.selectedGoods = goodsList;
          console.clear()
          console.log(this.selectedGoods,'ccheckkkk')


          let beneList = this.businessDetails?.beneficiaryCountryList.map(
            (e) => {
              return new MultiSelectGoods(e.value?.toUpperCase(), true);
            }
          );
          this.businessForm?.controls['beneficiaryCountry'].setValue(beneList);
          this.selectedBeneficiaryCountryNames = beneList?.map((e) => e.value);
          this.selectedBeneficiaryCountries = beneList;
        }
      } else if (this.subscriber == 'BANK') {
        console.log('Creating bank form');
        this.businessForm?.patchValue({
          bankName: this.businessDetails?.bankName,
          userDetailsForm: [],
          selectedCountry:  this.businessDetails?.addressDetails?.registeredCountry
            ? this.businessDetails?.addressDetails?.registeredCountry.toUpperCase():this.personalDetails?.country.toUpperCase(),
          state: this.businessDetails?.addressDetails?.province,
          city: this.businessDetails?.addressDetails?.city,
          addressLine1: this.businessDetails?.addressDetails?.address1,
          addressLine2: this.businessDetails?.addressDetails?.address2,
          addressLine3: this.businessDetails?.addressDetails?.address3,
          pincode: this.businessDetails?.addressDetails?.pincode,
          telephone: this.businessDetails?.addressDetails?.telephone,
        });
        if (this.businessDetails&& Object.keys(this.businessDetails)[0]!=='default') {
          this.businessId = this.businessDetails?.id;
          console.log(this.businessId);
        }
        // if (
        //   this.businessDetails?.emplyeeDetails &&
        //   this.businessDetails?.emplyeeDetails.length > 0
        // ) {
        //   this.addUserDetailsParams();
        // } else {
        //   this.addUserDetails();
        // }
      } else {
        console.log('Creating customer form');
        this.businessForm?.patchValue({
          registerType: this.businessDetails?.registrationType
          ? this.businessDetails?.registrationType
          : 'EXPORTER_AND_IMPORTER',
          companyName: this.businessDetails?.companyName,
          userDetailsForm: [],
          selectedCountry:  this.businessDetails?.addressDetails?.registeredCountry
            ? this.businessDetails?.addressDetails?.registeredCountry.toUpperCase():this.personalDetails?.country.toUpperCase(),
          state: this.businessDetails?.addressDetails?.province,
          city: this.businessDetails?.addressDetails?.city,
          addressLine1: this.businessDetails?.addressDetails?.address1,
          addressLine2: this.businessDetails?.addressDetails?.address2,
          addressLine3: this.businessDetails?.addressDetails?.address3,
          pincode: this.businessDetails?.addressDetails?.pincode,
          telephone: this.businessDetails?.addressDetails?.telephone,
        });
        if (this.businessDetails&& Object.keys(this.businessDetails)[0]!=='default') {
          this.businessId = this.businessDetails?.id;
          console.log(this.businessId);
        }

        // if (
        //   this.businessDetails?.emplyeeDetails &&
        //   this.businessDetails?.emplyeeDetails.length > 0 && !this.businessDetails?.emplyeeDetails.default
        // ) {
        //   this.addUserDetailsParams();
        // } else {
        //   this.addUserDetails();
        // }
      }
      if (this.editable) {
        if (this.subscriber === 'BANK_AS_UNDERWRITER') {
          this.businessForm.controls['beneficiaryCountry'].disable();
          this.businessForm.controls['selectedCountry'].disable();
        } else {
          this.businessForm.controls['telephone'].disable();
          this.businessForm.controls['pincode'].disable();
          this.businessForm.controls['addressLine3'].disable();
          this.businessForm.controls['addressLine2'].disable();
          this.businessForm.controls['addressLine1'].disable();
          this.businessForm.controls['city'].disable();
          this.businessForm.controls['state'].disable();
          this.businessForm.controls['selectedCountry'].disable();

        }
      }
    }
    this.businessForm?.controls['selectedCountry'].disable()

  }

  createForm() {
    this.selectedGoods = [];
    this.selectedGoodsNames = [];
    this.personalDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (this.subscriber && this.subscriber == 'BANK_AS_UNDERWRITER') {
      console.log('Creating underwriter form');
      this.businessForm = new FormGroup({
        bankName: new FormControl(
          this.businessDetails?.bankName ? this.businessDetails?.bankName : '',
          [Validators.required, Validators.maxLength(25)]
        ),
        branchName: new FormControl(
          this.businessDetails?.branchName
            ? this.businessDetails?.branchName
            : '',
          [Validators.required, Validators.maxLength(25)]
        ),
        swiftCode: new FormControl(
          this.businessDetails?.swiftCode
            ? this.businessDetails?.swiftCode
            : '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(11),
            Validators.pattern('[0-9a-zA-Z]+'),
          ]
        ),
        designation: new FormControl(
          this.businessDetails?.designation
            ? this.businessDetails?.designation
            : '',
          [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')]
        ),
        minLCValue: new FormControl(
          this.businessDetails?.minLCValue
            ? this.formatAmount(this.businessDetails?.minLCValue)
            : '',
          [Validators.required]
        ),
        currency: new FormControl(
          this.businessDetails?.currency ? this.businessDetails?.currency : '',
          [Validators.required]
        ),
        blacklistedGoods: new FormControl('', [Validators.required]),
        beneficiaryCountry: new FormControl('', [Validators.required]),
        selectedCountry: new FormControl(
          this.businessDetails?.addressDetails?.registeredCountry
            ? this.businessDetails?.addressDetails?.registeredCountry.toUpperCase()
            : this.titlecasePipe
                .transform(this.personalDetails?.country)
                .toUpperCase(),
          [Validators.required]
        ),
        state: new FormControl(
          this.businessDetails?.addressDetails?.province
            ? this.businessDetails?.addressDetails?.province
            : '',
          [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')]
        ),
        city: new FormControl(
          this.businessDetails?.addressDetails?.city
            ? this.businessDetails?.addressDetails?.city
            : '',
          [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')]
        ),
        addressLine1: new FormControl(
          this.businessDetails?.addressDetails?.address1
            ? this.businessDetails?.addressDetails?.address1
            : '',
          [Validators.required]
        ),
        addressLine2: new FormControl(
          this.businessDetails?.addressDetails?.address2
            ? this.businessDetails?.addressDetails?.address2
            : '',
          [Validators.required]
        ),
        addressLine3: new FormControl(
          this.businessDetails?.addressDetails?.address3
            ? this.businessDetails?.addressDetails?.address3
            : '',
          []
        ),
        pincode: new FormControl(
          this.businessDetails?.addressDetails?.pincode
            ? this.businessDetails?.addressDetails?.pincode
            : '',
          [Validators.required, Validators.pattern(this.NO_SPECIAL_CHAR)]
        ),
        telephone: new FormControl(
          this.businessDetails?.addressDetails?.telephone
            ? this.businessDetails?.addressDetails?.telephone
            : '',
          Validators.compose([Validators.required, Validators.minLength(7)])
        ),
      });

      if (this.businessDetails && Object.keys(this.businessDetails)[0]!=='default') {
        this.businessId = this.businessDetails?.id;
        this.businessForm.controls['selectedCountry'].disable();
        console.log(this.businessId);
        let goodsList = this.businessDetails?.blklstedGoods?.map((e) => {
          return new MultiSelectGoods(e.value, true);
        });

        this.businessForm?.controls['blacklistedGoods'].setValue(goodsList);
        this.selectedGoodsNames = goodsList?.map((e) => e.value);
        this.selectedGoods = goodsList;

        let beneList = this.businessDetails?.beneficiaryCountryList.map(
          (e) => {
            return new MultiSelectGoods(e.value?.toUpperCase(), true);
          }
        );
        this.businessForm?.controls['beneficiaryCountry'].setValue(beneList);
        this.selectedBeneficiaryCountryNames = beneList?.map((e) => e.value);
        this.selectedBeneficiaryCountries = beneList;
      }
    } else if (this.subscriber == 'BANK') {
      console.log('Creating bank form');
      this.businessForm = new FormGroup({
        bankName: new FormControl(
          this.businessDetails?.bankName ? this.businessDetails?.bankName : '',
          [Validators.required, Validators.maxLength(25)]
        ),
        // registerType:new FormControl(this.businessDetails?.registrationType?this.businessDetails?.registrationType:'',[Validators.required]),
        // companyName:new FormControl('',[Validators.required,Validators.pattern('[a-zA-Z0-9]+')]),
        userDetailsForm: new FormArray([]),
        selectedCountry: new FormControl(
          this.businessDetails?.addressDetails?.registeredCountry
            ? this.businessDetails?.addressDetails?.registeredCountry.toUpperCase()
            : this.titlecasePipe
                .transform(this.personalDetails?.country)
                .toUpperCase(),
          [Validators.required]
        ),
        state: new FormControl(
          this.businessDetails?.addressDetails?.province
            ? this.businessDetails?.addressDetails?.province
            : '',
          [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')]
        ),
        city: new FormControl(
          this.businessDetails?.addressDetails?.city
            ? this.businessDetails?.addressDetails?.city
            : '',
          [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')]
        ),
        addressLine1: new FormControl(
          this.businessDetails?.addressDetails?.address1
            ? this.businessDetails?.addressDetails?.address1
            : '',
          [Validators.required]
        ),
        addressLine2: new FormControl(
          this.businessDetails?.addressDetails?.address2
            ? this.businessDetails?.addressDetails?.address2
            : '',
          [Validators.required]
        ),
        addressLine3: new FormControl(
          this.businessDetails?.addressDetails?.address3
            ? this.businessDetails?.addressDetails?.address3
            : '',
          []
        ),
        pincode: new FormControl(
          this.businessDetails?.addressDetails?.pincode
            ? this.businessDetails?.addressDetails?.pincode
            : '',
          [Validators.required, Validators.pattern(this.NO_SPECIAL_CHAR)]
        ),
        telephone: new FormControl(
          this.businessDetails?.addressDetails?.telephone
            ? this.businessDetails?.addressDetails?.telephone
            : '',
          Validators.compose([Validators.required, Validators.minLength(7)])
        ),
      });
      if (this.businessDetails && Object.keys(this.businessDetails)[0]!=='default') {
        this.businessId = this.businessDetails?.id;
        console.log(this.businessId);
      }
      if (
        this.businessDetails?.emplyeeDetails &&
        this.businessDetails?.emplyeeDetails.length > 0
      ) {
        this.addUserDetailsParams();
      } else {
        this.addUserDetails();
      }
    } else {
      console.log('Creating customer form');
      this.businessForm = new FormGroup({
        registerType: new FormControl(
          this.businessDetails?.registrationType
            ? this.businessDetails?.registrationType
            : 'EXPORTER_AND_IMPORTER',
          [Validators.required]
        ),
        companyName: new FormControl(
          this.businessDetails?.companyName
            ? this.businessDetails?.companyName
            : '',
          [Validators.required]
        ),
        userDetailsForm: new FormArray([]),
        selectedCountry: new FormControl(
          this.businessDetails?.addressDetails?.registeredCountry
            ? this.businessDetails?.addressDetails?.registeredCountry.toUpperCase()
            : this.titlecasePipe
                .transform(this.personalDetails?.country)
                .toUpperCase(),
          [Validators.required]
        ),
        state: new FormControl(
          this.businessDetails?.addressDetails?.province
            ? this.businessDetails?.addressDetails?.province
            : '',
          [Validators.required]
        ),
        city: new FormControl(
          this.businessDetails?.addressDetails?.city
            ? this.businessDetails?.addressDetails?.city
            : '',
          [Validators.required]
        ),
        addressLine1: new FormControl(
          this.businessDetails?.addressDetails?.address1
            ? this.businessDetails?.addressDetails?.address1
            : '',
          [Validators.required]
        ),
        addressLine2: new FormControl(
          this.businessDetails?.addressDetails?.address2
            ? this.businessDetails?.addressDetails?.address2
            : '',
          [Validators.required]
        ),
        addressLine3: new FormControl(
          this.businessDetails?.addressDetails?.address3
            ? this.businessDetails?.addressDetails?.address3
            : '',
          []
        ),
        pincode: new FormControl(
          this.businessDetails?.addressDetails?.pincode
            ? this.businessDetails?.addressDetails?.pincode
            : '',
          [Validators.required, Validators.pattern(this.NO_SPECIAL_CHAR)]
        ),
        telephone: new FormControl(
          this.businessDetails?.addressDetails?.telephone
            ? this.businessDetails?.addressDetails?.telephone
            : '',
          Validators.compose([Validators.required, Validators.minLength(7)])
        ),
      });
      if (this.businessDetails&& Object.keys(this.businessDetails)[0]!=='default') {
        this.businessId = this.businessDetails?.id;
        console.log(this.businessId);
      }

      if (
        this.businessDetails?.emplyeeDetails &&
        this.businessDetails?.emplyeeDetails.length > 0
      ) {
        this.addUserDetailsParams();
      } else {
        this.addUserDetails();
      }
    }
    if (this.editable) {
      if (this.subscriber === 'BANK_AS_UNDERWRITER') {
        this.businessForm.controls['beneficiaryCountry'].disable();
        this.businessForm.controls['selectedCountry'].disable();
      } else {
        this.businessForm.controls['telephone'].disable();
        this.businessForm.controls['pincode'].disable();
        this.businessForm.controls['addressLine3'].disable();
        this.businessForm.controls['addressLine2'].disable();
        this.businessForm.controls['addressLine1'].disable();
        this.businessForm.controls['city'].disable();
        this.businessForm.controls['state'].disable();
        this.businessForm.controls['selectedCountry'].disable();

      }
    }
  }

  public errorHandling = (error: string) => {
    return this.businessForm.hasError(error);
  };

  currencyChange(e: any) {
    if (e.target.value === '') {
      this.currencyOptions = this.currencies;
    } else {
      console.log(e);
      const filterValue4 = e.target.value.toLowerCase();

      this.currencyOptions = this.currencies.filter((option: any) =>
        option.toLowerCase().includes(filterValue4)
      );
    }
  }

  beneCountryChange(e: any) {
    if (e.target.value === '') {
      this.beneficiaryCountryOptions = this.beneficiaryCountries;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.beneficiaryCountryOptions = this.beneficiaryCountries.filter(
        (option: any) => option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  selectbeneficiaryCountry() {
    this.beneficiaryCountryOptions.forEach((e: any) => {
      const res = this.selectedBeneficiaryCountries.find((i: any) => {
        return i.name?.toUpperCase() == e.name?.toUpperCase();
      });
      if (res) {
        e.selected = true;
      }
    });
  }

  optionClickedBeneCountry(event: Event, item: MultiSelectCountries) {
    event.stopPropagation();
    this.toggleBeneCountrySelection(event, item);
  }

  displayBeneCountries(
    value: MultiSelectCountries[] | string
  ): string | undefined {
    let displayValue: string;
    console.log(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (index === 0) {
          displayValue = item.name;
        } else {
          displayValue += ', ' + item.name;
        }
      });
    } else {
      displayValue = value;
    }
    console.log(displayValue);
    return displayValue;
  }

  toggleBeneCountrySelection(event: any, item: MultiSelectCountries) {
    item.selected = !item.selected;
    if (event.checked) {
      if (item.name == 'All') {
        this.selectedBeneficiaryCountries = [];
        this.selectedBeneficiaryCountryNames = [];
        this.beneficiaryCountries.forEach((e: any) => {
          e.selected = true;
          if (!(e.name.toLowerCase() == 'all')) {
            this.selectedBeneficiaryCountries.push(e);
          }

          if (e.name != 'All') {
            const res = this.selectedBeneficiaryCountryNames.find((i: any) => {
              return i.value.toUpperCase() == e.name.toUpperCase();
            });
            if (!res)
              this.selectedBeneficiaryCountryNames.push({
                value: e.name.toUpperCase(),
              });
          }
        });
      } else {
        this.selectedBeneficiaryCountries.push(item);
        this.selectedBeneficiaryCountryNames.push({
          value: item.name.toUpperCase(),
        });
      }
      this.selectbeneficiaryCountry();
    } else {
      if (item.name == 'All') {
        this.beneficiaryCountries.forEach((e: any) => {
          e.selected = false;
        });
        this.selectedBeneficiaryCountries = [];
        this.selectedBeneficiaryCountryNames = [];
      } else {
        console.log(item.name);
        console.log(
          this.selectedBeneficiaryCountries.findIndex(
            (i: any) => i.name.toLowerCase() === item.name.toLowerCase()
          )
        );
        const res = this.selectedBeneficiaryCountries.findIndex(
          (i: any) => i.name.toLowerCase() === item.name.toLowerCase()
        );
        console.log(res);
        if (res >= 0) {
          console.log(this.selectedBeneficiaryCountries);
          this.selectedBeneficiaryCountries.splice(res, 1);
          this.selectedBeneficiaryCountryNames.splice(res, 1);
          console.log(this.selectedBeneficiaryCountries);
          // this.beneficiaryCountryOptions[res].selected = false;
        }

        // const i = this.selectedBeneficiaryCountries.findIndex(e => e.name.toLowerCase() === item.name.toLowerCase());
        // this.selectedBeneficiaryCountries.splice(i, 1);
        // const j = this.selectedBeneficiaryCountryNames.findIndex(e => e.value.toLowerCase() === item.name.toLowerCase());
        // this.selectedBeneficiaryCountryNames.splice(j, 1);
      }
      this.selectbeneficiaryCountry();
    }
    this.businessForm.controls['beneficiaryCountry'].setValue(
      this.selectedBeneficiaryCountries
    );
    if (this.selectedBeneficiaryCountries?.length == 0) {
      this.beneficiaryCountryOptions = this.beneficiaryCountryOptionsC;
    }
  }

  goodsChange(e: any) {
    if (e.target.value === '') {
      this.goodsOptions = this.goods;
    } else {
      console.log(e);
      const filterValue = e.target.value.toLowerCase();

      this.goodsOptions = this.goods.filter((option: any) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  selectGoods() {
    this.goodsOptions.forEach((e: any) => {
      const res = this.selectedGoods.find((i: any) => {
        return i.name == e.name;
      });
      if (res) {
        e.selected = true;
      }
    });
  }

  optionClicked(event: Event, item: MultiSelectGoods) {
    event.stopPropagation();
    this.toggleSelection(event, item);
  }

  toggleSelection(event: any, item: MultiSelectGoods) {

    item.selected = !item.selected;
    if (event.checked) {
      if (item.name !== 'None') {
        console.log(item.name, 'checked');
        // if (item.name.toLowerCase() === 'others') {
        //   this.selectedOtherTypeGoods = true;
        //   this.otherGoods = new FormControl('', [Validators.required]);
        // } else {
        //   this.selectedOtherTypeGoods = false;
        // }
        this.goodsOptions.forEach((e: any) => {
          if (e.name.toLowerCase() === 'none') {
            e.selected = false;
          }
        });
        const noneIndex = this.selectedGoods.findIndex(
          (e) => e.name.toLowerCase() === 'none'
        );
        if (noneIndex !== -1) {
          this.selectedGoods.splice(noneIndex, 1);
          this.selectedGoodsNames.splice(noneIndex, 1);
        }
        this.selectedGoods.push(item);
        this.selectedGoodsNames.push({ value: item.name });
      } else {
        console.log(item.name, 'none checked');
        this.selectedGoods = [];
        this.selectedGoodsNames = [];
        this.goodsOptions.forEach((e: any) => {
          if (e.name.toLowerCase() !== 'none') {
            e.selected = false;
          }
        });
        this.selectedGoods.push(item);
        this.selectedGoodsNames.push({ value: item.name });
      }
      this.selectGoods();
    } else {
      console.log(item.name, 'unchecked');
      console.log(this.selectGoods);
      const i = this.selectedGoods.findIndex(
        (e) => e.name.toLowerCase() === item.name.toLowerCase()
      );
      if (i >= 0) {
        this.selectedGoods.splice(i, 1);
        this.selectedGoodsNames.splice(i, 1);
        this.goodsOptions[i].selected = false;
      }
      this.selectGoods();
    }
    console.log(this.selectedGoods);
    this.businessForm.controls['blacklistedGoods'].setValue(this.selectedGoods);
  }

  displayGoods(value: MultiSelectGoods[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.name;
        } else {
          displayValue += ', ' + user.name;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  addUserDetailsParams() {
    this.userDetailsArrayParams()?.clear();

    for (let ts of this.businessDetails?.emplyeeDetails) {
      this.userDetailsArrayParams()?.push(
        new FormGroup({
          id: new FormControl(ts.id),
          firstName: new FormControl(ts.firstName),
          lastName: new FormControl(ts.lastName),
          designation: new FormControl(ts.designation),
        })
      );
    }
  }

  userDetailsArrayParams(): FormArray {
    return this.businessForm?.get('userDetailsForm') as FormArray;
  }

  addUserDetails() {
    this.userDetailsArrayParams().push(this.newUserDetailsForm());
  }

  newUserDetailsForm(): FormGroup {
    return new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      designation: new FormControl(''),
    });
  }

  onRadioChange(e: any) {
    console.log(e.value);
    this.selectedRegisterType = e.value;
    console.log(this.selectedRegisterType);
  }

  countryChange(e: any) {
    if (e.target.value === '') {
      this.countryOptions = this.countries;
    } else {
      console.log(e);
      const filterValue3 = e.target.value.toLowerCase();

      this.countryOptions = this.countries.filter((option: any) =>
        option.countryName.toLowerCase().includes(filterValue3)
      );
    }
  }

  deleteItem(i: any) {
    console.log(this.users);
    console.log(i);
    this.users.splice(i, 1);
    console.log(this.users);
    const dtArr = this.businessForm.get('userDetailsForm') as FormArray;
    dtArr.removeAt(i);
  }

  addMore() {
    console.log('Clicked');
    this.users.push({});
    this.addUserDetails();
  }

  submit() {
    console.log('Clicked');
    if (this.businessForm.valid) {
      let data: any = {};

      if (this.subscriber != 'BANK_AS_UNDERWRITER') {
        const userDetails = this.getUserDetails();
        if (this.subscriber == 'CUSTOMER') {
          data = {
            registrationType:
              this.businessForm.controls['registerType'].value.toUpperCase(),
            companyName: this.businessForm?.controls['companyName'].value,
            emplyeeDetails: userDetails,
            addressDetails: {
              registeredCountry:
                this.businessForm?.controls['selectedCountry'].value,
              province: this.businessForm?.controls['state'].value,
              city: this.businessForm?.controls['city'].value,
              address1: this.businessForm?.controls['addressLine1'].value,
              address2: this.businessForm?.controls['addressLine2'].value,
              address3: this.businessForm?.controls['addressLine3'].value,
              pincode: this.businessForm?.controls['pincode'].value,
              telephone: this.businessForm?.controls['telephone'].value,
            },
          };
        } else if (this.subscriber == 'BANK') {
          console.log('Creating bank as customer');
          data = {
            bankName: this.businessForm.controls['bankName'].value,
            // "registrationType": this.businessForm.controls['registerType'].value.toUpperCase(),
            // "companyName": this.businessForm?.controls['companyName'].value,
            emplyeeDetails: userDetails,
            addressDetails: {
              registeredCountry:
                this.businessForm?.controls['selectedCountry'].value,
              province: this.businessForm?.controls['state'].value,
              city: this.businessForm?.controls['city'].value,
              address1: this.businessForm?.controls['addressLine1'].value,
              address2: this.businessForm?.controls['addressLine2'].value,
              address3: this.businessForm?.controls['addressLine3'].value,
              pincode: this.businessForm?.controls['pincode'].value,
              telephone: this.businessForm?.controls['telephone'].value,
            },
          };
        }
      } else {
        data = {
          branchName: this.businessForm.controls['branchName'].value,
          bankName: this.businessForm.controls['bankName'].value,
          designation: this.businessForm.controls['designation'].value,
          swiftCode: this.businessForm.controls['swiftCode'].value,
          currency: this.businessForm.controls['currency'].value,
          minLCValue:this.parseAmount({target:{value:this.businessForm.controls['minLCValue'].value}}),
          blklstedGoods:  this.selectedGoods
          ?.filter((e) => e.selected)
          .map((e) => {
            return { value: e.name };
          }),
          beneficiaryCountryList: this.selectedBeneficiaryCountries
            ?.filter((e) => e.selected)
            .map((e) => {
              return { value: e.name };
            }),
          addressDetails: {
            registeredCountry:
              this.businessForm.controls['selectedCountry'].value,
            province: this.businessForm.controls['state'].value,
            city: this.businessForm.controls['city'].value,
            address1: this.businessForm.controls['addressLine1'].value,
            address2: this.businessForm.controls['addressLine2'].value,
            address3: this.businessForm.controls['addressLine3'].value,
            pincode: this.businessForm.controls['pincode'].value,
            telephone: this.businessForm.controls['telephone'].value,
          },
        };
        if (this.selectedOtherTypeGoods) {
          data.otherGoodsType = this.otherGoods.value;
        }
      }
      this.customerService.addBusinessDetails(data).subscribe((res: any) => {
        console.log(res);

        if (res.success) {
          if (!this.editable) {
            this.index.emit(2);
          } else {
            const popup = this.dialog.open(ProfileUpdatePopupComponent, {
              data: { from: 'Business' },
            });
            popup.afterClosed().subscribe((res) => {
              if (this.editable?.from === 'my-profile') {
                this.router.navigateByUrl('/customer/transactions/profile');
              } else if (this.editable?.from === 'bank-profile') {
                this.router.navigateByUrl(
                  '/customer/transactions/bank-profile'
                );
              } else if (this.editable?.from === 'bank-underwriter-profile') {
                this.router.navigateByUrl('/bank-underwriter/profile');
              }
            });
          }
        }
      });
    }
  }

  getUserDetails() {
    let details: any = [];
    this.userDetailsArrayParams().controls.forEach(
      (control: any, index: any) => {
        if (
          control.controls.firstName.value &&
          control.controls.lastName.value &&
          control.controls.designation.value
        ) {
          details.push({
            firstName: control.controls.firstName.value,
            lastName: control.controls.lastName.value,
            designation: control.controls.designation.value,
          });
        }
        if (control.controls.id && control.controls.id.value) {
          details[index].id = control.controls.id.value;
        }
      }
    );
    return details;
  }

  checkAutocomplete(e: any, formName: any) {
    let formValue = this.businessForm.controls[formName].value;
    console.log(formValue, formName);
    if (formName === 'selectedCountry') {
      let isExists = this.countries.find((ele: any) => {
        console.log(ele.countryName.toLowerCase() === formValue?.toLowerCase());
        return ele.countryName.toLowerCase() === formValue?.toLowerCase();
      });
      console.log(isExists);
      if (isExists) {
        console.log(
          this.countries.find(
            (ele: any) =>
              ele.countryName.toLowerCase() === formValue?.toLowerCase()
          )
        );
        this.businessForm.controls[formName].setValue(
          this.countries.find(
            (ele: any) =>
              ele.countryName.toLowerCase() === formValue?.toLowerCase()
          ).countryName
        );
      } else {
        this.businessForm.controls[formName].setErrors({ required: true });
      }
    }

    if (formName === 'currency') {
      let isExists = this.currencies.find((ele: any) => {
        console.log(ele.toLowerCase() === formValue?.toLowerCase());
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      console.log(isExists);
      if (isExists) {
        console.log(
          this.currencies.find(
            (ele: any) => ele.toLowerCase() === formValue?.toLowerCase()
          )
        );
        this.businessForm.controls[formName].setValue(
          this.currencies.find(
            (ele: any) => ele.toLowerCase() === formValue?.toLowerCase()
          )
        );
      } else {
        this.businessForm.controls[formName].setErrors({ required: true });
      }
    }

    if (formName === 'blacklistedGoods') {
      console.log(e.target.value?.replace(/,\s+/g, ',')?.toLowerCase());
      let inputGoods = e.target.value
        ?.replace(/,\s+/g, ',')
        ?.toLowerCase()
        ?.split(',');
      let existingGoodsList = this.goods.map((ele: any) => ele.name);
      console.log(existingGoodsList);
      console.log(
        existingGoodsList.join(',')?.replace(/,\s+/g, ',')?.toLowerCase()
      );
      let checkGoods = inputGoods.some((inputGood) => {
        return !existingGoodsList.some((good) => {
          return good.toLowerCase() === inputGood.toLowerCase();
        });
      });
      console.log(checkGoods);
      if (checkGoods) {
        this.businessForm.controls[formName].setErrors({ required: true });
      } else {
        this.businessForm.controls[formName].setErrors(null);
      }
    }

    if (formName === 'beneficiaryCountry') {
      console.log(e.target.value?.replace(/,\s+/g, ',')?.toLowerCase());
      let inputCountries = e.target.value
        ?.replace(/,\s+/g, ',')
        ?.toLowerCase()
        ?.split(',');
      let existingCountryNames = this.countries.map(
        (ele: any) => ele.countryName
      );
      console.log(existingCountryNames);
      console.log(
        existingCountryNames.join(',')?.replace(/,\s+/g, ',')?.toLowerCase()
      );
      let checkCountry = inputCountries.some((inputCountry) => {
        return !existingCountryNames.some((country) => {
          return country.toLowerCase() === inputCountry.toLowerCase();
        });
      });
      console.log(checkCountry);
      if (checkCountry) {
        this.businessForm.controls[formName].setErrors({ required: true });
      } else {
        this.businessForm.controls[formName].setErrors(null);
      }
    }
  }
  resetCountry() {
    let selectedoptions: any = this.selectedBeneficiaryCountries;
    let originaloptions: any = this.beneficiaryCountryOptionsC;
    selectedoptions.forEach((selectedOption) => {
      const matchingOption = originaloptions.find(
        (option) => option.name === selectedOption.name
      );
      if (matchingOption) {
        matchingOption.selected = selectedOption.selected;
      }
    });

    this.beneficiaryCountryOptions = originaloptions;
  }
  getCapz(v) {
    console.log(v, 'capz');
    return v;
  }
  getCheck(item:any){

    return item.selected
  }

  amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  console.log(value)
  const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
  return isValid ? null : null;
}

formatAmount(value: string) {
  const number = +value?.toString()?.replace(/[^0-9.]/g, '');
  return isNaN(number) ? '' :number>0? number.toLocaleString('en-US',{
    maximumFractionDigits:2,
  }):'';
}

parseAmount(e: any) {
  console.log(e)
  let target=e.target.value||''
  return target.replace(/,/g, '');
}

onBlur(formName:any) {
  const value = this.parseAmount({ target: { value: this.businessForm.controls[formName].value } });
  this.businessForm.controls[formName].setValue(this.formatAmount(value));
  console.log(this.businessForm.controls[formName])
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
