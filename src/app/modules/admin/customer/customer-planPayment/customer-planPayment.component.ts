import { Component ,OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-planPayment',
  templateUrl: './customer-planPayment.component.html',
  styleUrls: ['./customer-planPayment.component.scss']
})
export class CustomerPlanPaymentComponent implements OnInit{

  userId:any; 
  planPaymentData:any=[];
  selectedPlan='PREPAID';
  orderClickStatus:any;
  openPanelState=false;
  openTotalPanelState=false;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;
  clickData:any;
  commentValue: string;
  step : Number;

  
  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService, private fb: FormBuilder){
      this.userId=this.route.snapshot.paramMap.get('id');
      this.customerService.orderClickName.subscribe(res=>{
        this.orderClickStatus = res;
      })
      if(this.orderClickStatus != 'PENDING'){
        this.gettotalOrder();
      }else{
        this.getPendingOrder();
      }
  }
  ngOnInit(){
    // this.customerService.getOrderByUserId(this.userId).subscribe((res:any)=>{
    //   this.planPaymentData = res.data;
    // })
  }
  gettotalOrder(){
    const AllOrderPaylaod = {
      "page": 0,
      "size": 5,
      "userId": this.userId
  }
    this.customerService.getTotalOrderById(AllOrderPaylaod).subscribe((res)=>{
      console.log(res)
      this.planPaymentData = res['content'];
      console.log(this.planPaymentData);
    })
  }
  getPendingOrder(){
    const AllOrderPaylaod = {
      "page": 0,
      "size": 5,
      "userId": this.userId
  }
    this.customerService.getPendingOrderById(AllOrderPaylaod).subscribe((res)=>{
      console.log(res)
      this.planPaymentData = res['content'];
      console.log(this.planPaymentData);
    })
  }

  back(): void {
    this.location.back()
  } 
  comment(orderId,paymentId,orderToken,paymentStatus) {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '350px',
    });
    this.clickData = {
      orderId, paymentId, orderToken,paymentStatus
    };
    console.log('comment', this.clickData);
  }
  action(){
    const payload = {
    orderId: this.clickData.orderId,
    paymentId: this.clickData.paymentId,
    modeOfPayment: "WIRE_TRANSFER",
    paymentStatus: this.clickData.paymentStatus,
    tokenValue : this.clickData.orderToken,
    approvedType:"MAKER",
    userId: this.userId,
    comment: this.commentValue,
    }
    this.customerService.updateOrder(payload).subscribe((res:any)=>{
      this.closeComment();
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
          message: res['message'],
          status: res['success']
        },
      });
      if (res['success'] == true) {
        if(this.orderClickStatus != 'PENDING'){
          this.gettotalOrder();
        }else{
          if(this.clickData.paymentStatus == 'MAKER_APPROVED'){
            this.getPendingOrder();
          }else{
            this.router.navigateByUrl('admin/dsb/customer-list');
          }
        }
      }    
    },(error)=>{
      this.closeComment();
    })
  }
  closeComment() {
    this.dialogRef.close();
  }
}