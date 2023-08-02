import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import * as _moment from 'moment';
import { filter, of } from 'rxjs';
import { Adminv2Service } from 'src/app/modules/adminV2/services/adminv2.service';
interface Field {
  value: string;
  viewValue: string;
  valueTo: string;
}

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss'],
})
export class FilterPopupComponent implements OnInit {
  filterFormCopy = {};
  clearAllForm = false;
  dateOpen = false;
  dateOpen2 = false;
  currentDateValueIndex = 0;
  fieldTypes = {
    BOOLEAN: ['EQUAL', 'NOT_EQUAL'],
    CHAR: ['EQUAL', 'NOT_EQUAL'],
    // DATE: ['EQUAL', 'NOT_EQUAL', 'BETWEEN'],
    DATE: ['BETWEEN'],
    DOUBLE: ['EQUAL', 'NOT_EQUAL', 'BETWEEN'],
    INTEGER: ['EQUAL', 'NOT_EQUAL', 'IN', 'BETWEEN'],
    LONG: ['EQUAL', 'NOT_EQUAL', 'IN', 'BETWEEN'],
    STRING: ['EQUAL', 'NOT_EQUAL', 'LIKE', 'NOTLIKE', 'IN'],
  };

  operators = ['EQUAL', 'NOT_EQUAL', 'LIKE', 'NOTLIKE', 'IN', 'BETWEEN'];
  fields = [];
  filterForm = [];
  ngOnInit(): void {
    this.fields = this.data.columnKeys.filter(
      (E) => !['more', 'select', 'Action'].includes(E)
    );
    this.filterForm = JSON.parse(JSON.stringify(this.data.filters));
    this.filterFormCopy = JSON.parse(JSON.stringify(this.data.filters));
    this.intiateForm();
  }

  intiateForm() {
    if (this.filterForm.length > 0) {
    } else {
      this.filterForm.push(this.createItem());
    }
  }
  today = new Date();

  createItem() {
    return {
      field: '',
      fieldType: '',
      operator: '',
      value: '',
      valueTo: '',
      from: '',
      to: '',
    };
  }
  addItem(): void {
    if (this.checkValidation(this.filterForm).length == 0) {
      const newItem = this.createItem();
      const fieldType = newItem.fieldType;
  
      if (fieldType === 'INTEGER' || fieldType === 'DOUBLE') {
        newItem.value = null;
        newItem.valueTo = null;
      }
  
      this.filterForm.push(newItem);
      console.log(this.filterForm);
    }
  }
  removeRow(index) {
    this.filterForm.splice(index, 1);
  }
  isOpenCalender = {
    for: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<FilterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminv2Services: Adminv2Service
  ) {}

  startDateControl = new FormControl();
  endDateControl = new FormControl();

  close() {
    this.dialogRef.close();
  }
  open(index) {
    this.isOpenCalender.for = index;
  }
  getType(index) {
    switch (this.filterForm[index]['fieldType']) {
      case 'BOOLEAN':
        return 'boolean';
      case 'DATE':
        if (this.filterForm[index]['operator'] === 'BETWEEN') {
          return 'date';
        } else {
          return 'date_single';
        }
      case 'INTEGER':
        case 'DOUBLE':
          if (this.filterForm[index]['operator'] === 'BETWEEN') {
            return 'number_range';
          } else {
            return 'number_single';
          }

      default:
        return 'default';
    }
  }
  addGroup() {}

  date = _moment().format('YYYY-MM-DD');

  formatDate(date?) {
    return date;
  }
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('menuTrigger2') menuTrigger2: MatMenuTrigger;
  dateEmit(e, menu) {
    this.menuTrigger.closeMenu();
    this.filterForm[this.isOpenCalender.for].from = e.startDate;
    this.filterForm[this.isOpenCalender.for].to = e.endDate;
    this.dateOpen = false;
  }
  dateEmit2(e, menu) {
    this.menuTrigger2.closeMenu();
    this.filterForm[this.isOpenCalender.for].from = e.startDate;
    (this.filterForm[this.isOpenCalender.for].to = ''),
      (this.dateOpen2 = false);
  }
  getCurrentDateData() {
    if (
      this.filterForm[this.isOpenCalender.for].from &&
      this.filterForm[this.isOpenCalender.for].to
    ) {
      return {
        startDate: this.filterForm[this.isOpenCalender.for].from,
        endDate: this.filterForm[this.isOpenCalender.for].to,
        type: 'range',
      };
    } else {
      return {
        startDate: '',
        endDate: '',
        type: 'range',
      };
    }
  }
  getCurrentDateData2() {
    if (this.filterForm[this.isOpenCalender.for].from) {
      return {
        startDate: this.filterForm[this.isOpenCalender.for].from,
        endDate: '',
        type: 'single',
      };
    } else {
      return {
        startDate: '',
        endDate: '',
        type: 'single',
      };
    }
  }
  clearAll() {
    this.filterForm = [];
    this.filterForm.push(this.createItem());
    this.clearAllForm = true;
  }
  applyFilter() {
    let payload = {
      filters: [...this.createFilterPayload(this.filterForm)],

      sorts: [
        {
          key: 'updatedOn',

          direction: 'DESC',
        },
      ],

      page: this.data.page.pageIndex,

      size: this.data.page.pageSize,
    };
    console.log(JSON.stringify(payload));
    if (this.clearAllForm) {
      this.dialogRef.close({
        payload: payload,
        filterApplied: this.filterForm,
      });
    } else {
      if (this.checkValidation(this.filterForm).length == 0) {
        this.dialogRef.close({
          payload: payload,
          filterApplied: this.filterForm,
        });
      }
    }
  }
  cancel() {
    this.dialogRef.close({
      response: [],
      filterApplied: this.filterFormCopy,
    });
  }
  checkValidation(formData) {
    let err = [];
    for (let i = 0; i < formData.length; i++) {
      const field = formData[i].field;
      const fieldType = formData[i].fieldType;
      const operator = formData[i].operator;
      const value = formData[i].value;
      const valueTo = formData[i].valueTo;
      const from = formData[i].from;
      const to = formData[i].to;
      if (!field) {
        err.push({
          index: i,
          errorType: 'Invalid Field',
          field: 'field',
        });
      }
      if (!fieldType) {
        err.push({
          index: i,
          errorType: 'Invalid Field',
          field: 'fieldType',
        });
      }
      if (!operator) {
        err.push({
          index: i,
          errorType: 'Invalid Field',
          field: 'operator',
        });
      }

      if (fieldType === 'DATE') {
        if (operator === 'BETWEEN') {
          if (!from || !to) {
            err.push({
              index: i,
              errorType: 'Invalid Date',
              field: !from ? 'from' : 'to',
            });
          }
          if (!to) {
            err.push({
              index: i,
              errorType: 'Invalid Date',
              field: 'to',
            });
          }
        } else {
          if (!from) {
            err.push({
              index: i,
              errorType: 'Invalid Date',
              field: !from ? 'from' : 'to',
            });
          }
        }
      } else if (fieldType === 'INTEGER' || fieldType === 'DOUBLE') {
        if (operator === 'BETWEEN') {
          if (!value || !valueTo) {
            err.push({
              index: i,
              errorType: 'Invalid Value',
              field: !value ? 'value' : 'valueTo',
            });
          }
          if (!valueTo) {
            err.push({
              index: i,
              errorType: 'Invalid Value',
              field: 'valueTo',
            });
          }
        } else {
          if (!value) {
            err.push({
              index: i,
              errorType: 'Invalid Value',
              field: !value ? 'value' : 'valueTo',
            });
          }
        }
      } else {
        if (!value) {
          err.push({
            index: i,
            errorType: 'Invalid Value',
            field: 'value',
          });
        }
      } 
    }

    return err;
  }
  createFilterPayload(formData) {
    let data = [];
    for (let i = 0; i < formData.length; i++) {
      const field = formData[i].field;
      const fieldType = formData[i].fieldType;
      const operator = formData[i].operator;
      const value = formData[i].value;
      const valueTo = formData[i].valueTo;
      const from = formData[i].from;
      const to = formData[i].to;

      let item: any = {};
      item.key = field;
      item.operator = operator;
      item.fieldType = fieldType;

      if (fieldType == 'DATE') {
        if (operator === 'BETWEEN') {
          item.value = `${_moment(from).format('DD-MM-YYYY')} 00:00:00`;
          item.value_to = `${_moment(to).format('DD-MM-YYYY')} 23:59:59`;
        } else {
          item.value = `${_moment(from).format('DD-MM-YYYY')} 00:00:00`;
        }
      } else {
        if (operator === 'IN') {
          item.value = value?.split(',');
        } else {
          item.value = value;
        }
      }
      data.push(item);
      if (fieldType == 'INTEGER' || fieldType == 'DOUBLE') {
        if (operator === 'BETWEEN') {
          item.value = value;
          item.valueTo = valueTo;
        } else {
          item.value = value;
        }
      } else {
        if (operator === 'IN') {
          item.value = value?.split(',');
        } else {
          item.value = value;
        }
      }
    }
    return data;
  }
  selectionChangeField(event, i) {
    this.filterForm[i].fieldType = this.fields.find(
      (e: any) => e.value === event.value
    ).fieldType;
    console.log(
      this.fields.find((e: any) => e.value === event.value).fieldType
    );
  }
  getOperators(fieldType: any) {
    const applicableOperators = this.fieldTypes[fieldType];
    return applicableOperators;
  }
  getFieldType() {
    return Object.keys(this.fieldTypes);
  }
  getTransformedOperator(operator: string): string {
    switch (operator) {
      case 'EQUAL':
        return 'Equal';
      case 'NOT_EQUAL':
        return 'Not Equal';
      case 'BETWEEN':
        return 'Between';
      case 'IN':
        return 'In';
      case 'LIKE':
        return 'Like';
      case 'NOTLIKE':
        return 'Not Like';
      default:
        return operator;
    }
    // return operator
  }
}
