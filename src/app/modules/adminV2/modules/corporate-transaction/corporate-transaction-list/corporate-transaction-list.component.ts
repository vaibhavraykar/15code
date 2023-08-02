import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../customers/services/customer.service';
import { CorporateTransactionService } from '../services/corporate-transaction.service';

@Component({
  selector: 'app-corporate-transaction-list',
  templateUrl: './corporate-transaction-list.component.html',
  styleUrls: ['./corporate-transaction-list.component.scss']
})
export class CorporateTransactionListComponent {

  constructor(private corpoService: CorporateTransactionService,private customerService:CustomerService) { }
  @ViewChild('customTable') customTable: any
  data = []
  tableStructure: any ;
  factorEntity:any=[];
  transType:any='ACTIVE';

  ngOnInit(): void {
    this.customerService.selectedTransactionType.subscribe(res=>{
      if(res){
        this.transType = res;
      }
    })
    let payload = {
      page: 0,
      size: 10,
      status: this.transType,
    }
    this.fetchData(payload);
    this.tableStructure = {
      displayColumns: [
        'more',
        'User ID',
      'Assignor/Seller',
      'Debtor/Buyer',
      'Invoice Number',
      'Amount',
      'Financing Period',
      'Transaction ID',
      'Transaction Status',
      'Select Factor',
      'Factor Pricing',
      'Submit',
      'Action',
  
      ],
      dataSource: new MatTableDataSource([]),
      compareDate: false,
  
      page: {
        previousPageIndex: 1,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      },
  
      transaction: {
        showTransType: false,
        selectedTransactionType: this.transType,
        transactionsOption: [
          { value: 'ALL', viewValue: 'All' },
          { value: 'ACTIVE', viewValue: 'Approved' },
          { value: 'PENDING', viewValue: 'Pending' },
          { value: 'REJECTED', viewValue: 'Rejected' },
  
        ]
      },  
    };

  }


  fetchData(payload: any) {
    this.corpoService.getTransactionList(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        this.factorEntity =  response.content.map(x => x.factorEntity)
        let newObs = []
        this.factorEntity.forEach((e) => {
          if (e) 
          {
            newObs.push(e.map(x => x.companyName))
          }else{
            newObs.push(undefined);
          }
        })
        this.factorEntity = newObs;
        this.corpoService.factorEntity.next(this.factorEntity);
        let data = response.content.map((item: any,i) => {
          return {
            'User ID': item?.user.userId,
            'Assignor/Seller': item?.factoringUserType=='DEBTOR'?item?.debtorToAssignor:item?.groupComapany?.companyName,
            'Debtor/Buyer': item?.factoringUserType=='DEBTOR'?item?.groupComapany.companyName:item?.assignorToDebtor,
            'Invoice Number': item?.invoiceNumber,
            'Amount': item?.amount.toLocaleString('en')+'.00',
            'Financing Period': item?.finicingPeriod,
            'Transaction ID': item?.transactionId,
            'Transaction Status': item?.transactionStatus,
            'Select Factor': item?.mtransactionId,
            'Factor Pricing': item?.eligibleFactoringTransactionDto ? item?.eligibleFactoringTransactionDto.length : '0',
            'Submit': item?.mtransactionId,
            'Action': {
              from: 'corporateList',
              data: item,
              id: item?.id,
              factorStatus:item?.factorStatus,
              factorEntity:item?.factorEntity,
              index:i
            }

          }
        })
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
  }
  tableEventEmitter(event) {
    console.log(event)
    switch (event.eventName) {
      case 'paginationButton':
        this.goNextPrevious(event.event)
        break;
      case 'entrySize':
        this.changeEntrySize(event.event)
        break;
      case 'transactionType':
        this.changeTransType(event.event)
        break;
      case 'msgAdded':
        let payload = { page: this.tableStructure.page.pageIndex,size: this.tableStructure.page.pageSize, status: this.tableStructure.transaction.selectedTransactionType,}
        this.fetchData(payload);
    }
  }
  goNextPrevious(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: this.tableStructure.transaction.selectedTransactionType,
    }
    this.fetchData(payload);
  }
  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: this.tableStructure.transaction.selectedTransactionType,
    }
    this.fetchData(payload);
  }
  changeTransType(status: any) {
    let payload = {
      page: 0,
      size: 10,
      status: status,
    }
    this.fetchData(payload);
  }

}
