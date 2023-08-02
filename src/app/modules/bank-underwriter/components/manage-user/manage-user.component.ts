import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserPopupComponent } from '../add-user-popup/add-user-popup.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent implements OnInit {
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  totalItems: any;
  totalPages: any;
  searchValue = '';
  last: any;
  displayColumns = [
    'Date',
    'First Name',
    'Last Name',
    'Email',
    'Credits Used',
    'Quotes Placed',
    'Status',
  ];
  newDataSource: any = [
    {
      Date: '',
      'First Name': '',
      'Last Name': '',
      Email: '',
      'Credits Used': '',
      'Quotes Placed': '',
      Status: '',
    },
  ];
  constructor(private dialog: MatDialog, private bs: BankUnderwriterService) {}

  addbank() {
    const dia = this.dialog.open(AddUserPopupComponent, { autoFocus: false });
    dia.afterClosed().subscribe((res) => {
      this.searchValue = ''
      let data = {
        searchInput: this.searchValue,
        page: this.page.index,
        size: this.page.size,
      };
      this.fetchApiData(data);
    });
  }

  ngOnInit(): void {
    let data = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchApiData(data);
  }

  fetchApiData(data: any) {

    this.bs.getUser(data).subscribe({
      next: (res: any) => {
        console.log(res);
        const { data, page, size, totalElements, totalPages } = res;
        this.page.page = page;
        this.page.size = size;
        this.page.totalElements = totalElements;
        this.page.totalPages = totalPages;
        this.totalItems = totalElements;
        this.totalPages = totalPages;
        this.newDataSource = new MatTableDataSource(
          data?.map((ele: any) => {
            return {
              Date: new Date(ele?.createdOnEpoch),
              'First Name': ele?.firstName,
              'Last Name': ele?.lastName,
              Email: ele?.email,
              'Credits Used': ele?.creditUsed,
              'Quotes Placed': ele?.quotesPlaced,
              Status: ele?.status,
            };
          })
        );
      },
    });
  }

  pageSize: any = 10;
  onPageChange(event) {
    this.page.index = event.pageIndex;
    this.page.size = event.pageSize;
    let payload = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    this.fetchApiData(payload);
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
    let payload = {
      searchInput: this.searchValue,
      page: this.page.index,
      size: this.page.size,
    };
    // console.log(payload);
    this.fetchApiData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      searchInput: this.searchValue,
      page: this.page.index,
      size:this.page.size,
    };
    this.fetchApiData(payload);
  }

  searchData(event: any) {
    this.searchValue = event.target.value;
    let payload = {
      searchInput: this.searchValue,
      page: this.page.index,
      size:this.page.size,
    };
    this.fetchApiData(payload);
  }

  download() {
    this.bs.downloadBankUser().subscribe({
      next: (res) => {
        this.saveFile(res, 'users.csv');
      },
    });
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
}
