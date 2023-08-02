import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { CustomerServicesService } from '../services/customer-services.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {


  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private customerService:CustomerServicesService,
    public loadingService:LoaderService,
    private as:AuthService
  ){
      // this.loadingService.setLoading(true);
    }

  pid:any;
  orderId:any;
  paymentMethod:any;
  tokenValue:any;
  showSuccess:boolean=false;
  userDetails:any;
  userInfo:any;

  ngOnInit(): void {
    this.route.queryParams.subscribe(param=>{
      this.tokenValue=param['token'];
    });
    this.pid=JSON.parse(localStorage.getItem('productId'));
    this.orderId=JSON.parse(localStorage.getItem('orderId'));
    this.userDetails=JSON.parse(localStorage.getItem('userDetails'))
    let link=localStorage.getItem('paypalLink');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(link  )
    console.log(this.userDetails);
    console.log(this.tokenValue);
    console.log(this.pid);
    if(this.pid&&this.tokenValue){
      this.completeOrder(link)
    }
  }

  completeOrder(link:any){
    var data={
      "orderId": this.orderId,
      "paymentId": this.pid,
      "modeOfPayment": "PAYPAL",
      "paymentStatus": "COMPLETED",
      "tokenValue" : this.tokenValue,
      "userId":this.userDetails.username,
      "approvedType" : "CHECKER"
    }
    console.log(data);
    this.customerService.completeOrder(data).subscribe((res:any)=>{
      console.log(res)
      if(res.success){
        this.showSuccess=true;
      }
      else{
        console.log("Entered false")
        // this.router.navigateByUrl('/customer/profile')
        this.gotoKyc();
      }
    },
   (error:any)=>{
      if(error){
      console.log("Entered false",error)
      // this.router.navigateByUrl('/customer/profile')
      this.gotoKyc()
    }
    })
  }

  gotoKyc(){
    
    this.as.getUserDetails().subscribe({
      next:(res:any)=>{
        let response = res.data[0];
        let userData = Object.keys(res.data[0]).find(
          (ele) => ele === 'postpaidPaymentInfo'
        );
        console.log(userData)
        if(userData){
          if(this.userInfo.isBusinessKycApproved &&
              this.userInfo.isPaymentDone &&
              this.userInfo.isPersonalKycApproved)
              { 
                if (res.data[0]?.subscriberType!=='BANK_AS_UNDERWRITER'){
                  this.router.navigateByUrl('/customer/transactions/dashboard');
                }
                else{
                  this.router.navigateByUrl('/bank-underwriter/dashboard');
                }
              }
              else{
                this.router.navigateByUrl('/customer/profile'); 
              }
        }
        else{
          if (
            response?.isBusinessKycApproved &&
            response?.isPaymentDone &&
            response?.isPersonalKycApproved
          ) {
            this.router.navigateByUrl('/customer/transactions/dashboard');
          } else {
            this.router.navigateByUrl('/customer/profile');
          }
        }
      }
    })
    
  }

}
