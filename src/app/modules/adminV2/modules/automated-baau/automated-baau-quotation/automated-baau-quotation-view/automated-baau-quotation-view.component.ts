import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { CustomerService } from '../../../customers/services/customer.service';
@Component({
  selector: 'app-automated-baau-quotation-view',
  templateUrl: './automated-baau-quotation-view.component.html',
  styleUrls: ['./automated-baau-quotation-view.component.scss']
})
export class AutomatedBaauQuotationViewComponent implements OnInit{

    quotationId:any;
    viewData:any;
    requirement = "Banker's Acceptance";
    todaysDate: any;
    routelocation:any;
    priTran:any;
    secTran:any;


  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService){
      this.routelocation= this.location
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
        if (this.viewData?.transactionId.startsWith('BC') || this.viewData?.transactionId.startsWith('CU')) {

          this.priTran = true;

        } else if (this.viewData?.transactionId.startsWith('BA')) {
          this.secTran = true;
        }
    }else{
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
        message:res['message'],
        status:res['success']
        },
        disableClose:true
      });
    }
  })
  }
  back(): void {
    this.location.back()
  } 

}