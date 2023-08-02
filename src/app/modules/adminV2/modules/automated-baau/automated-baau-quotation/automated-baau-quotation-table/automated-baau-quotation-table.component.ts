import {Component,OnInit} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../../components/table/table.component';
import { CustomerService } from '../../../customers/services/customer.service';
@Component({
  selector: 'app-automated-baau-quotation-table',
  templateUrl: './automated-baau-quotation-table.component.html',
  styleUrls: ['./automated-baau-quotation-table.component.scss'],
})
export class AutomatedBaauQuotationTableComponent extends TableComponent implements OnInit {

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
 private customerService:CustomerService){
    super(_liveAnnouncer, router, apiService, dialog);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewBaauTransactionDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/automated-baau/details/${element['Transaction Id']}`);
  }
  viewBaauQuotationDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/automated-baau/quotationDetails/${element.Actions.quotId}`);
  }
}
