import { Component, OnInit } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TableComponent } from '../../../components/table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../customers/services/customer.service';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';
@Component({
  selector: 'app-baau-table',
  templateUrl: './baau-table.component.html',
  styleUrls: ['./baau-table.component.scss'],
})
export class BaauTableComponent extends TableComponent implements OnInit {
  numberOfFilters: any;

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private customerService: CustomerService) {
    super(_liveAnnouncer, router, apiService, dialog);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewBaauDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/baau/view/${element.Action.userName}`);
  }

  planAndPaymentOrder(data, element?: any) {
    // this.customerService.orderClickName.next(data);
    localStorage.setItem('orderClickName',data);
    this.router.navigateByUrl(`/adminv2/baau/planAndPayment/${element.Action.userName}`);
  }
  customerKyc(element?: any) {
    this.router.navigateByUrl(`/adminv2/baau/kyc/${element.Action.userName}`);
  }
  totalTxn(element) {
    this.router.navigateByUrl(`/adminv2/baau/quotation/${element.Action.mid}`);
  }
  transactionType(_e) {
    this.customerService.selectedTransactionType.next(this.tableStructure.transaction.selectedTransactionType);
    this.transactionTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'transactionType',
      event: _e.value,
    });
  }
  filter() {
    const filterPopup= this.dialog.open(FilterPopupComponent,{data:this.tableStructure,disableClose:true})
    filterPopup.afterClosed().subscribe((res)=>{

      if (res.payload) {
        let e = res.payload
        if (e.filters[0].key && e.filters[0].fieldType && e.filters[0].operator && e.filters[0].value) {
          this.combinedEmitter.emit({
            eventName: 'filter',
            event: res.payload,
          });
          this.tableStructure.filters = res.filterApplied
          this.tableStructure.filtersPayload = res.payload
          this.numberOfFilters = res.payload.filters.length;
        } else {
          this.combinedEmitter.emit({
            eventName: 'filter',
            event: res.payload,
          });
          this.tableStructure.filters = []
          this.tableStructure.filtersPayload = {}
          this.numberOfFilters = 0;
        }
      }
    });
  }
  addUserDetails(data,element?: any){
    // this.customerService.userClickName.next(data);
    localStorage.setItem('userClickName',data);
    this.router.navigateByUrl(`/adminv2/baau/user/${element.Action.personalid}`);
  }
}
