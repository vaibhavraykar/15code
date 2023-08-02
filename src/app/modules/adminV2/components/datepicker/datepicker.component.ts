import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AllMaterialModule } from 'src/app/material-module';
import * as _moment from 'moment';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: true,
  imports: [AllMaterialModule],
})
export class DatepickerComponent implements OnInit {
  double = false;
  ngOnInit(): void {
    this.startDate = this.inputData.startDate;
    this.endDate = this.inputData.endDate;
    if (this.inputData.type == 'range') {
      this.double = true;
    } else {
      this.double = false;
    }
  }
  @Input() inputData: any;
  @Output() dateEmit = new EventEmitter<any>();
  startDate = '';
  endDate = '';
  maxdate = _moment().format('YYYY-MM-DD');
  trigger() {

    if(this.double){
      if (this.startDate && this.endDate) {
        this.dateEmit.emit({
          startDate: _moment(this.startDate).format('YYYY-MM-DD'),
          endDate: _moment(this.endDate).format('YYYY-MM-DD'),
        });
      }
    }
  else{
      if (this.startDate) {
      this.dateEmit.emit({
        startDate: _moment(this.startDate).format('YYYY-MM-DD')
      });
    }
  }
  }
}
