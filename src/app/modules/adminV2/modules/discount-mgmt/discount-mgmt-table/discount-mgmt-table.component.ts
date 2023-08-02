import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { CustomPaginator } from './CustomPaginator';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { DiscountManagementServices } from '../services/discount-mgmt-services.service';
import { TableComponent } from '../../../components/table/table.component';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { CustomerService } from '../../customers/services/customer.service';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';
@Component({
  selector: 'app-discount-mgmt-table',
  templateUrl: './discount-mgmt-table.component.html',
  styleUrls: ['./discount-mgmt-table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class DiscountMgmtTableComponent extends TableComponent {
  loginuserName: any;
  numberOfFilters: any;

  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
    private discountMgmtService: DiscountManagementServices,
    private customerService: CustomerService
  ) {
    super(_liveAnnouncer, router, apiService, dialog);
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);

  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }

  confirmCouponStatus(id: any, status: any) {
    console.log(id);
    let data = {
      id: id,
      status: status
    }
    let message;
    if (data.status == 'ACTIVE') {
      message = 'Are you sure you want to approve the discount coupon?';
    } else if (data.status == 'REJECTED') {
      message = 'Are you sure you want to Reject the discount coupon?';
    }

    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: message
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.discountMgmtService.updateCouponStatus(data).subscribe((res: any) => {
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
            disableClose:true
          });
          if (res['success'] == true) {
            this.onupdateUser('activeInactive');
          }
        })
      }
    });
  }


  onupdateUser(activeInactive) {
    console.log(activeInactive);
    this.combinedEmitter.emit({
      eventName: 'activeInactive',
      event: activeInactive

    })
  }

  viewDetails(element?: any) {
    console.log('id element', element.Action.id);
    this.router.navigateByUrl(`/adminv2/discount-management/view-coupon/${element.Action.id}`);
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
    const filterPopup = this.dialog.open(FilterPopupComponent, { data: this.tableStructure })
    filterPopup.afterClosed().subscribe((res) => {

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
}
