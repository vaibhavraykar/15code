import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { CustomPaginator } from './CustomPaginator';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../components/table/table.component';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { CommonPopupComponent } from '../../../components/common-popup/common-popup.component';
import { SubscriptionMgmtServices } from '../services/subscription-services.services';
import { CustomerService } from '../../customers/services/customer.service';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';

@Component({
  selector: 'app-subscription-table',
  templateUrl: './subscription-table.component.html',
  styleUrls: ['./subscription-table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class SubscriptionMgmtTable extends TableComponent {
  loginuserName: any;
  numberOfFilters: any;
  @Output() applicableTypeChangeHandler: any = new EventEmitter<any>();
  myRole:any;
  myRights:any;
  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
    private subsMgmtServices: SubscriptionMgmtServices,
    private customerService: CustomerService
  ) {
    super(_liveAnnouncer, router, apiService, dialog);
    this.loginuserName = localStorage.getItem('userName');
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));

  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onupdatePayment(approvePayment){
    console.log(approvePayment);
    this.combinedEmitter.emit({
      eventName: 'approvePayment',
      event: approvePayment
    })
  }

  onUpdateRM(approveRM){
    console.log(approveRM);
    this.combinedEmitter.emit({
      eventName: 'approveRM',
      event: approveRM
    })
  }

  onUpdateTransaction(approveTransaction){
    console.log(approveTransaction);
    this.combinedEmitter.emit({
      eventName: 'approveTransaction',
      event: approveTransaction
    })
  }

  onUpdateSubscription(approveSubscription){
    console.log(approveSubscription);
    this.combinedEmitter.emit({
      eventName: 'approveSubscription',
      event: approveSubscription
    })
  }

  applicableTypeChange(_e) {
    this.applicableTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'applicableEntType',
      event: _e.value,
    });
  }

  editPlan(element?: any){
    console.log('id element',element.Action.userId);
    this.subsMgmtServices.editAdminSubsId.next(element.Action.userId);
    this.router.navigateByUrl(`/adminv2/subscription-management/edit-subscription/${element.Action.userId}`);
  }

  viewDetails(element?: any){
    console.log('id element',element.Action.userId);
    this.router.navigateByUrl(`/adminv2/subscription-management/view-subscription/${element.Action.userId}`);
  }

  onChangeRadio(data) {
    this.customerService.selectedUserTypeForTable.next(this.tableStructure.selectedUserType);
    this.combinedEmitter.emit({
      eventName: 'userType',
      event: data.value
    })
  }


  confirmProductStatus(id:any, status:any) {
    console.log(id);
    let data = {
      id: id,
      status: status
    }
    let message;
    if(status =='ACTIVE'){
    message = 'Are you sure you want to approve the Subscription?';
    } else if(status =='REJECTED'){
    message = 'Are you sure you want to Reject the Subscription?';
    }

    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: message,
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.subsMgmtServices.updateProductStatus(data).subscribe((res: any) => {
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
            this.onUpdateSubscription(this.tableStructure.selectedUserType);
          }
        })
      }
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
