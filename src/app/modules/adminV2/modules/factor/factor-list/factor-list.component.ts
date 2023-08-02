import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FactorService } from '../services/factor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factor-list',
  templateUrl: './factor-list.component.html',
  styleUrls: ['./factor-list.component.scss']
})
export class FactorListComponent {

  constructor(private factorService: FactorService, private router:Router) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any = {
    displayColumns: [
      'more',
      'Factor ID',
      'Factor Name',
      'Factor Country',
      'Status',
      'Actions',
    ],
    dataSource: new MatTableDataSource([]),
    compareDate: false,
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
    },
  };



  ngOnInit(): void {
    let payload = {
      page: 0,
      size: 10
    }
    this.fetchData(payload);

  }


  fetchData(payload: any) {
    this.factorService.getAllFactorList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'Factor ID': item?.entityId,
            'Factor Name': item?.companyName,
            'Factor Country': item?.country,
            'Status': item?.status,
            'Actions': {
              from: 'factorList',
              data: item,
              makerApprovedBy:item?.makerApprovedBy,
              id:item?.id
            }

          }
        })
        this.tableStructure.columnKeys = this.getColumnKeys();
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
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
      case 'updated':
        let payload = {page: 0,size: 10}
        this.fetchData(payload);
        break;
      // case 'filter':
      //   this.applyFilter(event.event);
      //   break;
    }
  }
  goNextPrevious(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
    }
    this.fetchData(payload);
  }
  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
    }
    this.fetchData(payload);
  }
  newFactor(){
    this.router.navigate(['adminv2/factor/create']);
  }
  getColumnKeys() {
    this.factorService.metaFilter().subscribe((res: any) => {
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
      };
      this.fetchData(payload);
    }

  }

  fetchFilteredSearch(e) {
    this.factorService.getFilterd(e).subscribe({
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
            'Factor ID': item?.entityId,
            'Factor Name': item?.companyName,
            'Factor Country': item?.country,
            'Status': item?.status,
            'Actions': {
              from: 'factorList',
              data: item,
              makerApprovedBy:item?.makerApprovedBy,
              id:item?.id
            }
          };
        });
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable();
      },
    });
  }
}
