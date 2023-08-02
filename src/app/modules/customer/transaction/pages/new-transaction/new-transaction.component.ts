import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CustomerServicesService } from '../../../services/customer-services.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionDetailPopupComponent } from '../../../profile/subscription-detail-popup/subscription-detail-popup.component';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit{

  tab:any;
  tabsVisited:any ={
    'SELECT PRODUCT':false,
    'APPLICANT & BENEFICIARY':false,
    'TRANSACTION DETAILS':false
  }

  userDetails:any;
  subscriber:any;
  selectedProduct:any;
  userTypeSelected:any;
  applicantBeneDetails:any;
  transactionData:any;
  transactionId:any;
  transactionDetails:any;
  requirementProduct!:any;
  applicantFormValidStatus:any;
  cloneTrans=false;
  type:any;

  constructor(
    private transactionService:TransactionService,
    private route:ActivatedRoute,
    private router:Router,
    private as:AuthService,
    private dialog:MatDialog
  ){}

  ngOnInit(){
    this.tab=0;
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    // console.log(this.userDetails);
    this.subscriber = this.userDetails.subscriberType;
    this.as.getUserDetails().subscribe({
      next:(res:any)=>{
        console.log(res?.data[0]?.postpaidPaymentInfo);
        if(res?.data[0]?.postpaidPaymentInfo){
          if(res?.data[0]?.postpaidPaymentInfo?.paymentStatus==="PENDING_FOR_APPROVAL"){
            const popup = this.dialog.open(SubscriptionDetailPopupComponent,{disableClose:true}); 
            popup.afterClosed().subscribe(()=>{
              if(this.subscriber === 'CUSTOMER'){
              this.router.navigateByUrl('/customer/transactions/dashboard');
            }
            else if (this.subscriber === 'BANK_AS_UNDERWRITER') {
              this.router.navigateByUrl('/bank-underwriter/dashboard');
            }
            else{
              this.router.navigateByUrl('/customer/transactions/dashboard');
            }
            })
          }
        }
      }
    })
    // console.log(this.subscriber);
    this.route.queryParams.subscribe((param:any)=>{
      this.transactionId=param['transactionId'];
      if (this.transactionId){
        this.type='edit';
      }
      this.cloneTrans = param['clone'];
      console.log("Got transactionID",this.transactionId)
      if(this.transactionId){
        this.tabsVisited ={
          'SELECT PRODUCT':true,
          'APPLICANT & BENEFICIARY':true,
          'TRANSACTION DETAILS':true
        }
        this.transactionService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
          this.transactionDetails=res.data[0];
          if(this.cloneTrans){
            console.table(this.transactionDetails);
            this.transactionDetails={...this.transactionDetails }
          }
          this.requirementProduct=this.transactionDetails.requirementType;
          this.selectedProduct=this.requirementProduct;
          console.log(this.transactionDetails);
          console.log(this.requirementProduct);
        })
      }
    });
  }

  // Tab Change Event Handler
  tabChangeHandler(e:any){
    this.tab=e.index;
  }
  
  // Saves the selected Product
  selectedProductType(event:any){
    this.selectedProduct=event;
    console.log(this.selectedProduct)
  }

  // To disable/enable second tab
  disableEmitter(e: any) {
    console.log(e)
    if (e) {
      this.tabsVisited['APPLICANT & BENEFICIARY'] = true;
      this.tabsVisited['TRANSACTION DETAILS']=false;
    } else {
      this.tabsVisited['APPLICANT & BENEFICIARY'] = false;
      this.tabsVisited['TRANSACTION DETAILS']=false;
      this.tabsVisited['SELECT PRODUCT']=false;
    }
  }
  
  getVisited(){
    if (!this.tabsVisited['SELECT PRODUCT']) {
      return { visited_one: true };
    } else if ((this.tabsVisited['APPLICANT & BENEFICIARY']&&this.tab>=0)||this.tabsVisited['TRANSACTION DETAILS']) {
      return { visited_both: true, visited_one: true };
    }
    return {};
  }

  // To go to second tab
  next(event:any){
    console.log(event)
    this.tab=1;
    this.tabsVisited['SELECT PRODUCT']=true;
    document.querySelector('.mat-drawer-content').scrollTop=0;
  }

  // Saves selected User Type
  userType(e:any){
    // console.log(e);
    this.userTypeSelected=e;
  } 

  // Saves data from second tab
  applicantBeneficiaryData(event:any){
    this.applicantBeneDetails=event;
    console.log(event);
  }

  // To go to third tab
  finsihedApplicantDetails(event:any){
    console.log(event);
    this.tab=2;
    this.tabsVisited['TRANSACTION DETAILS']=true;
    document.querySelector('.mat-drawer-content').scrollTop=0;
  }

  applicantFormStatus(event:any){
    console.log("Hi---",event);
    this.applicantFormValidStatus = event;
  }

  finishedTransactionDetails(event:any){
    this.transactionData=event;
    // console.log(this.transactionData)
    let newData={...this.applicantBeneDetails,...this.transactionData};
    // console.log('ND',newData)
    // this.transactionService.transactionDraft(newData).subscribe((res:any)=>{
    //   console.log(res);
    // })
    
  }



}
