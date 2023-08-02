import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
//
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FilterComponent } from "../../popup/esgcomplaint/filter-second/filter/filter.component";
import { MoreOptionsPopupComponent } from "../../popup/esgcomplaint/more-options/more-options-popup/more-options-popup.component";
import { CloseTransactionPopupComponent } from "../../popup/close-transaction/close-transaction-popup/close-transaction-popup.component";
import { BankUnderwriterService } from "../../services/bank-underwriter.service";
import { TransactionService } from "src/app/modules/customer/transaction/services/transaction.service";
//
export interface PeriodicElement {
  "Transaction ID": string;
  "Issueing Country": string;
  // "Transaction Validity": string;
  Amount: string;
  "Issuance Bank": string;
  "Applicant Name": string;
  "Beneficiary Name": string;
  Product: string;
  "Product Value": string;
  // "Transaction Valid till": string;
  Quote: string;
  // "Quote Valid till": string;
  "Quote Rank": string;
}

export interface PeriodicElement2 {
  // position: number;
  transactionId: number;
  issuingCountry: string;
  transactionValidity: string;
  amount: string;
  issuanceBank: string;
  applicantName: string;
  beneficiaryName: string;
  product: string;
  productValue: string;
  transactionValid: string;
  quote: string;
  quoteValid: string;
  quoteRank: string;
  action: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    transactionId: 19,
    issuingCountry: "10/10/2023",
    transactionValidity: "City Bank",
    amount: "India",
    issuanceBank: "Milk",
    applicantName: "100",
    beneficiaryName: "herfsrff",
    product: "htgeqw",
    productValue: "25/09/2023",
    transactionValid: "",
    quote: "",
    quoteValid: "",
    quoteRank: "",
    action: "",
  },
];

@Component({
  selector: "app-all-transaction",
  templateUrl: "./all-transaction.component.html",
  styleUrls: ["./all-transaction.component.scss"],
})
export class AllTransactionComponent implements OnInit {
  displayedColumns2: string[] = [
    "transactionId",
    "issuingCountry",
    // "transactionValidity",
    'currency',
    "amount",
    "issuanceBank",
    "applicantName",
    "beneficiaryName",
    "product",
    // "transactionValid",
    "quote",
    // "quoteValid",
    "quoteRank",
    'status',
    "action",
  ];
  displayedColumnsActive: string[] = [
    "transactionId",
    "issuingCountry",
    // "transactionValidity",
    "amount",
    "issuanceBank",
    "applicantName",
    "beneficiaryName",
    "product",
    "productValue",
    // "transactionValid",
    "quote",
    // "quoteValid",
    "quoteRank",
    "status",
    "action",
  ];
  dataSource2: PeriodicElement2[] = [];
  displayedColumns = [
    "transactionId",
    "issuingCountry",
    "transactionValidity",
    "amount",
    "issuanceBank",
    "applicantName",
    "beneficiaryName",
    "product",
    "productValue",
    "transactionValid",
    "quote",
    "quoteValid",
    "quoteRank",
    "action",
  ];
  dataSource: PeriodicElement[] = [];
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
  totalItemsAll: number;
  totalPagesAll: number;
  dataLengthAll: any = 0;
  pageIndexAll: any = 0;
  lastAll: any;
  pageAll = {
    index: 0,
    page: 0,
    size: 5,
    totalElementsAll: 0,
    totalPagesAll: 0,
  };
  selected:any;
  filterBy: any = ["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"];


  productsTypes:any[] =[
    { name:'Confirmation',value:'CONFIRMATION'},
    { name:'Discounting',value:'DISCOUNTING'},
    { name:'Confirmation & Discounting',value:'CONFIRMANDDISCOUNT'},
    { name:'Refinancing',value:'REFINANCE'},
    { name:'Bankers Acceptance',value:'BANKER'},
    { name:'Bank Guarantee',value:'BANKGUARANTEE'},
    { name:'Avalisation',value:'BILLAVALISATION'}
  ]

  //
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private bankService: BankUnderwriterService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.searchForm=new FormGroup({
      searchInput: new FormControl('')
    })
    this.userDetails = JSON.parse(localStorage.getItem("userInfo"));
    let data = {
      page: this.page.index,
      size: this.page.size,
      status:this.filterBy,
      subscriberType: this.userDetails?.subscriberType,
      userId: "",
      transactionId: "",
    };
    this.fetchData(data);
    // this.fetchDataAll(data);
    this.selected='Open';
  }

  findProductName(name:any){
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value===name
    )
    console.log(product)
    return product.name.toUpperCase();
  }

  fetchData(data: any) {
    this.bankService.getQuotation(data).subscribe((res: any) => {
      this.transactionDetails = res.data;
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource2 = res.data
        .map((item: any) => {
          return {
            transactionId: item?.transactionId,
            issuingCountry: item?.lCIssuanceCountry,
            transactionValidity: item?.validity,
            currency: item?.lCCurrency,
            amount: item?.lCValue,
            issuanceBank: item?.lCIssuanceBank,
            applicantName: item?.applicantName,
            beneficiaryName: item?.beneName,
            product: this.findProductName(item?.requirementType),
            productValue: "",
            transactionValid: item?.transactionValidTill,
            status: item?.transactionStatus,
            quote: item?.quotationCount
              ? item?.quotationCount
              : item?.quotationsList
              ? item.quotationsList.length
              : 0,
            quoteValid: item?.quotationsList
              ? item.quotationsList[0]?.quotationValidTill
              : "-",
            quoteRank: item?.quotationsList
              ? item.quotationsList[0]?.quotationRank
              : 0,
              quoteId:item?.quotationsList?item.quotationsList[0]?.quotationId:0,
            action: "",
          };
        })
        // .filter((item: any) => item.quote > 0);
        this.bankService.getCreditUpdate.next(true);
    });
  }

  fetchDataAll(data: any) {
    this.bankService.getQuotation(data).subscribe((res: any) => {
      this.pageAll.page = res.page;
      this.pageAll.size = res.size;
      this.pageAll.totalElementsAll = res.totalElements;
      this.pageAll.totalPagesAll = res.totalPages;
      this.totalItemsAll = res.totalElements;
      this.totalPagesAll = res.totalPages;
      this.dataSource = res.data
        .map((item: any) => {
          return {
            transactionId: item?.transactionId,
            issuingCountry: item?.lCIssuanceCountry,
            transactionValidity: item?.validity,
            amount: item?.lCValue,
            issuanceBank: item?.lCIssuanceBank,
            applicantName: item?.applicantName,
            beneficiaryName: item?.beneName,
            product:this.findProductName(item?.requirementType),
            productValue: "",
            transactionValid: item?.transactionValidTill,
            quote: item?.quotationCount
              ? item?.quotationCount
              : item?.quotationsList
              ? item.quotationsList.length
              : 0,
            quoteValid: item?.quotationsList
              ? item.quotationsList[0]?.quotationValidTill
              : "-",
            quoteRank: item?.quotationsList
              ? item.quotationsList[0]?.quotationRank
              : 0,
            action: "",
          };
        })
        // .filter((item: any) => item.quote > 0);
    });
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
    };
    console.log(payload);
    this.fetchData(payload);
  }
  pagePreviousAll() {
    this.pageAll.index = this.pageAll.index - 1;
    let payload = {
      status: this.filterBy,
      page: this.pageAll.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
    };
    console.log(payload);
    this.fetchDataAll(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: this.filterBy,
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
    };
    console.log(payload);
    this.fetchData(payload);
  }

  pageNextAll() {
    this.pageAll.index = this.pageAll.index + 1;
    let payload = {
      status: this.filterBy,
      page: this.pageAll.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
    };
    console.log(payload);
    this.fetchDataAll(payload);
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

  getPageAll() {
    this.lastAll =
      this.pageAll.size * (this.pageAll.index + 1) <
      this.pageAll?.totalElementsAll
        ? this.pageAll.size * (this.pageAll.index + 1)
        : this.pageAll?.totalElementsAll;
    if (this.pageAll.index == 0) {
      if (this.pageAll.size >= this.pageAll.totalElementsAll) {
        return `1 - ${this.pageAll.totalElementsAll}`;
      } else {
        return `1 - ${this.pageAll.size}`;
      }
    } else {
      return `${this.pageAll.index * this.pageAll.size + 1} - ${this.lastAll} `;
    }
  }
  filter() {
    const dialog = this.dialog.open(FilterComponent, {
      data: {
        filterBy: this.filterBy,
      },
    });
    dialog.afterClosed().subscribe((res: any) => {
      if (res?.filter) {
        this.page.index=0;
        this.filterBy = res.filterBy !== 'ALL' ? [res.filterBy] : ["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"];
        let payload = {
          status: this.filterBy,
          page: this.page.index,
          size: this.page.size,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: "",
          passCodeUserId: "",
          transactionId: "",
        };
        console.log(payload)
        this.fetchData(payload);
      } else {
        let payload = {
          status: this.filterBy,
          page: this.page.index,
          size: this.page.size,
          subscriberType: this.userDetails?.subscriberType,
          subsidaryId: "",
          passCodeUserId: "",
          transactionId: "",
        };
        this.fetchData(payload);
      }
    });
  }
  moreoptions() {
    this.dialog.open(MoreOptionsPopupComponent);
  }
  closetransaction() {
    this.dialog.open(CloseTransactionPopupComponent);
  }
  //
  // searchInput: FormControl;

  search(e: any) {
    this.filterBy= ["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"]
    this.page.index=0;
    console.log(e.target.value);
    let payload = {
      status: ["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: e.target.value,
    };
    console.log(payload);
    this.fetchData(payload);
    this.fetchDataAll(payload);
  }

  viewTransaction(id: any) {
    this.router.navigateByUrl(
      `/bank-underwriter/transaction-details?transactionId=${id}`
    );
  }

  viewQuote(id: any) {
    let data = this.transactionDetails.filter(
      (item: any) => item.transactionId === id
    );
    console.log(data[0].quotationsList[0].quotationId);
    this.router.navigateByUrl(
      `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`
    );
  }

  viewQuoteTransaction(e:any, status: any) {
    let data = this.transactionDetails.filter(
      (item: any) => item.transactionId === e
    );
    console.log(data[0].quotationsList[0].quotationId);
    if(status == 'ACCEPTED') {
      this.router.navigateByUrl(
        `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`, {state:{from:'active'}}
      );
    } else if(status == 'REJECTED') {
      this.router.navigateByUrl(
        `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`, {state:{from:'rejected'}}
      );
    } else if(status == 'EXPIRED') {
      this.router.navigateByUrl(
        `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`, {state:{from:'expired'}}
      );
    } else if(status == 'CLOSE') {
      this.router.navigateByUrl(
        `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`, {state:{from:'close'}}
      );
    }
    else if(status == 'WITHDRAW') {
      this.router.navigateByUrl(
        `/bank-underwriter/quote-details?quoteId=${data[0].quotationsList[0].quotationId}`, {state:{from:'withdraw'}}
      );
    }


  }

  placeQuotes(e:any) {
    this.router.navigateByUrl(`/bank-underwriter/place-quote?transactionId=${e}`,{state:{from:'new'}});
  }

  downloadCSV() {
    let payload = {
      status: ["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: "",
    };
    this.bankService.generateCSV(payload).subscribe((res: any) => {
      console.log(res.data);
      window.open(res.data[0].url);
    });
  }

  closeQuotation(e:any,transactionId:any){
    console.log(e.value);
    if(e.value=='Close'){
      console.log('hi',transactionId)
      const popup = this.dialog.open(CloseTransactionPopupComponent,
        {
          data:{
            transactionId:transactionId,
          }
        }
        )

        popup.afterClosed().subscribe((res: any) =>{
          this.selected='Open';
          let data={
            status: ["ACCEPTED"],
            page: this.page.index,
            size: this.page.size,
            subscriberType: this.userDetails?.subscriberType,
            subsidaryId: "",
            passCodeUserId: "",
            transactionId: "",
          }
          this.fetchData(data);
          this.fetchDataAll(data);
        })
    }
  }
  refresh(){
    this.page.index=0;
    let data = {
      page: this.page.index,
      size: this.page.size,
      status:["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"],
      subscriberType: this.userDetails?.subscriberType,
      userId: "",
      transactionId: "",
    };
    this.fetchData(data);
    this.filterBy=["ACCEPTED","REJECTED","EXPIRED","CANCELLED","CLOSED","WITHDRAWN"]
  }

  onPageChange(event: any) {
      console.log(event);
      this.page.index = event.pageIndex;
      let payload = {
        page: this.page.index,
        size: event.pageSize,
        status: this.filterBy,
        subscriberType: this.userDetails?.subscriberType,
        subsidaryId: '',
        passCodeUserId: '',
        transactionId: '',
      };
      this.fetchData(payload);
    }
}
