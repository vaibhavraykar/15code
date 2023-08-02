import {Component,OnInit,} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../components/table/table.component';
import { FactorService } from '../services/factor.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';
@Component({
  selector: 'app-factor-table',
  templateUrl: './factor-table.component.html',
  styleUrls: ['./factor-table.component.scss'],
})
export class FactorTableComponent extends TableComponent implements OnInit {

  loginuserName:any;
  numberOfFilters: any;
  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private factorService: FactorService) {
    super(_liveAnnouncer, router, apiService, dialog);
    this.loginuserName = localStorage.getItem('userName');

  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewFactorDetails(data?: any) {
    this.factorService.viewFactorData.next(data);
    this.router.navigate(['adminv2/factor/view']);
  }
  editFactor(data?:any){
    this.factorService.viewFactorData.next(data);
    this.router.navigate(['adminv2/factor/edit']);
  }
  actionFactor(status,id){
    let data= {
      status: status,
      id: id,
    }
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '500px',
      height: '310px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: 'Are you sure you want to proceed with the action ?'
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.factorService.updateFactorStatus(data).subscribe(res=>{
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
              eventName: 'updated',
              event: true
            })
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
        } else {
          this.combinedEmitter.emit({
            eventName: 'filter',
            event: res.payload,
          });
          this.tableStructure.filters = []
          this.tableStructure.filtersPayload = {}
        }
        this.numberOfFilters = res.payload.filters.length;
      }
    });
  }
}
