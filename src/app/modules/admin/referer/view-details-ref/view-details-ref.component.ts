import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-view-details-ref',
  templateUrl: './view-details-ref.component.html',
  styleUrls: ['./view-details-ref.component.scss']
})
export class ViewDetailsRefComponent {
  userId:any;
  data:any=[];

constructor(private route:ActivatedRoute,private router:Router,private location:Location,
  private dialog: MatDialog,private customerService:CustomerService){
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
