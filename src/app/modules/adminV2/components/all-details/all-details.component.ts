import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddDetailsService } from './services/add-details.service';
import { GrantRequestsServices } from '../../modules/grant-requests/services/grant-requests-services.services';

@Component({
  selector: 'app-all-details',
  templateUrl: './all-details.component.html',
  styleUrls: ['./all-details.component.scss']
})
export class AllDetailsComponent implements OnInit{
  routelocation:any
  transactionId:any;
  transactionDetails:any;
  constructor( 
    private location:Location,
    private route:ActivatedRoute,
    private as: AddDetailsService,
    private grantRequestServices : GrantRequestsServices
    ){
    this.routelocation= this.location
  }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.transactionId = params['id'];
      this.as.getTransactionById(this.transactionId).subscribe((res:any)=>{
        console.log(res.data[0])
        this.transactionDetails=res?.data[0];
      })
    })
  }

  back() {
    this.grantRequestServices.setSelectedTab(3);
    this.location.back(); 
  }


}
