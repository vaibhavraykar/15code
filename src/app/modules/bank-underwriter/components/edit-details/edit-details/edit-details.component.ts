import { Component, OnInit } from "@angular/core";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { LatestAcceptedTransactionsComponent } from "../../../popup/latest-accepted-transactions/latest-accepted-transactions/latest-accepted-transactions.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BankUnderwriterService } from "../../../services/bank-underwriter.service";
import * as _moment from "moment";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-details",
  templateUrl: "./edit-details.component.html",
  styleUrls: ["./edit-details.component.scss"],
})
export class EditDetailsComponent implements OnInit {
  transactionId: any;
  product!: any;
  transactionDetails: any;
  quoteForm!: FormGroup;
  previewData!: any;
  quoteID: any;
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
    public dialog: MatDialog,
    private router: Router,
    private bankService: BankUnderwriterService,
    private route: ActivatedRoute,
    private location:Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.quoteID = param["quoteId"];
      this.bankService.getQuotationById(this.quoteID).subscribe((res: any) => {
        console.log(res.data);
        this.transactionDetails = res.data[0];
        this.transactionId = this.transactionDetails.transactionId;
        this.product = this.transactionDetails?.requirementType;
        this.findProductName(this.product);
        this.previewData = this.transactionDetails?.quotationsList[0];
        this.createPlatform();
      });
      // this.transactionService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
      //   this.transactionDetails=res.data[0];
      //   console.log(this.transactionDetails);
      //   this.product=this.transactionDetails?.requirementType;
      //   this.createPlatform();
      // })
    });
  }

  goBack(){
    this.location.back();
  }

  findProductName(name:any) {
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value===name
    )
    console.log(product)
    this.productName= product.name.toUpperCase();
  }

  getToday(){
    return (new Date());
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

  createPlatform() {
    if (this.product === "CONFIRMATION") {
      console.log("Creating Confirmation Form");
      this.quoteForm = new FormGroup({
        confirmationCommision: new FormControl(
          this.previewData ? this.previewData?.confirmationCharges : "",
          [Validators.required]
        ),
        confCharge: new FormControl(
          this.previewData
            ? this.previewData?.confChgsIssuanceToMatur == true
              ? '2'
              : '1'
            : "1",[Validators.required]
        ),
        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",
          [this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    } else if (this.product === "DISCOUNTING") {
      console.log("Creating DISCOUNTING Form");
      this.quoteForm = new FormGroup({
        applicableBenchmark: new FormControl(
          this.previewData ? this.previewData?.applicableBenchmark : ""
        ),
        commentsBenchmark: new FormControl(
          this.previewData ? this.previewData?.commentsBenchmark : "",
          []
        ),
        discountingCharges: new FormControl(
          this.previewData ? this.previewData?.discountingCharges : "",
          [Validators.required]
        ),
        negotiationChargesFixed: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.negotiationChargesFixed) : "",
          [Validators.required,this.amountValidator]
        ),
        negotiationChargesPerct: new FormControl(
          this.previewData ? this.previewData?.negotiationChargesPerct : "",
          [Validators.required]
        ),

        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",
          [this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    } else if (this.product === "CONFIRMANDDISCOUNT") {
      console.log("Creating CONFIRMANDDISCOUNT Form");
      this.quoteForm = new FormGroup({
        confirmationCommision: new FormControl(
          this.previewData ? this.previewData?.confirmationCharges : "",
          [Validators.required]
        ),
        confCharge: new FormControl(
          this.previewData
            ? this.previewData?.confChgsIssuanceToMatur == true
              ? '2'
              : '1'
            : "1",[Validators.required]
        ),
        applicableBenchmark: new FormControl(
          this.previewData ? this.previewData?.applicableBenchmark : ""
        ),
        commentsBenchmark: new FormControl(
          this.previewData ? this.previewData?.commentsBenchmark : ""
        ),
        discountingCharges: new FormControl(
          this.previewData ? this.previewData?.discountingCharges : "",
          [Validators.required]
        ),
        negotiationChargesFixed: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.negotiationChargesFixed) : "",
          [Validators.required,this.amountValidator]
        ),
        negotiationChargesPerct: new FormControl(
          this.previewData ? this.previewData?.negotiationChargesPerct : "",
          [Validators.required]
        ),

        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",
          [this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    } else if (this.product === "REFINANCE") {
      console.log("Creating REFINANCE Form");
      this.quoteForm = new FormGroup({
        applicableBenchmark: new FormControl(
          this.previewData ? this.previewData?.applicableBenchmark : ""
        ),
        commentsBenchmark: new FormControl(
          this.previewData ? this.previewData?.commentsBenchmark : ""
        ),
        refinancingCharges: new FormControl(
          this.previewData ? this.previewData?.refinancingCharges : "",
          [Validators.required]
        ),

        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",
          [this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    } else if (this.product === "BANKER") {
      console.log("Creating BANKER Form");
      this.quoteForm = new FormGroup({
        applicableBenchmark: new FormControl(
          this.previewData ? this.previewData?.applicableBenchmark : ""
        ),
        commentsBenchmark: new FormControl(
          this.previewData ? this.previewData?.commentsBenchmark : ""
        ),
        bankAcceptCharges: new FormControl(
          this.previewData ? this.previewData?.bankAcceptCharges : "",
          [Validators.required]
        ),
        negotiationChargesFixed: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.negotiationChargesFixed) : "",
          [Validators.required,this.amountValidator]
        ),
        negotiationChargesPerct: new FormControl(
          this.previewData ? this.previewData?.negotiationChargesPerct : "",
          [Validators.required]
        ),

        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",
          [this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    } else if (this.product === "BANKGUARANTEE") {
      console.log("Creating BANKGUARANTEE Form");
      console.log(this.previewData)
      this.quoteForm = new FormGroup({
        confirmationCommision: new FormControl(
          this.previewData ? this.previewData?.confirmationCharges : "",
          [Validators.required]
        ),
        bankCharge: new FormControl(
          this.previewData
            ? this.previewData?.confChgsIssuanceToClaimExp == true
              ? '2'
              : '1'
            : '1',[Validators.required]
        ),
        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",
          [this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    } else {
      console.log("Creating Avalising Form");
      this.quoteForm = new FormGroup({
        applicableBenchmark: new FormControl(
          this.previewData ? this.previewData?.applicableBenchmark : ""
        ),
        commentsBenchmark: new FormControl(
          this.previewData ? this.previewData?.commentsBenchmark : ""
        ),
        discountingCharges: new FormControl(
          this.previewData ? this.previewData?.discountingCharges : "",
          [Validators.required]
        ),

        otherCharges: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.otherCharges) : "",
          [this.amountValidator]
        ),
        typeOfCharge: new FormControl(
          this.previewData ? this.previewData?.chargesType : ""
        ),
        minimumTransactionCharge: new FormControl(
          this.previewData ? this.formatAmount(this.previewData?.minTransactionCharges) : "",[this.amountValidator]
        ),
        bankQuoteValidity: new FormControl(
          this.previewData ? this.previewData?.validity : "",
          [Validators.required]
        ),
        othertnc: new FormControl(
          this.previewData ? this.previewData?.termConditionComments : ""
        ),
      });
    }
  }

  latestacceptedtransactions() {
    this.dialog.open(LatestAcceptedTransactionsComponent);
  }

  save() {
    if(this.quoteForm.valid){
    if (this.product === "CONFIRMATION") {
      console.log("Sending CONFIRMATION Quote Data");
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays,
        // Quote Fields
        confirmationCharges:
          this.quoteForm.controls["confirmationCommision"].value,
        confChgsIssuanceToMatur:
          this.quoteForm.controls["confCharge"].value == 2 ? true : false,
        confChgsIssuanceToNegot:
          this.quoteForm.controls["confCharge"].value == 1 ? true : false,

        // Common Quote Fields
        otherCharges: this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value,
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
        // "confChgsMatur":0,
        // "confChgsNegot":0
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    } else if (this.product === "DISCOUNTING") {
      console.log("Sending DISCOUNTING Quote Data");
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays,
        // Quote Fields
        applicableBenchmark:
          this.quoteForm.controls["applicableBenchmark"].value,
        commentsBenchmark: this.quoteForm.controls["commentsBenchmark"].value,
        discountingCharges: this.quoteForm.controls["discountingCharges"].value,
        negotiationChargesFixed:this.parseAmount({ target: { value: this.quoteForm.controls["negotiationChargesFixed"].value }}),
        negotiationChargesPerct:
          this.quoteForm.controls["negotiationChargesPerct"].value,
        // Common Quote Fields
        otherCharges: this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value,
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    } else if (this.product === "CONFIRMANDDISCOUNT") {
      console.log("Sending CONFIRMANDDISCOUNT Quote Data");
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays,
        // Quote Fields
        confirmationCharges:
          this.quoteForm.controls["confirmationCommision"].value,
        confChgsIssuanceToMatur:
          this.quoteForm.controls["confCharge"].value == 2 ? true : false,
        confChgsIssuanceToNegot:
          this.quoteForm.controls["confCharge"].value == 1 ? true : false,
        applicableBenchmark:
          this.quoteForm.controls["applicableBenchmark"].value,
        commentsBenchmark: this.quoteForm.controls["commentsBenchmark"].value,
        discountingCharges: this.quoteForm.controls["discountingCharges"].value,
        negotiationChargesFixed:this.parseAmount({ target: { value: this.quoteForm.controls["negotiationChargesFixed"].value }}),
        negotiationChargesPerct:
          this.quoteForm.controls["negotiationChargesPerct"].value,
        // Common Quote Fields
        otherCharges: this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value,
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    } else if (this.product === "REFINANCE") {
      console.log("Sending REFINANCE Quote Data");
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays?this.transactionDetails.usanceDays:'',
        // Quote Fields
        applicableBenchmark:
          this.quoteForm.controls["applicableBenchmark"].value,
        commentsBenchmark: this.quoteForm.controls["commentsBenchmark"].value,
        refinancingCharges: this.quoteForm.controls["refinancingCharges"].value,
        // Common Quote Fields
        otherCharges: this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value, //needs to check
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    } else if (this.product === "BANKER") {
      console.log("Sending BANKER Quote Data");
      console.log(this.quoteForm.controls);
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays,
        // Quote Fields
        applicableBenchmark:
          this.quoteForm.controls["applicableBenchmark"].value,
        commentsBenchmark: this.quoteForm.controls["commentsBenchmark"].value,
        bankAcceptCharges: this.quoteForm.controls["bankAcceptCharges"].value,
        negotiationChargesFixed:this.parseAmount({ target: { value: this.quoteForm.controls["negotiationChargesFixed"].value }}),
        negotiationChargesPerct:
          this.quoteForm.controls["negotiationChargesPerct"].value,
        // Common Quote Fields
        otherCharges:this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value, //needs to check
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    } else if (this.product === "BANKGUARANTEE") {
      console.log("Sending BANKGUARANTEE Quote Data");
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays,
        // Quote Fields
        confirmationCharges:
          this.quoteForm.controls["confirmationCommision"].value,
        confChgsIssuanceToMatur:
          this.quoteForm.controls["bankCharge"].value == 2 ? true : false,
        confChgsIssuanceToNegot:
          this.quoteForm.controls["bankCharge"].value == 1 ? true : false,
        // Common Quote Fields
        otherCharges: this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value,
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    } else {
      console.log("Sending Avalisation Quote Data");
      let data = {
        transactionId: this.transactionId,
        quotationId:this.quoteID,
        requirementType: this.transactionDetails.requirementType,
        lCIssuanceBank: this.transactionDetails.lCIssuanceBank,
        lCValue: this.transactionDetails.lCValue,
        lCCurrency: this.transactionDetails.lCCurrency,
        usanceDays: this.transactionDetails.usanceDays,
        // Quote Fields
        applicableBenchmark:
          this.quoteForm.controls["applicableBenchmark"].value,
        commentsBenchmark: this.quoteForm.controls["commentsBenchmark"].value,
        discountingCharges: this.quoteForm.controls["discountingCharges"].value,
        // Common Quote Fields
        otherCharges: this.parseAmount({ target: { value: this.quoteForm.controls["otherCharges"].value }}),
        chargesType: this.quoteForm.controls["typeOfCharge"].value,
        minTransactionCharges:this.parseAmount({ target: { value: this.quoteForm.controls["minimumTransactionCharge"].value }}),
        validity: _moment(
          this.quoteForm.controls["bankQuoteValidity"].value
        ).format("YYYY-MM-DD"),
        termConditionComments: this.quoteForm.controls["othertnc"].value,
      };
      console.log(data);
      this.bankService.updateQuotation(data).subscribe((res: any) => {
        console.log(res.data);
        this.router.navigateByUrl("/bank-underwriter/active-transaction");
      });
    }
  }
  }

  amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  console.log(value)
  const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
  return isValid ? null : null;
}

formatAmount(value: string) {
  console.log(value)
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
