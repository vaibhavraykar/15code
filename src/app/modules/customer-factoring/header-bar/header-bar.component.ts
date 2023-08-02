import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { CustomerFactoringService } from '../customer-factoring.service';
// import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-header-bar-cust-factor',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent  implements OnInit{
  isLogout:boolean = false;
  userDetails:any=[];
  constructor(
    private router:Router,
    private store:Store,
    private custFactService:CustomerFactoringService,
    ){}

  ngOnInit(): void {
    this.userDetails = localStorage.getItem('loginEmail'); //this.adminService.userInfo;
    console.log( this.userDetails);
  }
  logout() {
    this.isLogout = !this.isLogout;
    this.custFactService.isLogout.next(this.isLogout);
  }
  close() {
    this.isLogout = false;
    // this.authService.logout().subscribe((res:any)=>{
      localStorage.clear();
      this.store.dispatch(new Logout());
      this.store.dispatch(clearState());
      // this.router.navigateByUrl('/auth/login');
      localStorage.clear();
      window.location.href='/cust/verification'
    // })
  }

}
