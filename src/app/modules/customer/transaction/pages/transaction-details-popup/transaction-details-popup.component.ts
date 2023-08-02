import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-details-popup',
  templateUrl: './transaction-details-popup.component.html',
  styleUrls: ['./transaction-details-popup.component.scss']
})
export class TransactionDetailsPopupComponent {
constructor(
  public dialogRef: MatDialogRef<TransactionDetailsPopupComponent>
){}
discriptionText:string ='These transactions are open and visible to Partner banks for them to quote on the same and have not crossed the validity date.'

discriptionText1:string ='These transactions are rejected by Partner Banks or yourself post quotes have been accepted by you due to multiple reasons best identified between the Corporates and the discovered negotiating bank.'

discriptionText3:string ='These Transactions have passed their validity date without acceptance of quotes received on the said transaction.'

close(){
  this.dialogRef.close();
}
}
