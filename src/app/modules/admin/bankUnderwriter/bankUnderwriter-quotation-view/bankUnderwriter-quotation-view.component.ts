import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';
import { SubscriptionComponent } from 'src/app/modules/customer/profile/subscription/subscription.component';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
@Component({
  selector: 'app-bankUnderwriter-quotation-view',
  templateUrl: './bankUnderwriter-quotation-view.component.html',
  styleUrls: ['./bankUnderwriter-quotation-view.component.scss']
})
export class BankUnderwriterQuotationViewComponent implements OnInit{

    quotationId:any;
    viewData:any;
    requirement = "Banker's Acceptance";
    todaysDate: any;



  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService){
  }
  ngOnInit(){
    this.quotationId=this.route.snapshot.paramMap.get('id');
    this.viewDetails();
    var str = new Date().setSeconds(0,0);
    this.todaysDate = new Date(str).toISOString();
  }
  viewDetails(){
    this.customerService.getbaauquotationdetailsByid(this.quotationId).subscribe((res:any)=>{
      if(res['success'] == true){
        this.viewData=res['data'][0];
    }else{
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
        message:res['message'],
        status:res['success']
        },
      });
    }
  })
  }
  back(): void {
    this.location.back()
  } 

}