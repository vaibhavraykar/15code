import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
import { FactorService } from '../../services/factor/factor.service';
import { EditFactorComponent } from '../edit-factor/edit-factor.component';

@Component({
  selector: 'app-viewfactor',
  templateUrl: './view-factor.component.html',
  styleUrls: ['./view-factor.component.scss']
})
export class ViewFactorComponent implements OnInit{

  empId:any;
  viewData:any;
  userList:any=[]
  masterUserList:any=[];
  additionalUserList:any=[]
  constructor(private route:ActivatedRoute,private router:Router,private location:Location,public adminService:AdminService,
    private dialog: MatDialog,private factorService:FactorService){
        this.factorService.viewFactorData.subscribe(res=>{
            this.viewData=res;
            this.userList = res['userList'];
            this.userList.map(x=>{
              if(x.userType == 'MASTER_USER'){
                this.masterUserList.push(x);
              }if(x.userType != 'MASTER_USER'){
                this.additionalUserList.push(x);
              }
            });
            // console.log('masterUserList',this.masterUserList);
            // console.log('additionalUserList',this.additionalUserList);

        })
  }
  ngOnInit(){
  }
  back(): void {
    this.location.back()
  } 
  edit(data){
    this.router.navigate(['admin/dsb/factor-list']);
    const popup = this.dialog.open(EditFactorComponent, {
        width: '800px',
        height: '450px',
        data :{
          full_data : data,
          edit : true
        },
        disableClose: true
      }); 
  }
}