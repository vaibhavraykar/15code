import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  userID:any;
  pwd:any;

  constructor(
    private adminService:AdminService,
    private router:Router,
  ){}

  ngOnInit(): void {

  }


  userIDHandler(event:any){
    this.userID=event;
  }

  pwdHandler(event:any){
    this.pwd = event;
  }

  submit(e:any){

    console.log('clicked');
    if(this.userID&&this.pwd){
      console.log(this.userID,'this.userID\n',this.pwd,'pwd');
      
      this.adminService.getAdminToken(this.userID,this.pwd).subscribe((res:any)=>{
        console.log(res);
        this.adminService.setAdminToken(res.data[0]);
        this.router.navigateByUrl('/admin/factoring/transaction-details')
      })
    }
    e.preventDefault();
  }

}
