import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';
import { SubscriptionComponent } from 'src/app/modules/customer/profile/subscription/subscription.component';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit{

    userId:any;
    data:any=[];

  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService){
  }
  ngOnInit(){
    this.userId=this.route.snapshot.paramMap.get('id');
    this.customerService.getCustomerById(this.userId).subscribe((res:any)=>{
      this.data = res.data[0];
    })
  }
  back(): void {
    this.location.back()
  } 

}