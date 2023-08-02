import {Component,EventEmitter,Input,OnChanges,OnInit,Output,SimpleChanges} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { CustomPaginator } from './CustomPaginator';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { TableComponent } from '../../../components/table/table.component';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { RMManagementServices } from '../services/rm-management-services.services';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CustomerService } from '../../customers/services/customer.service';
import { FilterPopupComponent } from '../../../components/filter-popup/filter-popup.component';

@Component({
  selector: 'app-rm-table',
  templateUrl: './rm-table.component.html',
  styleUrls: ['./rm-table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class RMTableComponent extends TableComponent {
  loginuserName: any;
  selectedId: string[] = [];
  country: any;
  subscriberType: any;
  firstName: any;
  lastName: any;
  newcountry: any;
  newsubscriberType: any;
  selectRMList: any = [];
  selectedUser:any;
  selectedUserId: string[] = [];
  selectedRMfirstName: any;
  selectedRMlastName: any;
  commonDropdown = false;
  selectedIds: string[] = [];
  numberOfFilters: any;


  @Output() applicableTypeChangeHandler: any = new EventEmitter<any>();


  constructor(
    _liveAnnouncer: LiveAnnouncer,
    router: Router,
    apiService: ApiService,
    dialog: MatDialog,
    private rmMgmtService: RMManagementServices,
    private customerService : CustomerService
  ) {
    super(_liveAnnouncer, router, apiService, dialog);
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
  }
  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applicableTypeChange(_e) {
    this.customerService.selectedUserTypeForTable.next(this.tableStructure.selectedUserType);
    this.applicableTypeChangeHandler.emit(_e.value);
    this.commonDropdown = false;
    this.combinedEmitter.emit({
      eventName: 'applicableEntType',
      event: _e.value,
    });
  }


  onAssignRM(assignRM){
    console.log(assignRM);
    this.combinedEmitter.emit({
      eventName: 'assignRM',
      event: assignRM
    })
  }

  getSelectedRM(country: string, subscriberType: string) {
    let data = {
      countryName: country.charAt(0).toUpperCase() + country.slice(1).toLowerCase(),
      subscriberType: subscriberType
    }
    this.rmMgmtService.getRMList(data).subscribe((res: any) => {
      this.selectRMList = res.data[0];
    })
  }

  onCheckboxChange(event: MatCheckboxChange, element: any) {
    element.checked = event.checked;
    const selectedElements = this.tableStructure.dataSource.data.filter((el: any) => el.checked);
    if (selectedElements.length > 1) {
      this.commonDropdown = true;
      this.selectedIds = selectedElements.map((el: any) => el.Action.id);
      console.log('multiple id',this.selectedIds);
      const selectedData = selectedElements.map((el: any) => {
        return {
          country: el.Action.country,
          subscriberType: el.Action.subscriberType
        };
      })
      console.log('Selected Details at 0', selectedData[0]); //here what i have done is taken fields of first id so agar vo india ki jagah algeria bhi hoga to bhi vo india vale bata dega and what it should be is ki it should check if countriyName are different then give an error that choose the same countryName
      this.selectMultiple(selectedData[0]);
    } else {
      this.commonDropdown = false;
    }
  }
  selectMultiple(element? : any) {
    this.newcountry = element.country
    this.newsubscriberType = element.subscriberType
    this.getSelectedRM(this.newcountry, this.newsubscriberType);
  }

  select(element? : any) {
    this.selectedId = element.Action.id;
    this.country = element.Action.country;
    this.subscriberType = element.Action.subscriberType;
    this.firstName = element['First Name'];
    this.lastName = element['Last Name'];

    // this.getSelectedRM(personalDetails.country, personalDetails.subscriberType);
    let data = {
      countryName: this.country.charAt(0).toUpperCase() + this.country.slice(1).toLowerCase(),
      subscriberType: this.subscriberType
    }
    console.log('line 73',data);
    this.rmMgmtService.getRMList(data).subscribe((res: any) => {
      this.selectRMList = res.data[0];
    })
  }

  onUserSelectionChange(selectedUserName: string) {
    this.selectedUser = this.selectRMList.find((user) => user.firstName === selectedUserName);
    this.selectedUserId = this.selectedUser.id;
    this.selectedRMfirstName = this.selectedUser.firstName;
    this.selectedRMlastName = this.selectedUser.lastName;
    console.log('selected RM', this.selectedRMfirstName);
  }

  onSubmit() {
    const data = {
      id: this.selectedId,
      rmId: this.selectedUserId
    };
    const nameData = {
      firstName: this.firstName,
      lastName: this.lastName
    };
    console.log('nameData', this.firstName,this.lastName);
    if(this.selectedUser){
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: 'Are you sure you want to assign' + ' ' + this.selectedRMfirstName + ' ' + this.selectedRMlastName + ' ' + 'as RM for the user' + ' ' + nameData.firstName + ' ' + nameData.lastName + ' ' + '?'
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.rmMgmtService.submitAssignRM(data).subscribe((res: any) => {
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
            this.onAssignRM('assignRM');
          }
        })
      }
    });
  }
}

  onSubmitMultiple() {
    const multipayload = {
      userId: this.selectedIds,
      rmId: this.selectedUserId
    };
    if(this.selectedUser){
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: multipayload,
        message: 'Are you sure you want to assign' + ' ' + this.selectedRMfirstName + ' ' + this.selectedRMlastName + ' ' +  'as RM for the selected users ?'
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.rmMgmtService.submitMultiAssignRM(multipayload).subscribe(res => {
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
            this.onAssignRM('assignRM');
            this.commonDropdown = false;
          }
    
        })
      }
    });
  }
}

  viewDetails(element?: any){
    console.log('id element',element.Action.id);
    this.router.navigateByUrl(`/adminv2/discount-management/view-coupon/${element.Action.id}`);
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
