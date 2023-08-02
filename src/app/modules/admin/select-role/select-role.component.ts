import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss'],
})
export class SelectRoleComponent implements OnInit {
  roleData:any;
    roleList:any=[];
    myRights:any;
    myRole:any;
    rightListByRoleName:any;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SelectRoleComponent>,@Inject(MAT_DIALOG_DATA) public data,
    private adminservice :AdminService
  ) {
    this.roleList=data.data[0].user_info.role;
  }

  ngOnInit(): void {
  }

  selectedRole(value){
    this.roleData = value;
  }
  close(){
    this.dialogRef.close();
  }
  submit(){
    if(this.roleData){
      localStorage.setItem('selectedRole',JSON.stringify(this.roleData));
      this.adminservice.getRightByRoleName(this.roleData.name).subscribe((res:any)=>{
        this.rightListByRoleName = res.data[0].rights;
        this.myRights = this.rightListByRoleName.map(x=>x.name);
        localStorage.setItem('rightsList', JSON.stringify(this.myRights));
        console.log(this.myRights);
        let loginElement = document.querySelector('.login-container')
        loginElement.setAttribute('hidden','true')
        // this.router.navigateByUrl('/admin/dsb/dashboard');
        this.router.navigateByUrl('/adminv2/dashboard');
        this.close();
      })
    }

  }
}
