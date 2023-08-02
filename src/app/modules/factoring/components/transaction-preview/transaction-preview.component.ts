import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-transaction-preview',
  templateUrl: './transaction-preview.component.html',
  styleUrls: ['./transaction-preview.component.scss'],
})
export class TransactionPreviewComponent implements OnInit {
  constructor(
    private router: Router,
    private factoringService: FactoringService
  ) {}
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataSource: any[] = [];
  data: any[] = [];
  selected?: any[];
  allID: any = [];
  dataLength: any = 0;
  pageIndex: any = 0;
  companies:any=[];
  displayedColumns = [
    ['Transaction Number 1', 'Debtor Name 1', 'Amount1', 'Invoice No.1'],
    ['Transaction Number 2', 'Debtor Name 2', 'Amount2', 'Invoice No.2'],
    ['Transaction Number 3', 'Debtor Name 3', 'Amount3', 'Invoice No.3'],
    ['Transaction Number 4', 'Debtor Name 4', 'Amount4', 'Invoice No.4'],
  ];
  assigner: any;

  displayColumns: string[] = [
    'Transaction ID',
    'Product Type',
    'User Type',
    'Status',
    'Amount',
    'Invoice Number',
    'Invoice Date',
    'Tenure',
    'Due Date',
    'Charges On',
    'Grace Period',
    'Country Of Origin',
    'Country Of Discharge',
    'Financing Period',
    'ESG Compliant',
    'Underlying Goods',
    'Extra Underlying Goods',
    'Assignor/Seller',
    'Debtor/Buyer',
  ];

  ngOnInit() {
    let payload = { status: 'PENDING', page: 0, size: 5 };
    this.fetchData(payload);

  }
  render = true;
  fetchData(payload: any) {
    console.log(payload, 'fetch');
    this.factoringService.getListByStatus(payload).subscribe((res: any) => {
      this.data = res.content;
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.dataSource = [];
      this.allID=[];
      for (let i = 0; i < this.data.length; i++) {
        this.allID.push(this.data[i].id);

        this.dataSource.push({
          'Transaction ID': this.data[i].transactionId,
          'Product Type': this.data[i].factoringProductType,
          'User Type': this.data[i].factoringUserType,
          Status: this.data[i].status,
          Amount: this.data[i].amount.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }),
          'Invoice Number': this.data[i].invoiceNumber,
          'Invoice Date': this.data[i].date,
          'Tenure': this.data[i].tenor,
          'Due Date': this.data[i].dueDate,
          'Charges On': this.data[i].chargesOn,
          'Grace Period': this.data[i].gracePeriod,
          'Country Of Origin': this.data[i].countryOrigin,
          'Country Of Discharge': this.data[i].countryDischarge,
          'Financing Period': this.data[i].finicingPeriod,
          'ESG Compliant':this.data[i].isESGCompliant?'YES':'NO',
          'Underlying Goods': this.data[i].underlyingGoods,
          'Extra Underlying Goods':this.data[i].underlyingGoods=='Others'?this.data[i].extraUnderlyingGoods:'',
          'Assignor/Seller': this.data[i].factoringUserType=='ASSIGNOR'?this.data[i].groupComapany?.companyName:this.data[i].debtorToAssignor,
          'Debtor/Buyer': this.data[i].factoringUserType=='ASSIGNOR'?this.data[i].assignorToDebtor:this.data[i].groupComapany?.companyName,
        });
      }
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;

      console.log('ALLID', this.allID);
    });
  }

  selectedTransactions(event: any) {
    let newArr = event.map(ele=>this.data.find(item=>item.transactionId==ele)).map(e=>e.id)
    console.log(newArr);
    this.selected = newArr;
    console.log(this.selected);
  }

  confirm() {
    if (this.selected?.length > 0) {
      this.factoringService.update(this.selected).subscribe((res: any) => {
        console.log(res);
        this.router.navigateByUrl('/factoring/success');
      });
      return;
    }

  }

  selectedTransaction(event: any) {
    console.log(event);

    let selectedData = this.data.find(item=>item.transactionId===event);
    let id = selectedData.id;
    this.router.navigate(['/factoring/view-transaction', id]);
  }

  pagePrevious(e: any) {
    this.page.index = this.page.index - 1;
    let payload = { status: 'PENDING', page: this.page.index, size: 5 };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext(e: any) {
    this.page.index = this.page.index + 1;
    let payload = { status: 'PENDING', page: this.page.index, size: 5 };
    console.log(payload);
    this.fetchData(payload);
  }
}
