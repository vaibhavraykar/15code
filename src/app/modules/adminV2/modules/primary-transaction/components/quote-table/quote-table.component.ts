import { Component } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { TableComponent } from 'src/app/modules/adminV2/components/table/table.component';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { PrimaryTransactionServicesService } from '../../services/primary-transaction-services.service';

@Component({
  selector: 'app-quote-table',
  templateUrl: './quote-table.component.html',
  styleUrls: ['./quote-table.component.scss']
})
export class QuoteTableComponent extends TableComponent {
  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
   private ps: PrimaryTransactionServicesService
  ) {
    super(_liveAnnouncer, router, apiService, dialog)
  }

  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewQuotation(element?: any){
    console.log('id element',element.Action.trxnId);
    this.router.navigateByUrl(`/adminv2/primary-transaction/quotation-list/${element.Action.trxnId}`);
  }
  viewQuotes(element?: any){
    console.log('id element',element.Action.quoteId);
    this.router.navigateByUrl(`/adminv2/primary-transaction/view-quote/${element.Action.quoteId}`);
  }
}
