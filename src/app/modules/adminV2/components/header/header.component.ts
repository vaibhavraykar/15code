import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ComponentService } from '../component.service';
import { Store } from '@ngrx/store';
import { Logout } from 'src/app/store/actions/logout.action';
import { clearState } from 'src/app/modules/auth/state/auth.actions';
import { take, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AdminChangePasswordComponent } from '../../modules/change-password/change-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  displayName:any;
  selectedRole:any;
  constructor(public cs :ComponentService,private store:Store,private dialog:MatDialog) {
    let data = JSON.parse(localStorage.getItem('userDetails'));
    this.displayName = data.firstName.slice(0, 1).toUpperCase() + data.lastName.slice(0, 1).toUpperCase() ;
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.selectedRole = selectedRoleDetails.name;
  }

  openSidebar() {
  this.cs.updateSidebarValue()
  }
  logout(){
    localStorage.clear();
    this.store.dispatch(new Logout());
    this.store.dispatch(clearState());
    timer(500).pipe(take(1)).subscribe(() => {
      window.location.href = '/auth/login';
    });
  }
  cp() {
    const popup = this.dialog.open(AdminChangePasswordComponent,{
      width: '600px',
      disableClose:true
    });
  }
}
