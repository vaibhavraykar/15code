import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-transaction-details-list',
  templateUrl: './transaction-details-list.component.html',
  styleUrls: ['./transaction-details-list.component.scss'],
})
export class TransactionDetailsListComponent {
  dataSource: any[] = [];
  data: any[] = [];
  selected?: any[];
  companies?:any[]=[];
  dataLength: any = 0;
  pageIndex: any = 0;

  displayColumns: string[] = [
    'Transaction ID',
    'Date & Time',
    'Debtor/Buyer',
    'Invoice Number',
    'Amount',
    'Financing Period',
    'Pricing',
    'Status',
  ];
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  constructor(
    private factoringService: FactoringService,
    private router: Router
  ) {}

  ngOnInit() {
    // forkJoin([this.factoringService.getListByStatus({status:"PENDING","page":0,"size":5,}), this.factoringService.getListByStatus({status:"ACTIVE","page":0,"size":5})]).subscribe((res:any)=>{
    //   console.log(res,'res');
    //   let arr = [...res[0]?.content,...res[1]?.content].map((ele:any)=>{
    //     return{
    //       'Transaction ID':ele.id,          
    //         'Date & Time':ele.date,
    //         'Debtor': ele.debtor,
    //         'Invoice Number':ele.invoiceNumber,
    //         'Amount':ele.amount,
    //         'Validity Date':ele.transactionValidityDate,
    //         'Status':ele.status,
    //     }
    //   });
    //   this.dataSource=arr
    // })
    let payload = { status: 'ACTIVE', page: 0, size: 5 };
    this.fetchData(payload);
    
  }
  fetchData(payload: any) {
    this.factoringService.getListByStatus(payload).subscribe((res: any) => {
      if(res){
        console.log(res, 'res');
      this.data = res.content;
      console.log(this.data, 'data');

      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.dataSource = [];
      for (let i = 0; i < this.data.length; i++) {
        this.data[i];
        console.log(this.data[i], 'data 1');
        

        this.dataSource.push({
          'Transaction ID': this.data[i].transactionId,
          'Date & Time': this.data[i].date,
          'Debtor/Buyer': this.data[i].factoringUserType=='DEBTOR'?this.data[i].groupComapany?.companyName:this.data[i].assignorToDebtor,
          'Invoice Number': this.data[i].invoiceNumber,
          Amount: this.data[i].amount.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }),
          'Financing Period': this.data[i].finicingPeriod,
          Pricing : this.data[i].eligibleFactoringTransactionDto ? this.data[i].eligibleFactoringTransactionDto?.length : 0,
          Status: this.data[i].status,
        });
      }

      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
      }
      else{
        this.dataSource=[]
      }
    });
  }
  selectedTransaction(event: any) {
    console.log(event);
    let selectedID= this.data.find(item=>item.transactionId==event);
    let id = selectedID.id;
    console.log(id, 'id');
    this.router.navigate(['/factoring/view-transaction', id]);
  }
  pagePrevious(e: any) {
    this.page.index = this.page.index - 1;
    let payload = { status: 'ACTIVE', page: this.page.index, size: 5 };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext(e: any) {
    this.page.index = this.page.index + 1;
    let payload = { status: 'ACTIVE', page: this.page.index, size: 5 };
    console.log(payload);
    this.fetchData(payload);
  }
  viewPrice(eve:any){
    this.data.forEach(item=>{
      if(item.transactionId == eve.id){
        let id = item.id;
        console.log(item.id);
        this.router.navigate(['/factoring/view-pricing',id]);
      }
    });
  }
}
