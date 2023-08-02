import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { DiscountManagementService } from '../../services/discount-management/discountManagement.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit{

  id:any;
  viewData:any;
  roleInfo: any = [];

  constructor(private route:ActivatedRoute,private router:Router,private location:Location,public adminService:AdminService,
    private dialog: MatDialog,private userService:DiscountManagementService){
    this.userService.adminCouponId.subscribe((res:any)=>{
      if(res){
        this.id=res;
      }
    })
    this.id=this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(){
    console.log(this.id);
    this.viewDetails();
  }

  viewDetails(){
    this.userService.getDiscountById(this.id).subscribe((res:any)=>{
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
