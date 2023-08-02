import { Component, ViewChild, TemplateRef } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { TableComponent } from 'src/app/modules/adminV2/components/table/table.component';
import { CommonPopupComponent } from 'src/app/modules/adminV2/components/common-popup/common-popup.component';
import { PrimaryTransactionServicesService } from '../../services/primary-transaction-services.service';
import { FilterPopupComponent } from '../../../../components/filter-popup/filter-popup.component';
import { GeneralPopupComponent } from 'src/app/modules/adminV2/components/general-popup/general-popup.component';
import { CustomerService } from '../../../customers/services/customer.service';

@Component({
  selector: 'app-primary-table',
  templateUrl: './primary-table.component.html',
  styleUrls: ['./primary-table.component.scss']
})
export class PrimaryTableComponent extends TableComponent {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;
  commisionPercentValue: any = '';
  commisionAmountValue: any = '';
  showValue: boolean = false;
  id: any;
  numberOfFilters: any;
  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
    private ps: PrimaryTransactionServicesService,
    private customerService: CustomerService
  ) {
    super(_liveAnnouncer, router, apiService, dialog)

  }

  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  approvePendingTrans(id: any, status: any, approvedType: any) {
    let message;
    if (status == 'MAKER_APPROVED') {
      message = 'Are you sure you want to approve the Transaction?';
    } else if (status == 'CANCELLED') {
      message = 'Are you sure you want to reject the Transaction?';
    }
    const popup = this.dialog.open(CommonPopupComponent, {
      data: {
        message: message,
      },
      disableClose:true
    });
    popup.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result.response == true) {
        let data = {
          txnId: id,
          txnStatus: status,
          approvedType: approvedType,
          comment: result.comment
        }
        this.ps.updateStatusTrans(data).subscribe((res: any) => {
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
            this.onUpdatePendingTrans('approvePending');
          }
        })
      }
    })
  }
  viewQuotation(element?: any) {
    console.log('id element', element.Action.trxnId);
    this.router.navigateByUrl(`/adminv2/primary-transaction/quotation-list/${element.Action.trxnId}`);
  }
  // viewQuotes(element?: any){
  //   console.log('id element',element.Action.quoteId);
  //   this.router.navigateByUrl(`/adminv2/primary-transaction/view-quote/${element.Action.quoteId}`);
  // }

  quotesRelay(element?: any) {
    this.id = element.Action.trxnId;
    this.commisionPercentValue = element.Action.percentValue;
    this.commisionAmountValue = element.Action.amtValue;
    console.log('id', this.id)
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '350px',
      disableClose:true
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
  onUpdatePendingTrans(approvePending) {
    console.log(approvePending);
    this.combinedEmitter.emit({
      eventName: 'approvePending',
      event: approvePending
    })
  }

  isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    const inputValue = evt.target.value;
    const decimalCount = inputValue.split('.').length - 1;

    if (charCode === 46 && decimalCount === 0) {
        return true;
    }
    if (charCode >= 48 && charCode <= 57) {
        return true;
    }
    return false;
  }

  percentOnly(event):boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const decimalCount = inputValue.split('.').length - 1;

    if (charCode === 46 && decimalCount === 0) {
        return true;
    }
    if (charCode >= 48 && charCode <= 57) {
      const newValue = inputValue + String.fromCharCode(charCode);
      const numericValue = +newValue;
      if (numericValue > 100 || numericValue < 0) {
        return false;
      }
      return true;
    }
    return false;
  }

  onSubmit(id: any) {
    const commissionPercent = this.commisionPercentValue;
    const commissionAmount = this.commisionAmountValue;

    if(this.showValue == false){
    const data = {
      transactionId : id,
      commissionPercent: commissionPercent,
      commissionAmount: commissionAmount,
      isVisibleByAdmin: this.showValue
    }
    console.log('data',data)
    this.callingRelayTransaction(data);
    this.dialogRef.close();
  } else {
      const data = {
        transactionId: id,
        commissionPercent: commissionPercent,
        commissionAmount: commissionAmount,
        isVisibleByAdmin: this.showValue
      }
      console.log('data', data)
      const popup = this.dialog.open(GeneralPopupComponent, {
        width: '600px',
        height: '240px',
        data: {
          title: 'isConfirm',
          full_data: data,
          message: "Please Confirm if you want to continue."
        },
      });
      popup.afterClosed().subscribe(dialogResult => {
        let result = dialogResult;
        if (dialogResult) {
          this.callingRelayTransaction(data);
        }
      });
      this.dialogRef.close();
    }
  }

  callingRelayTransaction(data) {
    this.ps.relayTransaction(data).subscribe((res: any) => {
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
        this.onUpdatePendingTrans('approvePending');
      }
    })
  }
  transactionType(_e) {
    this.customerService.selectedTransactionType.next(this.tableStructure.transaction.selectedTransactionType);
    this.transactionTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'transactionType',
      event: _e.value,
    });
  }

  closeComment() {
    this.dialogRef.close();
  }
}
