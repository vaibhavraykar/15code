import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FactoringService } from '../../services/factoring.service';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { map, Observable, of, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UploadTransactionPopupComponent } from '../upload-transaction-popup/upload-transaction-popup.component';

const moment = _moment;
@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent {
  assigner = [
    { name: 'Assigner', value: '1' },
    { name: 'Self', value: '2' },
  ];
  goods = [
    { name: 'Automobile', value: '1' },
    { name: 'Machinery', value: '2' },
  ];
  charges = [
    { name: 'ASSIGNOR', value: '1' },
    { name: 'DEBTOR', value: '2' },
  ];
  origin = [
    { name: 'India', value: '1' },
    { name: 'Bangladesh', value: '2' },
  ];
  discharge = [
    { name: 'India', value: '1' },
    { name: 'Bangladesh', value: '2' },
  ];
  countries?: any = [];
  currencies?:any=[];
  all_goods?: any = [];
  group_companies?: any = [];
  radioOption: any;
  selectedAssigner: any;
  selectedDebtor: any;
  assignee: any;
  assignerToDebtor: any;
  debtorToAssigner: any;
  debtor: any;
  amount: any;
  invoiceNum: any;
  date: any;
  tenor: any;
  due_date: any;
  underlining_good: any;
  charges_on: any;
  grace_period: any;
  country_origin: any;
  country_discharge: any;
  trasaction_validity: any;
  isESGCompliant: boolean = false;
  selectedUser: any;
  dateReal = new FormControl('', [Validators.required]);
  dueDate = new FormControl('', [Validators.required]);
  validityDate = new FormControl('', [Validators.required]);
  currentDate: any;
  selectedCurrency: any;

  assignerControl = new FormControl('');
  countryDischarge = new FormControl('');
  countryOrigin = new FormControl('');
  underlyingGoods = new FormControl('');
  currency = new FormControl('');
  filteredOptions: any;
  currencyOptions: any;
  countryOriginOptions: any;
  underlyingOptions: any;
  assignerOptions: Observable<any[]>;
  extraUnderlingGoods: string;
  finicingPeriod: string;
  @Input() product: any;
  @Output() back: any = new EventEmitter();

  constructor(
    private router: Router,
    private factoringService: FactoringService,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.selectedUser = 'ASSIGNOR';
    this.apiService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.currencies = res.data[0].currencies;
      console.log(this.countries);
      this.filteredOptions = this.countries;
      this.countryOriginOptions = this.countries;
      this.currencyOptions = this.currencies;
    });
    this.apiService.getAllGoods().subscribe((res: any) => {
      this.all_goods = res.data[0];
      console.log(this.all_goods);
      this.underlyingOptions = this.all_goods;
    });
    this.factoringService.getCompany().subscribe((res: any) => {
      console.log(res);
      this.group_companies = res;
    });

    this.filteredOptions = this.countryDischarge.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.underlyingOptions = this.underlyingGoods.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_goods(value || ''))
    );

    this.countryOriginOptions = this.countryOrigin.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_origin(value || ''))
    );

    // this.assignerOptions = this.assignerControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter_assigner(value || '')),
    // );

    this.currencyOptions = this.currency.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_currency(value || ''))
    );
  }
  preview() {
    this.back.emit();
  }

  transaction() {
    const sPopup = this.dialog.open(UploadTransactionPopupComponent, {
      width: '500px',
      height: '300px',
    });
    // this.router.navigateByUrl('/factoring/transaction');
  }

  save() {
    this.date = moment(this.dateReal.value).format('DD-MM-YYYY');
    this.due_date = moment(this.dueDate.value).format('DD-MM-YYYY');
    this.trasaction_validity = moment(this.validityDate.value).format(
      'YYYY-MM-DD'
    );

    // var data = {
    //   factoringProductType: this.product.toUpperCase(),
    //   factoringUserType: this.selectedUser,
    //   status: 'PENDING',
    //   amount: this.amount,
    //   invoiceNumber: this.invoiceNum,
    //   date: this.date,
    //   Tenour: this.tenor,
    //   dueDate: this.due_date,
    //   chargesOn: this.charges_on,
    //   gracePeriod: this.grace_period,
    //   countryOrigin: this.countryOrigin.value,
    //   countryDischarge: this.countryDischarge.value,
    //   transactionValidityDate: this.trasaction_validity,
    //   isESGCompliant: this.isESGCompliant,
    //   underlingGoods: this.underlyingGoods.value,
    //   currency: this.currency.value,
    //   // "assigner":this.assigner,
    //   // "assignerToDebtor":this.assignerToDebtor
    // };
    let data: any = {
      factoringProductType: this.product.toUpperCase(),
      factoringUserType: this.selectedUser,
      amount: this.amount,
      invoiceNumber: this.invoiceNum,
      date: this.date,
      tenor: this.tenor,
      dueDate: this.due_date,
      chargesOn: this.charges_on,
      gracePeriod: this.grace_period,
      countryOrigin: this.countryOrigin.value,
      countryDischarge: this.countryDischarge.value,
      finicingPeriod: this.finicingPeriod,
      isESGCompliant: this.isESGCompliant,
      underlyingGoods: this.underlyingGoods.value,
      // assigner: 102,
      // assignerToDebtor: 'Hello From',
      currency: this.currency.value,
      // extraUnderlingGoods: 'Water',
    };

    if (this.selectedUser == 'ASSIGNOR') {
      data['assignor'] = this.assigner;
      data['assignorToDebtor'] = this.assignerToDebtor;
    } else if (this.selectedUser == 'DEBTOR') {
      data['debtor'] = this.debtor;
      data['debtorToAssignor'] = this.debtorToAssigner;
    }
    if (this.underlyingGoods.value === 'Others') {
      data['extraUnderlyingGoods'] = this.extraUnderlingGoods;
    }

    this.factoringService.createTransaction(data).subscribe((res: any) => {
      console.log(res);
      this.router.navigateByUrl('factoring/transaction-preview');
    });
  }

  uploadTransaction(file: any) {
    let formdata = new FormData();

    formdata.append('file', file, file.name);
    const promise = this.factoringService.uploadTransaction(formdata);
    promise
      .then((res: any) => {
        this.router.navigateByUrl('factoring/transaction-preview');
      })
      .catch((err: any) => {
        console.log(err);
        if (err.status && err.status == 200) {
          this.router.navigateByUrl('factoring/transaction-preview');
        }
      });
  }

  findMinDate() {
    var today = this.currentDate.getTime();
    var invoicedate = new Date(this.dateReal.value).getTime();
    if (today > invoicedate) {
      return this.currentDate;
    } else {
      return this.dateReal.value;
    }
  }

  findToday(){
    let today:any = new Date();
    return today;
  }

  financeHandler(event: any) {
    this.finicingPeriod = event;
  }
  onRadioSelection(event: any) {
    console.log(event.value);
    this.radioOption = event.value;
  }

  esgCompliant(event: any) {
    console.log(event.checked);
    this.isESGCompliant = event.checked;
  }

  debtorHandler(event: any) {
    console.log(event);
    this.assignerToDebtor = event;
  }

  amountHandler(event: any) {
    console.log(event);
    this.amount = event;
  }

  invoiceHandler(event: any) {
    console.log(event);
    this.invoiceNum = event;
  }

  tenorHandler(event: any) {
    console.log(event);
    this.tenor = event;
  }

  gracePeriodhandler(event: any) {
    console.log(event, 'check');
    this.grace_period = event;
  }

  selectionAssigner(event: any) {
    console.log(event);
    this.assigner = event.value;
  }
  selectionDebtor(event: any) {
    console.log(event);
    this.debtor = event.value;
  }

  selectionGoods(event: any) {
    console.log(event);
    this.underlining_good = event;
    console.log(this.underlining_good);
  }

  selectionCharges(event: any) {
    console.log(event);
    this.charges_on = event;
    console.log(this.charges_on);
  }

  selectionCountryOrigin(event: any) {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].countryCode == event) {
        this.country_origin = this.countries[i].countryName;
      }
    }

    console.log(this.country_origin);
  }

  selectionCountryDischarge(event: any) {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].countryCode == event) {
        this.country_discharge = this.countries[i].countryName;
      }
    }
    console.log(this.country_discharge);
  }

  selectionCurrency(event: any) {
    console.log(event);
    this.selectedCurrency = event;
  }

  dateChangeHandler(event: any) {
    console.log(event);
  }

  selectedDateHandler(event: any) {
    console.log(event);
  }

  assignerHandler(event: any) {
    console.log(event);
    this.debtorToAssigner = event;
  }

  goodsHandler(event: any) {
    console.log(event);
    this.extraUnderlingGoods = event;
  }

  private _filter(value: string): string[] {
    const filterValue1 = value == '' ? '' : value.toLowerCase();

    console.log(
      this.countries.filter((option) =>
        option.countryName.toLowerCase().includes(filterValue1)
      )
    );
    return this.countries.filter((option) =>
      option.countryName.toLowerCase().includes(filterValue1)
    );
  }

  private _filter_origin(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    return this.countries.filter((option) =>
      option.countryName.toLowerCase().includes(filterValue)
    );
  }

  private _filter_goods(value: string): string[] {
    const filterValue3 = value.toLowerCase();
    console.log(filterValue3);
    return this.all_goods.filter((option) =>
      option.name.toLowerCase().includes(filterValue3)
    );
  }

  private _filter_currency(value: string): string[] {
    const filterValue4 = value.toLowerCase();
    console.log(filterValue4);
    return this.countries.filter((option) =>
      option.currency.toLowerCase().includes(filterValue4)
    );
  }

  // private _filter_assigner(value: string): string[] {
  //   const filterValue5 = value.toLowerCase();
  //   console.log(filterValue5)
  //   console.log(this.group_companies);
  //   return this.group_companies.filter(option => option.companyName.toLowerCase().includes(filterValue5));
  // }

  dischargeChange(e: any) {
    if (e.target.value === '') {
      this.filteredOptions = this.countries;
    } else {
      console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.filteredOptions = this.countries.filter((option) =>
        option.countryName.toLowerCase().includes(filterValue1)
      );
    }
  }

  originChange(e: any) {
    if (e.target.value === '') {
      this.countryOriginOptions = this.countries;
    } else {
      console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.countryOriginOptions = this.countries.filter((option) =>
        option.countryName.toLowerCase().includes(filterValue1)
      );
    }
  }

  currencyChange(e: any) {
    if (e.target.value === '') {
      this.currencyOptions = this.currencies;
    } else {
      console.log(e);
      const filterValue3 = e.target.value.toLowerCase();

      this.currencyOptions = this.currencies.filter((option) =>
        option.toLowerCase().includes(filterValue3)
      );
    }
  }

  goodsChange(e: any) {
    if (e.target.value === '') {
      this.underlyingOptions = this.all_goods;
    } else {
      console.log(e);
      const filterValue3 = e.target.value.toLowerCase();

      this.underlyingOptions = this.all_goods.filter((option) =>
        option.name.toLowerCase().includes(filterValue3)
      );
    }
  }

  getFinancingDate() {
    if (this.dueDate.value) {
      let startDate = new Date(this.dueDate.value);
      let endDate = new Date(this.currentDate);

      let differenceInTime = endDate.getTime() - startDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);

      this.finicingPeriod = `${Math.abs(Math.floor(differenceInDays))}`;
      return `${Math.abs(Math.floor(differenceInDays))}`;
    } else {
      return '';
    }
  }

  getTenorDate() {
    if (this.dueDate.value && this.dateReal.value) {
      let startDate = new Date(this.dueDate.value);
      let endDate = new Date(this.dateReal.value);

      let differenceInTime = endDate.getTime() - startDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      this.tenor = `${Math.abs(Math.floor(differenceInDays))}`;
      return `${Math.abs(Math.floor(differenceInDays))}`;
    } else {
      return '';
    }
  }
}
