import { Component ,OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../../customers/services/customer.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-baau-quotation',
  templateUrl: './baau-quotation.component.html',
  styleUrls: ['./baau-quotation.component.scss']
})
export class BaauQuotationComponent implements OnInit{
  constructor(private customerService: CustomerService,private route:ActivatedRoute,private location:Location) { 
    this.routelocation = this.location
  }
    @ViewChild('customTable') customTable: any
    routelocation:any;
    data = []
    tableStructure: any = {
      displayColumns: [
        'more',
        'Transaction Id',
        'Quotes',
        'Requirement',
        'Status',
        'Valid Till',
        'Actions',
      ],
      dataSource: new MatTableDataSource([]),
      compareDate: false,

      page: {
        previousPageIndex: 1,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      },
    };
    transactionId:any;
    payload:any;
    countOfQuote :any;
    ngOnInit(): void {
    this.transactionId=this.route.snapshot.paramMap.get('id');
    this.customerService.totalQuoteCount.subscribe(res=>{
      this.countOfQuote =  res;
    })
    this.payload = {page:0, size: 10, status : 'ALL', mid : this.transactionId}
    this.viewDetails(this.payload);

    }
    viewDetails(payload){

      this.customerService.baauquotationById(payload).subscribe({
        next: (response: any) => {
          this.tableStructure.page = {
            previousPageIndex: (response.page - 1),
            pageIndex: response.page,
            pageSize: response.size,
            length: response.totalElements,
          }
          let data = response.content.map((item: any) => {
            return {
              'Transaction Id': item?.transactionId,
              'Quotes': item?.totalQuote.toLocaleString('en')+'.00',
              'Requirement': item?.requirementType,
              'Status': item?.status,
              'Valid Till': item?.quotationValidTill,
              'Actions': {
                from: 'baauquotation',
                quotId:item?.quotationId,
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
      }
    }
    goNextPrevious(data) {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: "ALL",
        mid: this.transactionId
      }
      this.viewDetails(payload);
    }
    changeEntrySize(data) {
      let payload = {
        page: data.pageIndex,
        size: data.pageSize,
        status: "ALL",
        mid: this.transactionId
      }
      this.viewDetails(payload);
    }
}
