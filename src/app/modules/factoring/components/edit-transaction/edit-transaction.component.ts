import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FactoringService } from '../../services/factoring.service';
import { FormControl, Validators } from '@angular/forms';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.scss'],
})
export class EditTransactionComponent implements OnInit,AfterViewInit {
  @ViewChild('amount')amount:any;
  currencyOptions: any;
  country = [
    { name: 'India', value: '1' },
    { name: 'Bhutan', value: '2' },
  ];
  bcountry = [
    { name: 'India', value: '1' },
    { name: 'Bhutan', value: '2' },
  ];
  product = [
    { name: 'Product1', value: '1' },
    { name: 'Product2', value: '2' },
  ];
  service = [
    { name: 'Service1', value: '1' },
    { name: 'Service2', value: '2' },
  ];
  port = [
    { name: 'Port1', value: '1' },
    { name: 'Port2', value: '2' },
  ];
  discharge = [
    { name: 'Port of Discharge1', value: '1' },
    { name: 'Port of Discharge2', value: '2' },
  ];

  charges = [
    { name: 'ASSIGNOR', value: '1' },
    { name: 'DEBTOR', value: '2' },
  ];
  assigner = [
    { name: 'Assigner', value: '1' },
    { name: 'Self', value: '2' },
  ];
  debtor = [
    { name: 'Debtor', value: '1' },
    { name: 'Self', value: '2' },
  ];

  updatedData: any = {};
  assigners: FormControl;
  debtors: FormControl;
  date: FormControl;
  dueDate: FormControl;
  validityDate: FormControl;
  countryOrigin: FormControl;
  countryDischarge: FormControl;
  goods: FormControl;
  radioOption: any;
  transactId?: any;
  countries: any = [];
  currencies:any=[];
  all_goods: any = [];
  group_companies: any = [];
  viewData?: any;
  selectedUser?: any;
  chargesOn: any;
  selectedCurrency: any;
  currency = new FormControl('');
  currentDate: any;
  dateReal = new FormControl('', [Validators.required]);
  finicingPeriod: string;
  tenor: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private factoringService: FactoringService
  ) {}
  ngAfterViewInit(): void {
    console.log(this.amount,'qqqqqqqqqqqq')
  }

  ngOnInit() {
    this.transactId = this.route.snapshot.paramMap.get('id');
    this.currentDate = new Date();
    console.log(this.transactId);
    this.editTransaction(this.transactId);

    this.apiService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.currencies = res.data[0].currencies;
      console.log(this.countries);
      this.currencyOptions = this.currencies;
    });
    this.apiService.getAllGoods().subscribe((res: any) => {
      this.all_goods = res.data[0];
      console.log(this.all_goods);
    });
    this.factoringService.getCompany().subscribe((res: any) => {
      console.log(res);
      this.group_companies = res;
      console.log(this.group_companies);
    });

    this.date = new FormControl('', []);
    this.dueDate = new FormControl('', []);
    this.countryOrigin = new FormControl('', []);
    this.countryDischarge = new FormControl('', []);
    this.validityDate = new FormControl('', []);
    this.goods = new FormControl('', []);
    this.chargesOn = new FormControl('', []);
    this.assigners = new FormControl('', []);
    this.debtors = new FormControl('', []);
  }

  getFinancingDate() {
    if (this.dueDate.value) {
      let startDate = new Date(this.dueDate.value);
      let endDate = new Date(this.currentDate);
      let differenceInTime = endDate.getTime() - startDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      this.finicingPeriod = `${Math.abs(Math.floor(differenceInDays))}`;
      this.updatedData.finicingPeriod = `${Math.abs(
        Math.floor(differenceInDays)
      )}`;

      return `${Math.abs(Math.floor(differenceInDays))}`;
    } else {
      return '';
    }
  }
  findMaxDate() {
    console.log();
    return new Date(this.dueDate.value);
  }

  findMinDate(){
    var today = this.currentDate.getTime();
    var invoicedate = new Date(this.date.value).getTime();
    if (today > invoicedate) {
      return this.currentDate;
    } else {
      return this.date.value;
    }
  }
  
  findToday(){
    return new Date();
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

  selectionCurrency(event: any, from?: string) {
    if (from === 'autoComplete') {
      this.selectedCurrency = event.option.value;
      this.updatedData.currency = this.selectedCurrency;
      return;
    }
    this.selectedCurrency = event;
  }
  financeHandler(event: any) {
    this.finicingPeriod = event;
  }

  editTransaction(id: any) {
    this.factoringService.getTransactionById(id).subscribe((res: any) => {
      this.viewData = res;
      console.log(this.viewData,'sssssssssssssssssss');      
      const incomingDate: string =  this.viewData.date;
      const incomingDueDate: string =  this.viewData.dueDate;
      const [day, month, year]: any = incomingDate.split('-');
      const [dueDay, dueMonth, dueYear]: any = incomingDueDate.split('-');
      const dateObj: Date = new Date(+year, month - 1, +day);
      const dueDateObj: Date = new Date(+dueYear, dueMonth - 1, +dueDay);
      console.log(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      const convertDate = _moment(dateObj).format('YYYY-MM-DD');
      const convertDueDate = _moment(dueDateObj).format('YYYY-MM-DD');
      this.selectedUser = this.viewData.factoringUserType;
      this.date.setValue(convertDate);
      this.dueDate.setValue(convertDueDate);
      this.validityDate.setValue(this.viewData.transactionValidityDate);
      this.countryOrigin.setValue(this.viewData.countryOrigin);
      this.countryDischarge.setValue(this.viewData.countryDischarge);
      this.goods.setValue(this.viewData.underlyingGoods);
      this.chargesOn.setValue(this.viewData.chargesOn);
      this.assigners.setValue(this.viewData.assignor);
      this.debtors.setValue(this.viewData.debtor);
      this.currency.setValue(this.viewData.currency);
      this.updatedData = this.viewData;
      if (this.viewData.underlyingGoods === 'Others') {
        if (this.viewData.extraUnderlyingGoods) {
          this.updatedData.extraUnderlyingGoods =
            this.viewData.extraUnderlyingGoods;
        }
      }
      // this.amount?.form2.setValue(this.amount.formatAmount(this.viewData.amount.toString()))
      setTimeout(()=>{
        this.amount?.form2.setValue(this.amount.formatAmount(this.viewData.amount.toString()))
      },500)
    });
  }

  updatedInvoice(event: any) {
    console.log(event);
    if (this.viewData.invoiceNumber != event) {
      this.updatedData.invoiceNumber = event;
    }
    console.log(this.updatedData);
  }

  updateDate(event: any) {
    var date = moment(event.value).format('DD-MM-YYYY');

    if (this.viewData.date != date) {
      this.updatedData.date = date;
    }
  }

  updateDueDate(event: any) {
    var date = moment(event.value).format('DD-MM-YYYY');
    if (this.viewData.dueDate != date) {
      this.updatedData.dueDate = date;
    }
  }

  updateValidityDate(event: any) {
    var date = moment(event.value).format('YYYY-MM-DD');
    if (this.viewData.validityDate != date) {
      this.updatedData.validityDate = date;
    }
  }

  updatedTenor(event: any) {
    if (this.viewData.tenor != event) {
      this.updatedData.tenor = event;
    }
  }

  updatedGracePeriod(event: any) {
    if (this.viewData.gracePeriod != event) {
      this.updatedData.gracePeriod = event;
    }
  }

  updatedDebtor(event: any) {
    if (this.viewData.assignorToDebtor != event) {
      this.updatedData.assignorToDebtor = event;
    }
  }

  updatedAssigner(event: any) {
    if (this.viewData.debtorToAssignor != event) {
      this.updatedData.debtorToAssignor = event;
    }
  }

  assignerChange(event: any) {
    if (
      this.viewData.factoringUserType == 'ASSIGNOR' &&
      this.viewData.assignor != event.value
    ) {
      this.updatedData.assignor = event.value;
    } else if (this.viewData.factoringUserType == 'DEBTOR' && this.updatedData.factoringUserType!='DEBTOR') {
      this.updatedData.debtorToAssignor = event.value;
    }
    else{
      this.updatedData.assignor = event.value;
    }
  }

  debtorChange(event: any) {
    if (
      this.viewData.factoringUserType == 'DEBTOR' &&
      this.viewData.debtor != event.value
    ) {
      this.updatedData.debtor = event.value;
    } else if (this.viewData.factoringUserType == 'ASSIGNOR') {
      this.updatedData.assignorToDebtor = event.value;
    }
  }

  onRadioSelection(event: any) {
    if (this.viewData.factoringUserType != event.value) {
      this.updatedData.factoringUserType = event.value;
    }
  }

  toggleESG(event: any) {
    if (this.viewData.isESGCompliant != event.checked) {
      this.updatedData.isESGCompliant = event.checked;
    }
  }

  chargesChange(event: any) {
    if (this.viewData.chargesOn != event.value) {
      this.updatedData.chargesOn = event.value;
    }
  }

  goodsChange(event: any) {
    if (this.viewData.underlyingGoods != event.value) {
      this.updatedData.underlyingGoods = event.value;
      if (this.updatedData?.underlyingGoods !== 'Others') {
        if (this.updatedData?.extraUnderlyingGoods) {
          delete this.updatedData.extraUnderlyingGoods;
        }
      }
    }
  }

  countryOriginChange(event: any) {
    if (this.viewData.countryOrigin != event.value) {
      this.updatedData.countryOrigin = event.value;
    }
  }

  countryDischargeChange(event: any) {
    if (this.viewData.countryDischarge != event.value) {
      this.updatedData.countryDischarge = event.value;
    }
  }

  updatedAmount(event: any) {
    if (this.viewData.amount != event) {
      this.updatedData.amount = event;
    }
  }

  save() {
    console.log(this.updatedData, '<======');
    // To be changed(To delete the unwanted object values when depending on choice of user type) Date:08/02/2023
    if(this.updatedData.factoringUserType=='DEBTOR'){
     // delete this.updatedData?.assignerToDebtor;
     // delete this.updatedData?.assigner;
    }
    else if(this.updatedData.factoringUserType=='ASSIGNOR'){
     // delete this.updatedData?.debtor;
     // delete this.updatedData?.debtorToAssigner;
    }
    console.log(this.updatedData)

    this.updatedData.id = parseInt(this.transactId);
    this.factoringService
      .createTransaction(this.updatedData)
      .subscribe((res: any) => {
        this.router.navigateByUrl('/factoring/transaction-preview');
      });
  }
  cancel() {
    this.router.navigateByUrl('/factoring/transaction-preview');
  }
  goodsHandler(e: any) {
    console.log(e);
    this.updatedData.extraUnderlingGoods = e;
  }
  getTenorDate() {
    if (this.dueDate.value && this.date.value) {
      let startDate = new Date(this.dueDate.value);
      let endDate = new Date(this.date.value);

      let differenceInTime = endDate.getTime() - startDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      this.tenor = `${Math.abs(Math.floor(differenceInDays))}`;
      this.updatedData.tenor = `${Math.abs(Math.floor(differenceInDays))}`;
      return `${Math.abs(Math.floor(differenceInDays))}`;
    } else {
      return '';
    }
  }
}
