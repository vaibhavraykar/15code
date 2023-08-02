import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { CustomPaginator } from './CustomPaginator';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../common-popup/common-popup.component';
import { PrimaryTransactionServicesService } from '../../modules/primary-transaction/services/primary-transaction-services.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class TableComponent implements OnInit {
  columnChange = false;
  selectedColumns = [];
  allCountries = [];
  selection: any = new SelectionModel<any>(true, []);
  selectedValue: string;
  transactions: any[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  @Input() tableData: any;
  @Input() tableStructure: any;
  @Output() transactionTypeChangeHandler: any = new EventEmitter<any>();
  @Output() dateChangeHandler: any = new EventEmitter<any>();
  @Output() pageButtonEmitter: any = new EventEmitter<any>();
  @Output() pageSizeChangeEmitter: any = new EventEmitter<any>();
  @Output() tableSearchHandler: any = new EventEmitter<any>();
  @Output() combinedEmitter: any = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _liveAnnouncer: LiveAnnouncer,
    public router: Router,
    public apiService: ApiService,
    public dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.fetchFilterAPis();
    this.initiateTable();

  }

  ngAfterViewInit() {
    this.refreshTable();
  }

  namingColumn(name: any) {
    switch (name) {
      case 'B_Country':
        return 'Country';
      case 'A_Country':
        return 'Country';
      default:
        return name;
    }
  }

  initiateTable() {
    this.allColumnsHeader = this.tableStructure.displayColumns
      .map((_e: any) => {
        if (!['more'].includes(_e)) {
          return {
            name: _e,
            selected: true,
          };
        } else {
          return null;
        }
      })
      .filter((_e) => _e !== null);
    this.selectedColumns = JSON.parse(JSON.stringify(this.allColumnsHeader)); //clone table headers
    this.tableStructure.dataSource.paginator = this.paginator;
  }

  refreshTable() {
    this.tableStructure.dataSource.sort = this.sort;
    // this.tableStructure.dataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableStructure.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.tableStructure.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  viewTransaction(element?: any) {
    this.router.navigateByUrl(`/adminv2/view/${element['Transaction ID']}`);
  }

  approveTransaction(element?: any) {

  }

  rejectTransaction(element?: any) {

  }

  // column filter section
  onMenuOpened() {
    this.selectedColumns = JSON.parse(JSON.stringify(this.allColumnsHeader)); //clones and set value
  }
  onMenuClosed() {}
  onColumnSelect(_e: any, item: any) {
    if (_e.checked) {
      const index = this.selectedColumns.findIndex(
        (_e: any) => _e.name === item.name
      );
      this.selectedColumns[index].selected = true;
    } else {
      const index = this.selectedColumns.findIndex(
        (_e: any) => _e.name === item.name
      );
      this.selectedColumns[index].selected = false;
    }
  }
  onMenuKeyDown(_e: any, i: any) {}
  allColumnsHeader = [];

  dateChange(_E) {
    let data = {
      start: this.range.value.start,
      end: this.range.value.end,
    };
    this.dateChangeHandler.emit(data);
    this.combinedEmitter.emit({
      eventName: 'dateRange',
      event: data,
    });
  }
  openFilterMenu(name: any) {
    console.log(name);
  }

  countries$: Observable<any[]>;
  countrySelected() {}
  filterCountries(_e) {
    let val = _e.target.value;
    if (!val) {
      this.countries$ = of(this.allCountries);
    } else {
      this.countries$ = of(
        this.allCountries.filter((ele) =>
          ele.name.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  }

  fetchFilterAPis() {
    this.apiService.getAllCountryCode().subscribe({
      next: ({ data }: any) => {
        this.allCountries = data[0].countryNames.map((ele: any) => {
          return { name: ele, selected: false };
        });
        this.createDynamicMethods();
      },
    });
  }
  createDynamicMethods() {
    for (const property of this.tableStructure.displayColumns) {
      if (!['more', 'select', 'Action'].includes(property)) {
        const methodName = `filter${property.replace(/\s/g, '')}`;
        this.tableStructure[methodName] = {
          count: 0,
          method: function (array, value) {
            console.log(methodName);
          },
        };
        if (['B_Country', 'A_Country'].includes(property)) {
          this.tableStructure[methodName].countries = this.allCountries;
          this.tableStructure[methodName].countries$ = of(this.allCountries);
          this.tableStructure[methodName].countrySelected = (
            _e: any,
            item: any
          ) => {
            let index = this.tableStructure[methodName].countries.findIndex(
              (_e) => _e.name.toLowerCase() === item.name.toLowerCase()
            );
            if (_e.checked) {
              this.tableStructure[methodName].countries[index].selected = true;
            } else {
              this.tableStructure[methodName].countries[index].selected = false;
            }
          };
          this.tableStructure[methodName].applyFilters = () => {
            let count = this.tableStructure[methodName].countries.filter(
              (_e) => _e.selected == true
            );
            this.tableStructure[methodName].count = count.length;
            this.tableStructure[methodName].countries$ = of(
              this.tableStructure[methodName].countries
            );
          };
          this.tableStructure[methodName].clearFilters = () => {
            this.tableStructure[methodName].countries$ = of(
              this.allCountries.map((_e: any) => {
                return { name: _e.name, selected: false };
              })
            );
            this.tableStructure[methodName].count = 0;
          };
          this.tableStructure[methodName].filterCountries$ = (_e: any) => {
            let val = _e.target.value;
            if (!val) {
              this.tableStructure[methodName].countries$ = of(
                this.tableStructure[methodName].countries
              );
            } else {
              this.tableStructure[methodName].countries$ = of(
                this.tableStructure[methodName].countries.filter((ele) =>
                  ele.name.toLowerCase().includes(val.toLowerCase())
                )
              );
            }
          };
        }
      }
    }
  }
  isFilterApplied(col) {
    return this.tableStructure[`filter${col}`]?.count || 0;
  }
  getCountries$(name: any) {
    return this.tableStructure[`filter${name}`];
  }
  transactionTypeChange(_e) {
    this.transactionTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'transactionType',
      event: _e.value,
    });
  }

  saveColumnFilter() {
    let columnheaders = this.selectedColumns
      .filter((_e) => _e.selected)
      .map((_ele) => _ele.name);
    console.log(columnheaders);
    this.tableStructure.displayColumns = ['more', ...columnheaders];
    this.allColumnsHeader = this.selectedColumns;
  }
  checkSelection(row: any) {
    return this.selection.isSelected(row);
  }

  changeEntriesSize($: any) {
    this.paginator.pageIndex = 0;
    let data = {
      pageSize: $.value,
      pageIndex: 0,
    };
    this.pageSizeChangeEmitter.emit(data);
    this.combinedEmitter.emit({
      eventName: 'entrySize',
      event: data,
    });
  }
  paginationEmitter($: any) {
    this.pageButtonEmitter.emit($);
    this.combinedEmitter.emit({
      eventName: 'paginationButton',
      event: $,
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let data = filterValue.trim().toLowerCase();
    this.tableSearchHandler.emit(data);
    this.combinedEmitter.emit({
      eventName: 'search',
      event: data,
    });
  }
}
