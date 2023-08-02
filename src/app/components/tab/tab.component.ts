import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit, OnChanges {
  @Input() tabsVisited: any;
  @Input() selectedIndex: any;
  @Input() disableTab: boolean;
  @Input() labels: any[];
  index: any;
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();
  changedindex: any;
  total: any;
  selectedTabLabel: any;

  ngOnInit() {
    this.total = this.labels?.length;
  }
  ngOnChanges(event: any) {
    if (event.disableTab) {
      this.disableTab = event.disableTab.currentValue;
    }
    if (event.selectedIndex) {
      this.selectedIndex = event.selectedIndex.currentValue;
    }
  }

  selectedTab(e: any) {
    this.clickEvent.emit(this.labels[e.index]);
    this.index = e.index - 1;
    this.selectedTabLabel = this.labels[this.index];
    console.log('The Label', this.selectedTabLabel);
    console.log('Selected Index', this.index);
    console.log('Tab Data status', this.tabsVisited);
  }

  selectedIndexChange(event) {
    console.log(event);
    this.changedindex = event;
  }

  getVisited() {
    if (
      this.tabsVisited['SELECT PRODUCT'] &&
      !this.tabsVisited['TRANSACTION DETAILS']
    ) {
      return { visited_both: true, visited_one: true };
    }
    if (
      this.tabsVisited['SELECT PRODUCT'] &&
      this.tabsVisited['TRANSACTION DETAILS']
    ) {
      return { visited_both: true };
    }

    if (
      !this.tabsVisited['SELECT PRODUCT'] &&
      !this.tabsVisited['TRANSACTION DETAILS']
    ) {
      return {};
    }
    return {};
  }
}
