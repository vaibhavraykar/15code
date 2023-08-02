import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SecondaryTransactionServices } from '../services/sec-transaction-services.services';

@Component({
  selector: 'app-sec-quotation-list',
  templateUrl: './sec-quotation-list.component.html',
  styleUrls: ['./sec-quotation-list.component.scss']
})
export class SecQuotationListComponent {
  constructor(private location:Location,private router: Router,private route: ActivatedRoute, private secondaryTranServices: SecondaryTransactionServices) { 
    this.routelocation = this.location
  }
  @ViewChild('customTable') customTable: any;
  routelocation:any;
  transactionId:any;
  data = []
  tableStructure: any = {
    displayColumns: [
      'Transaction Id',
      'Bank',
      'Total Quote',
      'Status',
      'Valid Till',
    ],
    dataSource: new MatTableDataSource([]),
    // compareDate: true,

    page: {
      previousPageIndex: 1,
      pageIndex: 0,
      pageSize: 10,
      length: 0,
    },

  };



  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.transactionId = params['id'];
      console.log('id',this.transactionId);
      this.fetchData();
    })

  }

  fetchData() {
    this.secondaryTranServices.quoatationById(this.transactionId).subscribe({
      next: (response: any) => {
        console.log('res', response);
        let data = response.data.map((item: any) => {
          return {
            'Transaction Id': item?.transactionId,
            'Bank': item?.bankName,
            'Total Quote': item?.totalQuote ? item?.totalQuote:'NA',
            'Status': item?.quotationStatus,
            ...(item?.quotationStatus === 'ACTIVE' && { 'Valid Till': item?.quotationValidTill }),
            'Action':{
              from: 'quotation_list',
              quoteId: item?.quotationId
            }

          }
        })
        this.tableStructure.dataSource = new MatTableDataSource(data);
        this.customTable.refreshTable()
      }
    })
  }

}
