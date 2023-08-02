import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';

@Component({
  selector: 'app-customer-planAndPayment',
  templateUrl: './customer-planAndPayment.component.html',
  styleUrls: ['./customer-planAndPayment.component.scss']
})
export class CustomerPlanAndPaymentComponent {
  routelocation: any;
  @ViewChild('customTable') customTable: any
  planPaymentData = [];
  orderType: any;
  userId: any;
  panelOpenState: Number;
  SecondpanelOpenState: boolean;
  step: Number;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;
  clickData: any;
  commentValue: string;
  myRights:any;
  
  constructor(private customerService: CustomerService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
    private router: Router) {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.routelocation = this.location

  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.orderType = localStorage.getItem('orderClickName');
    // this.customerService.orderClickName.subscribe(res => {
    //   this.orderType = res;
    // })
    if (this.orderType == 'Total') {
      this.gettotalOrder();
    } else {
      this.getPendingOrder();
    }
  }

  gettotalOrder() {
    const AllOrderPaylaod = {
      "page": 0,
      "size": 5,
      "userId": this.userId
    }
    this.customerService.getTotalOrderById(AllOrderPaylaod).subscribe((res) => {
      console.log(res)
      this.planPaymentData = res['content'];
      console.log('line 55',this.planPaymentData);
      let transactionPostpaidList = [];
      console.log(this.planPaymentData);
      this.planPaymentData = this.planPaymentData.map((data) => {
        const transactionPostpaidList = data.orders.orderLines
          .filter((orderLine) => orderLine.productDetails.planType === 'POSTPAID')
          .map((orderLine) => orderLine.transactionDetail);
      
        return {
          ...data,
          orders: {
            ...data.orders,
            transactionPostpaidList: [...transactionPostpaidList],
          },
        };
      });
      console.log('line 84',this.planPaymentData);
    })
  }
  getPendingOrder() {
    const AllOrderPaylaod = {
      "page": 0,
      "size": 5,
      "userId": this.userId
    }
    this.customerService.getPendingOrderById(AllOrderPaylaod).subscribe((res) => {
      console.log(res)
      this.planPaymentData = res['content'];
      console.log(this.planPaymentData);
      this.planPaymentData = this.planPaymentData.map((data) => {
        const transactionPostpaidList = data.orders.orderLines
          .filter((orderLine) => orderLine.productDetails.planType === 'POSTPAID')
          .map((orderLine) => orderLine.transactionDetail);
      
        return {
          ...data,
          orders: {
            ...data.orders,
            transactionPostpaidList: [...transactionPostpaidList],
          },
        };
      });
    })
  }
  comment(orderId, paymentId, orderToken, paymentStatus) {
    let dataStatus:boolean;
    if( paymentStatus == 'MAKER_APPROVED'){
      dataStatus = true
    }else{
      dataStatus = false
    }
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        message: 'Are you sure you want to proceed with the action ?',
        status:dataStatus
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.dialogRef = this.dialog.open(this.callAPIDialog,{disableClose:true});
        this.clickData = {
          orderId, paymentId, orderToken, paymentStatus
        };
        console.log('comment', this.clickData);
      }})
  }
  action() {
    const payload = {
      orderId: this.clickData.orderId,
      paymentId: this.clickData.paymentId,
      modeOfPayment: "WIRE_TRANSFER",
      paymentStatus: this.clickData.paymentStatus,
      tokenValue: this.clickData.orderToken,
      approvedType: "MAKER",
      userId: this.userId,
      comment: this.commentValue,
    }
        this.customerService.updateOrder(payload).subscribe((res) => {
          if (res['success'] == true) {
            this.closeComment();
            const popup = this.dialog.open(GeneralPopupComponent, {
              width: '500px',
              height: '350px',
              data: {
                title: 'isAllGood',
                message: res['message'],
                status: res['success']
              },
              disableClose:true
            });
            if (this.orderType == 'Total') {
              this.gettotalOrder();
            } else {
              if (this.clickData.paymentStatus == 'MAKER_APPROVED') {
                this.getPendingOrder();
              } else {
                this.router.navigateByUrl('adminv2/customer/list');
              }
            }
          }
        }
          , (error) => {
            this.dialog.closeAll();
            const popup = this.dialog.open(GeneralPopupComponent, {
              width: '500px',
              height: '350px',
              data: {
                title: 'isAllGood',
                message: error.error['message'],
                status: error.error['success']
              },
              disableClose:true
            });
          }
        )
  }
  closeComment() {
    this.dialogRef.close();
    this.commentValue = '';
  }
}
