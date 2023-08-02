import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RMManagementServices } from '../services/rm-management-services.services';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-rm-list',
  templateUrl: './rm-list.component.html',
  styleUrls: ['./rm-list.component.scss']
})
export class RmListComponent {
  constructor(private router: Router, 
    private rmMgmtServices: RMManagementServices, private customerService: CustomerService
    ) { 
      
    }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any ;
  userType:any='CUSTOMER';
  


  ngOnInit(): void {
    this.customerService.selectedUserTypeForTable.subscribe(res => {
      if (res) {
        this.userType = res;
      }
    })
    let payload = {
      page: 0,
      size: 10,
      status: 'COMPLETED',
      subscriberType: this.userType
    }
    this.fetchData(payload);
    this.tableStructure = {
      displayColumns: [
        'more',
        'select',
        'User Id',
        'User Type',
        'Company/Bank',
        'First Name',
        'Last Name',
        'Email ID',
        'Country',
        'Status',
        'Select RM',
        'Action',
        
      ],
      dataSource: new MatTableDataSource([]),
      // compareDate: true,
      // columnKeys: [],
      // filters: [],
  
      page: {
        previousPageIndex: 1,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      },
  
      transaction: {
        showTransType: false,
        selectedTransactionType: 'MAKER_APPROVED',
  
      },
      applicableEntity: {
        showapplicableEntity: true,
        showapplicableEntityType: this.userType,
        applicableEntityOption: [
          { value: 'CUSTOMER', viewValue: 'Customer' },
          { value: 'BANK', viewValue: 'BAAC' },
          { value: 'BANK_AS_UNDERWRITER', viewValue: 'BAAU' },
          { value: 'REFERRER', viewValue: 'Referrer' },
        ]
      }
  
    };
  

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
      case 'assignRM':
        this.onAssignRM(event.event)
        break;
      case 'applicableEntType':
        this.changeapplicableEntityType(event.event)
        break;
      // case 'filter':
      //   this.applyFilter(event.event);
      //   break;
    }
  }

  changeTransType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: 'COMPLETED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }

  changeapplicableEntityType(subscriberType: any){
    let payload = {
      page: 0,
      size: 10,
      status: 'COMPLETED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }
  
  fetchData(payload: any) {
    this.rmMgmtServices.rmSelected(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'User Id': item?.personalDetails.username,
            'User Type': item?.personalDetails.subscriberType,
            'Company/Bank': (this.tableStructure.applicableEntity.showapplicableEntityType === 'CUSTOMER' || this.tableStructure.applicableEntity.showapplicableEntityType === 'REFERRER') ? item?.businessDetails.companyName : item?.businessDetails.bankName,
            'First Name': item?.personalDetails.firstName,
            'Last Name': item?.personalDetails.lastName,
            'Email ID': item?.personalDetails.email,
            'Country': item?.personalDetails.country,
            'Status': item.businessDetails.rmStatusType,
            'Action' : {
              from: 'rm_list',
              id: item?.personalDetails.id,
              country: item?.personalDetails.country,
              subscriberType: item?.personalDetails.subscriberType,
              name: item?.businessDetails.rmUser.firstName + ' ' + item?.businessDetails.rmUser.lastName
            }
          }
        })
        // this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
  }

  
  goNextPrevious(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: 'COMPLETED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }

  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: 'COMPLETED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }
  onAssignRM(assignRM) {
    let payload = {
      page: 0,
      size: 10,
      status: 'COMPLETED',
      subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
    }
    this.fetchData(payload);
  }

  // getColumnKeys() {
  //   this.rmMgmtServices.metaFilter().subscribe((res: any) => {
  //     const newData = res.data;
  //     console.log('Data', newData);
  //     const fieldInfo = newData[0].fieldInfo;
  //     this.tableStructure.columnKeys = fieldInfo.map((field) => ({
  //       value: field.key,
  //       viewValue: field.key.toUpperCase(),
  //       fieldType: this.getType(field.value),
  //     }));

  //     console.log(this.tableStructure.columnKeys);
  //   })
  // }

  // getType(value) {
  //   switch (value) {
  //     case 'long':
  //       return 'STRING';
  //     case 'String':
  //       return 'STRING';
  //     case 'double':
  //       return 'NUMBER';
  //     case 'Boolean':
  //       return 'BOOLEAN';
  //     case 'Integer':
  //       return 'INTEGER';
  //     default:
  //       return 'UNKNOWN';
  //   }
  // }

  // applyFilter(e) {
  //   console.log(e)
  //   if (e.filters[0].key && e.filters[0].fieldType && e.filters[0].operator && e.filters[0].value) {
  //     this.fetchFilteredSearch(e);
  //   } else {
  //     let payload = {
  //       page: 0,
  //       size: 10,
  //       status: 'COMPLETED',
  //       subscriberType: this.tableStructure.applicableEntity.showapplicableEntityType
  //     };
  //     this.fetchData(payload);
  //   }

  // }

  // fetchFilteredSearch(e) {
  //   if(Array.isArray(e)){
  //     var updatedFilters = e.map((filter) => {
  //       return {
  //         ...filter,
  //         statusType: 'COMPLETED'
  //       };
  //     });
  //     console.log(updatedFilters);
  //   }else{
  //     e.statusType = 'COMPLETED'
  //     updatedFilters = e;
  //   }
  //   this.rmMgmtServices.getFilterd(e).subscribe({
  //     next: (res: any) => {
  //       let response = res.content;
  //       this.tableStructure.page = {
  //         previousPageIndex: res.page - 1,
  //         pageIndex: res.page,
  //         pageSize: res.size,
  //         length: res.totalElements,
  //       };
  //       let data = response.map((item: any) => {
  //         return {
  //           'User Id': item?.personalDetails.username,
  //           'User Type': item?.personalDetails.subscriberType,
  //           'Company/Bank': (this.tableStructure.applicableEntity.showapplicableEntityType === 'CUSTOMER' || this.tableStructure.applicableEntity.showapplicableEntityType === 'REFERRER') ? item?.businessDetails.companyName : item?.businessDetails.bankName,
  //           'First Name': item?.personalDetails.firstName,
  //           'Last Name': item?.personalDetails.lastName,
  //           'Email ID': item?.personalDetails.email,
  //           'Country': item?.personalDetails.country,
  //           'Status': item.businessDetails.rmStatusType,
  //           'Action' : {
  //             from: 'rm_list',
  //             id: item?.personalDetails.id,
  //             country: item?.personalDetails.country,
  //             subscriberType: item?.personalDetails.subscriberType,
  //             name: item?.businessDetails.rmUser.firstName + ' ' +  item?.businessDetails.rmUser.lastName
  //           },
  //         };
  //       });
  //       this.tableStructure.dataSource = new MatTableDataSource(data);
  //       this.customTable.refreshTable();
  //     },
  //   });
  // }


}
