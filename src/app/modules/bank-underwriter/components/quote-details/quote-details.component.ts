import { Component, OnInit } from "@angular/core";
import { BankUnderwriterService } from "../../services/bank-underwriter.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LatestAcceptedTransactionsComponent } from "../../popup/latest-accepted-transactions/latest-accepted-transactions/latest-accepted-transactions.component";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { ConfirmationPopupComponent } from "../../popup/confirmation-popup/confirmation-popup.component";
import { RejectPopupComponent } from "../reject-popup/reject-popup.component";

@Component({
  selector: "app-quote-details",
  templateUrl: "./quote-details.component.html",
  styleUrls: ["./quote-details.component.scss"],
})
export class QuoteDetailsComponent implements OnInit {
  transactionDetails: any;
  transactionId: any;
  product: any;
  previewData: any;
  quoteID: any;
  productName:any;
  acceptedQuoteDetails:any;

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
    private bankService: BankUnderwriterService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,

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
        this.acceptedQuoteDetails = this.previewData?.acceptedQuotationBean;
        console.log(this.acceptedQuoteDetails)
      });
    });
  }

  findProductName(name:any) {
    console.log(name)
    let product = this.productsTypes.find(
      (item: any) => item.value.toLowerCase() === name.toLowerCase()
    );
    console.log(product)
    this.productName= product.name.toUpperCase();
  }

  editQuotation(id: any) {
    console.log(id);
    this.router.navigateByUrl(`/bank-underwriter/edit-details?quoteId=${id}`);
  }

  goBack(){
    this.location.back();
  }

  rejectQuotation(transactionId: any, quoteid: any) {
    this.dialog.open(RejectPopupComponent,{data:{
      transactionId: transactionId,
      quotationId: quoteid,
    },autoFocus:false});
    // console.log(id);
    // let data = {
    //   transactionId: transactionId,
    //   quotationId: quoteid,
    // };
    // this.bankService.rejectQuotation(data).subscribe((res: any) => {
    //   console.log(res, 'res');
    //   if (res.success) {
    //     this.router.navigateByUrl("/bank-underwriter/new-transaction");
    //   }
    //    else {
    //     alert("reject");
    //    }
    // });
  }

  withdraw() {
    let data = {
      transactionId: this.transactionId,
      quotationId: this.quoteID,
    };
    this.bankService.withdrawQuotation(data).subscribe((res: any) => {
      console.log(res.data);
      this.router.navigateByUrl("/bank-underwriter/active-transaction");
    });
  }
  latestacceptedtransactions() {
    this.dialog.open(LatestAcceptedTransactionsComponent);
  }
}
