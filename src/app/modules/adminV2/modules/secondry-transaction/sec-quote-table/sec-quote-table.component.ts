import { Component } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { TableComponent } from 'src/app/modules/adminV2/components/table/table.component';
import { SecondaryTransactionServices } from '../services/sec-transaction-services.services';

@Component({
  selector: 'app-sec-quote-table',
  templateUrl: './sec-quote-table.component.html',
  styleUrls: ['./sec-quote-table.component.scss']
})
export class SecQuoteTableComponent extends TableComponent {
  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
   private secTransService: SecondaryTransactionServices
  ) {
    super(_liveAnnouncer, router, apiService, dialog)
  }

  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
 
  viewQuotes(element?: any){
    console.log('id element',element.Action.quoteId);
    this.router.navigateByUrl(`/adminv2/secondary-transaction/view-quotation/${element.Action.quoteId}`);
  }
}
