import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EsgComplaintPopupComponent } from "../../../popup/esgcomplaint/esg-complaint/esg-complaint-popup/esg-complaint-popup.component";
import { ApiService } from "src/app/services/api.service";
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, startWith, map } from "rxjs";
import { TransactionService } from "src/app/modules/customer/transaction/services/transaction.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-secondary-transaction-details',
  templateUrl: './secondary-transaction-details.component.html',
  styleUrls: ['./secondary-transaction-details.component.scss'],
})
export class SecondaryTransactionDetailsComponent
  implements DoCheck, OnChanges
{
  @Input() state: any = {};
  type: any = 'new';
  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private transactionService: TransactionService,
    private router: Router
  ) {
    if (this.router.url.indexOf('/edit?id') > 0) {
      this.type = 'edit';
    } else {
      this.type = 'new';
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(()=>{
      if (this.form) {
        this.setFormValue(changes['state'].currentValue);
      }
    },1000)
  }
  ngDoCheck(): void {
    if (
      this.form.value.targetBookingDate &&
      this.form.value.transactionMaturityDate
    ) {
      const targetBookingDate = new Date(this.form.value.targetBookingDate);
      const transactionMaturityDate = new Date(
        this.form.value.transactionMaturityDate
      );
      const timeDiff =
        transactionMaturityDate.getTime() - targetBookingDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // 1000 ms/s * 3600 s/h * 24 h/day = 86400000 ms/day
      this.form.controls['tenor'].setValue(daysDiff || 1);
    }
  }

  today = new Date();
  maturityMinDate: Date = this.today;
  form!: FormGroup;
  countryList = [];
  currencyList = [];
  typesOfGoods = [];
  countryLoadingPort = [];
  countryDischargePort = [];
  currencyList$ = new Observable<string[]>();
  typesOfGoods$ = new Observable<string[]>();
  countryList$: Observable<string[]>;
  countryLoadingPort$ = new Observable<string[]>();
  countryDischargePort$ = new Observable<string[]>();
  countryLoadingList$ = new Observable<string[]>();
  countryDischargeList$ = new Observable<string[]>();

  @Output() transactionDetailsHandler: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.createForm();
    this.fetchApis();
  }
  updateMaturityMinDate() {
    const bookingDate = this.form.get('targetBookingDate').value;
    this.maturityMinDate = bookingDate ? bookingDate : this.today;
  }
  fetchApis() {
    this.apiService.getAllCountryCode().subscribe({
      next: (response: any) => {
        try {
          this.countryList = response.data[0].countryNames.map((item) =>
            item.replace('\n', '')
          ).sort();
          this.currencyList = response.data[0].currencies
            .map((item) => item.replace('\n', ''))
            ?.sort();
          this.matAutocompleteCountryCurrencyObservers();
        } catch (e) {
          this.countryList = [];
          this.countryList = [];
        }
      },
      error: (error: any) => {
        this.countryList = [];
        this.countryList = [];
      },
    });
    this.apiService.getAllGoods().subscribe({
      next: (response: any) => {
        try {
          this.typesOfGoods = response.data[0].map((item) => item.name);

          this.matAutocompleteGoodsObservers();
        } catch (e) {
          this.typesOfGoods = [];
        }
      },
      error: (error: any) => {
        this.typesOfGoods = [];
      },
    });
  }

  createForm() {
    this.form = new FormGroup(
      {
        transactionMaturityDate: new FormControl('', [Validators.required]),
        transactionValidity: new FormControl('', [Validators.required]),
        tenor: new FormControl('', []),
        targetBookingDate: new FormControl('', [Validators.required]),
        typeOfGood: new FormControl('', [Validators.required]),
        currency: new FormControl('', [Validators.required]),
        amount: new FormControl('', [
          Validators.required,
          this.amountValidator
        ]),
        esgCompliant: new FormControl('', [Validators.required]),
        loadingCountry: new FormControl('', [Validators.required]),
        loadingCountryport: new FormControl('', [Validators.required]),
        dischargeCountry: new FormControl('', [Validators.required]),
        dischargeCountryport: new FormControl('', [Validators.required]),
        destinationGoods: new FormControl('', [Validators.required]),
        otherGoodsType: new FormControl('', [Validators.required]),
      },
      { validators: portMatchValidator }
    );
    this.form.controls['loadingCountryport'].disable();
    this.form.controls['dischargeCountryport'].disable();
    // this.form.controls["tenor"].disable();
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
    this.countryLoadingList$ = this.form.controls[
      'loadingCountry'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => {
        return state
          ? this._filter(state, 'country')
          : this.countryList.slice();
      })
    );
    this.countryDischargeList$ = this.form.controls[
      'dischargeCountry'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => {
        return state
          ? this._filter(state, 'country')
          : this.countryList.slice();
      })
    );
    this.countryList$ = this.form.controls[
      'destinationGoods'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => {
        return state
          ? this._filter(state, 'country')
          : this.countryList.slice();
      })
    );
  }
  matAutocompleteGoodsObservers() {
    this.typesOfGoods$ = this.form.controls['typeOfGood'].valueChanges.pipe(
      startWith(''),
      map((state) => {
        return state ? this._filterGoods(state) : this.typesOfGoods.slice();
      })
    );
  }
  private _filter(value: string, type: string): string[] {
    const filterValue = this._normalizeValue(value);
    if (type === 'currency') {
      return this.currencyList.filter((currency) =>
        this._normalizeValue(currency).includes(filterValue)
      );
    } else if (type === 'country') {
      return this.countryList.filter((country) =>
        this._normalizeValue(country).includes(filterValue)
      );
    } else {
      return [];
    }
  }
  private _filterGoods(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.typesOfGoods.filter((good) =>
      this._normalizeValue(good).includes(filterValue)
    );
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  esgcomplaintpopup() {
    this.dialog.open(EsgComplaintPopupComponent,{data:'secondry'});
  }
  fetchCountryPort(type: string) {
    if (type === 'loading' && this.form.controls['loadingCountry'].valid) {
      this.form.controls['loadingCountryport'].setValue('');
      this.form.controls['loadingCountryport'].enable();
      this.form.controls['loadingCountryport'].setValidators(
        Validators.required
      );
    }
    if (type === 'discharge' && this.form.controls['dischargeCountry'].valid) {
      this.form.controls['dischargeCountryport'].setValue('');
      this.form.controls['dischargeCountryport'].enable();
      this.form.controls['dischargeCountryport'].setValidators(
        Validators.required
      );
    }

    let contryString =
      type === 'loading'
        ? this.form.value.loadingCountry
        : type === 'discharge'
        ? this.form.value.dischargeCountry
        : '';
    if (!contryString) {
      return;
    }
    this.transactionService.getLoadingPort(contryString).subscribe({
      next: (res: any) => {
        try {
          if (type === 'loading') {
            this.countryLoadingPort = res.data.map((item) => `${item.code} - ${item.port}`);
          }
          if (type === 'discharge') {
            this.countryDischargePort = res.data.map((item) => `${item.code} - ${item.port}`);
          }
        } catch (e) {
          if (type === 'loading') {
            this.countryLoadingPort = [];
          }
          if (type === 'discharge') {
            this.countryDischargePort = [];
          }
        }
      },
      error: () => {
        if (type === 'loading') {
          this.countryLoadingPort = [];
        }
      },
      complete: () => {
        if (type === 'loading') {
          this.countryLoadingPort$ = this.form.controls[
            'typeOfGood'
          ].valueChanges.pipe(
            startWith(''),
            map((state) => {
              return state
                ? this._filterLoadingPort(state)
                : this.countryLoadingPort.slice();
            })
          );
        }
        if (type === 'discharge') {
          this.countryDischargePort$ = this.form.controls[
            'typeOfGood'
          ].valueChanges.pipe(
            startWith(''),
            map((state) => {
              return state
                ? this._filterDischargePort(state)
                : this.countryDischargePort.slice();
            })
          );
        }
      },
    });
  }
  private _filterLoadingPort(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countryLoadingPort.filter((port) =>
      this._normalizeValue(port).includes(filterValue)
    );
  }
  private _filterDischargePort(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countryDischargePort.filter((port) =>
      this._normalizeValue(port).includes(filterValue)
    );
  }

  setFormValue(data: any) {
    const {
      lCValue,
      usanceDays,
      isESGComplaint,
      lCBookingDate,
      loadingCountry,
      loadingPort,
      dischargeCountry,
      dischargePort,
      lCCurrency,
      finalDestinationOfGoods,
      lCMaturityDate,
      validity,
      goodsType,
      otherGoodsType,
    } = data;
    this.form.setValue({
      transactionMaturityDate: lCMaturityDate,
      transactionValidity: validity,
      tenor: usanceDays,
      targetBookingDate: lCBookingDate,
      typeOfGood: goodsType,
      currency: lCCurrency,
      amount: this.formatAmount(lCValue),
      esgCompliant: isESGComplaint == 'true' ? true : false,
      loadingCountry: loadingCountry,
      loadingCountryport: loadingPort || '',
      dischargeCountry: dischargeCountry,
      dischargeCountryport: dischargePort || '',
      destinationGoods: finalDestinationOfGoods,
      otherGoodsType: otherGoodsType,
    });
    if (dischargePort) {
      this.form.controls['dischargeCountryport'].enable();
    }
    if (loadingPort) {
      this.form.controls['loadingCountryport'].enable();
    }
  }

  submit() {
    console.log(this.form);
    if (this.form.value.typeOfGood !== 'Others') {
      this.form.controls['otherGoodsType'].setValue('');
      this.form.controls['otherGoodsType'].setErrors(null);
    }
    if (this.form.valid) {
      this.form.controls['amount'].setValue(this.parseAmount({
        target: { value: this.form.controls['amount'].value },
      }));
      this.transactionDetailsHandler.emit(this.form.value);
      console.log(this.form.value);
    }
  }
  restrictKeys(event: any) {
    console.log(event.keyCode)
    return (
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      event.keyCode == 8 ||
      event.keyCode == 190 ||
      event.keyCode == 110 ||
      event.keyCode == 9 ||
      event.keyCode == 37 ||
      event.keyCode == 39
    );
  }

  selectedPort(e: any, formName: any) {
    if (this.form.hasError('portMismatch'))
      this.form.controls[formName].setErrors([{ portMismatch: true }]);
    else this.form.controls[formName].setErrors(null);
  }

  checkCountryExistsPorts(e: any, formName: any) {
    let formValue = this.form.controls[formName].value;
    if (formValue.length === 0) {
      return;
    }
    if (formName === 'loadingCountry') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryList.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
      if(!this.form.controls[formName].valid){
        this.form.controls['loadingCountryport'].disable();
      }
    }
    if (formName === 'loadingCountryport') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryLoadingPort.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
    }
    if (formName === 'dischargeCountry') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryList.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
      if (!this.form.controls[formName].valid) {
        this.form.controls['dischargeCountryport'].disable();
      }
    }
    if (formName === 'dischargeCountryport') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryDischargePort.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
    }
    if (formName === 'destinationGoods') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryList.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
    }
    if (formName === 'currency') {
      let formValue = this.form.controls[formName].value;
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
    if (formName === 'typeOfGood') {
      let formValue = this.form.controls[formName].value;
      let isExists = this.typesOfGoods.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
    }
    
  }

  amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  console.log(value)
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
  console.log(e)
  let target=e.target.value||''
  return target.replace(/,/g, '');
}

onBlur(formName:any) {
  const value = this.parseAmount({ target: { value: this.form.controls[formName].value } });
  this.form.controls[formName].setValue(this.formatAmount(value));
  console.log(this.form.controls[formName])
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

export const portMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('loadingCountryport').value !== formGroup.get('dischargeCountryport').value)
    return null;
  else
    return {portMismatch: true};
};
