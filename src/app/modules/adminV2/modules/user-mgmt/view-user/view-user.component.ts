import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserManagementServices } from '../services/user-mgmt-services.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
  routelocation:any
  loginuserName: any;
  couponId:any;
  idDetails:any;
  makerDate: any;
  checkerDate: any;
  countryList = [];
  roleInfo: any = [];
  dialogRef: MatDialogRef<any, any>;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(
    private location:Location,
    private route:ActivatedRoute,
    private dialog: MatDialog,
    private userMgmtService: UserManagementServices,
    ){
    this.routelocation= this.location;
    this.loginuserName = localStorage.getItem('userName');
  }



  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.couponId = params['id'];
      console.log('id',this.couponId);
      this.getUserList();
    })
  }

  getUserList(){
    this.userMgmtService.getUserById(this.couponId).subscribe((res:any)=>{
      console.log(res.data[0])
      this.idDetails=res?.data[0];
      const makerepochTime = this.idDetails?.makerApprovalDate;
      const mDate = new Date(makerepochTime);
      this.makerDate = mDate.toUTCString();
      const checkerepochTime = this.idDetails?.checkerApprovalDate;
      const cDate = new Date(checkerepochTime);
      this.checkerDate = cDate.toUTCString();
      console.log('maker',this.idDetails.userId)
      this.countryList = res['data'][0].countryList;
      var p: any = '';
      if (this.countryList) {
        for (let i = 0; i < this.countryList.length; i++) {
          if (i === 0) {
            p = this.countryList[i];
          } else {
            p = p + ',' + ' ' + this.countryList[i];
          }
        }
        this.countryList = p;
        console.log(this.countryList.length);
      }
      this.roleInfo = res['data'][0].roles;
      console.log('line 57', this.roleInfo);
      var r: any = '';
      if (this.roleInfo) {
        for (let i = 0; i < this.roleInfo.length; i++) {
          if (i === 0) {
            r = this.roleInfo[i].name.replace('_', ' ');
          } else {
            r = r + ',' + ' ' + this.roleInfo[i].name.replace('_', ' ');
          }
        }
        this.roleInfo = r;
        console.log(r);
      }
    })
  }
  viewCountry() {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '250px',
      disableClose:true
    });
  }

  changeStatus(id:any, status:any) {
    console.log(id);
    let data = {
      id: id,
      status: status
    }
    let message;
    if (this.idDetails.status == 'ACTIVE') {
      message = 'Are you sure you want to assign change the user status from Active to Inactive?';
    } else if (this.idDetails.status == 'INACTIVE') {
      message = 'Are you sure you want to assign change the user status from Inactive to Active?';
    }
    console.log('data of approval',data);
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: message
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.userMgmtService.updataAdminUserStatus(data).subscribe((res: any) => {
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
            disableClose:true
          });
          if (res['success'] == true) {
            this.getUserList();
          }

        })

      }
    });
  }
  close(){
    this.dialogRef.close();
  }
}
