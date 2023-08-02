import { Component } from '@angular/core';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent {
  tab:any;
  isClick:boolean = false;
  selectedProduct:any;
  tabsVisited:any ={
    'SELECT PRODUCT':false,
    'TRANSACTION DETAILS':false
  }

  labels:any=[
    'SELECT PRODUCT',
    'TRANSACTION DETAILS'
  ];

  tabSelected:any;

  ngOnInit(){
    this.tabSelected=this.labels[0];
  }

  changeHandler(e:any){
    this.tabSelected=e;
  }


  next(event:any){
    console.log(event);
    this.isClick = true;
    this.tab=1;
    this.tabsVisited['SELECT PRODUCT']=true;
  }
  back(event:any){
    console.log(event);
    this.isClick = true;
    this.tab=0;
    this.tabsVisited['TRANSACTION DETAILS']=true;
  }

  chosenProduct(event:any){
    console.log(event);
    this.selectedProduct=event;
  }

}
