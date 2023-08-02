import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {
  routelocation: any;
  customerDetails: any = [];
  panelOpenState: boolean;
  secondPanelOpenState: boolean;
  userName: any;

  constructor(private route: ActivatedRoute, private customerService: CustomerService, private location: Location,) {
    this.routelocation = this.location

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userName = params['id'];
      console.log(this.userName);
      this.customerService.getCustomerById(this.userName).subscribe((res: any) => {
        console.log(res.data[0])
        this.customerDetails = res?.data[0];
      })
    })
  }

}
