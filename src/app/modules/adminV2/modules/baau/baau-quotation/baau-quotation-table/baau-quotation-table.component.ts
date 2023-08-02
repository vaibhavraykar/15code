import {Component,OnInit} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../../components/table/table.component';
import { CustomerService } from '../../../customers/services/customer.service';
@Component({
  selector: 'app-baau-quotation-table',
  templateUrl: './baau-quotation-table.component.html',
  styleUrls: ['./baau-quotation-table.component.scss'],
})
export class BaauQuotationTableComponent extends TableComponent implements OnInit {

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
 private customerService:CustomerService){
    super(_liveAnnouncer, router, apiService, dialog);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewBaauTransactionDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/baau/details/${element['Transaction Id']}`);
  }
  viewBaauQuotationDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/baau/quotationDetails/${element.Actions.quotId}`);
  }
}
