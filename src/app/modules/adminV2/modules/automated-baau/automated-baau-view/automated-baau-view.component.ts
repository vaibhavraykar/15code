import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AutomatedBaauService } from '../services/automated-baau.service';

@Component({
  selector: 'app-automated-baau-view',
  templateUrl: './automated-baau-view.component.html',
  styleUrls: ['./automated-baau-view.component.scss']
})
export class AutomatedBaauViewComponent implements OnInit {

  routelocation: any;
  baauDetails: any;
  panelOpenState: boolean;
  userName: any;
  issuanceCountry:any;
  blklstedGoodsList:any;
  masterUserData:any;
  passUserData:any=[];
  constructor(private route: ActivatedRoute, private automatedbaauService: AutomatedBaauService, private location: Location,) {
    this.routelocation = this.location
    this.automatedbaauService.viewDetails.subscribe(res=>{
    this.baauDetails = res; 
    this.masterUserData = this.baauDetails?.userList.filter(x=>x.userType == 'MASTER_USER');
    this.passUserData = this.baauDetails?.userList.filter(x=>x.userType == 'PASSCODE_USER');
     })
  }

  ngOnInit() {

  }

}
