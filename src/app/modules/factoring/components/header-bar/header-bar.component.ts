import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent  implements OnInit{
  isLogout:boolean = false;
  userDetails:any=[];
  constructor(private authService:AuthService,
    private router:Router,
    private store:Store
    ){}

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));//this.authService.userDetails[0].personalDetails;
    console.log( this.userDetails);
  }
  logout() {
    this.isLogout = !this.isLogout;
  }
  close() {
    this.isLogout = false;
    this.authService.logout().subscribe((res:any)=>{
      localStorage.clear();
      this.store.dispatch(new Logout());
      this.store.dispatch(clearState());
      // this.router.navigateByUrl('/auth/login').then(()=>{
      //   window.location.href('/auth/login')
      // });
      window.location.href='/auth/login'
    })
    // this.authService.appLogout();
  }
}
