import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { BankUnderwriterService } from "../../services/bank-underwriter.service";
import { Router } from "@angular/router";
import { TransactionService } from "src/app/modules/customer/transaction/services/transaction.service";

export interface PeriodicElement {
  Draft: string;
  Product: string;
  Date: string;
}

@Component({
  selector: "app-save-transaction",
  templateUrl: "./save-transaction.component.html",
  styleUrls: ["./save-transaction.component.scss"],
})
export class SaveTransactionComponent implements OnInit {
  displayedColumns = ["Draft", "Product", "Date", "Action"];
  transactionList:any;
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
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchInput:new FormControl('')
    })
    this.userDetails = JSON.parse(localStorage.getItem("userInfo"));
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: ["DRAFT"],
      subscriberType: this.userDetails?.subscriberType,
      userId: "",
      transactionId: "",
    };
    this.fetchData(data);
  }

  findProductName(name:any){
    console.log(name)
    let product = this.productsTypes.find(
      (item: any) => item.value.toLowerCase() === name.toLowerCase()
    );
    console.log(product)
    return product.name.toUpperCase();
  }

  fetchData(data: any) {
    this.bankService.getQuotation(data).subscribe((res: any) => {
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.transactionList=res.data;
      this.dataSource = res.data.map((item: any) => ({
        // if(true){
        //   return {
        Draft: item?.transactionId,
        Product: this.findProductName(item?.requirementType),
        Date: item?.insertedDate,
        Action: "",
        QuotationID:item?.quotationsList[0]?.quotationId,
        //   }
        // }
      }));
        this.bankService.getCreditUpdate.next(true);
    });
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = {
      status: ["DRAFT"],
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
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = {
      status: ["DRAFT"],
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
      status: ["DRAFT"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: e.target.value,
    };
    this.fetchData(payload);
  }

  downloadCSV() {
    let payload = {
      status: ["DRAFT"],
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

  edit(id:any){
    console.log(id);
    let payload = {
      status: ["DRAFT"],
      page: this.page.index,
      size: this.page.size,
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: "",
      passCodeUserId: "",
      transactionId: id,
    };
    this.bankService.getQuotation(payload).subscribe((res:any)=>{
      console.log(res)
    })
    this.router.navigateByUrl(`/bank-underwriter/place-quote?transactionId=${id}`);
  }


  delete(id:any){
    console.log(id);
    console.log(this.transactionList.filter((item:any)=>item.transactionId===id));
    let transactionDetails=this.transactionList.filter((item:any)=>item.transactionId===id)
    let qid=transactionDetails[0].quotationsList[0].quotationId;
    console.log(qid)
    let data={
      "transactionId": id,
      "quotationId": qid
    }
    console.log(data)
    this.bankService.cancelQuotation(data).subscribe((res:any)=>{
      console.log(res);
    })
  }
  refresh(){
    this.page.index=0;
    let data = {
      page: this.page.index,
      size: this.page.size,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      userId: '',
      transactionId: '',
    };
    this.fetchData(data);
  }
  onPageChange(event: any) {
    console.log(event);
    this.page.index = event.pageIndex;
    let payload = {
      page: this.page.index,
      size: event.pageSize,
      status: ['DRAFT'],
      subscriberType: this.userDetails?.subscriberType,
      subsidaryId: '',
      passCodeUserId: '',
      transactionId: '',
    };
    this.fetchData(payload);
  }
}
