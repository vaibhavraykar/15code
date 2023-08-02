import {Component,OnInit} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TableComponent } from '../../../components/table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { AutomatedBaauService } from '../services/automated-baau.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-automated-baau-table',
  templateUrl: './automated-baau-table.component.html',
  styleUrls: ['./automated-baau-table.component.scss'],
})
export class AutomatedBaauTableComponent extends TableComponent implements OnInit {
  loginuserName: any;

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private automatedService:AutomatedBaauService,private customerService:CustomerService){
    super(_liveAnnouncer, router, apiService, dialog);
    this.loginuserName = localStorage.getItem('userName');

  }
  override applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    console.log( this.tableStructure.dataSource,' this.tableStructure.dataSource')
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
   viewBaauDetails(element?: any) {
    this.automatedService.viewDetails.next(element.Actions.data);
    this.router.navigateByUrl(`/adminv2/automated-baau/view`);
  }
  totalTxn(element){
    this.router.navigateByUrl(`/adminv2/automated-baau/quotation/${element.Actions.mid}`);
  }
  transactionApproval(element:any, transactionStatus:any) {
    let message;
    message = 'Are you sure you want to proceed with this action?';
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        message: message,
      },
      disableClose:true
    });
    popup.afterClosed().subscribe((result:any)=>{
      console.log(result);
      if(result == true){
        let payload = {
          id: element.Actions?.data?.id,
          status: transactionStatus,
        }
        this.automatedService.updateStatus(payload).subscribe((res: any) => {
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
            this.combinedEmitter.emit({
              eventName: 'createdSuccessfully',
              event: true
            })
          }
        })
      }
    })
  }
  transactionType(_e) {
    console.log(this.tableStructure.transaction.selectedTransactionType,'this.tableStructure.transaction.selectedTransactionType')
    this.customerService.selectedTransactionType.next(this.tableStructure.transaction.selectedTransactionType);
    this.transactionTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'transactionType',
      event: _e.value,
    });
  }
  
}

