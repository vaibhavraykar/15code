import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { TransactionService } from '../../services/transaction.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterTransactionsPopupComponent } from '../filter-transactions-popup/filter-transactions-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CloseTransactionComponent } from '../close-transaction/close-transaction.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

// export interface PeriodicElement {
//   'Transaction ID':string;
//   'Amount':string;
//   'Applicant':string;
//   'Beneficiary':string;
//   'Quotes recieved': string;
//   'Status':string;
// }

export interface PeriodicElement {
  transactionID:string;
  amount:string;
  applicant:string;
  beneficiary:string;
  quotes:string;
  status:string;
  // name: string;
  // position: number;
  // weight: number;
  // symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  // {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  // {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  // {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  // {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  // {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  // {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-previous-transaction',
  templateUrl: './previous-transaction.component.html',
  styleUrls: ['./previous-transaction.component.scss']
})
export class PreviousTransactionComponent {
  // displayColumns:string[]=['Transaction ID', 'Amount', 'Applicant', 'Beneficiary', 'Quotes recieved', 'Status'];
  // dataSource :any;
  transStatus:any[]=["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED"]
  displayedColumns: string[] = ['transactionID', 'currency' ,'amount', 'applicant', 'beneficiary','quotes','status','actions'];
  dataSource = ELEMENT_DATA;
  pageData = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  newDataSource:PeriodicElement[];
  totalItems:number;
  totalPages:number;
  dataLength: any = 0;
  pageIndex: any = 0;
  groupCompanies:any;
  last:any;
  userDetails:any;
  // searchInput:FormControl;
  subsidiaryID:any;
  passcodeUserId:any;
  searchForm:FormGroup;
  selected:any;

  constructor(
    public dialog: MatDialog,
    private router:Router,
    private transactionService:TransactionService,
    private customerService:CustomerServicesService,
    private authService: AuthService
    ){}

  ngOnInit():void{
    if (sessionStorage.getItem('filter')) {
    this.transStatus = JSON.parse(sessionStorage.getItem('filter'));
    console.log(this.transStatus)
  }
    this.searchForm=new FormGroup({
      searchInput:new FormControl('')
    })
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.userDetails);
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    // })
    let data={
      "page":this.pageData.index,
      "size":this.pageData.size,
      "status":this.transStatus,
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
      }
      this.fetchData(data);
      this.selected="Open";
  }

  fetchData(data:any){
    this.transactionService.findTransactions(data).subscribe((res:any)=>{
      let response=res.data;
      this.pageData.page=res.page;
      this.pageData.size=res.size;
      this.pageData.totalElements=res.totalElements;
      this.pageData.totalPages = res.totalPages;
      this.totalItems=res.totalElements;
      this.totalPages=res.totalPages;
      console.log(response);
      this.newDataSource=response.map((item:any)=>{
      return {
        'transactionID':item?.transactionId,
        'currency':item?.lCCurrency,
        'amount':item?.lCValue,
        'applicant':item?.applicantName?item?.applicantName:this.getGroupCompanyName(item?.subsidaryId),
        'beneficiary':item?.beneName?item?.beneName:this.getGroupCompanyName(item?.subsidaryId),
        'quotes':item?.quotationCount,
        'status':item?.transactionStatus
      };
      })
      console.log(this.newDataSource);
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
        this.customerService.getCreditUpdate.next(true);

        this.authService.getUserDetails().subscribe();
    })
  }

  editActiveSelectedTransaction(e:any, status:any){
    if(status == 'ACTIVE') {
      console.log(e,`/customer/transactions/view?transactionId=${e}`, status);
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'active'}});
    } else if(status == 'ACCEPTED') {
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'accepted'}});
    } else if(status == 'REJECTED') {
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'rejected'}});
    } else if(status == 'EXPIRED') {
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'expired'}});
    } else if(status == 'CLOSED') {
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'close'}});
    } else if(status == 'CANCELLED') {
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'cancelled'}});
    } else if(status == 'PENDING') {
      this.router.navigateByUrl(`/customer/transactions/view-details?transactionId=${e}`,{state:{from:'pending'}});
    }
    // console.log(e,`/customer/transactions/view?transactionId=${e}`);
    // this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`,{state:{type:'active'}});
  }
  downloadCSVInv(id:any){
    let dataPrevious={
      "page":this.pageData.index,
      "size":this.pageData.size,
      "status":  this.transStatus,
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":this.subsidiaryID?`${this.subsidiaryID}`:'',
      "passCodeUserId":this.passcodeUserId?this.passcodeUserId:'',
      "transactionId":id
      }
      this.transactionService.generateCSV(dataPrevious).subscribe((res:any)=>{
        console.log(res.data);
        window.open(res.data[0].url)
      })
  }

  // downloadSelected(e:any){
  //   console.log(e);
  //   let payload={
  //     "page":0,
  //     "size":5,
  //     "status":"ACTIVE",
  //     "subscriberType": this.userDetails.subscriberType,
  //     "subsidaryId":"",
  //     "passCodeUserId":"",
  //     "transactionId":e
  //   }
  //   this.transactionService.generateCSV(payload).subscribe((res:any)=>{
  //     console.log(res.data);
  //     window.open(res.data[0].url)
  //   })
  // }

  getGroupCompanyName(id:any){
    let companyName = this.groupCompanies?.businessDetails.find((item:any)=>item.id==id)
    return companyName?.companyName;
  }


  editSelected(e:any){
    console.log(e,`/customer/transactions/view?transactionId=${e}`);
    this.router.navigateByUrl(`/customer/transactions/view?transactionId=${e}`);
  }

  pagePrevious() {
    this.pageData.index = this.pageData.index - 1;
    let payload = { "status":this.transStatus,
    "page": this.pageData.index,
    'size': this.pageData.size ,
    "subscriberType": this.userDetails.subscriberType,
    "subsidaryId":"",
    "passCodeUserId":"",
    "transactionId":""
   };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.pageData.index = this.pageData.index + 1;
    let payload = { 'status': this.transStatus,
    'page': this.pageData.index,
    'size': this.pageData.size ,
    "subscriberType": this.userDetails.subscriberType,
    "subsidaryId":"",
    "passCodeUserId":"",
    "transactionId":""};
    console.log(payload);
    this.fetchData(payload);
  }

  getPage() {
    this.last =
      this.pageData.size * (this.pageData.index + 1) <
      this.pageData?.totalElements
        ? this.pageData.size * (this.pageData.index + 1)
        : this.pageData?.totalElements;
    if (this.pageData.index == 0) {
      if (this.pageData.size >= this.pageData.totalElements) {
        return `1 - ${this.pageData.totalElements}`;
      } else {
        return `1 - ${this.pageData.size}`;
      }
    } else {
      // this.last =
      //   this.pageData.size * (this.pageData.index + 1) <
      //   this.pageData?.totalElements
      //     ? this.pageData.size * (this.pageData.index + 1)
      //     : this.pageData?.totalElements;

      return `${this.pageData.index * this.pageData.size + 1} - ${this.last} `;
    }
  }

  downloadCSV(){
    console.log(this.pageData);
    let payload={
      "page":this.pageData.index,
      "size":this.pageData.size,
      "status":this.transStatus,
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
    }
    this.transactionService.generateCSV(payload).subscribe((res:any)=>{
      console.log(res.data);
      window.open(res.data[0].url)
    })
  }

  search(e:any){
    this.pageData.index=0;
    console.log(e.target.value)
    let data = {
      page: this.pageData.index,
      size: this.pageData.size,
      status: this.transStatus,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: e.target.value,
    };
      this.fetchData(data);
  }

  reset(){
    this.pageData.index=0;
    this.transStatus=["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED"]
    sessionStorage.setItem('filter', JSON.stringify([...this.transStatus]));
    let data={
      "page":this.pageData.index,
      "size":this.pageData.size,
      "status":["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED"],
      "subscriberType": this.userDetails.subscriberType,
      "subsidaryId":"",
      "passCodeUserId":"",
      "transactionId":""
      }
      this.fetchData(data);
  }

  closeTransaction(e:any,id:any){
    console.log(e.value);
    if(e.value=='Close'){
      console.log('hi',id)
      const popup = this.dialog.open(CloseTransactionComponent,
        {
          data:{
            transactionId:id,
          }
        }
        )

        popup.afterClosed().subscribe((res: any) =>{
          this.transStatus = ["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED"];
          this.selected='Open';
          this.pageData.index=0;
          let data = {
            status: this.transStatus,
            page: this.pageData.index,
            size: this.pageData.size,
            subscriberType: this.userDetails?.subscriberType,
            subsidaryId: '',
            passCodeUserId: '',
            transactionId: '',
          };
          this.fetchData(data);
        })
    }
  }

  filter(){
    console.log("Enter")
    const filterpopup = this.dialog.open(FilterTransactionsPopupComponent,{data:{
      from:'PREVIOUS_TRANSACTION'
    }});
    filterpopup.afterClosed().subscribe(res=>{
      console.log(res);
      this.subsidiaryID=res.data.subsidaryId;
      this.passcodeUserId=res.data.passcodeUserId;
      this.transStatus = res.data.status!==''?[res.data.status]:this.transStatus;
      this.pageData.index=0;
      sessionStorage.setItem('filter', JSON.stringify([...this.transStatus]));
      let data={
        "page":this.pageData.index,
        "size":this.pageData.size,
        "status":  this.transStatus||["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED"],
        "subscriberType": this.userDetails.subscriberType,
        "subsidaryId":this.subsidiaryID?`${this.subsidiaryID}`:'',
        "passCodeUserId":this.passcodeUserId?this.passcodeUserId:'',
        "transactionId":""
        }
        this.fetchData(data);
    })
  }
  quoteDetails(id:any,status:any) {
    console.log(status)
    this.getQuoteId(id,status)
  }
  getQuoteId(id:any,status:any){
    let payload={
      "page":0,
      "size":100,
      "transactionId":id,
      "status":[status]
    }
    this.transactionService.findQuotations(payload).subscribe({
      next: (res: any) => {
        const { data } = res
        if (data?.length > 0) {
          this.router.navigateByUrl(`/customer/transactions/quotes-details?quoteId=${data[0].quotationId}`)
        }
      }
    })
  }

  onPageChange(event:any){
      console.log(event)
      this.pageData.index = event.pageIndex;
      let payload = {
        page: this.pageData.index,
        size: event.pageSize,
        status: this.transStatus,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload)
    }
}
