import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-transaction-tab',
  templateUrl: './dashboard-transaction-tab.component.html',
  styleUrls: ['./dashboard-transaction-tab.component.scss'],
})
export class DashboardTransactionTabComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dateChange(_E) {
    let data = {
      start: this.range.value.start,
      end: this.range.value.end,
    };
  }
}
