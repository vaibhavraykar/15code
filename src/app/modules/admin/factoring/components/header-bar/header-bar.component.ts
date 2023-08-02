import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent  implements OnInit{
  isLogout:boolean = false;
  userDetails:any=[];
  selectedRole:any;
  constructor(
    private router:Router,
    private store:Store,
    private adminService:AdminService,
    ){}

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails')); //this.adminService.userInfo;
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.selectedRole = selectedRoleDetails.name;
    console.log( this.userDetails);
  }
  logout() {
    this.isLogout = !this.isLogout;
  }
  close() {
    this.isLogout = false;
    // this.authService.logout().subscribe((res:any)=>{
      localStorage.clear();
      this.store.dispatch(new Logout());
      this.store.dispatch(clearState());
      // this.router.navigateByUrl('/auth/login');
      window.location.href='/auth/login'
    // })
  }
  addFactorOpen(){
    this.router.navigateByUrl('admin/dsb/factor-list');
  }
}
