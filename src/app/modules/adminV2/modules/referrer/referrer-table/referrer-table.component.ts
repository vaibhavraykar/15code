import { Component,OnInit,} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../customers/services/customer.service';
import { ReferrerService } from '../services/referrer.service';
@Component({
  selector: 'app-referrer-table',
  templateUrl: './referrer-table.component.html',
  styleUrls: ['./referrer-table.component.scss'],
})
export class ReferrerTableComponent extends TableComponent implements OnInit {

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private referrerService: ReferrerService,private customerService: CustomerService) {
    super(_liveAnnouncer, router, apiService, dialog);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getReferrerList(status,element?: any) {
    const data = {
      id:  element['User ID'],
      status: status
    }
    this.referrerService.setSelectedUserForRefererView.next(data);
    this.router.navigateByUrl(`/adminv2/referrer/refer-list`);
  }
  viewReferrer(element?:any){
    this.router.navigateByUrl(`/adminv2/referrer/referView/${element['User ID']}`);
  }
  referrerKyc(element?: any) {
    this.router.navigateByUrl(`/adminv2/referrer/kyc/${element['User ID']}`);
  }
  transactionType(_e) {
    this.customerService.selectedTransactionType.next(this.tableStructure.transaction.selectedTransactionType);
    this.transactionTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'transactionType',
      event: _e.value,
    });
  }
}
