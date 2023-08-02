import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-baau-view',
  templateUrl: './baau-view.component.html',
  styleUrls: ['./baau-view.component.scss']
})
export class BaauViewComponent implements OnInit {
  routelocation:any;
  baauDetails:any=[];
  panelOpenState: boolean;
  secondPanelOpenState: boolean;
  userName:any;
  issuanceCountry:any;
  beneCountry:any;
  blgGoodList:any;

  constructor( private route:ActivatedRoute , private customerService: CustomerService,private location:Location,){
    this.routelocation= this.location

  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
        this.userName = params['id'];
        console.log(this.userName);
        this.customerService.getCustomerById(this.userName).subscribe((res:any)=>{
          console.log(res.data[0])
          this.baauDetails=res?.data[0];
          const issCountry = this.baauDetails.personalDetails.issuanceCountryList;
          const beneCou = this.baauDetails.businessDetails.beneficiaryCountryList;
          const blkgood = this.baauDetails.businessDetails.blklstedGoods;
          if(issCountry){
            this.issuanceCountry = issCountry.map(x=>x.value).join(", ");
          }
          if(beneCou){
            this.beneCountry = beneCou.map(x=>x.value).join(", ");
          }
          if(blkgood){
            this.blgGoodList = blkgood.map(x=>x.value).join(", ");
          }
        })
      })
  }

}
