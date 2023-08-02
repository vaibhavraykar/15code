import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerFactoringService } from '../customer-factoring.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-tran-factoring',
  templateUrl: './view-tran-factoring.component.html',
  styleUrls: ['./view-tran-factoring.component.scss']
})
export class ViewTranFactoringComponent {
  public pagerConfig: any;
  public pageSizeOptions = [5, 10, 20, 30];
  // ,'View','Select','Submit'
  displayColumns: string[];
  public selectedCheckboxes = [];
  transactId:any;
  value:any = '';
  response:any;
  constructor(private route:ActivatedRoute,private custFacService:CustomerFactoringService,private location:Location){
      this.transactId=this.route.snapshot.paramMap.get('id');
      this.viewDetails();
  }

  viewDetails(){
    this.custFacService.viewDataById(this.transactId).subscribe(res=>{
      this.response = res['data'][0];
    })
  }
  back(): void {
    this.location.back()
  } 

}
