import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { TransactionService } from '../../../services/transaction.service';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { Router } from '@angular/router';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
})
export class TransactionDetailsComponent implements OnInit,OnChanges{

  @Input() applicantFormValid:any;
  @Input() data:any;
  @Input() selectedProductType:any;
  @Input() userType:any;
  @Input() transactionDataInput:any;
  @Input() clone:any;
  @Output() finsihedDetails: EventEmitter<any>=new EventEmitter;
  @Input() subscriberType:any;

  currencyOptions:any;
  countryOptions:any;
  goodsTypeOptions:any;
  bgTypeOptions:any;
  portOfLoadingOptions:any;
  countryOfLoadingOptions:any;
  countryOfDischargeOptions:any;
  portOfDischargeOptions:any;
  finalDestinationOfGoodsOptions:any;

  currencies:any=[];
  countries:any=[];
  goods:any=[];
  bgTypes:any=[];
  load_ports:any=[];
  discharge_ports:any=[];

  amount:any;
  tenor:any;
  selectedCharegsOn:any;
  transactionData:any;
  fileName:any='';
  tenorFileName:any='';
  groupCompanies:any;
  companyName:any;
  otherGoodsSelected:boolean=false;
  otherBGTypeSelected:boolean=false;
  showFormCompletionError:boolean=false;
  otherBGType:FormControl;
  // otherTypeGoods:FormControl;

  detailsForm!: FormGroup;
  isView: boolean = false;
  filePathForView:any;

  constructor(
    public dialog: MatDialog,
    private apiService:ApiService,
    private transactionService:TransactionService,
    private router:Router,
    ){}

  ngOnInit(): void {
    if(!this.applicantFormValid){
      this.showFormCompletionError=false;
    }
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    console.log(this.groupCompanies);
    if(this.transactionDataInput){
      console.log("Got")
      console.log(this.transactionDataInput)
    }
    console.log(this.selectedProductType);
    this.apiService.getAllCountryCode().subscribe((res:any)=>{
      this.currencies=res.data[0].currencies;
      this.countries=res.data[0].countryNames.map(item=>{
        if(item.includes('\n')){
          console.log(item);
          item=item.replace('\n','');
          return item
        }
        else{
          return item
        }
      });
      this.currencyOptions = this.currencies.sort();
      this.countryOptions = this.countries;
      this.countryOfLoadingOptions = this.countries;
      this.countryOfDischargeOptions = this.countries;
      this.finalDestinationOfGoodsOptions=this.countries;
    });

    this.apiService.getAllGoods().subscribe((res:any)=>{
      this.goods=res.data[0];
      this.goodsTypeOptions = this.goods.filter(ele=>ele.name.toLowerCase()!=='none');
    })

    this.transactionService.getBGType().subscribe((res:any)=>{
      this.bgTypes=res.data;
      console.log(this.bgTypes)
      this.bgTypeOptions=this.bgTypes;
    });

    if(this.selectedProductType=='BILLAVALISATION'){
      this.userType='Applicant';
    }
    else{
      this.userType='Beneficiary';
    }
    // this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if(changes['selectedProductType']){
      this.selectedProductType=changes['selectedProductType'].currentValue;
      this.createForm();
      this.otherGoodsSelected=false;
    }
    if(changes['userType']){
      this.userType=changes['userType'].currentValue;
    }
    if(changes['data']){
      this.data=changes['data'].currentValue;
      console.log("changes",this.data)
      this.showFormCompletionError=false;
      this.getGroupCompany(this.data?.subsidaryId);
      if(this.detailsForm){
      this.detailsForm.controls['chargesOn'].setValue(this.data?.userType)
      if(this.data?.selector==="BILLAVALISATION"||this.data?.requirementType=="BILLAVALISATION"){
        this.detailsForm.controls['chargesOn'].setValue('Beneficiary');
      }
      }
    }
  }

  // Get Todays date
  getToday() {
    const today = new Date();
    return today;
  }

  // Find minimum date for bill maturity date
  findMinDate() {
    let billMaturityMinDate = new Date();
    // billMaturityMinDate.setDate(billMaturityMinDate.getDate()+1);
    const today = new Date().getTime();
    let billIssuanceDate = new Date(this.detailsForm.controls['billIssuanceDate'].value).getTime();
    // return billMaturityMinDate;

    if(this.detailsForm.controls['billIssuanceDate'].value){
      if(billMaturityMinDate.getTime() > billIssuanceDate){
        return billMaturityMinDate;
      }
      else {
        let currdate =new Date(this.detailsForm.controls['billIssuanceDate'].value);
        currdate.setDate(currdate.getDate());
        return currdate;
      }
    }
    else{
      return billMaturityMinDate
    }
  }

  // Calculate tenor from bill issuance date and bill maturity date
  getTenorDate() {
    if (this.detailsForm.controls['billMaturityDate'].value && this.detailsForm.controls['billIssuanceDate'].value) {
      let startDate = new Date(this.detailsForm.controls['billIssuanceDate'].value);
      let endDate = new Date(this.detailsForm.controls['billMaturityDate'].value);

      let differenceInTime = endDate.getTime() - startDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      this.tenor = `${Math.abs(Math.floor(differenceInDays))}`;
      this.detailsForm.controls['ussance'].setValue(this.tenor);
      return `${Math.abs(Math.floor(differenceInDays))}`;
    } else {
      this.detailsForm.controls['ussance'].setValue('');
      return '';
    }
  }

  getGroupCompany(id:any){
    console.log('=======================================',id)
    const companyDetails=this.groupCompanies?.businessDetails.find((item:any)=>item.id==id);
    console.log(companyDetails);
    this.companyName=companyDetails?.companyName;
    console.log(this.companyName);
  }

  createForm(){
    if(this.selectedProductType=='REFINANCE'){
      console.log("Creating Refinancing Form")
      this.detailsForm = new FormGroup({
        // Product Details
        currency : new FormControl(this.transactionDataInput?this.transactionDataInput.lCCurrency:'',[Validators.required]),
        amount: new FormControl(this.transactionDataInput?this.formatAmount(this.transactionDataInput.lCValue):'',[Validators.required,Validators.maxLength(11),this.amountValidator]),
        issuanceDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lCIssuingDate:'',[Validators.required]),
        transactionValidity: new FormControl(this.transactionDataInput?this.transactionDataInput.validity:'',[Validators.required]),
        typeOfGood: new FormControl(this.transactionDataInput?this.transactionDataInput.goodsType:'',[Validators.required]),
        otherTypeGoods: new FormControl(""),
        // Tenor Details
        originalUssance:new FormControl(this.transactionDataInput?this.transactionDataInput.originalTenorDays:'',[Validators.required,Validators.maxLength(5)]),
        financingPeriod: new FormControl(this.transactionDataInput?this.transactionDataInput.refinancingPeriod:'',[Validators.required,Validators.maxLength(5)]),
        lcMaturityDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lcMaturityDate:'',Validators.required),
        tenorFileUpload: new FormControl(''),
        // LC Details
        lcNumber:new FormControl(this.transactionDataInput?this.transactionDataInput.lcNumber:'',[Validators.required,Validators.maxLength(20)]),
        lcbeneBankCountry:new FormControl(this.transactionDataInput?this.transactionDataInput.lastBankCountry:'',Validators.required),
        lcbankSwiftCode:new FormControl(this.transactionDataInput?this.transactionDataInput.lastBeneSwiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        lcbankName:new FormControl(this.transactionDataInput?this.transactionDataInput.lastBeneBank:'',[Validators.required,Validators.maxLength(25)]),
        // Charges On Details
        chargesOn: new FormControl(this.transactionDataInput?this.transactionDataInput.chargesType:'',[Validators.required]),
        //  ESG Compliant Details
        esgCompliant: new FormControl(this.transactionDataInput?.isESGComplaint?this.convertBoolean(this.transactionDataInput?.isESGComplaint):false),
        // Final Destination of Goods
        finalDestinationOfGoods:new FormControl(this.transactionDataInput?this.transactionDataInput.finalDestinationOfGoods:'',[Validators.required]),
        // Shipment Details
        loadingCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingCountry:'',[Validators.required]),
        loadingPort: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingPort:'',[Validators.required]),
        dischargePort: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargePort:'',[Validators.required]),
        dischargeCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargeCountry:'',[Validators.required]),
        fileUpload:new FormControl('')
      }, {validators: portMatchValidator})
      if(this.transactionDataInput){
        this.detailsForm.controls['loadingPort'].enable();
        this.detailsForm.controls['dischargePort'].enable();
        this.getLoadingCountry({option:{value:this.transactionDataInput.loadingCountry}})
        this.detailsForm?.controls['loadingPort'].setValue(this.transactionDataInput.loadingPort);
        this.getDischargeCountry({option:{value:this.transactionDataInput.dischargeCountry}});
        this.detailsForm?.controls['dischargePort'].setValue(this.transactionDataInput.dischargePort);
        const filename = this.getFileNameFromURL(this.transactionDataInput?.invoiceUpload||'');
        console.log(filename);
        this.fileName=filename;
      }
      else{
        this.detailsForm.controls['loadingPort'].disable();
        this.detailsForm.controls['dischargePort'].disable();
      }
      if(this.detailsForm.controls['typeOfGood'].value.toLowerCase() === 'others'){
        this.otherGoodsSelected =true;
        this.detailsForm.controls['otherTypeGoods'].setValue(this.transactionDataInput?this.transactionDataInput?.otherGoodsType:"")
      }
    }
    else if(this.selectedProductType=='BANKGUARANTEE'){
      console.log("Creating Bank Guarantee Form")
      this.detailsForm = new FormGroup({
        // Product Details
        currency : new FormControl(this.transactionDataInput?this.transactionDataInput.lCCurrency:'',[Validators.required]),
        amount: new FormControl(this.transactionDataInput?this.formatAmount(this.transactionDataInput.lCValue):'',[Validators.required,Validators.maxLength(11),this.amountValidator]),
        issuanceDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lCIssuingDate:'',[Validators.required]),
        transactionValidity: new FormControl(this.transactionDataInput?this.transactionDataInput.validity:'',[Validators.required]),
        bgExpiryDate: new FormControl(this.transactionDataInput?this.transactionDataInput.bgExpiryDate:'',Validators.required),
        claimExpiryDate:new FormControl(this.transactionDataInput?this.transactionDataInput.claimExpiryDate:'',Validators.required),
        typeOfBG: new FormControl(this.transactionDataInput?this.transactionDataInput.bgType:'',Validators.required),
        // Tenor Details
        tenor: new FormControl(this.transactionDataInput?this.transactionDataInput.usanceDays:'',[Validators.required,Validators.maxLength(5)]),
        claimPeriod: new FormControl(this.transactionDataInput?this.transactionDataInput.paymentTerms:'',[Validators.required,Validators.maxLength(3)]),

        // Charges On Details
        chargesOn: new FormControl(this.transactionDataInput?this.transactionDataInput.chargesType:'',[Validators.required]),
        //  ESG Compliant Details
        esgCompliant: new FormControl(this.transactionDataInput?.isESGComplaint?this.convertBoolean(this.transactionDataInput.isESGComplaint):false),
        // Final Destination of Goods
        // finalDestinationOfGoods:new FormControl(this.transactionDataInput?this.transactionDataInput.finalDestinationOfGoods:'',[Validators.required]),
        fileUpload:new FormControl('')

      })
      if(this.transactionDataInput){
        const filename = this.getFileNameFromURL(this.transactionDataInput?.invoiceUpload||'');
        console.log(filename);
        this.fileName=filename;
      }
      if(this.transactionDataInput?.bgType.toLowerCase()=='others'){
        this.otherBGTypeSelected = true;
        this.otherBGType = new FormControl(this.transactionDataInput?.otherBGType?this.transactionDataInput?.otherBGType:'',[Validators.required])
        // this.otherBGType.setValue(this.transactionData?.otherBGType?this.transactionData?.otherBGType:'');
        console.log(this.transactionDataInput?.otherBGType)
        console.log(this.otherBGType.value);
      }
    }
    else if(this.selectedProductType=='BANKER'){
      console.log("Creating Bank Acceptance Form")
      this.detailsForm = new FormGroup({
        // Product Details
        currency : new FormControl(this.transactionDataInput?this.transactionDataInput.lCCurrency:'',[Validators.required]),
        amount: new FormControl(this.transactionDataInput?this.formatAmount(this.transactionDataInput.lCValue):'',[Validators.required,Validators.maxLength(11),this.amountValidator]),
        issuanceDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lCIssuingDate:'',[Validators.required]),
        lastShipmentDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lastShipmentDate:'',[Validators.required]),
        negotiationDate: new FormControl(this.transactionDataInput?this.transactionDataInput.negotiationDate:'',[Validators.required]),
        transactionValidity: new FormControl(this.transactionDataInput?this.transactionDataInput.validity:'',[Validators.required]),
        typeOfGood: new FormControl(this.transactionDataInput?this.transactionDataInput.goodsType:'',[Validators.required]),
        otherTypeGoods: new FormControl(""),
        // Tenor Details
        paymentTerms: new FormControl(this.transactionDataInput?this.transactionDataInput.paymentTerms:'',[Validators.maxLength(300)]),
        financingPeriod: new FormControl(this.transactionDataInput?this.transactionDataInput.refinancingPeriod:'',[Validators.required,Validators.maxLength(5)]),
        // Charges On Details
        chargesOn: new FormControl(this.transactionDataInput?this.transactionDataInput.chargesType:'',[Validators.required]),
        //  ESG Compliant Details
        esgCompliant: new FormControl(this.transactionDataInput?.isESGComplaint?this.convertBoolean(this.transactionDataInput.isESGComplaint):false),
        // Final Destination of Goods
        finalDestinationOfGoods:new FormControl(this.transactionDataInput?this.transactionDataInput.finalDestinationOfGoods:'',[Validators.required]),

        // Shipment Details
        loadingCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingCountry:'',[Validators.required]),
        loadingPort: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingPort:'',[Validators.required]),
        dischargePort: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargePort:'',[Validators.required]),
        dischargeCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargeCountry:'',[Validators.required]),
        fileUpload:new FormControl('')
      }, {validators: portMatchValidator})
      if(this.transactionDataInput){
        this.detailsForm.controls['loadingPort'].enable();
        this.detailsForm.controls['dischargePort'].enable();
        this.getLoadingCountry({option:{value:this.transactionDataInput.loadingCountry}})
        this.detailsForm?.controls['loadingPort'].setValue(this.transactionDataInput.loadingPort);
        this.getDischargeCountry({option:{value:this.transactionDataInput.dischargeCountry}});
        this.detailsForm?.controls['dischargePort'].setValue(this.transactionDataInput.dischargePort);
        const filename = this.getFileNameFromURL(this.transactionDataInput?.invoiceUpload||'');
        console.log(filename);
        this.fileName=filename;
      }
      else{
        this.detailsForm.controls['loadingPort'].disable();
        this.detailsForm.controls['dischargePort'].disable();
      }
      if(this.detailsForm.controls['typeOfGood'].value.toLowerCase() === 'others'){
        this.otherGoodsSelected =true;
        this.detailsForm.controls['otherTypeGoods'].setValue(this.transactionDataInput?this.transactionDataInput?.otherGoodsType:"")
       }
    }
    else if(this.selectedProductType=='BILLAVALISATION'){
      console.log("Creating Avalisation Form")
      this.detailsForm = new FormGroup({
        // Product Details
        currency : new FormControl(this.transactionDataInput?this.transactionDataInput.lCCurrency:'',[Validators.required]),
        amount: new FormControl(this.transactionDataInput?this.formatAmount(this.transactionDataInput.lCValue):'',[Validators.required,Validators.maxLength(11),this.amountValidator]),
        lastShipmentDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lastShipmentDate:'',[Validators.required]),
        transactionValidity: new FormControl(this.transactionDataInput?this.transactionDataInput.validity:'',[Validators.required]),
        typeOfGood: new FormControl(this.transactionDataInput?this.transactionDataInput.goodsType:'',[Validators.required]),
        otherTypeGoods: new FormControl(""),

        billIssuanceDate: new FormControl(this.transactionDataInput?this.transactionDataInput?.lCIssuingDate:'',Validators.required),
        billMaturityDate: new FormControl(this.transactionDataInput?this.transactionDataInput?.lcMaturityDate:'',Validators.required),
        typeOfBill: new FormControl(this.transactionDataInput?this.transactionDataInput.billType:'Avalized',Validators.required),
        ussance:new FormControl(this.transactionDataInput?this.transactionDataInput.usanceDays:'',[Validators.required]),

        // Charges On Details
        chargesOn: new FormControl(this.transactionDataInput?this.transactionDataInput.chargesType:'Beneficiary',[Validators.required]),
        //  ESG Compliant Details
        esgCompliant: new FormControl(this.transactionDataInput?.isESGComplaint?this.convertBoolean(this.transactionDataInput.isESGComplaint):false),
        // Final Destination of Goods
        finalDestinationOfGoods:new FormControl(this.transactionDataInput?this.transactionDataInput.finalDestinationOfGoods:'',[Validators.required]),

        // Shipment Details
        loadingCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingCountry:'',[Validators.required]),
        loadingPort: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingPort:'',[Validators.required]),
        dischargePort: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargePort:'',[Validators.required]),
        dischargeCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargeCountry:'',[Validators.required]),
        fileUpload:new FormControl('')
      }, {validators: portMatchValidator})
      if(this.transactionDataInput){
        this.detailsForm.controls['loadingPort'].enable();
        this.detailsForm.controls['dischargePort'].enable();
        this.getLoadingCountry({option:{value:this.transactionDataInput.loadingCountry}})
        this.detailsForm?.controls['loadingPort'].setValue(this.transactionDataInput.loadingPort);
        this.getDischargeCountry({option:{value:this.transactionDataInput.dischargeCountry}});
        this.detailsForm?.controls['dischargePort'].setValue(this.transactionDataInput.dischargePort);
        const filename = this.getFileNameFromURL(this.transactionDataInput?.invoiceUpload||'');
        console.log(filename);
        this.fileName=filename;
      }
      else{
        this.detailsForm.controls['loadingPort'].disable();
        this.detailsForm.controls['dischargePort'].disable();
      }
      if(this.detailsForm.controls['typeOfGood'].value.toLowerCase() === 'others'){
        this.otherGoodsSelected =true;
        this.detailsForm.controls['otherTypeGoods'].setValue(this.transactionDataInput?this.transactionDataInput?.otherGoodsType:"")
       }
    }
    else{
      console.log("Creating General Form")
      this.detailsForm = new FormGroup({
        // Product Details
        currency : new FormControl(this.transactionDataInput?this.transactionDataInput.lCCurrency:'',[Validators.required]),
        amount: new FormControl(this.transactionDataInput?this.formatAmount(this.transactionDataInput.lCValue):'',[Validators.required,Validators.maxLength(11),this.amountValidator]),
        issuanceDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lCIssuingDate:'',[Validators.required]),
        lastShipmentDate: new FormControl(this.transactionDataInput?this.transactionDataInput.lastShipmentDate:'',[Validators.required]),
        negotiationDate: new FormControl(this.transactionDataInput?this.transactionDataInput.negotiationDate:'',[Validators.required]),
        transactionValidity: new FormControl(this.transactionDataInput?this.transactionDataInput.validity:'',[Validators.required]),
        typeOfGood: new FormControl(this.transactionDataInput?this.transactionDataInput?.goodsType:'',[Validators.required]),
        otherTypeGoods: new FormControl(""),
        // Tenor Details
        ussance:new FormControl(this.transactionDataInput?this.transactionDataInput.usanceDays:'',[Validators.required,Validators.maxLength(5)]),
        paymentTerms:new FormControl(this.transactionDataInput?this.transactionDataInput.paymentTerms:'',[Validators.maxLength(300)]),
        // Charges On Details
        chargesOn: new FormControl(this.transactionDataInput?this.transactionDataInput?.chargesType:'',[]),
        //  ESG Compliant Details
        esgCompliant: new FormControl(this.transactionDataInput?.isESGComplaint?this.convertBoolean(this.transactionDataInput.isESGComplaint):false),
        // Final Destination of Goods
        finalDestinationOfGoods:new FormControl(this.transactionDataInput?this.transactionDataInput.finalDestinationOfGoods:'',[Validators.required]),

        // Shipment Details
        loadingCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingCountry:'',[Validators.required]),
        loadingPort: new FormControl(this.transactionDataInput?this.transactionDataInput.loadingPort:'',[Validators.required]),
        dischargePort: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargePort:'',[Validators.required]),
        dischargeCountry: new FormControl(this.transactionDataInput?this.transactionDataInput.dischargeCountry:'',[Validators.required]),

        fileUpload:new FormControl('')
      }, {validators: portMatchValidator})
      if(this.transactionDataInput){

        // this.detailsForm.controls['chargesOn'].setValue(
        //   this.transactionDataInput.chargesType
        // );
        this.detailsForm.controls['loadingPort'].enable();
        this.detailsForm.controls['dischargePort'].enable();
        this.getLoadingCountry({option:{value:this.transactionDataInput.loadingCountry}})
        this.detailsForm?.controls['loadingPort'].setValue(this.transactionDataInput.loadingPort);
        this.getDischargeCountry({option:{value:this.transactionDataInput.dischargeCountry}});
        this.detailsForm?.controls['dischargePort'].setValue(this.transactionDataInput.dischargePort);
        const filename = this.getFileNameFromURL(this.transactionDataInput?.invoiceUpload||'');
        console.log(filename);
        this.fileName=filename;
      }
      else{
        this.detailsForm.controls['loadingPort'].disable();
        this.detailsForm.controls['dischargePort'].disable();
      }
      if(this.detailsForm.controls['typeOfGood'].value.toLowerCase() === 'others'){
        this.otherGoodsSelected =true;
        this.detailsForm.controls['otherTypeGoods'].setValue(this.transactionDataInput?this.transactionDataInput?.otherGoodsType:"")
      }
    }

  }

  amountInputHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;

    if((charCode>31 && (charCode<48 || charCode>57))&&charCode!=46){
      return false;
    }
    else if(charCode==46){
      if(this.detailsForm.controls['amount'].value.split('').includes('.')){
        return false;
      }
      else{
        return true;
      }
    }
    return true;
  }

  pasteHandler(e:any){
    const data=e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;


    if (data === '' || re.test(data)) {
      // console.log(true)
      return true
    }

    // console.log(false)
    return false;
  }

  onlyDigitHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;

    if((charCode>31 && (charCode<48 || charCode>57))){
      return false;
    }
    return true;
  }

  onlyNonZeroDigitHandler(e:any) {
    const charCode = e.which?e.which:e.keyCode;
    let input = e.target.value;
    // console.log("Code",charCode);
    // console.log("Value",input);
    if(input.length!=0&&(charCode>31 && (charCode<48 || charCode>57))){

     return false;
    }
    else if(input.length==0&&charCode==48){
      return false;
    }
    return true;
  }

  nonZeroHandlerData(e:any,control:any) {
    console.log(e.target.value);
    let input = e.target.value;
    if(this.detailsForm.controls[control].value==0){
      this.detailsForm.controls[control].setValue('');
      console.log("true")
    }else{
      console.log("false");
    }
  }

  currencyChange(e:any){
    if (e.target.value === '') {
      this.currencyOptions = this.currencies;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.currencyOptions = this.currencies.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  countryChange(e:any){
    if (e.target.value === '') {
      this.countryOptions = this.countries;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.countryOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  goodsTypeChange(e:any){
    if (e.target.value === '') {
      this.goodsTypeOptions = this.goods;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.goodsTypeOptions = this.goods.filter((option) =>
        option.name.toLowerCase().includes(filterValue1)
      );
    }
  }

  bgTypeSelected(e:any){
    if(e.option.value.toLowerCase()==='others'){
      this.otherBGTypeSelected = true;
      this.otherBGType = new FormControl('',Validators.required);
    }
    else{
      this.otherBGTypeSelected = false;
    }
  }

  getGoodsSelected(e:any) {
    console.log(e.option.value);
    if(e.option.value.toLowerCase()=='others'){
      this.otherGoodsSelected=true;
      this.detailsForm?.controls['otherTypeGoods'].setValidators([Validators.required]);
    }
    else{
      this.otherGoodsSelected=false;
      this.detailsForm?.controls['otherTypeGoods'].clearValidators();
    }
  }

  bgTypeChange(e:any){
    if(e.target.value === ''){
      this.bgTypeOptions = this.bgTypes;
    }
    else{
      const filterValue3 = e.target.value.toLowerCase();

      this.bgTypeOptions = this.bgTypes.filter((option)=>
      option.bgtype.toLowerCase().includes(filterValue3))

    };
  }

  countryOfloadingChange(e:any){
    if (e.target.value === '') {
      this.countryOfLoadingOptions = this.countries;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.countryOfLoadingOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  portOfloadingChange(e:any){
    if (e.target.value === '') {
      this.portOfLoadingOptions = this.load_ports;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.portOfLoadingOptions = this.load_ports.filter((option) =>
        option.port.toLowerCase().includes(filterValue1)||option.code.toLowerCase().includes(filterValue1)
      );
    }
  }

  countryOfdischargeChange(e:any){
    if (e.target.value === '') {
      this.countryOfDischargeOptions = this.countries;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.countryOfDischargeOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  portOfdischargeChange(e:any){
    if (e.target.value === '') {
      this.portOfDischargeOptions = this.discharge_ports;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.portOfDischargeOptions = this.discharge_ports.filter((option) =>
        option.port.toLowerCase().includes(filterValue1)||option.code.toLowerCase().includes(filterValue1)
      );
    }
  }

  getLoadingCountry(e:any){
    console.log(e)
    this.detailsForm.controls['loadingPort'].setValue('');
    this.detailsForm.controls['loadingPort'].enable();
    this.transactionService.getLoadingPort(e.option.value).subscribe((res:any)=>{
      console.log(res.data);
      this.load_ports=res.data.map(item=>{
        return item
      });
      console.log(this.load_ports);
      this.portOfLoadingOptions=this.load_ports;

    })
  }

  getDischargeCountry(e:any){
    this.detailsForm.controls['dischargePort'].setValue('');
    this.detailsForm.controls['dischargePort'].enable();
    this.transactionService.getLoadingPort(e.option.value).subscribe((res:any)=>{
      console.log(res.data);
      this.discharge_ports=res.data.map(item=>{
        return item
      });
      this.portOfDischargeOptions=this.discharge_ports;
    })
  }

  // Final Destination of Goods Field Autocomplete Search Function
  destinationCountryOfGoods(e:any){
    if (e.target.value === '') {
      this.finalDestinationOfGoodsOptions = this.countries;
    } else {
      // console.log(e);
      const filterValue8 = e.target.value.toLowerCase();

      this.finalDestinationOfGoodsOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue8)
      );
    }
  }

  isESGCompliant(e:any){
    // console.log(e);
  }

  fileChangeEvent(e:any){
    // console.log(e);
  }

  uploadMaturityDates(file:any) {
    // .jpg,.jpeg,.png,.pdf,.xlsx,.csv
    const allowedExtensions = ['.jpg','.jpeg','.png','.pdf','.xlsx','.csv'];
    const fileExtension = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      console.log(file);
      this.detailsForm.controls['tenorFileUpload'].setErrors(null)
      this.tenorFileName=file.name;
      if(file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
        let base64 = reader?.result;
        this.detailsForm.controls['tenorFileUpload'].setValue(`${file.name}|${base64}`)
        };
        let type = file.type.split('/');
        this.detailsForm.controls['tenorFileUpload'].setValue(type[1]);
      }
    }else{
      this.detailsForm.controls['tenorFileUpload'].setErrors({invalid:true})
    }

  }

  uploadTransaction(file:any){
    // console.log(e);
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff'];
    const fileExtension = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      this.detailsForm.controls['fileUpload'].setErrors(null)
      this.fileName=file.name;
      if(file){
        this.isView = true;
        console.log('file', file)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log(reader)
        reader.onload = (e) => {
        let base64 = reader?.result;
        console.log(base64)
        this.filePathForView=base64;
        this.detailsForm.controls['fileUpload'].setValue(`${file.name}|${base64}`)
        };
        let type = file.type.split('/');
        this.detailsForm.controls['fileUpload'].setValue(type[1]);
      }
    }else{
      this.detailsForm.controls['fileUpload'].setErrors({invalid:true})
    }
    console.log(file);

  }

  deleteSelectedDateFile() {
    console.log("clicked");
    this.tenorFileName='';
    this.detailsForm.controls['tenorFileUpload'].setValue('');
  }

  deleteSelectedFile(){
		console.log("clicked");
    this.fileName='';
    if (this.transactionDataInput?.invoiceUpload){
      this.transactionDataInput.invoiceUpload=null;
    }
      this.detailsForm.controls['fileUpload'].setValue('');
	}

  save(){
    console.log(this.detailsForm)
    if(this.data.requirementType=="CONFIRMANDDISCOUNT"&&this.data.userType=='Beneficiary'){
      console.log("Entered ",this.data.userType )
      console.log(this.detailsForm.controls['chargesOn'])

      console.log(this.detailsForm.get('chargesOn').clearValidators())
      this.detailsForm.get('chargesOn').clearValidators();

      console.log(this.detailsForm.controls['chargesOn'])
    }
    console.log(this.detailsForm.controls)
    console.log(this.detailsForm.valid)
    console.log(this.detailsForm.hasError('portMismatch'))

    // if (this.detailsForm.hasError('portMismatch'))
    //   this.detailsForm.controls['dischargePort'].setErrors([{'portMismatch': true}]);
    // else{
    //   this.detailsForm.controls['dischargePort']?.setErrors(null);
    //   console.log(this.data);
    // }


    if(this.detailsForm.valid && this.applicantFormValid){
      this.showFormCompletionError=false;
      if(this.selectedProductType=='REFINANCE'){
        this.transactionData={
        // Product Details
        "lCCurrency":this.detailsForm.controls['currency'].value,
        "lCValue":this.parseAmount({target:{value:this.detailsForm.controls['amount'].value}}),
        "lCIssuingDate":_moment(this.detailsForm.controls['issuanceDate'].value).format('YYYY-MM-DD'),
        "validity":_moment(this.detailsForm.controls['transactionValidity'].value).format('YYYY-MM-DD'),
        "goodsType":this.detailsForm.controls['typeOfGood'].value,
        // Tenor Details
        "originalTenorDays":this.detailsForm.controls['originalUssance'].value,
        "refinancingPeriod":this.detailsForm.controls['financingPeriod'].value,
        "lcMaturityDate":_moment(this.detailsForm.controls['lcMaturityDate'].value).format('YYYY-MM-DD'),
        "refinanceLcUpload":this.detailsForm.controls['tenorFileUpload'].value,
        "refinanceLcUploadType":'',
        // LC Details
        "lcNumber":this.detailsForm.controls['lcNumber'].value,
        "lastBankCountry":this.detailsForm.controls['lcbeneBankCountry'].value,
        "lastBeneSwiftCode":this.detailsForm.controls['lcbankSwiftCode'].value,
        "lastBeneBank":this.detailsForm.controls['lcbankName'].value,
        // Charges On Details
        "chargesType":this.detailsForm.controls['chargesOn'].value,
        //  ESG Compliant Details
        "isESGComplaint":this.detailsForm.controls['esgCompliant'].value==true?'Yes':'No',
        // Final Destination Of Goods
        "finalDestinationOfGoods":this.detailsForm.controls['finalDestinationOfGoods'].value,

        // Shipment Details
        "loadingCountry":this.detailsForm.controls['loadingCountry'].value,
        "loadingPort":this.detailsForm.controls['loadingPort'].value,
        "dischargeCountry":this.detailsForm.controls['dischargeCountry'].value,
        "dischargePort":this.detailsForm.controls['dischargePort'].value,
        "invoiceUpload":this.detailsForm.controls['fileUpload'].value,
        }
        if(this.otherGoodsSelected){
          this.transactionData.otherGoodsType=this.detailsForm.controls['otherTypeGoods'].value;
        }
      }
      else if(this.selectedProductType=='BANKGUARANTEE'){
        this.transactionData={
          // Product Details
          "lCCurrency":this.detailsForm.controls['currency'].value,
          "lCValue":this.parseAmount({target:{value:this.detailsForm.controls['amount'].value}}),
          "lCIssuingDate":_moment(this.detailsForm.controls['issuanceDate'].value).format('YYYY-MM-DD'),
          "validity":_moment(this.detailsForm.controls['transactionValidity'].value).format('YYYY-MM-DD'),
          "bgType":this.detailsForm.controls['typeOfBG'].value,
          "bgExpiryDate":_moment(this.detailsForm.controls['bgExpiryDate'].value).format('YYYY-MM-DD'),
          "claimExpiryDate":_moment(this.detailsForm.controls['claimExpiryDate'].value).format('YYYY-MM-DD'),
          // Tenor Details
          "usanceDays":this.detailsForm.controls['tenor'].value,
          "paymentTerms":this.detailsForm.controls['claimPeriod'].value,
          // Charges On Details
          "chargesType":this.detailsForm.controls['chargesOn'].value,
          //  ESG Compliant Details
          "isESGComplaint":this.detailsForm.controls['esgCompliant'].value,
          // Final Destination Of Goods
          // "finalDestinationOfGoods":'this.detailsForm.controls['finalDestinationOfGoods'].value',
          "invoiceUpload":this.detailsForm.controls['fileUpload'].value,
          }
          if(this.otherBGTypeSelected) {
            this.transactionData.otherBGType=this.otherBGType.value
          }
      }
      else if(this.selectedProductType=='BANKER'){
        this.transactionData={
          // Product Details
          "lCCurrency":this.detailsForm.controls['currency'].value,
          "lCValue":this.parseAmount({target:{value:this.detailsForm.controls['amount'].value}}),
          "lCIssuingDate":_moment(this.detailsForm.controls['issuanceDate'].value).format('YYYY-MM-DD'),
          "lastShipmentDate":_moment(this.detailsForm.controls['lastShipmentDate'].value).format('YYYY-MM-DD'),
          "negotiationDate":_moment(this.detailsForm.controls['negotiationDate'].value).format('YYYY-MM-DD'),
          "validity":_moment(this.detailsForm.controls['transactionValidity'].value).format('YYYY-MM-DD'),
          "goodsType":this.detailsForm.controls['typeOfGood'].value,
          // Tenor Details
          "paymentTerms":this.detailsForm.controls['paymentTerms'].value,
          "refinancingPeriod":this.detailsForm.controls['financingPeriod'].value,
          // Charges On Details
          "chargesType":this.detailsForm.controls['chargesOn'].value,
          //  ESG Compliant Details
          "isESGComplaint":this.detailsForm.controls['esgCompliant'].value,
          // Final Destination Of Goods
          "finalDestinationOfGoods":this.detailsForm.controls['finalDestinationOfGoods'].value,

          // Shipment Details
          "loadingCountry":this.detailsForm.controls['loadingCountry'].value,
          "loadingPort":this.detailsForm.controls['loadingPort'].value,
          "dischargeCountry":this.detailsForm.controls['dischargeCountry'].value,
          "dischargePort":this.detailsForm.controls['dischargePort'].value,
          "invoiceUpload":this.detailsForm.controls['fileUpload'].value,
          }
          if(this.otherGoodsSelected){
            this.transactionData.otherGoodsType=this.detailsForm.controls['otherTypeGoods'].value;
          }
      }
      else if(this.selectedProductType=='BILLAVALISATION'){
        this.transactionData={
          // Product Details
          "lCCurrency":this.detailsForm.controls['currency'].value,
          "lCValue":this.parseAmount({target:{value:this.detailsForm.controls['amount'].value}}),
          "lastShipmentDate":_moment(this.detailsForm.controls['lastShipmentDate'].value).format('YYYY-MM-DD'),
          "lCIssuingDate":_moment(this.detailsForm.controls['billIssuanceDate'].value).format('YYYY-MM-DD'),
          "lcMaturityDate":_moment(this.detailsForm.controls['billMaturityDate'].value).format('YYYY-MM-DD'),
          "billType":this.detailsForm.controls['typeOfBill'].value,
          "usanceDays":this.detailsForm.controls['ussance'].value,
          "validity":_moment(this.detailsForm.controls['transactionValidity'].value).format('YYYY-MM-DD'),
          "goodsType":this.detailsForm.controls['typeOfGood'].value,
          // Charges On Details
          "chargesType":this.detailsForm.controls['chargesOn'].value,
          //  ESG Compliant Details
          "isESGComplaint":this.detailsForm.controls['esgCompliant'].value,
          // Final Destination Of Goods
          "finalDestinationOfGoods":this.detailsForm.controls['finalDestinationOfGoods'].value,

          // Shipment Details
          "loadingCountry":this.detailsForm.controls['loadingCountry'].value,
          "loadingPort":this.detailsForm.controls['loadingPort'].value,
          "dischargeCountry":this.detailsForm.controls['dischargeCountry'].value,
          "dischargePort":this.detailsForm.controls['dischargePort'].value,
          "invoiceUpload":this.detailsForm.controls['fileUpload'].value,
          }
          if(this.otherGoodsSelected){
            this.transactionData.otherGoodsType=this.detailsForm.controls['otherTypeGoods'].value;
          }
      }
      else{
        this.transactionData={
          // Product Details
          "lCCurrency":this.detailsForm.controls['currency'].value,
          "lCValue":this.parseAmount({target:{value:this.detailsForm.controls['amount'].value}}),
          "lCIssuingDate":_moment(this.detailsForm.controls['issuanceDate'].value).format('YYYY-MM-DD'),
          "lastShipmentDate":_moment(this.detailsForm.controls['lastShipmentDate'].value).format('YYYY-MM-DD'),
          "negotiationDate":_moment(this.detailsForm.controls['negotiationDate'].value).format('YYYY-MM-DD'),
          "validity":_moment(this.detailsForm.controls['transactionValidity'].value).format('YYYY-MM-DD'),
          "goodsType":this.detailsForm.controls['typeOfGood'].value,
          // Tenor Details
          "usanceDays":this.detailsForm.controls['ussance'].value,
          "paymentTerms":this.detailsForm.controls['paymentTerms'].value,
          // Charges On Details
          "chargesType":this.detailsForm.controls['chargesOn'].value,
          //  ESG Compliant Details
          "isESGComplaint":this.detailsForm.controls['esgCompliant'].value,
          // Final Destination Of Goods
          "finalDestinationOfGoods":this.detailsForm.controls['finalDestinationOfGoods'].value,

          // Shipment Details
          "loadingCountry":this.detailsForm.controls['loadingCountry'].value,
          "loadingPort":this.detailsForm.controls['loadingPort'].value,
          "dischargeCountry":this.detailsForm.controls['dischargeCountry'].value,
          "dischargePort":this.detailsForm.controls['dischargePort'].value,
          "invoiceUpload":this.detailsForm.controls['fileUpload'].value,
        }
        if(this.otherGoodsSelected){
          this.transactionData.otherGoodsType=this.detailsForm.controls['otherTypeGoods'].value;
        }
      }

      console.log(this.transactionData);
      this.finsihedDetails.emit(this.transactionData);
      if(this.transactionDataInput){
        if(this.clone){
          let newData={...this.data,...this.transactionData};
          if (this.subscriberType === 'BANK') {
            newData = { ...newData, userType: null };
          }
          this.transactionService.transactionDraft(newData).subscribe((res:any)=>{
            console.log(res);
            this.router.navigateByUrl(`/customer/transactions/new/transaction-preview?transactionId=${res.data[0].transactionId}`)
          })
        }else{
          let newData={...this.data,...this.transactionData,"transactionId":this.transactionDataInput.transactionId};
          if (this.subscriberType === 'BANK') {
            newData = { ...newData, userType: null };
          }
          console.log('ND',newData)
          this.transactionService.update(newData).subscribe((res:any)=>{console.log(res);
            this.router.navigateByUrl(`/customer/transactions/new/transaction-preview?transactionId=${res.data[0].transactionId}`)
          })
        }

      }
      else{
        let newData={...this.data,...this.transactionData};
        if(this.subscriberType === 'BANK'){
          newData = {...newData,userType:null}
        }
        this.transactionService.transactionDraft(newData).subscribe((res:any)=>{
          console.log(res);
          this.router.navigateByUrl(`/customer/transactions/new/transaction-preview?transactionId=${res.data[0].transactionId}`)
        })
      }

    }
    else{
      this.showFormCompletionError=true;
    }
  }

  checkAutocomplete(e:any,formName:string){
    let formValue = this.detailsForm.controls[formName].value;
    console.log(formValue,formName)
    if(
      formName=="lcbeneBankCountry"||
      formName=="loadingCountry"||
      formName=="dischargeCountry"||
      formName=="finalDestinationOfGoods"
      ) {
        let isExists = this.countries.find((ele: any) => {
          console.log(ele.toLowerCase() === formValue?.toLowerCase())
          return ele.toLowerCase() === formValue?.toLowerCase();
        });
        if(isExists){
          console.log(this.countries.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase()));
          this.detailsForm.controls[formName].setValue(this.countries.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase()));
          if(formName=="loadingCountry") {
            this.getLoadingCountry({option:{value:this.countries.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase())}});
          }
          if(formName=="dischargeCountry") {
            this.getDischargeCountry({option:{value:this.countries.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase())}});
          }
          this.detailsForm.controls[formName].setErrors(null);
        }
        else{
          this.detailsForm.controls[formName].setErrors({ required: true });
        }
      }

      if(formName == 'dischargePort'){
        let isExists = this.portOfDischargeOptions.find((port:any)=> {
          console.log((port.port).toLowerCase(),formValue?.toLowerCase());
          return ((port.code+' - '+port.port).toLowerCase() === formValue?.toLowerCase());
        })
        console.log(isExists);
        // if(isExits){}
        if (!isExists) {
          this.detailsForm.controls[formName].setErrors({ required: true });
        } else {
          this.detailsForm.controls[formName].setErrors(null);
        }
      }

      if(formName == 'loadingPort'){
        let isExists = this.portOfLoadingOptions.find((port:any)=> {
          console.log((port.port).toLowerCase(),formValue?.toLowerCase());
          return ((port.code+' - '+port.port).toLowerCase() === formValue?.toLowerCase());
        })
        console.log(isExists);
        // if(isExits){}
        if (!isExists) {
          this.detailsForm.controls[formName].setErrors({ required: true });
        } else {
          this.detailsForm.controls[formName].setErrors(null);
        }
      }

      if(
        formName=='currency'
      ){
        let isExists = this.currencies.find((ele: any) => {
          console.log(ele.toLowerCase() === formValue?.toLowerCase())
          return ele.toLowerCase() === formValue?.toLowerCase();
        });
        if(isExists){
          console.log(this.currencies.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase()));
          this.detailsForm.controls[formName].setValue(this.currencies.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase()));
          this.detailsForm.controls[formName].setErrors(null);
        }
        else{
          this.detailsForm.controls[formName].setErrors({ required: true });
        }
      }

      if(
        formName=='typeOfBG'
      ){
        let isExists = this.bgTypes.find((ele: any) => {
          console.log(ele.bgtype.toLowerCase() === formValue?.toLowerCase())
          return ele.bgtype.toLowerCase() === formValue?.toLowerCase();
        });
        if(isExists){
          console.log(this.bgTypes.find((ele: any) =>ele.bgtype.toLowerCase() === formValue?.toLowerCase()));
          this.detailsForm.controls[formName].setValue(this.bgTypes.find((ele: any) =>ele.bgtype.toLowerCase() === formValue?.toLowerCase()).bgtype);
          this.detailsForm.controls[formName].setErrors(null);
        }
        else{
          this.detailsForm.controls[formName].setErrors({ required: true });
        }
      }

      if(
        formName=='typeOfGood'
      ) {
        let isExists = this.goods.find((ele: any) => {
          console.log(ele.name.toLowerCase() === formValue?.toLowerCase())
          return ele.name.toLowerCase() === formValue?.toLowerCase();
        });
        if(isExists){
          console.log(this.goods.find((ele: any) =>ele.name.toLowerCase() === formValue?.toLowerCase()));
          this.detailsForm.controls[formName].setValue(this.goods.find((ele: any) =>ele.name.toLowerCase() === formValue?.toLowerCase()).name);
          this.detailsForm.controls[formName].setErrors(null);
        }
        else{
          this.detailsForm.controls[formName].setErrors({ required: true });
        }
      }

  }


      convertBoolean(e){
        console.log(e)
        if(e?.toLowerCase() == true || e?.toLowerCase() == 'true' ||e?.toLowerCase() == 'yes' ){
          return true
        }else{
          return false
        }
      }

  openView() {
    const filterpopup = this.dialog.open(InvoiceViewComponent,{
      data:{
        name:this.fileName,
        path:this.filePathForView
      }
    });
  }

  openEditView(path:any){
    window.open(path,'_blank');
  }

  selectedPort(e:any,formName:any){
    if (this.detailsForm.hasError('portMismatch'))
      this.detailsForm.controls[formName].setErrors([{'portMismatch': true}]);
    else
      this.detailsForm.controls[formName].setErrors(null);
  }
  restrictKeys(event:any){
    console.log(event.keyCode)
    return (event.keyCode >=96 && event.keyCode <=105)||(event.keyCode >= 48 && event.keyCode <= 57)|| event.keyCode == 8|| event.keyCode == 190|| event.keyCode == 110 ||event.keyCode==9
  }

  revalidateDate(){
    let startDate = new Date(_moment(this.detailsForm.controls['billIssuanceDate'].value).format("YYYY-MM-DD"));
    let endDate = new Date(_moment(this.detailsForm.controls['billMaturityDate'].value).format("YYYY-MM-DD"));
    if(startDate &&endDate ){
      const timeDiff = ((endDate).getTime()) - ((startDate).getTime());
      if(timeDiff>=0){
      const daysDiff =(timeDiff / (1000 * 3600  *24))+1; // 1000 ms/s  3600 s/h  24 h/day = 86400000 ms/day
       this.detailsForm.controls['ussance'].setValue( `${daysDiff}`);
      }else{
      this.detailsForm.controls['ussance'].setValue( ``);
    }
    }else{
      this.detailsForm.controls['ussance'].setValue( ``);
    }

  }

  realDate(date:any){
    const d = new Date(date);
    try {
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes() - d.getTimezoneOffset()
      ).getTime();
    } catch (e) {
      return '';
    }
    // This will return an ISO string matching your local time.
  }

  getFileNameFromURL(url:any) {
   // Use the last part of the URL after the last slash as the filename
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];

  // Remove any query string parameters from the filename
  const filenameWithParams = lastPart.split('?')[0];

  // Remove any percent-encoded characters from the filename
  const filename = filenameWithParams.replace(/%+/g, '');

  return filename;
  }
  //revamp

  amountValidator(control: FormControl) {
    const value = control.value.replace(/,/g, '');
    const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
    return isValid ? null : { invalidAmount: true };
  }

  formatAmount(value: any) {
    const number = +(value?.toString())?.replace(/[^0-9.]/g, '');
    return isNaN(number) ? '' :number>0? number.toLocaleString('en-US',{
      maximumFractionDigits:2,
    }):'';
  }

  parseAmount(e: any) {
    console.log(e)
    let target=e.target.value||''
    return target?.replace(/,/g, '');
  }

  onBlur() {
    const value = this.parseAmount({target:{value:this.detailsForm.controls['amount'].value}});
this.detailsForm.controls['amount'].setValue(this.formatAmount(value));

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
  if (formGroup.get('loadingPort').value !== formGroup.get('dischargePort').value)
    return null;
  else
    return {portMismatch: true};
};
