import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  countries:any=['India','Australia'];
  subscriberTypeView:boolean = false;
  buttonClicked:boolean=false;
  thirdPartyUserDetails:any={}
  isThirdParty=false
  subscriberOptions = [
    {name:'Customer',imagePath:'/assets/images/signup/Ico-customer.svg'},
    {name:'Bank (As a Customer)', imagePath:'/assets/images/signup/Icon-bank as customer.svg'},
    {name:'Bank (As an Underwriter)', imagePath:'/assets/images/signup/Icon-bank as UW.svg'},
    // {name:'Referrer',imagePath:'/assets/images/signup/Icon-bank as customer.svg'},
  ]

  subscriberType:any;
  selectedIndex:any;
  constructor(private router:Router,private route: ActivatedRoute,private as:AuthService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      console.log(params)
      if(Object.keys(params).length>0){
        this.isThirdParty=true
        this.subscriberType='Customer';
        this.buttonClicked=true;
        this.proceed()
      let  thirdPartyRefer = Object.keys(params)[0]
        if(thirdPartyRefer==='rxil_token'){

          this. fetchThirdParty('RXIL',params[thirdPartyRefer])
        }
        if(thirdPartyRefer==='fieo_token'){

          this. fetchThirdParty('FIEO',params[thirdPartyRefer])
        }
        if(thirdPartyRefer==='bill_mantra_token'){

          this. fetchThirdParty('BILL_MANTRA',params[thirdPartyRefer])
        }
      }
    })
  }

  getVisited() {
    if (
      this.subscriberTypeView
    ) {
      return { visited_one: true,visited_both:true};
    }
    if(this.selectedIndex==0 && this.subscriberTypeView){
      return {visited_one:true, visited_both: true};
    }
    return {};
  }

  selectedType(event:any){
    this.buttonClicked=false;
    if(this.subscriberType==event){
      this.subscriberType='';
      this.subscriberTypeView = false;
      console.log(this.subscriberType==event, 'this.subscriberType')
    }
    else{
      this.subscriberTypeView = false;
      this.subscriberType=event;
    }
  }

  selectedTab(event:any){
    this.selectedIndex=event.index;
    if(this.selectedIndex==1){
      this.subscriberTypeView = true
    }
  }

  proceed() {
    this.buttonClicked=true;
    if(this.subscriberType){
      this.selectedIndex=1;
      this.subscriberTypeView = true
    }
    else{
      this.subscriberTypeView = false
    }
  }

  back() {
    this.router.navigateByUrl('auth/login');
  }
  fetchThirdParty(name:any,token:any){
   this.as.getThirdPartyDetails({token:token,name:name}).subscribe({
    next:(res:any)=>{
 this.thirdPartyUserDetails=res.data[0]
    }
   })

  }
}
