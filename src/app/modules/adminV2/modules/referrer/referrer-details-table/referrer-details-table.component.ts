import { Component,OnInit,} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../customers/services/customer.service';
import { ReferrerService } from '../services/referrer.service';
@Component({
  selector: 'app-referrer-details-table',
  templateUrl: './referrer-details-table.component.html',
  styleUrls: ['./referrer-details-table.component.scss'],
})
export class ReferrerDetailsTableComponent extends TableComponent implements OnInit {

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private customerService: CustomerService,private referrerService:ReferrerService) {
    super(_liveAnnouncer, router, apiService, dialog);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewRefer(element?:any){
    this.router.navigateByUrl(`/adminv2/referrer/referrerView/${element.Actions.userId}`);
  }
}
