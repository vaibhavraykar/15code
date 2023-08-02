import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../../transaction/services/transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddGroupCompanyPopupComponent } from '../add-group-company-popup/add-group-company-popup.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  date: string;
  company: string;
  country: string;
  kycStatus: string;
  status: string;

}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {company: 'CU231121BGDCONF1893', date: 'DD/MM/YYYY', country: 'Confirmation', email: 'name.surname@email.com', status: 'name.surname@email.com'}
// ];

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss'],
})
export class ManageGroupsComponent implements OnInit {
  displayedColumns: string[] = [
    // 'date',
    'company',

    'country',
    'kycStatus',
    'status',
  ];
  dataSource: any = [];
  totalSubsidiaries: any;
  utilizedSubsidiaries: any;
  userEmailID: any;
  totalItems: any;
  totalPages: any;
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  searchValue: any = '';

  constructor(public ts: TransactionService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userEmailID = JSON.parse(localStorage.getItem('userDetails'))?.email;
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchData(data);
  }

  fetchData(data: any) {
    this.ts.getGroupCompanyList(data).subscribe((res: any) => {
      const { data, page, size, totalElements, totalPages } = res;
      this.page.page = page;
      this.page.size = size;
      this.page.totalElements = totalElements;
      this.page.totalPages = totalPages;
      this.totalItems = totalElements;
      this.totalPages = totalPages;
      this.totalSubsidiaries = data[0]?.totalPlanSubsidiaries;
      this.utilizedSubsidiaries = data[0]?.utilizedSubsidiaries;
      this.dataSource = new MatTableDataSource(
        data[0]?.businessDetails?.map((ele: any) => {
          return {
            date: ele?.createdOnEpoch,
            company: ele?.companyName,
            country: ele?.addressDetails?.registeredCountry,
            status: ele?.status || 'NA',
            kycStatus: ele?.kycDetails?.documentList[0]?.status,
          };
        })
      );
      console.log(this.dataSource);
    });
  }
  refresh() {
    this.searchValue = '';
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchData(data);
  }

  addCoompany() {
    let data:any ={
      viewType:'default',
    }
    if(this.totalSubsidiaries <= this.utilizedSubsidiaries ){
      data.viewType = 'renew';
    }

    const popup = this.dialog.open(AddGroupCompanyPopupComponent, {
      data: data,
      autoFocus:false
    });
    popup.afterClosed().subscribe((res: any) => {
      this.refresh();
    });
  }

  onPageChange(event) {
    this.page.index = event.pageIndex;
    this.page.size = event.pageSize;
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchData(data);
  }

  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) < this.page?.totalElements
        ? this.page.size * (this.page.index + 1)
        : this.page?.totalElements;
    if (this.page.index == 0) {
      if (this.page.size >= this.page.totalElements) {
        return `1 - ${this.page.totalElements}`;
      } else {
        return `1 - ${this.page.size}`;
      }
    } else {
      return `${this.page.index * this.page.size + 1} - ${this.last} `;
    }
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchData(data);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchData(data);
  }

  searchFilter(filterValue: any) {
    // filterValue = filterValue.value.trim();
    // filterValue = filterValue.toLowerCase();
    // this.dataSource.filter = filterValue;
    this.searchValue = filterValue.value;
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchData(data);
  }

  downloadCompanies() {
    this.ts.downloadGroupCompanies().subscribe({
      next: (res) => {
        this.saveFile(res, 'groupCompany.csv');
      },
    });
  }

  async saveFile(res: any, name: any) {
    let link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
      this.convertToCSV(res)
    )}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // this.notifyService.showSuccess('Success',`${name} download successfully`)
  }

  convertToCSV(apiResponse) {
    let lines = apiResponse.split('\n');
    let csv = '';

    lines.forEach(function (line) {
      let values = line.split(',');
      let formattedLine = '';

      values.forEach(function (value, index) {
        if (index === values.length - 1) {
          formattedLine += value.trim();
        } else {
          formattedLine += value.trim() + ',';
        }
      });

      csv += formattedLine + '\n';
    });

    return csv;
  }
}
