import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FactorService } from '../services/factor.service';

@Component({
  selector: 'app-factor-baau-view',
  templateUrl: './factor-baau-view.component.html',
  styleUrls: ['./factor-baau-view.component.scss']
})
export class FactorViewComponent implements OnInit {

  routelocation: any;
  empId:any;
  viewData:any;
  userList:any=[]
  masterUserList:any=[];
  additionalUserList:any=[];
  panelOpenState:boolean;
  constructor(private route: ActivatedRoute, private factorService: FactorService, private location: Location,) {
    this.routelocation = this.location
  }

  ngOnInit() {
    this.factorService.viewFactorData.subscribe(res=>{
      this.viewData=res;
      this.userList = res['userList'];
      if(this.userList){
        this.userList.map(x=>{
          if(x.userType == 'MASTER_USER'){
            this.masterUserList.push(x);
          }if(x.userType != 'MASTER_USER'){
            this.additionalUserList.push(x);
          }
        });
      }
  })
  }

}
