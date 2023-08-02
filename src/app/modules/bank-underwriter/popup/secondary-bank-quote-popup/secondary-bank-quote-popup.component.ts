import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-secondary-bank-quote-popup',
  templateUrl: './secondary-bank-quote-popup.component.html',
  styleUrls: ['./secondary-bank-quote-popup.component.scss'],
})
export class SecondaryBankQuotePopupComponent {
  transactionDetails: any;
  bankDetails: any;
  viewType = 'placeNewQuoteUnfunded';
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      transactionDetails: any;
      bankDetails: any;
    },
    

    public dialogRef: MatDialogRef<SecondaryBankQuotePopupComponent>
  ) {}
  transactionInformation:any
  transactionInformationDetails:any

  ngOnInit(): void {
    this.transactionInformation = this.data.transactionDetails;
    this.transactionInformationDetails =  this.data.bankDetails;
    if(this.data?.bankDetails.isOfferdPriceAccepted){
      this.viewType = 'default'
    }else{
      if(this.data?.bankDetails.secTransactionType === 'FUNDED'){
        this.viewType = 'placeNewQuoteFunded'
      }else{
        this.viewType ='placeNewQuoteUnfunded'
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
  acceptQuotation() {
    this.dialogRef.close(true);
    
    // this.router.navigateByUrl('/bank-underwriter/active-secondary-transaction/quote/accepted')
  }
}
