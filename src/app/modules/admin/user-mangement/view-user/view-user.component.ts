import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserManagementService } from '../../services/userManagement/userManagement.service';

@Component({
  selector: 'app-viewuser',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewuserComponent implements OnInit {

  empId: any;
  viewData: any;
  roleInfo: any = [];
  roleSelection: any = [];
  countryList = [];
  finalCountryList: any = [];
  myRights:any;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;

  showEditButton: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private location: Location, public adminService: AdminService,
    private dialog: MatDialog, private userService: UserManagementService) {
    this.userService.adminUserId.subscribe((res: any) => {
      if (res) {
        this.empId = res;
      }
    })
  }
  ngOnInit() {
    this.showEditButton = this.route.snapshot.queryParams['showEditButton'] === 'true';
    this.empId = this.route.snapshot.paramMap.get('id');
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    console.log(this.empId);
    this.viewUser();
  }
  back(): void {
    this.location.back()
  }
  viewUser() {
    this.userService.getAdminUserById(this.empId).subscribe((res: any) => {
      if (res['success'] == true) {
        this.viewData = res['data'][0];
        console.log('data',this.viewData);
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
      } else {
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
        });
      }

    })
  }
  editUser(event) {
    console.log(event, 'id');
    this.userService.editAdminUserId.next(event);
    this.router.navigate(['admin/dsb/edit-user']);
  }
  viewCountry() {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '250px',
    });
  }
  close(){
    this.dialogRef.close();
  }
}
