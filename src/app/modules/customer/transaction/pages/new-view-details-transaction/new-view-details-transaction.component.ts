import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { TransactionService } from '../../services/transaction.service';
import { BankUnderwriterService } from 'src/app/modules/bank-underwriter/services/bank-underwriter.service';

@Component({
  selector: 'app-new-view-details-transaction',
  templateUrl: './new-view-details-transaction.component.html',
  styleUrls: ['./new-view-details-transaction.component.scss'],
})
export class NewViewDetailsTransactionComponent {
  viewType = 'default';
  transactionId: any;
  transactionDetails: any;
  groupCompanies: any;
  userDetails: any;
  subscriber: any;
  productName: any;
  validDate: any;
  totalDate: Date;
  showEdit: boolean = false;

  productsTypes: any[] = [
    { name: 'Confirmation', value: 'CONFIRMATION' },
    { name: 'Discounting', value: 'DISCOUNTING' },
    { name: 'Confirmation & Discounting', value: 'CONFIRMANDDISCOUNT' },
    { name: 'Refinancing', value: 'REFINANCE' },
    { name: 'Bankers Acceptance', value: 'BANKER' },
    { name: 'Bank Guarantee', value: 'BANKGUARANTEE' },
    { name: 'Avalisation', value: 'BILLAVALISATION' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private customerService: CustomerServicesService,
    private location: Location,
    private bankservice: BankUnderwriterService
  ) {
    let navigation = this.router.getCurrentNavigation();
    const routerState: any = navigation?.extras?.state || { from: '' };
    if (routerState?.from == 'active') {
      this.viewType = 'active';
    } else if (routerState?.from == 'accepted') {
      this.viewType = 'accepted';
    } else if (routerState?.from == 'rejected') {
      this.viewType = 'rejected';
    } else if (routerState?.from == 'expired') {
      this.viewType = 'expired';
    } else if (routerState?.from == 'close') {
      this.viewType = 'close';
    } else if (routerState?.from == 'cancelled') {
      this.viewType = 'cancelled';
    } else if (routerState?.from == 'pending' ||routerState?.from == 'maker_approved') {
      this.viewType = 'pending';
    } else {
      this.location.back();
    }
    // if (routerState?.from === 'newRequest') {
    //   console.log('newRequest');
    //   this.from = 'new';
    // } else if (routerState?.from === 'active') {
    //   this.viewType = 'activeBuyingQuote';
    //   this.from = 'active';
    // }else if (routerState?.from === 'save') {
    //   this.from = 'save';

    // } else {
    //   this.location.back();
    // }
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
    this.subscriber = this.userDetails.subscriberType;
    this.groupCompanies = JSON.parse(localStorage.getItem('groupCompany'));
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    // })
    this.route.queryParams.subscribe((param) => {
      this.transactionId = param['transactionId'];
    });
    this.transactionService
      .getTransactionByID(this.transactionId)
      .subscribe((res: any) => {
        // console.log(res);
        this.transactionDetails = res.data[0];

        this.validDate = new Date(this.transactionDetails?.validity);
        // console.log(this.validDate);
        this.validDate.setDate(this.validDate.getDate() + 7);
        // console.log(this.validDate);
        let today = new Date();
        // console.log(today)
        // console.log(today.getTime()<this.validDate.getTime())
        if (today.getTime() < this.validDate.getTime()) {
          this.showEdit = true;
        } else {
          this.showEdit = false;
        }
        this.findProductName(this.transactionDetails?.requirementType);
      });
  }

  goBack() {
    this.location.back();
  }

  findProductName(name: any) {
    // console.log(name);
    let product = this.productsTypes.find((item: any) => item.value === name);
    // console.log(product);
    this.productName = product.name.toUpperCase();
  }

  getGroupCompany(id: any) {
    let companyName = this.groupCompanies?.businessDetails.find(
      (item: any) => item.id == id
    );
    // console.log(companyName);
    return companyName?.companyName;
  }

  openFile() {
    window.open(this.transactionDetails.invoiceUpload, '_blank');
  }

  back(): void {
    this.location.back();
  }

  clone() {
    this.router.navigateByUrl(
      `/customer/transactions/new?transactionId=${this.transactionId}&clone=true`
    );
  }

  editTransaction() {
    // console.log('Clicked Edit', this.transactionId);
    this.router.navigateByUrl(
      `/customer/transactions/new?transactionId=${this.transactionId}`
    );
    // this.router.navigateByUrl('/customer/transactions/new');
  }

  reopen() {
    this.transactionService
      .reopenTransaction(this.transactionId)
      .subscribe((res: any) => {
        // console.log(res);
        if (res.success) {
          this.router.navigateByUrl(
            '/customer/transactions/active-transaction'
          );
        }
      });
  }

  openMaturityDateFile() {
    window.open(this.transactionDetails.refinanceLcUpload, '_blank');
  }

  cancel() {
    let data = {
      transactionId: this.transactionId,
    };
    this.transactionService.cancelTransactions(data).subscribe((res: any) => {
      if (res.success) {
        this.router.navigateByUrl(
          '/customer/transactions/previous-transaction'
        );
      }
    });
  }

  convertBoolean(e) {
    // console.log(e);
    if (
      e?.toLowerCase() == true ||
      e?.toLowerCase() == 'true' ||
      e?.toLowerCase() == 'yes'
    ) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
}
