import {Component,EventEmitter,Input,OnChanges,OnInit,Output, SimpleChanges,} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { CustomPaginator } from './CustomPaginator';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../components/table/table.component';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { GrantRequestsServices } from '../services/grant-requests-services.services';
import { CommonPopupComponent } from '../../../components/common-popup/common-popup.component';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';
import { CustomerService } from '../../customers/services/customer.service';
@Component({
  selector: 'app-grant-table',
  templateUrl: './grant-table.component.html',
  styleUrls: ['./grant-table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class GrantRequestTableComponent extends TableComponent {
  loginuserName: any;
  numberOfFilters: any;

  @Output() applicableTypeChangeHandler: any = new EventEmitter<any>();
  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
    private grantRequestService: GrantRequestsServices,
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

  // onUpdateTransaction(approveTransaction){
  //   console.log(approveTransaction);
  //   this.combinedEmitter.emit({
  //     eventName: 'approveTransaction',
  //     event: approveTransaction
  //   })
  // }

  onUpdateTransaction(approveTransaction){
    console.log(approveTransaction);
    this.combinedEmitter.emit({
      eventName: 'approveTransaction',
      event: approveTransaction
    })
  }

  applicableTypeChange(_e) {
    this.customerService.selectedUserTypeForTable.next(this.tableStructure.applicableEntity.showapplicableEntityType);
    this.applicableTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'applicableEntType',
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
  }else{
    this.combinedEmitter.emit({
      eventName: 'filter',
      event: res.payload,
    });
    this.tableStructure.filters=[]
    this.tableStructure.filtersPayload={}
  }
  this.numberOfFilters = res.payload.filters.length;
  }
    });
  }

  viewDetails(element?: any){
    console.log('id element',element.Action.userId);
    this.router.navigateByUrl(`/adminv2/grant-requests/view-kyc/${element.Action.userId}`);
  }
  viewTransactionDet(element?: any) {
    this.router.navigateByUrl(`/adminv2/view/${element['Trxn Id']}`);
  }

  

  viewGCKycDetails(element?:any){
    // this.grantRequestService.gcKycData.next(element.Action.item);
    localStorage.setItem('gcKycData',JSON.stringify(element.Action.item));
    this.router.navigateByUrl(`/adminv2/grant-requests/groupCompany-view-kyc`);
  }

  confirmPayment(orderId:any, pid:any, modeOfPayment:any, status:any, orderToken:any, approvedType:any, username: any) {
    let message;
    if(status =='COMPLETED'){
    message = 'Are you sure you want to approve the Payment?';
    } else if(status =='REJECTED'){
    message = 'Are you sure you want to Reject the Payment?';
    }
    const popup = this.dialog.open(CommonPopupComponent, {
      data: {
        message: message,
      },
      disableClose:true
    });
    popup.afterClosed().subscribe((result:any)=>{
      console.log(result);
      if(result.response==true){
        let payload = {
          orderId: orderId,
          paymentId: pid,
          modeOfPayment: modeOfPayment,
          paymentStatus: status,
          tokenValue: orderToken,
          approvedType: approvedType,
          userId: username,
          comment: result.comment,

        }
        this.grantRequestService.updatePaymentStatus(payload).subscribe((res: any) => {
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
            this.onupdatePayment('approvePayment');
          }
        })
      }
    })
  }

  rmApproval(id: any, status: any){
    const approvalData = {
      id : id,
      status : status
    }
    let message;
    if(approvalData.status =='COMPLETED'){
    message = 'Are you sure you want to approve the RM?';
    } else if(approvalData.status =='REJECTED'){
    message = 'Are you sure you want to Reject the RM?';
    }

    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: approvalData,
        message: message
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.grantRequestService.grantRmStatus(approvalData).subscribe((res: any) => {
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
              this.onUpdateRM('activeInactive');
          }
        })
      }
    });
  }

  transactionApproval(mtransactionId:any, transactionStatus:any, approvedType:any) {
    let message;
    if(transactionStatus =='ACTIVE'){
      message = 'Are you sure you want to approve the Transaction?';
      } else if(transactionStatus =='CANCELLED'){
      message = 'Are you sure you want to Reject the Transaction?';
      }
    const popup = this.dialog.open(CommonPopupComponent, {
      data: {
        message: message,
      },
      disableClose:true
    });
    popup.afterClosed().subscribe((result:any)=>{
      console.log(result);
      if(result.response==true){
        let payload = {
          txnId: mtransactionId,
          txnStatus: transactionStatus,
          comment: result.comment,
          approvedType: approvedType
        }
        this.grantRequestService.updateStatusTrans(payload).subscribe((res: any) => {
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
            this.onUpdateTransaction('approveTransaction');
          }
        })
      }
    })
  }


  viewbulkTransactionDet(element?: any){
    this.router.navigateByUrl(`/adminv2/view/${element['Trxn Id']}`);
  }
  bulktransactionApproval(mtransactionId:any, transactionStatus:any, approvedType:any) {
    let message;
    if(transactionStatus =='ACTIVE'){
      message = 'Are you sure you want to approve the Transaction?';
      } else if(transactionStatus =='DELETED'){
      message = 'Are you sure you want to Delete the Transaction?';
      }
    const popup = this.dialog.open(CommonPopupComponent, {
      data: {
        message: message,
      },
      disableClose:true
    });
    popup.afterClosed().subscribe((result:any)=>{
      console.log(result);
      if(result.response==true){
  
        if(transactionStatus =='ACTIVE'){
        var payload = {
          transactionId: mtransactionId,
          // status: transactionStatus,
          status: 'ACTIVE',
          // comments: result.comment,
          approvalUserId: this.loginuserName
        }
      }else{
         var payload1 = {
          transactionId: mtransactionId,
          status: transactionStatus,
          comments: result.comment,
          // approvedType: approvedType
        }
      }
      if(transactionStatus =='ACTIVE')
      {
        this.grantRequestService.bulkApproveDelete(payload).subscribe((res: any) => {
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
            this.onUpdateTransaction('approveTransaction');
          }
        })
      }
        else{
          this.grantRequestService.bulkApproveDelete(payload1).subscribe((res: any) => {
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
              this.onUpdateTransaction('approveTransaction');
            }
          })
        }
      }
    })
  }
}
