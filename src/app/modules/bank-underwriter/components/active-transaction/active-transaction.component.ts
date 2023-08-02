import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BankUnderwriterService } from "../../services/bank-underwriter.service";
import { TransactionService } from "src/app/modules/customer/transaction/services/transaction.service";
import { FilterPopupComponent } from "../../popup/esgcomplaint/filter/filter-popup/filter-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicElement {
  "Transaction ID": string;
  "Issuing Country": string;
  "Transaction Validity": string;
  Amount: string;
  "Issuance Bank:": string;
  "Applicant Name": string;
  "Beneficiary Name": string;
  Product: string;
  "Product Value": string;
  "Transaction Valid till": string;
  Quote: string;
  "Quote Valid till": string;
  "Quote Rank": string;
}

@Component({
  selector: "app-active-transaction",
  templateUrl: "./active-transaction.component.html",
  styleUrls: ["./active-transaction.component.scss"],
})
export class ActiveTransactionComponent implements OnInit {
  selectedUser='';
  isTransactionFreeze= false
  displayColumns = [
    "Transaction ID",
    "Issuing Country",
    "Transaction Validity",
    'Currency',
    "Amount",
    "Issuance Bank",
    "Applicant Name",
    "Beneficiary Name",
    "Product",
    "Transaction Valid till",
    "Quote",
    "Quote Valid till",
    "Quote Rank",
    "Action",
  ];
  // dataSource:PeriodicElement[]=[];
  newDataSource: any =[];
  // searchInput: FormControl;
  userDetails: any;
  totalItems: number;
  totalPages: number;
  dataLength: any = 0;
  pageIndex: any = 0;
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  transactionDetails: any;
  searchForm:FormGroup;

  productsTypes:any[] =[
    { name:'Confirmation',value:'CONFIRMATION'},
    { name:'Discounting',value:'DISCOUNTING'},
    { name:'Confirmation & Discounting',value:'CONFIRMANDDISCOUNT'},
    { name:'Refinancing',value:'REFINANCE'},
    { name:'Bankers Acceptance',value:'BANKER'},
    { name:'Bank Guarantee',value:'BANKGUARANTEE'},
    { name:'Avalisation',value:'BILLAVALISATION'}
  ]

  constructor(
    private router: Router,
    private bankService: BankUnderwriterService,
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchForm=new FormGroup({
      searchInput:new FormControl('')
    })
    this.userDetails = JSON.parse(localStorage.getItem("userInfo"));
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: ["PLACED","FREEZE"],
      subscriberType: this.userDetails?.subscriberType,
      userId: this.selectedUser,
      transactionId: "",
    };
    this.fetchData(data);
  }

  findProductName(name:any){
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value.toLowerCase()===name.toLowerCase()
    )
    console.log(product)
    return product.name.toUpperCase();
  }

  fetchData(data: any) {
    this.isTransactionFreeze =false
    this.bankService.getQuotation(data).subscribe((res: any) => {
      this.transactionDetails = res.data;
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.newDataSource = res.data
        .filter((item: any) => {
          return item?.quotationsList[0].status === "PLACED" || item?.quotationsList[0].status === "FREEZE";
        })
        .map((item: any) => {
if(item?.quotationsList[0].status === "FREEZE"){
  this.isTransactionFreeze= true
}
          return  {
            // if(true){
            //   return {
            "quotationList":item?.quotationsList[0],
            "Transaction ID": item?.transactionId,
            "Issuing Country": item?.lCIssuanceCountry,
            "Transaction Validity": item?.validity,
            'Currency':item?.lCCurrency,
            Amount: item?.lCValue,
            "Issuance Bank": item?.lCIssuanceBank,
            "Applicant Name": item?.applicantName,
            "Beneficiary Name": item?.beneName,
            Product: this.findProductName(item?.requirementType),
            "Product Value": "",
            "Transaction Valid till": item?.transactionValidTill,
            Quote: item?.quotationCount
              ? item?.quotationCount
              : item?.quotationsList
              ? item.quotationsList.length
              : 0,
            "Quote Valid till": item?.quotationsList
              ? item?.quotationsList[0].quotationValidTill
              : 0,
            "Quote Rank": item?.quotationsList
              ? item?.quotationsList[0].quotationRank
              : 0,
            Action: item?.reopen,
            //   }
            // }
          }
        });
        this.bankService.getCreditUpdate.next(true);
    });
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
      status: ["PLACED","FREEZE"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
      userId: this.selectedUser,
    };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: ["PLACED","FREEZE"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
      userId: this.selectedUser,
    };
    console.log(payload);
    this.fetchData(payload);
  }

  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) < this.page?.totalElements
        ? this.page.size * (this.page.index + 1)
        : this.page?.totalElements;
    if (this.page.index == 0) {
      if (this.page.size >= this.page.totalElements) {
        return `1 - ${this.page.totalElements}`;
      } else {
        return `1 - ${this.page.size}`;
      }
    } else {
      return `${this.page.index * this.page.size + 1} - ${this.last} `;
    }
  }

  search(e: any) {
    this.page.index=0;
    console.log(e.target.value);
    let payload = {
      status: ["PLACED","FREEZE"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: e.target.value,
      userId: this.selectedUser,
    };
    console.log(payload);
    this.fetchData(payload);
  }

  openQuotes(id: any, quoteCount: any) {
    if (quoteCount > 0) {
      console.log(id);
      // this.router.navigateByUrl(`/customer/transactions/quote?transactionId=${id}`)
    }
  }

  // To Got to Quote Place Quote
  placeQuote(id: any) {
    console.log(id);
    const quoteid = this.transactionDetails.filter(
      (item: any) => item.transactionId === id
    );
    console.log(quoteid);
    this.router.navigateByUrl(
      `/bank-underwriter/quote-details?quoteId=${quoteid[0].quotationsList[0].quotationId}`
    );
  }

  // View Details
  viewDetails(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/transaction-details?transactionId=${id}`
    );
  }
  downloadCSV() {
    console.log(this.page);
    let payload = {
      page: this.page.index,
      size: this.page.size,
      status: ["PLACED","FREEZE"],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
      userId: this.selectedUser,
    };
    this.bankService.generateCSV(payload).subscribe((res: any) => {
      console.log(res.data);
      window.open(res.data[0].url);
    });
  }
  refresh(){
    this.page.index = 0;
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: ["PLACED","FREEZE"],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(data);
  }
  filter(){
  const dialog=  this.dialog.open(FilterPopupComponent,{
      data:{
        filterType:'additional_user',
        user:this.selectedUser
      }
    })
    dialog.afterClosed().subscribe({
      next:(res)=>{
        if(res?.user){
          this.page.index=0;
          let data = {
            page: this.page.index,
            size: this.page.size,
            status: ["PLACED","FREEZE"],
            subscriberType: this.userDetails?.subscriberType,
            userId: res.user,
            transactionId: "",
          };

          this.fetchData(data);
          this.selectedUser=res.user
        }else{
          let data = {
            page: this.page.index,
            size: this.page.size,
            status: ["PLACED","FREEZE"],
            subscriberType: this.userDetails?.subscriberType,
            userId: '',
            transactionId: "",
          };
          this.fetchData(data);
          this.selectedUser=''
        }
      }
    })
  }
  validate(id){
    this.router.navigateByUrl(
      `/bank-underwriter/transaction-details?transactionId=${id}`
    );
  }

  onPageChange(event: any) {
      console.log(event);
      this.page.index = event.pageIndex;
      let payload = {
        page: this.page.index,
        size: event.pageSize,
        status: ['PLACED', 'FREEZE'],
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload);
    }
}
