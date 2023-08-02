import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-revenue-tab',
  templateUrl: './dashboard-revenue-tab.component.html',
  styleUrls: ['./dashboard-revenue-tab.component.scss'],
})
export class DashboardRevenueTabComponent {
  dataSource: any = [
    {
      countryName: 'cccc',
      totalCustomers: 'cccc',
      totalUnderwriters: 'cccc',
      totalTransactions: 'cccc',
      cumulativeValue: 'cccc',
    },
    {
      countryName: 'cccc',
      totalCustomers: 'cccc',
      totalUnderwriters: 'cccc',
      totalTransactions: 'cccc',
      cumulativeValue: 'cccc',
    },
  ];
  columns: string[] = [
    'countryName',
    'totalCustomers',
    'totalUnderwriters',
    'totalTransactions',
    'cumulativeValue',
  ];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  range2 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dateChange(_E) {
    let data = {
      start: this.range.value.start,
      end: this.range.value.end,
    };
  }
  paginationEmitter($: any) {
    // this.pageButtonEmitter.emit($);
    // this.combinedEmitter.emit({
    //   eventName: 'paginationButton',
    //   event: $,
    // });
  }
  changeEntriesSize($: any) {
    // this.paginator.pageIndex = 0;
    // let data = {
    //   pageSize: $.value,
    //   pageIndex: 0,
    // };
    // this.pageSizeChangeEmitter.emit(data);
    // this.combinedEmitter.emit({
    //   eventName: 'entrySize',
    //   event: data,
    // });
  }
}
