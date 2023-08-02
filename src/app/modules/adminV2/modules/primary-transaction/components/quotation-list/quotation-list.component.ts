import { Component,ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimaryTransactionServicesService } from '../../services/primary-transaction-services.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent {
  constructor(private location:Location,private router: Router,private route: ActivatedRoute, private primaryTransactionService: PrimaryTransactionServicesService) { 
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
    this.primaryTransactionService.quoatationById(this.transactionId).subscribe({
      next: (response: any) => {
        console.log('res', response);
        let data = response.data.map((item: any) => {
          return {
            'Transaction Id': item?.transactionId,
            'Bank': item?.bankName,
            'Total Quote': item?.totalQuote.toLocaleString('en'),
            'Status': item?.status,
            ...(item?.status === 'ACTIVE' && { 'Valid Till': item?.quotationValidTill }),
            'Action':{
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
