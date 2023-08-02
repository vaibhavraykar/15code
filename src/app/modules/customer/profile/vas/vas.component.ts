import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CustomerServicesService } from '../../services/customer-services.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SendEmailPopupComponent } from '../send-email-popup/send-email-popup.component';

@Component({
  selector: 'app-vas',
  templateUrl: './vas.component.html',
  styleUrls: ['./vas.component.scss'],
})
export class VasComponent implements OnInit {
  plans = [
    {
      name: 'Services',
      value: '$120',
    },
    {
      name: 'Mobile Services',
      value: '',
    },
    {
      name: 'Support',
      value: '',
    },
    {
      name: '24/7 Support',
      value: '$49',
    },
    {
      name: 'Tes',
      value: '',
    },
  ];
  vaasPlans: any;
  subPlanType: any;
  totalAmount: number = 0;
  selectedVAASPlans: any = [];
  summaryView: boolean = false;
  vaasPlansDetail: any;
  paymentMethod: any;
  paymentMethods: any = [
    { name: 'Paypal', value: 'PAYPAL' },
    { name: 'Wire Transfer', value: 'WIRE_TRANSFER' },
  ];

  constructor(
    private as: AuthService,
    private cs: CustomerServicesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchPlanDetials();
  }

  fetchPlanDetials() {
    this.as.getUserDetails().subscribe((res: any) => {
      let userData = res?.data[0];
      let plans = userData?.plans;
      if (plans){
        this.subPlanType = plans?.find(
          (ele: any) => ele?.productType === 'SUBSCRIPTION_PLAN'
        )?.planType;
      }
      // console.log(this.subPlanType);
      this.fetchPlans();
    });
  }

  fetchPlans() {
    this.cs.getAllProducts().subscribe((res: any) => {
      // console.log(res.data);
      this.vaasPlans = res.data.filter((ele) => {
        return (
          ele?.planType === this.subPlanType && ele?.productType === 'VAAS_PLAN'
        );
      });
      // console.log(this.vaasPlans);
    });
  }

  addPlans(id: any) {
    // console.log(id);
    if (!this.selectedVAASPlans.includes(id)) {
      this.selectedVAASPlans.push(id);
    }
    this.setselectedVAASDetails();
    this.calculateTotal();
    // console.log(this.totalAmount);
    // console.log(this.selectedVAASPlans);
  }

  removePlans(id: any) {
    // console.log(id);
    this.selectedVAASPlans = this.selectedVAASPlans.filter((ele) => ele != id);
    this.setselectedVAASDetails();
    this.calculateTotal();
    // console.log(this.selectedVAASPlans);
    if (this.summaryView && this.selectedVAASPlans.length < 1) {
      this.summaryView = false;
    }
  }

  setselectedVAASDetails() {
    this.vaasPlansDetail = this.vaasPlans.filter((ele) => {
      return this.selectedVAASPlans.includes(ele?.productId);
    });
    // console.log(this.vaasPlansDetail, 'Detailed');
  }

  calculateTotal() {
    this.totalAmount = this.vaasPlans.reduce((acc, curr) => {
      if (this.selectedVAASPlans.includes(curr?.productId)) {
        // console.log('Found', curr);
        // console.log(acc);
        acc = acc + curr?.price;
      }
      return acc;
    }, 0);
  }

  addVAS() {
    // if (this.selectedVAASPlans.length > 0) {
      this.summaryView = true;
    // }
  }

  onRadioChange(e: any) {
    // console.log(e);
    this.paymentMethod = e.value;
  }

  payVAASOrder() {
    let data = {
      vaasProductIds: this.selectedVAASPlans,
      paymentDetails: [
        {
          currency: "USD",
          modeOfPayment: this.paymentMethod,
        },
      ],
    };
    this.cs.createOrder(data).subscribe((res:any)=>{
      if(res.success){
        localStorage.setItem('productId', res.data[0].paymentDetails[0].pid);
        localStorage.setItem('orderId', res.data[0].orderId);
        if (this.paymentMethod != 'PAYPAL') {
          this.router.navigateByUrl('/customer/transactions/subscription');
        } 
        else {
          // console.log(res.data[0].paymentDetails);
          let links = res.data[0].paymentDetails[0].links;

          // console.log(links);
          let newLink = '';
          links.forEach((e) => {
            if (e.rel == 'approve') {
              // console.log('dfd', e.href);
              localStorage.setItem('paypalLink', e.href);
              window.location.href = e.href;
            }
          });
        }
      } 
    });
  }

  sendEmailPopup() {
    this.dialog.open(SendEmailPopupComponent);
  }
}
