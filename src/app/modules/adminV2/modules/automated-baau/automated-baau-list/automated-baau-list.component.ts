import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AutomatedBaauService } from "../services/automated-baau.service";
import { Router } from "@angular/router";
import { CustomerService } from "../../customers/services/customer.service";

@Component({
    selector:'app-automated-baau-list',
    templateUrl:'./automated-baau-list.component.html',
    styleUrls:['./automated-baau-list.component.scss']
})
export class AutomatedBaauListComponent{
    constructor(private automatedbaauService: AutomatedBaauService,private router: Router,private customerService: CustomerService) { }
    @ViewChild('customTable') customTable: any
    data = []
    tableStructure: any;
    transType:any='ALL';
    myRole:any;
    userName:any;
    ngOnInit(): void {
      this.customerService.selectedTransactionType.subscribe(res=>{
        if(res){
          this.transType = res;
        }
      })
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
    this.userName = localStorage.getItem('userName');
    if(this.myRole == 'CUSTOMER_RM' || this.myRole == 'BANK_RM'){
      let payload = {page: 0,size: 10,status: this.transType,userId: this.userName}
      this.fetchData(payload);
    }else{
      let payload = {page: 0,size: 10,status: this.transType}
      this.fetchData(payload);
    }
      this.tableStructure = {
        displayColumns: [
          'more',
          'Entity ID',
          'Bank Name',
          'Bank Country',
          'Total Quotes',
          'Approval',
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
  
        transaction: {
          showTransType: true,
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
      this.automatedbaauService.getAutomatedBaauList(payload).subscribe({
        next: (response: any) => {
          this.tableStructure.page = {
            previousPageIndex: (response.page - 1),
            pageIndex: response.page,
            pageSize: response.size,
            length: response.totalElements,
          }
          let data = response.content.map((item: any) => {
            console.log(item,'item')
            return {
              'Entity ID': item?.entityId,
              'Bank Name': item?.bankName,
              'Bank Country': item?.country,
              'Total Quotes': item?.noOfQuotation,
              'Approval': item?.status,
              'Actions': {
                from: 'automatedbaaulist',
                data: item,
                makerApprovedBy: item?.makerApprovedBy,
              },
             

            }
          })
          console.log(data,'data')
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
        case 'createdSuccessfully':
          if(this.myRole == 'CUSTOMER_RM' || this.myRole == 'BANK_RM'){
            let payload = {page: 0,size: 10, status: this.transType,userId: this.userName}
            this.fetchData(payload);
          }else{
            let payload = {page: 0,size: 10,status: this.transType}
            this.fetchData(payload);
          }
      }
    }
    goNextPrevious(data) {
      if(this.myRole == 'CUSTOMER_RM' || this.myRole == 'BANK_RM'){
        let payload = {page: data.pageIndex,size: data.pageSize,status: this.tableStructure.transaction.selectedTransactionType,userId: this.userName}
        this.fetchData(payload);
      }else{
        let payload = {page: data.pageIndex,size: data.pageSize,status: this.tableStructure.transaction.selectedTransactionType}
        this.fetchData(payload);
      }
    }
    changeEntrySize(data) {
      if(this.myRole == 'CUSTOMER_RM' || this.myRole == 'BANK_RM'){
        let payload = { page: data.pageIndex,size: data.pageSize,status: this.tableStructure.transaction.selectedTransactionType,userId: this.userName}
        this.fetchData(payload);
      }else{
        let payload = { page: data.pageIndex,size: data.pageSize,status: this.tableStructure.transaction.selectedTransactionType}
        this.fetchData(payload);
      }
    }
    changeTransType(status: any) {
      if(this.myRole == 'CUSTOMER_RM' || this.myRole == 'BANK_RM'){
        let payload = {page: 0,size: 10,status: status,userId: this.userName}
        this.fetchData(payload);
      }else{
        let payload = {page: 0,size: 10,status: status}
        this.fetchData(payload);
      }
    }
    newAutoBaau(){
      this.router.navigateByUrl(`/adminv2/automated-baau/create`);
    }
}
