import { Component, OnInit } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LatestAcceptedTransactionsComponent } from '../../popup/latest-accepted-transactions/latest-accepted-transactions/latest-accepted-transactions.component';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { Location } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-place-quote',
  templateUrl: './place-quote.component.html',
  styleUrls: ['./place-quote.component.scss']
})
export class PlaceQuoteComponent implements OnInit{

  transactionId:any;
  product!:any;
  transactionDetails:any;
  quoteForm!:FormGroup;

  preview:boolean=false;
  previewData:any;
  productName:any;

  productsTypes:any[] =[
    { name:'Confirmation',value:'CONFIRMATION'},
    { name:'Discounting',value:'DISCOUNTING'},
    { name:'Confirmation & Discounting',value:'CONFIRMANDDISCOUNT'},
    { name:'Refinancing',value:'REFINANCE'},
    { name:'Bankers Acceptance',value:'BANKER'},
    { name:'Bank Guarantee',value:'BANKGUARANTEE'},
    { name:'Avalisation',value:'BILLAVALISATION'}
  ]

  constructor(
    public dialog:MatDialog,
    private router: Router,
    private route:ActivatedRoute,
    private transactionService:TransactionService,
    private bankService:BankUnderwriterService,
    private location:Location,

    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param=>{
      this.transactionId=param['transactionId'];
      this.bankService.getQuotation({
        "page":0,
        "size":5,
        "transactionId":this.transactionId,
        "status":["DRAFT"]
        }).subscribe((res:any)=>{
          console.log(res);
          let data=res.data;
          let transactionDetails=data.filter((item:any)=>item?.transactionId==this.transactionId);
          console.log(transactionDetails);
          const qdetails = transactionDetails[0]?.quotationsList[0];
          console.log(qdetails);
          if(transactionDetails[0].quotationsList.length>0){

          this.previewData=qdetails;
          this.createPlatform();
          }
        })
      this.transactionService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
        this.transactionDetails=res.data[0];
        console.log(this.transactionDetails);
        this.product=this.transactionDetails?.requirementType;
        this.findProductName(this.product);
        this.createPlatform();
      })
    });
  }

  findProductName(name:any) {
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value===name
    )
    console.log(product)
    this.productName=product.name.toUpperCase();
  }

  numberInputHandler(e:any,controlName:string){
    console.log(e);
    const charCode = e.which?e.which:e.keyCode;

    if((charCode>31 && (charCode<48 || charCode>57))&&charCode!=46){
      return false;
    }
    else if(charCode==46){
      if(this.quoteForm.controls[controlName].value.split('').includes('.')){
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

  createPlatform(){
    if(this.product==='CONFIRMATION'){
      console.log("Creating Confirmation Form");
      this.quoteForm= new FormGroup({
        confirmationCommision: new FormControl(this.previewData?this.previewData?.confirmationCharges:'',[Validators.required]),
        confCharge: new FormControl(this.previewData?(this.previewData?.confChgsIssuanceToMatur==true?'2':'1'):'1',[Validators.required]),
        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
         othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
    else if(this.product==='DISCOUNTING'){
      console.log("Creating DISCOUNTING Form");
      this.quoteForm= new FormGroup({
        applicableBenchmark:new FormControl(this.previewData?this.previewData?.applicableBenchmark:''),
        commentsBenchmark:new FormControl(this.previewData?this.previewData?.commentsBenchmark:'',[]),
        discountingCharges:new FormControl(this.previewData?this.previewData?.discountingCharges:'',[Validators.required]),
        negotiationChargesFixed:new FormControl(this.previewData?this.previewData?.negotiationChargesFixed:'',[Validators.required]),
        negotiationChargesPerct:new FormControl(this.previewData?this.previewData?.negotiationChargesPerct:'',[Validators.required]),


        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
         othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
    else if(this.product==='CONFIRMANDDISCOUNT'){
      console.log("Creating CONFIRMANDDISCOUNT Form");
      this.quoteForm= new FormGroup({
        confirmationCommision: new FormControl(this.previewData?this.previewData?.confirmationCharges:'',[Validators.required]),
        confCharge: new FormControl(this.previewData?(this.previewData?.confChgsIssuanceToMatur==true?'2':'1'):'1',[Validators.required]),
        applicableBenchmark:new FormControl(this.previewData?this.previewData?.applicableBenchmark:''),
        commentsBenchmark:new FormControl(this.previewData?this.previewData?.commentsBenchmark:'',[]),
        discountingCharges:new FormControl(this.previewData?this.previewData?.discountingCharges:'',[Validators.required]),
        negotiationChargesFixed:new FormControl(this.previewData?this.previewData?.negotiationChargesFixed:'',[Validators.required]),
        negotiationChargesPerct:new FormControl(this.previewData?this.previewData?.negotiationChargesPerct:'',[Validators.required]),


        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
         othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
    else if(this.product==='REFINANCE'){
      console.log("Creating REFINANCE Form");
      this.quoteForm= new FormGroup({
        applicableBenchmark:new FormControl(this.previewData?this.previewData?.applicableBenchmark:''),
        commentsBenchmark:new FormControl(this.previewData?this.previewData?.commentsBenchmark:'',[]),
        refinancingCharges:new FormControl(this.previewData?this.previewData?.refinancingCharges:'',[Validators.required]),

        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
         othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
    else if(this.product==='BANKER'){
      console.log("Creating BANKER Form");
      this.quoteForm= new FormGroup({
        applicableBenchmark:new FormControl(this.previewData?this.previewData?.applicableBenchmark:''),
        commentsBenchmark:new FormControl(this.previewData?this.previewData?.commentsBenchmark:'',[]),
        bankAcceptCharges:new FormControl(this.previewData?this.previewData?.bankAcceptCharges:'',[Validators.required]),
        negotiationChargesFixed:new FormControl(this.previewData?this.previewData?.negotiationChargesFixed:'',[Validators.required]),
        negotiationChargesPerct:new FormControl(this.previewData?this.previewData?.negotiationChargesPerct:'',[Validators.required]),

        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
         othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
    else if(this.product==='BANKGUARANTEE'){
      console.log("Creating BANKGUARANTEE Form");
      this.quoteForm= new FormGroup({
        confirmationCommision: new FormControl(this.previewData?this.previewData?.confirmationCharges:'',[Validators.required]),
        bankCharge: new FormControl(this.previewData?(this.previewData?.confChgsIssuanceToexp==true?'1':'2'):'1',[Validators.required]),
        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
         othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
    else{
      console.log("Creating Avalising Form");
      this.quoteForm= new FormGroup({
        applicableBenchmark:new FormControl(this.previewData?this.previewData?.applicableBenchmark:''),
        commentsBenchmark:new FormControl(this.previewData?this.previewData?.commentsBenchmark:'',[]),
        discountingCharges:new FormControl(this.previewData?this.previewData?.discountingCharges:'',[Validators.required]),

        otherCharges: new FormControl(this.previewData?this.previewData?.otherCharges:'',[this.amountValidator]),
        typeOfCharge: new FormControl(this.previewData?this.previewData?.typeOfCharge:''),
        minimumTransactionCharge: new FormControl(this.previewData?this.previewData?.minTransactionCharges:'',[this.amountValidator]),
        bankQuoteValidity: new FormControl(this.previewData?this.previewData?.validity:'',[Validators.required]),
        othertnc: new FormControl(this.previewData?this.previewData?.termConditionComments:'')
      });
    }
  }

  latestacceptedtransactions(){
    // this.dialog.open(LatestAcceptedTransactionsComponent)
  }


  save(){
    if(this.quoteForm.valid){
      if(this.product==='CONFIRMATION'){
        console.log("Sending CONFIRMATION Quote Data");
        let data={
            "transactionId":this.transactionId,
            "requirementType":this.transactionDetails.requirementType,
            "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
            "lCValue":this.transactionDetails.lCValue,
            "lCCurrency":this.transactionDetails.lCCurrency,
            "usanceDays":this.transactionDetails.usanceDays,
            // Quote Fields
            "confirmationCharges":this.quoteForm.controls['confirmationCommision'].value,
            "confChgsIssuanceToMatur":this.quoteForm.controls['confCharge'].value==2?true:false,
            "confChgsIssuanceToNegot":this.quoteForm.controls['confCharge'].value==1?true:false,


            // Common Quote Fields
            "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
            "chargesType":this.quoteForm.controls['typeOfCharge'].value,
            "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
            "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
            "termConditionComments":this.quoteForm.controls['othertnc'].value,
            // "confChgsMatur":0,
            // "confChgsNegot":0
        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
      else if(this.product==='DISCOUNTING'){
        console.log("Sending DISCOUNTING Quote Data");
        let data={
            "transactionId":this.transactionId,
            "requirementType":this.transactionDetails.requirementType,
            "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
            "lCValue":this.transactionDetails.lCValue,
            "lCCurrency":this.transactionDetails.lCCurrency,
            "usanceDays":this.transactionDetails.usanceDays,
            // Quote Fields
            "applicableBenchmark":this.quoteForm.controls['applicableBenchmark'].value,
            "commentsBenchmark":this.quoteForm.controls['commentsBenchmark'].value,
            "discountingCharges":this.quoteForm.controls['discountingCharges'].value,
            "negotiationChargesFixed": this.parseAmount({ target: { value: this.quoteForm.controls['negotiationChargesFixed'].value } }),
            "negotiationChargesPerct": this.quoteForm.controls['negotiationChargesPerct'].value,
            // Common Quote Fields
            "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
            "chargesType":this.quoteForm.controls['typeOfCharge'].value,
            "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
            "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
            "termConditionComments":this.quoteForm.controls['othertnc'].value,

        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
      else if(this.product==='CONFIRMANDDISCOUNT'){
        console.log("Sending CONFIRMANDDISCOUNT Quote Data");
        let data={
          "transactionId":this.transactionId,
          "requirementType":this.transactionDetails.requirementType,
          "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
          "lCValue":this.transactionDetails.lCValue,
          "lCCurrency":this.transactionDetails.lCCurrency,
          "usanceDays":this.transactionDetails.usanceDays,
          // Quote Fields
          "confirmationCharges":this.quoteForm.controls['confirmationCommision'].value,
          "confChgsIssuanceToMatur":this.quoteForm.controls['confCharge'].value==2?true:false,
          "confChgsIssuanceToNegot":this.quoteForm.controls['confCharge'].value==1?true:false,
          "applicableBenchmark":this.quoteForm.controls['applicableBenchmark'].value,
          "commentsBenchmark":this.quoteForm.controls['commentsBenchmark'].value,
          "discountingCharges":this.quoteForm.controls['discountingCharges'].value,
          "negotiationChargesFixed": this.parseAmount({ target: { value: this.quoteForm.controls['negotiationChargesFixed'].value } }),
          "negotiationChargesPerct": this.quoteForm.controls['negotiationChargesPerct'].value,
          // Common Quote Fields
          "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
          "chargesType":this.quoteForm.controls['typeOfCharge'].value,
          "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
          "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
          "termConditionComments":this.quoteForm.controls['othertnc'].value,

        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
      else if(this.product==='REFINANCE'){
        console.log("Sending REFINANCE Quote Data");
        let data={
          "transactionId":this.transactionId,
          "requirementType":this.transactionDetails.requirementType,
          "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
          "lCValue":this.transactionDetails.lCValue,
          "lCCurrency":this.transactionDetails.lCCurrency,
          "usanceDays":this.transactionDetails.usanceDays,
          // Quote Fields
          "applicableBenchmark":this.quoteForm.controls['applicableBenchmark'].value,
          "commentsBenchmark":this.quoteForm.controls['commentsBenchmark'].value,
          "refinancingCharges":this.quoteForm.controls['refinancingCharges'].value,
          // Common Quote Fields
          "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
          "chargesType":this.quoteForm.controls['typeOfCharge'].value,   //needs to check
          "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
          "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
          "termConditionComments":this.quoteForm.controls['othertnc'].value,

        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
      else if(this.product==='BANKER'){
        console.log("Sending BANKER Quote Data");
        let data={
          "transactionId":this.transactionId,
          "requirementType":this.transactionDetails.requirementType,
          "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
          "lCValue":this.transactionDetails.lCValue,
          "lCCurrency":this.transactionDetails.lCCurrency,
          "usanceDays":this.transactionDetails.usanceDays,
          // Quote Fields
          "applicableBenchmark":this.quoteForm.controls['applicableBenchmark'].value,
          "commentsBenchmark":this.quoteForm.controls['commentsBenchmark'].value,
          "bankAcceptCharges":this.quoteForm.controls['bankAcceptCharges'].value,
          "negotiationChargesFixed": this.parseAmount({ target: { value: this.quoteForm.controls['negotiationChargesFixed'].value } }),
          "negotiationChargesPerct": this.quoteForm.controls['negotiationChargesPerct'].value,
          // Common Quote Fields
          "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
          "chargesType":this.quoteForm.controls['typeOfCharge'].value,  //needs to check
          "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
          "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
          "termConditionComments":this.quoteForm.controls['othertnc'].value,

        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
      else if(this.product==='BANKGUARANTEE'){
        console.log("Sending BANKGUARANTEE Quote Data");
        let data={
          "transactionId":this.transactionId,
          "requirementType":this.transactionDetails.requirementType,
          "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
          "lCValue":this.transactionDetails.lCValue,
          "lCCurrency":this.transactionDetails.lCCurrency,
          "usanceDays":this.transactionDetails.usanceDays,
          // Quote Fields
          "confirmationCharges":this.quoteForm.controls['confirmationCommision'].value,
          "confChgsIssuanceToexp":this.quoteForm.controls['bankCharge'].value==1?true:false,
          "confChgsIssuanceToClaimExp":this.quoteForm.controls['bankCharge'].value==2?true:false,
          // Common Quote Fields
          "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
          "chargesType":this.quoteForm.controls['typeOfCharge'].value,
          "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
          "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
          "termConditionComments":this.quoteForm.controls['othertnc'].value,

        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
      else{
        console.log("Sending Avalisation Quote Data");
        let data={
          "transactionId":this.transactionId,
          "requirementType":this.transactionDetails.requirementType,
          "lCIssuanceBank":this.transactionDetails.lCIssuanceBank,
          "lCValue":this.transactionDetails.lCValue,
          "lCCurrency":this.transactionDetails.lCCurrency,
          "usanceDays":this.transactionDetails.usanceDays,
          // Quote Fields
          "applicableBenchmark":this.quoteForm.controls['applicableBenchmark'].value,
          "commentsBenchmark":this.quoteForm.controls['commentsBenchmark'].value,
          "discountingCharges":this.quoteForm.controls['discountingCharges'].value,
          // Common Quote Fields
          "otherCharges":this.parseAmount({ target: { value: this.quoteForm.controls['otherCharges'].value } }),
          "chargesType":this.quoteForm.controls['typeOfCharge'].value,
          "minTransactionCharges":this.parseAmount({ target: { value: this.quoteForm.controls['minimumTransactionCharge'].value } }),
          "validity":_moment(this.quoteForm.controls['bankQuoteValidity'].value).format('YYYY-MM-DD'),
          "termConditionComments":this.quoteForm.controls['othertnc'].value,

        }
        console.log(data);
        this.bankService.draftQuotation(data).subscribe((res:any)=>{
          console.log(res);
          if(res.success){
            this.previewData=res.data[0].quotationsList[0];
            this.preview=true;
          }
        });
      }
    }
  }

  getToday() {
    const today = new Date();
    return today;
  }


  editQuote(quoteId:any){
    console.log(quoteId);
    this.preview=false;
    // this.router.navigateByUrl(`/bank-underwriter/edit-details?quoteId=${quoteId}`)
  }

  goBackPage(){
    this.location.back();
  }

  goBack(){
    this.preview=false;
  }

  confirmQuotation(transactionId:any,quoteId:any){
    console.log(transactionId,quoteId);
    let data={
      "transactionId": transactionId,
      "quotationId": quoteId
    }
    this.bankService.saveQuotation(data).subscribe((res:any)=>{
      console.log(res);
      if(res.success){
        this.bankService.getCreditUpdate.next(true)
        this.router.navigateByUrl('/bank-underwriter/success');
      }
    })
  }

  cancelQuote(transactionId:any,quoteId:any){
    let data={
      "transactionId": transactionId,
      "quotationId": quoteId
    }
    this.bankService.cancelQuotation(data).subscribe((res:any)=>{
      if(res.success){
        this.router.navigateByUrl('/bank-underwriter/new-transaction')
      }
    })
  }

  amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  console.log(value)
  const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
  return isValid ? null : null;
}

formatAmount(value: string) {
  const number = +value.replace(/[^0-9.]/g, '');
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
  const value = this.parseAmount({ target: { value: this.quoteForm.controls[formName].value } });
  this.quoteForm.controls[formName].setValue(this.formatAmount(value));
  console.log(this.quoteForm.controls[formName])
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
