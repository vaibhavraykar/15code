import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserManagementServices } from '../services/user-mgmt-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approve-reject-user',
  templateUrl: './approve-reject-user.component.html',
  styleUrls: ['./approve-reject-user.component.scss']
})
export class ApproveRejectUserComponent implements OnInit {
  constructor(private router: Router, private userMgmtService: UserManagementServices) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any = {
    displayColumns: [
      'more',
      'EMP ID',
      'First Name',
      'Last Name',
      'Designation',
      'Mobile No',
      'Reporting Manager',
      'Status',
      'Action'
    ],
    dataSource: new MatTableDataSource([]),
    // compareDate: true,
    columnKeys: [],
    filters: [],

    page: {
      previousPageIndex: 1,
      pageIndex: 0,
      pageSize: 10,
      length: 0,
    },

    transaction: {
      showTransType: false,
      selectedTransactionType: 'PENDING',
    }

  };



  ngOnInit(): void {
    let payload = {
      page: 0,
      size: 10,
      status: 'PENDING',
      subscriberType: 'ADMIN'
    }
    this.fetchData(payload);

  }


  tableEventEmitter(event) {
    console.log(event)
    switch (event.eventName) {
      case 'paginationButton':
        this.goNextPrevious(event.event)
        break;
      case 'entrySize':
        this.changeEntrySize(event.event)
        break;
      case 'userApproval':
        this.onUpdate(event.event)
        break;
      case 'filter':
        this.applyFilter(event.event);
        break;
    }
  }

  fetchData(payload: any) {
    this.userMgmtService.getAdminUserList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'EMP ID': item?.userId,
            'First Name': item?.firstName,
            'Last Name': item?.lastName,
            'Designation': item?.designation,
            'Mobile No': item?.mobileNo,
            'Reporting Manager': item?.reportingManager,
            'Status': item?.status,
            'Action': {
              from: 'approval_user',
              id: item?.id,
              makerApprovedBy: item?.makerApprovedBy,
              userId: item?.userId
            }

          }
        })
        this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
  }

  addUser() {
    this.router.navigateByUrl('/adminv2/user-management/add-user');
  }

  goNextPrevious(data) {
    if (this.tableStructure.filters.length > 0) {

      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    } else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'PENDING',
        subscriberType: 'ADMIN'
      }
      this.fetchData(payload);
    }
  }

  changeEntrySize(data) {
    if (this.tableStructure.filters.length > 0) {

      let payload = {
        ...this.tableStructure.filtersPayload,
        page: data.pageIndex,
        size: data.pageSize,
      };
      this.fetchFilteredSearch(payload);
    } else {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: 'PENDING',
        subscriberType: 'ADMIN'
      }
      this.fetchData(payload);
    }
  }
  onUpdate(aprroveReject) {
    let payload = {
      page: 0,
      size: 10,
      status: 'PENDING',
      subscriberType: 'ADMIN'
    }
    this.fetchData(payload);
  }

  getColumnKeys() {
    this.userMgmtService.metaFilter().subscribe((res: any) => {
      const newData = res.data;
      console.log('Data', newData);
      const fieldInfo = newData[0].fieldInfo;
      this.tableStructure.columnKeys = fieldInfo.map((field) => ({
        value: field.key,
        viewValue: field.key.toUpperCase(),
        fieldType: this.getType(field.value),
      }));

      console.log(this.tableStructure.columnKeys);
    })
  }

  getType(value) {
    switch (value) {
      case 'long':
        return 'LONG';
      case 'String':
        return 'STRING';
      case 'double':
        return 'DOUBLE';
      case 'Boolean':
        return 'BOOLEAN';
      case 'Integer':
        return 'INTEGER';
      default:
        return 'UNKNOWN';
    }
  }

  applyFilter(e) {
    console.log(e)
    if (e.filters[0].key && e.filters[0].fieldType && e.filters[0].operator && e.filters[0].value) {
      this.fetchFilteredSearch(e);
    } else {
      let payload = {
        page: 0,
        size: 10,
        status: 'PENDING',
        subscriberType: "ADMIN"
      };
      this.fetchData(payload);
    }

  }

  fetchFilteredSearch(e) {
    if(Array.isArray(e)){
      var updatedFilters = e.map((filter) => {
        return {
          ...filter,
          statusType: 'PENDING',
        };
      });
      console.log(updatedFilters);
    }else{
      e.statusType = 'PENDING',
      updatedFilters = e;
    }
    this.userMgmtService.getFilterd(e).subscribe({
      next: (res: any) => {
        let response = res.content;
        this.tableStructure.page = {
          previousPageIndex: res.page - 1,
          pageIndex: res.page,
          pageSize: res.size,
          length: res.totalElements,
        };
        let data = response.map((item: any) => {
          return {
            'EMP ID': item?.userId,
            'First Name': item?.firstName,
            'Last Name': item?.lastName,
            'Designation': item?.designation,
            'Mobile No': item?.mobileNo,
            'Reporting Manager': item?.reportingManager,
            'Status': item?.status,
            'Action': {
              from: 'approval_user',
              id: item?.id,
              makerApprovedBy: item?.makerApprovedBy,
              userId: item?.userId
            },
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
