import { Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  
  dataSource:any[]=[{'UserID':'1', 'Mobile':'', 'Assigner':'', 'Debtor':'','Invoice Number':'','Amount':'','Validity Date':'','Transaction ID':''}];
  displayColumns:string[]=['UserID', 'Mobile', 'Assigner', 'Debtor','Invoice Number','Amount','Validity Date','Transaction ID'];
}
