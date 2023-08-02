import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FactoringService } from '../../services/factoring.service';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { filter, map, Observable, startWith } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

const moment = _moment;
@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent {
  assigner = [
    {name: 'Assigner', value : '1'},
    {name: 'Self', value : '2'}
  ];
  goods = [
    {name: 'Automobile', value : '1'},
    {name: 'Machinery', value : '2'}
  ];
  charges = [
    {name: 'ASSIGNER', value : '1'},
    {name: 'SELF', value : '2'}
  ];
  origin = [
    {name: 'India', value : '1'},
    {name: 'Bangladesh', value : '2'}
  ];
  discharge = [
    {name: 'India', value : '1'},
    {name: 'Bangladesh', value : '2'}
  ];
  countries:any=[];
  all_goods:any=[];
  group_companies:any=[];
  radioOption:any;
  selectedAssigner:any;
  selectedDebtor:any;
  assignee:any;
  assignerToDebtor:any;
  debtorToAssigner:any;
  debtor:any;
  amount:any;
  invoiceNum:any;
  date:any;
  tenor:any;
  due_date:any;
  underlining_good:any;
  charges_on:any;
  currencyValue:any;
  grace_period:any;
  country_origin:any;
  country_discharge:any;
  trasaction_validity:any;
  isESGCompliant:boolean=false;
  selectedUser:any;
  dateReal = new FormControl('', [Validators.required]);
  dueDate = new FormControl('', [Validators.required]);
  validityDate = new FormControl('', [Validators.required]);
  filteredOptions: Observable<any[]>;
  currencyOptions: Observable<any[]>;
  countryOriginOptions: Observable<any[]>;
  underlyingOptions:Observable<any[]>;
  countryDischarge = new FormControl('');
  countryOrigin = new FormControl('');
  underlyingGoods = new FormControl('');
  currency=new FormControl('');

  @Input() product:any;
  @Output() back:any = new EventEmitter();


  constructor( private router:Router,
    private factoringService:FactoringService,
    private apiService:ApiService,private adminService :AdminService) { }

  ngOnInit(): void {
    this.selectedUser='ASSIGNER';
    this.adminService.getAllCountryCode().subscribe((res:any)=>{
      this.countries = res.data[0].countryList;
      console.log(this.countries);
    });
    this.adminService.getAllGoods().subscribe((res:any)=>{
      this.all_goods = res.data[0];
      console.log(this.all_goods);
    });
    this.filteredOptions = this.countryDischarge.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.underlyingOptions = this.underlyingGoods.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_goods(value || '')),
    );

    this.countryOriginOptions = this.countryOrigin.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_origin(value || '')),
    );

    this.currencyOptions = this.currency.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_currency(value || '')),
    );
    
    // this.factoringService.getCompany().subscribe((res:any)=>{
    //   console.log(res);
    //   this.group_companies=res;
    // })

  }
  preview(){
    this.back.emit();
  }

  transaction(){
    this.router.navigateByUrl('/factoring/transaction');
  }

  save(){
    
    this.date= moment(this.dateReal.value).format('YYYY-MM-DD');
    this.due_date= moment(this.dueDate.value).format('YYYY-MM-DD');
    this.trasaction_validity=moment(this.validityDate.value).format('YYYY-MM-DD');
    
    var data={
      "factoringProductType":this.product.toUpperCase(),
      "factoringUserType":this.selectedUser,
      "status":"PENDING",
      "amount":this.amount,
      "invoiceNumber":this.invoiceNum,
      "date":this.date,
      "Tenour":this.tenor,
      "dueDate":this.due_date,
      "chargesOn":this.charges_on,
      "gracePeriod":this.grace_period,
      "countryOrigin":this.country_origin,
      "countryDischarge":this.country_discharge,
      "transactionValidityDate":this.trasaction_validity,
      "isESGCompliant":this.isESGCompliant,
      "underlingGoods":this.underlining_good,
      // "assigner":this.assigner,
      // "assignerToDebtor":this.assignerToDebtor
    };
    if(this.selectedUser=='ASSIGNER'){
      data["assigner"]=this.assigner;
      data["assignerToDebtor"]=this.assignerToDebtor;
    }
    else if(this.selectedUser=='DEBTOR'){
      data["debtor"]=this.debtor;
      data["debtorToAssigner"]=this.debtorToAssigner;
    }

    // this.factoringService.createTransaction(data).subscribe((res:any)=>{
    //   console.log(res);
      this.router.navigateByUrl('factoring/transaction-preview');
    // });
  }

  uploadTransaction(file : any){
    let formdata = new FormData();

    formdata.append('file', file, file.name);
    // const promise = this.factoringService.uploadTransaction(formdata);
    
  //  promise.then(
  //   (res:any)=>{
  //     this.router.navigateByUrl('factoring/transaction-preview');
  //   }
  //   ).catch((err : any) => {
  //     console.log(err)
  //     if(err.status && err.status == 200){
  //       this.router.navigateByUrl('factoring/transaction-preview');
  //     }
  //     }  
  //   )
  }

  onRadioSelection(event:any){
    console.log(event.value);
    this.radioOption=event.value;
  }

  esgCompliant(event:any){
    console.log(event.checked);
    this.isESGCompliant=event.checked;
  }

  debtorHandler(event:any){
    console.log(event);
    this.assignerToDebtor=event;
  }

  amountHandler(event:any){
    console.log(event);
    this.amount=event;
  }

  invoiceHandler(event:any){
    console.log(event);
    this.invoiceNum=event;
  }

  tenorHandler(event:any){
    console.log(event);
    this.tenor=event;
  }

  gracePeriodhandler(event:any){
    console.log(event);
    this.grace_period=event;
  }

  selectionAssigner(event:any){
    console.log(event);
    this.assigner=event.value;
  }
  selectionDebtor(event:any){
    console.log(event);
    this.debtor=event.value;
  }

  selectionGoods(event:any){
    console.log(event);
    this.underlining_good=event;
    console.log(this.underlining_good);
  }

  selectionCharges(event:any){
    console.log(event);
    this.charges_on=event;
    console.log(this.charges_on);
  }

  selectionCountryOrigin(event:any){
    for(let i=0;i<this.countries.length;i++){
      if(this.countries[i].countryCode==event){
        this.country_origin=this.countries[i].countryName;
      }
    }
    
    console.log(this.country_origin);
  }

  selectionCountryDischarge(event:any){
    for(let i=0;i<this.countries.length;i++){
      if(this.countries[i].countryCode==event.value){
        this.country_discharge=this.countries[i].countryName;
      }
    }
    console.log(this.country_discharge);
  }

  dateChangeHandler(event:any){
    console.log(event);
  }

  selectedDateHandler(event:any){
    console.log(event)
  }

  assignerHandler(event:any){
    console.log(event);
    this.debtorToAssigner=event;
  }

  selectionCurrency($event){
    console.log(event);
    this.currencyValue =event;
  }

  private _filter(value: string): string[] {
    const filterValue1 = value.toLowerCase();
    console.log(this.countries.filter(option => option.countryName.toLowerCase().includes(filterValue1)))
    return this.countries.filter(option => option.countryName.toLowerCase().includes(filterValue1));
  }

  private _filter_origin(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue)
    return this.countries.filter(option => option.countryName.toLowerCase().includes(filterValue));
  }

  private _filter_goods(value: string): string[] {
    const filterValue3 = value.toLowerCase();
    console.log(filterValue3)
    return this.all_goods.filter(option => option.name.toLowerCase().includes(filterValue3));
  }

  private _filter_currency(value: string): string[] {
    const filterValue3 = value.toLowerCase();
    console.log(filterValue3)
    return this.countries.filter(option => option.currency.toLowerCase().includes(filterValue3));
  }
  
}
