import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss'],
})
export class NewTransactionComponent {
  tab: any;
  isClick: boolean = false;
  selectedProduct: any;
  disableTab: boolean = true;

  tabsVisited: any = {
    'SELECT PRODUCT': false,
    'TRANSACTION DETAILS': false,
  };

  labels: any = ['SELECT PRODUCT', 'TRANSACTION DETAILS'];

  tabSelected: any;

  ngOnInit() {
    this.tabSelected = this.labels[0];
  }

  changeHandler(e: any) {
    this.tabSelected = e;
    // this.tab = 1;
    console.clear();
    if (this.tabSelected === 'TRANSACTION DETAILS') {
      this.tab = 1;
    } else {
      this.tab = 0;
    }

    console.log(this.tabSelected, 'change Handler');
    // this.disableTab = false;
  }

  disableHandle(e: any) {
    console.log(e);
  }

  next(event: any) {
    console.log(event);
    this.isClick = true;
    this.tab = 1;
    console.log(event, 'next Handler');
    // this.tabsVisited['SELECT PRODUCT'] = true;
  }
  back(event: any) {
    console.log(event);
    this.isClick = true;
    this.tab = 0;
    this.tabsVisited['TRANSACTION DETAILS'] = true;
    console.log('back Handler');
  }

  chosenProduct(event: any) {
    this.selectedProduct = event;
    this.tabsVisited['SELECT PRODUCT'] = true;
  }
  disableEmitter(e: any) {
    if (e) {
      this.disableTab = false;
    } else {
      this.disableTab = true;
    }
  }
}
