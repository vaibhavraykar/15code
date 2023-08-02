import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../customers/services/customer.service';


@Component({
  selector: 'app-view-referrer',
  templateUrl: './view-referrer.component.html',
  styleUrls: ['./view-referrer.component.scss']
})
export class ViewReferrerComponent{
  userId:any;
  data:any=[];
  routelocation:any;
  panelOpenState:boolean;
constructor(private route:ActivatedRoute,private router:Router,private location:Location,
  private dialog: MatDialog,private customerService:CustomerService){
    this.routelocation=this.location;
}
ngOnInit(){
  this.userId=this.route.snapshot.paramMap.get('id');
  this.customerService.getCustomerById(this.userId).subscribe((res:any)=>{
    this.data = res.data[0];
    console.log('details of customer',this.data);
    
  })
}
back(): void {
  this.location.back()
} 
}
