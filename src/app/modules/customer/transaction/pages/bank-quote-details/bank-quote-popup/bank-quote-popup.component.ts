import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BankQuoteAcceptedComponent } from '../bank-quote-accepted/bank-quote-accepted.component';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { SubscriptionDetailPopupComponent } from 'src/app/modules/customer/profile/subscription-detail-popup/subscription-detail-popup.component';

@Component({
  selector: 'app-bank-quote-popup',
  templateUrl: './bank-quote-popup.component.html',
  styleUrls: ['./bank-quote-popup.component.scss']
})
export class BankQuotePopupComponent implements OnInit{
  bankOptions = [
    {
      title: 'Currency',
      value: 'USD'
    },
    {
      title: 'Quotes placed till date',
      value: '1'
    },
    {
      title: 'Quotes for paper',
      value: '1'
    },
    {
      title: 'Transaction amount',
      value: '$1,234'
    },
    {
      title: 'Applicant',
      value: 'Applicant Name'
    },
    {
      title: 'Benificiary',
      value: 'Benificiary Name'
    },
    {
      title: 'Transaction validity',
      value: 'DD/MM/YYYY'
    },
    {
      title: 'Confirmation commission P.A',
      value: '1%'
    },
    {
      title: 'Confirmation charges applicable from date of issuance till negotiation date',
      value: '47.22'
    },
    {
      title: 'Other charges (if any)',
      value: '100'
    },
    {
      title: 'Minimum transaction charges (if any)',
      value: '1'
    },
  ];
  // bankOptions:any=[];


  transactionId:any;
  quotationId:any;
  transactionDetails:any;
  quoteDetails:any;
  groupCompanies:any;
  groupCompanyName:any;
  product: any;
  postpaidPaymentStatus:any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BankQuotePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{transactionId:string,details:any,quoteId:any},
    public transactionService:TransactionService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    this.transactionDetails=this.data.details;
    this.quotationId=this.data.quoteId;
    this.transactionId=this.data.transactionId;
    this.product = this.data.details?.requirementType;
    console.log("This product", this.product)
    this.getQuotationById(this.quotationId);
    this.authService.getUserDetails().subscribe({
      next:(res:any)=>{
        console.log(res.data)
        let orderType = res.data[0].orders.orderLines.find(
          (ele) => ele.productDetails.productType === 'SUBSCRIPTION_PLAN'
        ).productDetails?.planType;
        console.log(orderType, 'order----');
        if (orderType === 'POSTPAID') {
          console.log('reached inside postpaid chekc');
          this.postpaidPaymentStatus =res.data[0]?.postpaidPaymentInfo?.paymentStatus;

        }
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  getQuotationById(data:any){
    this.transactionService.getQuotationById(data).subscribe((res:any)=>{
      console.log(res);
      this.quoteDetails=res.data[0];
      if (this.quoteDetails) {
        this.getGroupCompany(this.quoteDetails?.subsidaryId);
      }
    })
  }

  acceptQuotation(){
    let data={
      "transactionId": this.transactionId,
      "quotationId": this.quotationId
    }
    this.transactionService.acceptQuotation(data).subscribe((res: any) => {
      console.log(res);
      if (res.success) {
        this.dialogRef.close();
        this.router.navigateByUrl('/customer/transactions/quote/accepted', {
          state: { transactionId: res.data[0].id },
        });
      }
    });
    // if (
    //   this.postpaidPaymentStatus === 'PENDING' ||
    //   this.postpaidPaymentStatus === 'PENDING_FOR_APPROVAL'
    // ) {
    //   this.dialogRef.close();
    //   const popup = this.dialog.open(SubscriptionDetailPopupComponent);
    // } else {

    // }
  }

  getGroupCompany(id:any){
    console.log(id)
    console.log(this.groupCompanies);
    let companyName = this.groupCompanies?.businessDetails.find((item:any)=>{
      return item.id === id
    })
    console.log(companyName);
    return companyName?.companyName;
  }
}
