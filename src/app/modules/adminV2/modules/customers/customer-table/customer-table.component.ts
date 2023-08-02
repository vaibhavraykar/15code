import {
  Component,
  OnInit,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../services/customer.service';
import { TableComponent } from '../../../components/table/table.component';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';
@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent extends TableComponent implements OnInit {
  numberOfFilters: any;

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private customerService: CustomerService) {
    super(_liveAnnouncer, router, apiService, dialog);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewCustomerDetails(element?: any) {
      this.router.navigateByUrl(`/adminv2/customer/view/${element.Action.userName}`);
  }

  onChangeRadio(data) {
    this.paginator.pageIndex = 0;
    let dataForPagination = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.pageSizeChangeEmitter.emit(dataForPagination);
    this.customerService.selectedUserTypeForTable.next(this.tableStructure.selectedUserType);
    this.combinedEmitter.emit({
      eventName: 'userType',
      event: data.value
    })
  }
  planAndPaymentOrder(data, element?: any) {
    // this.customerService.orderClickName.next(data);
    localStorage.setItem('orderClickName',data);
    this.router.navigateByUrl(`/adminv2/customer/planAndPayment/${element.Action.userName}`);
  }
  customerKyc(element?: any) {
    this.router.navigateByUrl(`/adminv2/customer/kyc/${element.Action.userName}`);
  }
  totalTxn(element?: any) {
    this.router.navigateByUrl(`/adminv2/primary-transaction?mid=${element.Action.mid}`);
  }
  transactionType(_e) {
    this.paginator.pageIndex = 0;
    let dataForPagination = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.pageSizeChangeEmitter.emit(dataForPagination);
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

  if(res.payload){
    let e =res.payload
    if(e.filters[0].key&&e.filters[0].fieldType&&e.filters[0].operator&&e.filters[0].value){
    this.combinedEmitter.emit({
      eventName: 'filter',
      event: res.payload,
    });
    this.tableStructure.filters=res.filterApplied
    this.tableStructure.filtersPayload=res.payload
    this.numberOfFilters = res.payload.filters.length;
  }else{
    this.combinedEmitter.emit({
      eventName: 'filter',
      event: res.payload,
    });
    this.tableStructure.filters=[]
    this.tableStructure.filtersPayload={}
    this.numberOfFilters = 0;
  }
  }
    });
  
}
groupCompany(data, element?: any) {
  // this.customerService.clickGroupCompany.next(data);
  localStorage.setItem('clickGroupCompany',data);
  this.router.navigateByUrl(`/adminv2/customer/groupCompany/${element.Action.mid}`);
}
}
