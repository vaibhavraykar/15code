import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CustomerServicesService } from '../../services/customer-services.service';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { SubscriptionDetailPopupComponent } from '../subscription-detail-popup/subscription-detail-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { SendEmailPopupComponent } from '../send-email-popup/send-email-popup.component';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.scss'],
})
export class SubscriptionDetailComponent implements OnInit {
  orderDetails: any;
  subscriptionPlanDetail: any;
  dataSource: any=[];
  displayColumns: any = ['Invoice Number', 'Payment Date', 'Action'];
  tableData = [
    { 'Invoice Number': 'INV1345', 'Payment Date': 'DD/MM/YYY', Action: '' },
    { 'Invoice Number': 'INV1345', 'Payment Date': 'DD/MM/YYY', Action: '' },
    { 'Invoice Number': 'INV1345', 'Payment Date': 'DD/MM/YYY', Action: '' },
    { 'Invoice Number': 'INV1345', 'Payment Date': 'DD/MM/YYY', Action: '' },
  ];
  last: any;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  totalVaasAmount: number = 0;
  renewPlanView: boolean = false;
  subscriptionView: boolean = false;
  vaasPlanView: boolean = false;
  paymentDetailView: boolean = false;
  paymentSummaryView: boolean = false;
  planType: any;
  allPlans: any = [];
  filteredSubscriptionPlans: any = [];
  filteredVaasPlans: any = [];
  selectedSubscriptionPlan: any;
  selectedSubscriptionPlanDetails: any;
  selectedVaasPlan: any = [];
  selectedVaasPlanDetail: any = [];
  subtotal: any = 0;
  couponCode = new FormControl('');
  enableCouponButton: boolean = true;
  couponSuccessMessage: boolean = false;
  discount: any;
  grandTotal: any;
  showPaymentMethodSelectionError: boolean = false;
  paymentMethod: any;
  paymentMethods: any = [
    { name: 'Paypal', value: 'PAYPAL' },
    { name: 'Wire Transfer', value: 'WIRE_TRANSFER' },
  ];
  orderedVASPlans: any;
  email: any;
  totalItems: any;
  totalPages: any;
  subscriberType:any;

  postpaidPaymentStatus:any;

  constructor(
    private as: AuthService,
    private router: Router,
    private cs: CustomerServicesService,
    private dialog:MatDialog,
  ) {}

  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource(this.tableData);
    this.email = JSON.parse(localStorage.getItem('userDetails')).email;
    this.fetchPlanDetials();
    this.fetchTableData();
  }

  fetchTableData() {
    this.subscriberType = JSON.parse(
      localStorage.getItem('userInfo')
    )?.subscriberType;
    let data = {
      page:this.page.index,
      size:this.page.size
    }
    this.cs.getAllInvoice(data).subscribe((res: any) => {
      console.log(res);
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = res.data.map((ele: any) => {
        return {
          'Invoice Number': ele.invoiceNumber,
          'Payment Date': _moment(new Date(ele?.urlExpiryTime)).format('DD/MM/YYYY'),
          Action: ele.presignedUrl?ele.presignedUrl:'',
        };
      });
    });
  }

  fetchPlanDetials() {
    this.cs.getCurrentSubscriptionPlans().subscribe({
      next:(res:any)=>{
        console.log(res.data[0])
        this.planType = res.data[0]?.planType;
        this.subscriptionPlanDetail = res.data[0]?.productInfo;
      }
    })
    this.as.getUserDetails().subscribe((res: any) => {
      let userData = res?.data[0];
      this.orderDetails = userData?.orders;
    });
  }

  downloadPayment() {
    // console.log(
    //   this.orderDetails?.invoiceDetailsDto?.find(
    //     (item: any) => item.invoiceType === 'INVOICE'
    //   )?.presignedUrl
    // );
    if(this.planType!=='POSTPAID'){
      window.open(
        this.orderDetails?.invoiceDetailsDto?.find(
          (item: any) => item.invoiceType === 'INVOICE'
        )?.presignedUrl
      );
    }
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

  pagePrevious() {
    this.page.index = this.page.index - 1;
    this.fetchTableData();
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.fetchTableData();
  }

  downloadIndividualFile(url:any){
    window.open(url);
  }

  onPageChange(event) {
    this.page.index = event.pageIndex;
    this.page.size = event.pageSize;
    this.fetchTableData()
  }

  renewPlan() {
    this.as.getUserDetails().subscribe({
      next: (res: any) => {
        console.log(res.data);
        let orderType = res.data[0]?.orders?.orderLines.find(
          (ele) => ele?.productDetails?.productType === 'SUBSCRIPTION_PLAN'
        )?.productDetails?.planType;
        console.log(orderType, 'order----');
        if (orderType === 'POSTPAID') {
          console.log('reached inside postpaid chekc');
          this.postpaidPaymentStatus =
            res.data[0]?.postpaidPaymentInfo?.paymentStatus;
            if (
              this.postpaidPaymentStatus === 'PENDING' ||
              this.postpaidPaymentStatus === 'PENDING_FOR_APPROVAL'
            ) {
              console.log('TREEEE');
              const popup = this.dialog.open(SubscriptionDetailPopupComponent);
            } else {
              this.renewPlanView = true;
              this.subscriptionView = true;
              this.fetchSubscriptionPlans();
            }
        }
        else {
          this.renewPlanView = true;
          this.subscriptionView = true;
          this.fetchSubscriptionPlans();
        }
      },
    });
    
  }

  fetchSubscriptionPlans() {
    this.cs.getAllProducts().subscribe((res: any) => {
      console.log(res.data);
      this.allPlans = res.data;
      this.filteredVaasPlans = res.data.filter((ele: any) => {
        return (
          ele?.productType === 'VAAS_PLAN' && ele?.planType === 'PREPAID'
        );
      });
      this.filteredSubscriptionPlans = res.data.filter((ele: any) => {
        return (
          ele?.productType === 'SUBSCRIPTION_PLAN' &&
          ele?.planType === 'PREPAID'
        );
      });
      console.log(this.filteredSubscriptionPlans);
      console.log(this.filteredVaasPlans);
    });
  }

  addSubscriptionPlan(id: any) {
    this.selectedSubscriptionPlan = id;
    this.selectedSubscriptionPlanDetails = this.filteredSubscriptionPlans.find(
      (ele) => {
        return ele?.productId === id;
      }
    );
    console.log(this.selectedSubscriptionPlan, 'SELECTed sub pla');
    console.log(
      this.selectedSubscriptionPlanDetails,
      'SELECTed sub pla detail'
    );
    this.calculateSubTotal();
  }

  goToVAAS() {
    if (this.selectedSubscriptionPlan) {
      this.subscriptionView = false;
      if(this.filteredVaasPlans?.length>0){
        this.vaasPlanView = true;
      }
      else{
        this.goToPaymentDetails();
      }
    }
  }

  updateVaasPlansSelected(id: any) {
    if (!this.selectedVaasPlan.includes(id)) {
      this.selectedVaasPlan.push(id);
    } else {
      this.selectedVaasPlan = this.selectedVaasPlan.filter((ele) => ele != id);
    }
    this.selectedVaasPlanDetail = this.filteredVaasPlans.filter((ele) => {
      return this.selectedVaasPlan.includes(ele.productId);
    });
    this.calculateTotalVaasPlanAmount();
    console.log(this.selectedVaasPlan);
    console.log(this.selectedVaasPlanDetail);
  }

  calculateTotalVaasPlanAmount() {
    this.totalVaasAmount = this.selectedVaasPlanDetail?.reduce((acc, curr) => {
      if (this.selectedVaasPlan.includes(curr?.productId)) {
        acc = acc + curr?.price;
      }
      return acc;
    }, 0);
    this.calculateSubTotal();
    console.log(this.totalVaasAmount);
  }

  calculateSubTotal() {
    this.subtotal =
      this.totalVaasAmount + this.selectedSubscriptionPlanDetails?.price;
      this.grandTotal = this.subtotal
  }

  couponCodeHandler(e: any) {
    console.log(e.target.value);
    console.log(this.couponCode.value);
    if (this.couponCode.value !== '') {
      this.enableCouponButton = false;
    } else {
      this.enableCouponButton = true;
    }
  }

  removeCoupon() {
    console.log('remove');
    this.couponSuccessMessage = false;
    this.enableCouponButton = true;
    this.couponCode.setValue('');
    this.discount = 0;
    this.grandTotal = this.subtotal - (this.discount ? this.discount : 0);
  }

  applyDiscount() {
    console.log('APplying disconit,', this.couponCode.value);
    var data = {
      couponCode: this.couponCode.value,
      subscriptionId: this.selectedSubscriptionPlanDetails?.productId,
    };
    this.cs.getDiscount(data).subscribe((res: any) => {
      console.log(res);
      this.couponSuccessMessage = true;
      this.discount = res.data[0].discountValue;
      this.grandTotal = this.subtotal - (this.discount ? this.discount : 0);
    });
  }

  onRadioChange(e: any) {
    console.log(e);
    this.showPaymentMethodSelectionError = false;
    this.paymentMethod = e.value;
  }

  goToPaymentDetails() {
    this.vaasPlanView = false;
    this.paymentDetailView = true;
  }

  backToVAS() {
    this.paymentDetailView = false;
    if(this.filteredVaasPlans?.length>0){
      this.vaasPlanView = true;
    }
    else{
      this.backToSubsPlanView();
    }
  }

  goToSummary() {
    let data = {
      subscriptionProductId: this.selectedSubscriptionPlanDetails?.productId,
      vaasProductIds: this.selectedVaasPlan,
      couponCode: this.couponCode.value,
      paymentDetails: [
        {
          currency: this.selectedSubscriptionPlanDetails?.currency,
          modeOfPayment: this.paymentMethod,
        },
      ],
    };
    console.log(data);
    if (this.paymentMethod) {
      this.showPaymentMethodSelectionError = false;
      this.cs.createOrder(data).subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          localStorage.setItem('productId', res.data[0].paymentDetails[0].pid);
          localStorage.setItem('orderId', res.data[0].orderId);
          if (this.paymentMethod != 'PAYPAL') {
            this.renewPlanView=false;
            const popup = this.dialog.open(SubscriptionDetailPopupComponent);
            // popup.afterClosed().subscribe()
            // this.paymentDetailView = false;
            // this.paymentSummaryView = true;
            // this.orderDetails = res.data[0];
            // if (this.orderDetails) {
            //   this.orderedVASPlans = this.orderDetails?.orderLines?.filter(
            //     (item: any) => {
            //       console.log(item);
            //       return item?.productDetails?.productType == 'VAAS_PLAN';
            //     }
            //   );
            //   console.log(this.orderedVASPlans);
          }
          else {
          console.log(res.data[0].paymentDetails);
          let links = res.data[0].paymentDetails[0].links;
          console.log(links);
          let newLink = '';
          links.forEach((e) => {
            if (e.rel == 'approve') {
              console.log('dfd', e.href);
              localStorage.setItem('paypalLink', e.href);
              window.location.href = e.href;
            }
          });
        } 
        }
      });
    } else {
      this.showPaymentMethodSelectionError = true;
    }
  }

  goToDashboard() {
    console.log(this.subscriberType)
    if (this.subscriberType !== 'BANK_AS_UNDERWRITER') {
      this.router.navigateByUrl('/customer/transactions/dashboard');
    } else {
      this.router.navigateByUrl('/bank-underwriter/dashboard');
    }
  }

  backToSubsPlanView() {
    this.subscriptionView = true;
    this.vaasPlanView = false;
  }

  backToSubView() {
    this.renewPlanView = false;
  }

  sendEmailPopup() {
    this.dialog.open(SendEmailPopupComponent);
  }
}
