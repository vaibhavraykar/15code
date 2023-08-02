import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';
import { SubscriptionComponent } from 'src/app/modules/customer/profile/subscription/subscription.component';

@Component({
  selector: 'app-bankUnderwriter-view',
  templateUrl: './bankUnderwriter-view.component.html',
  styleUrls: ['./bankUnderwriter-view.component.scss']
})
export class BankUnderwriterViewComponent implements OnInit{

    userId:any;
    data:any=[];
    issuanceCountry:any;
    beneCountry:any;
    blgGoodList:any;

  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService){
  }
  ngOnInit(){
    this.userId=this.route.snapshot.paramMap.get('id');
    this.customerService.getCustomerById(this.userId).subscribe((res:any)=>{
      this.data = res.data[0];
      const issCountry = this.data.personalDetails.issuanceCountryList;
      const beneCou = this.data.businessDetails.beneficiaryCountryList;
      const blkgood = this.data.businessDetails.blklstedGoods;
      if(issCountry){
        this.issuanceCountry = issCountry.map(x=>x.value).join(",");
      }
      if(beneCou){
        this.beneCountry = beneCou.map(x=>x.value).join(",");
      }
      if(blkgood){
        this.blgGoodList = blkgood.map(x=>x.value).join(",");
      }
    })
  }
  back(): void {
    this.location.back()
  } 

}