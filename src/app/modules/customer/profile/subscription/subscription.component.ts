import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomerServicesService } from '../../services/customer-services.service';
import { IPayPalConfig, ICreateOrderRequest,IPayPalButtonStyle } from 'ngx-paypal';
import { MatDialog } from '@angular/material/dialog';
import { PostpaidTransactionPopupComponent } from '../postpaid-transaction-popup/postpaid-transaction-popup.component';
import { PostpaidTransactionSuccessComponent } from '../postpaid-transaction-success/postpaid-transaction-success.component';
import { Router } from '@angular/router';
import { TransactionPaymentComponent } from '../../transaction/pages/transaction-payment/transaction-payment.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit,OnChanges{
  isDisplay: boolean = false;
  openSummary: boolean = false;
  paymant: boolean = false;
  planselected:boolean=false;
  openVASPlans:boolean=false;
  rejectedPayment:boolean=false;
  rejectedWireTransfer:boolean=false;
  couponSuccessMessage:boolean=false;
  showSuccess:boolean;
  planClicked:any=[];
  plans:any=[];
  subscriptionPlans:any=[];
  vasSelectedPlans:any=[];
  selectedAddons:any=[];
  vasPlans:any=[];
  selectedPlan:any=[];
  filteredPlans:any=[];
  subtotal:any;
  discount:any;
  grandTotal:any;
  orderDetails:any;
  email:any;
  paymentMethod:any;
  onBoardingStatus:any;
  couponCode=new FormControl('');
  selectedSubscription:any;
  orderedVASPlans:any;
  enableCouponButton:boolean=true;
  showPaymentMethodSelectionError:boolean = false;
  checkPostpaidValue:boolean = true;
  isPrepaidCheck: boolean = false;
  butClick: boolean = false;

  @Input() subDetails:any;
  @Output() finished:EventEmitter<any>=new EventEmitter;
  @Input() editable:any;

  paymentMethods:any=[
    {name:'Paypal',value:'PAYPAL'} ,
    {name:'Wire Transfer',value:'WIRE_TRANSFER'}
  ]


  public payPalConfig:IPayPalConfig;
  isPostpaid: boolean = true;
  isBack: boolean = false;
  isPrepaid: boolean = false;
  openVASPlansPostpaid: boolean = false;
  showOnlyPostpaidClick: boolean = false;

constructor(
  private dialog: MatDialog,
  private customerService:CustomerServicesService,
  private router : Router,
  private authservice:AuthService
){}

  ngOnInit():void{
    console.log(JSON.parse(localStorage.getItem('userInfo')))
    this.onBoardingStatus=localStorage.getItem('onBoardingStatus');
    console.log(this.onBoardingStatus);
    this.initConfig();


    if(this.subDetails){
      console.log("CREATEDD");
      console.log(this.subDetails?.orders)
      console.log(this.subDetails,"DETAILSS");
      this.orderDetails=this.subDetails;
      if(this.orderDetails){
        console.log()
        if (
          this.orderDetails?.orderLines?.find(
            (item: any) =>
              item?.productDetails?.productType === 'SUBSCRIPTION_PLAN'
          )?.productDetails?.planType === 'PREPAID'
        ){
          this.isPrepaid = true;
          this.isPostpaid = false;
        }
        else{
          this.isPostpaid = true;
          this.isPrepaid = false;
        }
          this.orderedVASPlans = this.orderDetails?.orderLines?.filter(
            (item: any) => {
              console.log(item);
              return item?.productDetails?.productType == 'VAAS_PLAN';
            }
          );
        console.log(this.orderedVASPlans);
      }
      console.log("ORDERLIENS",this.orderDetails);
    }

    this.email=JSON.parse(localStorage.getItem('userDetails')).email;
    this.customerService.getAllProducts().subscribe((res:any)=>{
      console.log(res.data);
      this.plans=res.data;
      this.plans.map(item=>{
        if(item.productType=='SUBSCRIPTION_PLAN'){
          console.log(item.status)
          if(item.status=='ACTIVE'){
          this.subscriptionPlans.push(item);
          this.planClicked.push(false)
          }
        }
        else{
          if(item.status=='ACTIVE'){
          this.vasPlans.push(item);
        }
        }
      })
      console.log(this.vasPlans)
      this.getPlans();
    });  }

  private initConfig(): void {

    this.payPalConfig = {
    currency: 'USD',
    clientId: 'Ae1h-VGAeAfX-eN1uIbgc0O1WutibudnkiJSVQh2Xet0qg_sL_wI1ZlZ5vrumd82yqep8cC7MJbzfXZJ',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'INR',
            value: this.grandTotal,
            breakdown: {
              item_total: {
                currency_code: 'INR',
                value: this.grandTotal
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'INR',
                value: this.grandTotal,
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'horizontal',
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  ngOnChanges(changes: SimpleChanges){

    if(!(changes['subDetails'].firstChange)) {
      if(this.onBoardingStatus!='PAYMENT_REJECTED'&&this.subDetails&& this.subDetails?.paymentDetails?.[0]?.modeOfPayment=='WIRE_TRANSFER'){
      this.paymant=true;
      this.rejectedPayment=false;
      this.rejectedWireTransfer=true;
    }
    else if(this.onBoardingStatus=='PAYMENT_REJECTED'&&this.subDetails&& this.subDetails?.paymentDetails?.[0]?.modeOfPayment=='PAYPAL'){
      this.paymant=true;
      console.log('---------------REJECTED PAYPAL')
      this.rejectedPayment=false;
    }
    else if(this.onBoardingStatus=='PAYMENT_REJECTED'){
      this.paymant=true;
      this.rejectedPayment=true;
    }else if(this.subDetails?.status=='COMPLETED'&&this.subDetails&&this.subDetails.paymentDetails?.[0]?.modeOfPayment=='PAYPAL'){
      console.log("Entered the orderdetails")
      this.paymant=true;
      this.rejectedPayment=false;
    }
    else if(this.subDetails&&(this.subDetails?.status=='CREATED'||this.subDetails?.status=='COMPLETED')&&this.subDetails?.paymentDetails?.[0]?.modeOfPayment=='WIRE_TRANSFER'){
      this.paymant=true;
      this.rejectedPayment=false;
    }
    }
    if(this.editable?.from === 'sub-details'){
     this.paymant=false
    }
    console.log(this.editable?.from ,'<===================')
  }

  getPlans(){
    this.filteredPlans = this.isPostpaid?this.subscriptionPlans?.filter(item=>item.planType==='POSTPAID'):this.subscriptionPlans?.filter(item=>item.planType==='PREPAID');
    if(this.filteredPlans.length===1){
      this.selectedSubscription=this.filteredPlans[0]
    }
  }

  addPlan(index:any,id:any){
    console.log(id)
    // console.log(this.filteredPlans.find(item=>item.productId===id));
    // console.log(this.selectedSubscription,"Selected Plan")
    // console.log(this.planClicked)
    if(this.selectedSubscription){
      if(this.selectedSubscription?.productId===id){
        this.selectedSubscription=null;
        console.log(this.selectedSubscription,"Selected Plan")
      }
      else{
        this.selectedSubscription = this.filteredPlans.find(item=>item.productId===id);
        console.log(this.selectedSubscription,"Selected Plan")
      }
    }
    else{
      this.selectedSubscription = this.filteredPlans.find(item=>item.productId===id);
      console.log(this.selectedSubscription,"Selected Plan")
    }
    // if(this.selectedPlan!=this.plans[index]){
    //     this.planClicked[index]=true;
    //     console.log(this.planClicked)
    //   this.planselected=true;
    //   this.selectedPlan=this.filteredPlans[index];
    // }
    // else{
    //   this.planselected=false;
    //   this.selectedPlan=[];

    //   console.log(this.planClicked)
    // }
  }

  repay(){
    this.paymant=false;
  }


  isClick() {
    this.isDisplay = !this.isDisplay;
  }

  // goBack() {
  //   this.paymant=false;
  //   this.openSummary = false;
  //   this.openVASPlans = false;
  //   this.isBack = false;
  // }

  goBacktoPayment() {
    this.openVASPlans=false;
    this.openSummary = false;
  }
  backToVAS() {
    if(this.getFiltered(this.vasPlans).length>0){
      this.openVASPlans= true;
    }
    else{
      this.goBacktoPayment();
    }
    this.paymentMethod =null;
  }

  summary() {
    if(this.isPostpaid == true) {
      this.postpaidBuy();
      if (this.selectedSubscription.productId && this.butClick){
        const popup = this.dialog.open(PostpaidTransactionPopupComponent);
         popup.afterClosed().subscribe({
           next: (res: any) => {
             console.log(res);
             if (res === true) {
               let data = {
                 subscriptionProductId: this.selectedSubscription.productId,
                 vaasProductIds: this.vasSelectedPlans,
                 couponCode: this.couponCode.value,
                 paymentDetails: [
                   {
                     currency: this.selectedSubscription.currency,
                     modeOfPayment: 'WIRE_TRANSFER',
                   },
                 ],
               };
               this.postpaidPayment(data);
             }
           },
         });
      }
      

    }
     else {
      this.prepaidBuy();
      if (this.selectedSubscription && this.getFiltered(this.vasPlans).length > 0) {
        this.isBack = true;
        this.openVASPlans = true;
        this.openSummary = true;
      } else if (
        this.selectedSubscription &&
        this.isPostpaid &&
        this.vasPlans.length < 1
      ) {
        console.log(this.vasPlans.length, 'length');
        const popup = this.dialog.open(PostpaidTransactionPopupComponent);
        popup.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            // this.finished.emit(3);
            const popup2 = this.dialog.open(
              PostpaidTransactionSuccessComponent
            );
            popup2.afterClosed().subscribe((result) => {
              console.log(`Dialog result: ${result}`);
              if (result) {
                this.finished.emit(3);
                let data = {
                  subscriptionProductId: this.selectedSubscription.productId,
                  vaasProductIds: this.vasSelectedPlans,
                  couponCode: this.couponCode.value,
                  paymentDetails: [
                    {
                      currency: this.selectedSubscription.currency,
                      modeOfPayment: 'WIRE_TRANSFER',
                    },
                  ],
                };
                this.postpaidPayment(data);
              }
            });
          }
        });
      } else if (this.selectedSubscription) {
        console.log('no vasplans');
        this.openVASPlans = false;
        this.openSummary = true;
        this.subtotal = this.selectedSubscription?.price;
        this.grandTotal = this.subtotal - (this.discount ? this.discount : 0);
      } else {
        console.log('No plans selected');
        this.openVASPlans = false;
        this.openSummary = false;
      }
     }


  }
  postpaidBuy() {
    this.butClick = true;
    console.log(this.vasPlans, 'vasPlan postpaid');
      let postpaidVasPlan =this.plans?.filter(item=>item.planType==='POSTPAID' && item.status== 'ACTIVE');
      this.vasPlans = postpaidVasPlan;
      console.log(this.vasPlans, 'vasPlan1');
      // if(this.vasPlans.length>0) {
      //   this.openVASPlans=true;
      //   this.isPostpaid = false;

      // }
      // else {
      //   this.dialog.open(PostpaidTransactionPopupComponent);
      // }
  }
  prepaidBuy() {
    this.isPrepaidCheck = true;
    console.log(this.vasPlans, 'vasPlan prepaid');
      let postpaidVasPlan =this.plans?.filter(item=>item.planType==='PREPAID' && item.status== 'ACTIVE');
      this.vasPlans = postpaidVasPlan;
      console.log(this.vasPlans, 'vasPlan2');
      if(this.vasPlans.length>0) {
        this.openVASPlans=true;
        this.isPostpaid = false;
      }
  }

  vasSelected(e:any){
    this.selectedAddons=[];
    console.log(e);
    var count=0;
    if(e){
      this.vasSelectedPlans=e;

      e.forEach(ele=>{
        this.vasPlans.map(item=>{
          if(item.productId==ele){
            this.selectedAddons.push(item);
            count = count+item.price;
          }
        })
        console.log(this.selectedAddons);
      })
      this.openVASPlans=false;
      this.openSummary = true;
      if(this.isPostpaid == true) {
        let data={
          "subscriptionProductId": this.selectedSubscription.productId,
        "vaasProductIds": this.vasSelectedPlans,
        "couponCode" : this.couponCode.value,
        "paymentDetails": [
            {
                "currency": this.selectedSubscription.currency,
                "modeOfPayment": 'WIRE_TRANSFER'
            }
        ]
        }
        this.postpaidPayment(data);
      }
      console.log(this.selectedSubscription);
      this.subtotal=this.selectedSubscription.price+count;
      this.grandTotal=this.subtotal-(this.discount?this.discount:0);
    }
  }

  deleteVAS(index:any){
    console.log("Clicked");
    this.subtotal=this.subtotal-this.selectedAddons[index].price;
    this.grandTotal=this.grandTotal-this.selectedAddons[index].price;
    this.selectedAddons.splice(index,1);
    this.vasSelectedPlans.splice(index,1);

  }

  goBackToVAS(){
    this.openVASPlans=true;
  }

  couponCodeHandler(e:any){
    console.log(e.target.value);
    console.log(this.couponCode.value);
    if(this.couponCode.value!==''){
      this.enableCouponButton = false;
    }
    else{
      this.enableCouponButton = true;
    }
  }

  applyDiscount(){
    console.log("APplying disconit,",this.couponCode.value)
    var data = {
      "couponCode" : this.couponCode.value,
    "subscriptionId" :  this.selectedSubscription.productId
    }
    this.customerService.getDiscount(data).subscribe((res:any)=>{
      console.log(res);
      this.couponSuccessMessage=true;
      this.discount=res.data[0].discountValue;
      this.grandTotal=this.subtotal-(this.discount?this.discount:0);
    })

  }

  removeCoupon(){
    console.log("remove")
    this.couponSuccessMessage=false;
    this.enableCouponButton = true;
    this.couponCode.setValue('');
    this.discount=0;
    this.grandTotal=this.subtotal-(this.discount?this.discount:0);
  }

  onRadioChange(e:any){
    console.log(e);
    this.showPaymentMethodSelectionError = false;
    this.paymentMethod=e.value;
    if(e.value=="PAYPAL"){
      console.log("PAYPAL clcicked")
      this.initConfig();
    }
  }
  payment() {

    console.log('------',localStorage.setItem('productId',this.selectedSubscription.productId))
    var data={
      "subscriptionProductId": this.selectedSubscription.productId,
    "vaasProductIds": this.vasSelectedPlans,
    "couponCode" : this.couponCode.value,
    "paymentDetails": [
        {
            "currency": this.selectedSubscription.currency,
            "modeOfPayment": this.paymentMethod
        }
    ]
    }
    console.log(data);
    if(this.paymentMethod){
      this.showPaymentMethodSelectionError = false;
      this.customerService.createOrder(data).subscribe((res:any)=>{
        console.log(res)
        if(res.success){

          localStorage.setItem('productId',res.data[0].paymentDetails[0].pid);
          localStorage.setItem('orderId',res.data[0].orderId);
          if(this.paymentMethod!='PAYPAL'){
          this.rejectedPayment=false
          this.paymant = true;
          this.orderDetails=res.data[0];
          if(this.orderDetails){
            this.orderedVASPlans = this.orderDetails?.orderLines?.filter((item:any)=>{
              console.log(item);
              return item?.productDetails?.productType=="VAAS_PLAN"

            })
            console.log(this.orderedVASPlans);
          }
          }
          else{
            console.log(res.data[0].paymentDetails)
            let links = res.data[0].paymentDetails[0].links;
            console.log(links)
            let newLink="";
            links.forEach(e=>{
              if(e.rel=='approve'){
                console.log('dfd',e.href);
                localStorage.setItem('paypalLink',e.href);
                window.location.href=e.href
              }
            })
          }
        }
      },()=>{},()=>{
        this.rejectedPayment=false;
        this.authservice.getUserDetails().subscribe()
      })
    }
    else{
      this.showPaymentMethodSelectionError = true;
    }
  }

  goToKyc(){
    if(!this.editable){
      this.finished.emit(3);
    }
    else{
      if(this.editable?.from=='sub-details'){
        this.router.navigateByUrl('/customer/transactions/subscription');
      }
    }
  }


  downloadPayment(){
    // console.log(
    //   this.orderDetails?.invoiceDetailsDto.find(
    //     (item: any) => item.invoiceType === 'INVOICE'
    //   )?.presignedUrl
    // );
    window.open(
      this.orderDetails?.invoiceDetailsDto.find(
        (item: any) => item.invoiceType === 'INVOICE'
      )?.presignedUrl
    );
  }

  postpaid() {
    this.isPrepaid?this.selectedSubscription=null:this.selectedSubscription;
    this.isPostpaid = true;
    this.isPrepaid = false;
    this.checkPostpaidValue = true;
    this.getPlans();
    this.isPrepaidCheck = false;
  }

  prepaid() {
    this.isPostpaid?this.selectedSubscription=null:this.selectedSubscription;
    this.isPrepaid = true;
    this.isPostpaid = false;
    this.getPlans();
    this.checkPostpaidValue = false;
    this.isPrepaidCheck = true;
  }

  postpaidPayment(data: any) {
    this.customerService.createOrder(data).subscribe((res:any)=>{
      console.log(res)
      if(res.success){

        localStorage.setItem('productId',res.data[0].paymentDetails[0].pid);
        localStorage.setItem('orderId',res.data[0].orderId);
        if(this.paymentMethod!='PAYPAL'){

        this.paymant = true;
        this.orderDetails=res.data[0];
        if(this.orderDetails){
          this.orderedVASPlans = this.orderDetails?.orderLines?.filter((item:any)=>{
            console.log(item);
            return item?.productDetails?.productType=="VAAS_PLAN"

          })
            const popup = this.dialog.open(PostpaidTransactionSuccessComponent);
          console.log(this.orderedVASPlans);
        }
        }
        else{
          console.log(res.data[0].paymentDetails)
          let links = res.data[0].paymentDetails[0].links;
          console.log(links)
          let newLink="";
          links.forEach(e=>{
            if(e.rel=='approve'){
              console.log('dfd',e.href);
              localStorage.setItem('paypalLink',e.href);
              window.location.href=e.href
            }
          })
        }
      }
    })
  }
  getFiltered(plans){
    return plans?.filter((e)=>e.productType==='VAAS_PLAN')||[]
  }
  getRejectedStatus(){
    return this.rejectedPayment
  }
}
