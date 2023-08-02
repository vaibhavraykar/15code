import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-factoring-sidebar',
  templateUrl: './customer-factoring-sidebar.component.html',
  styleUrls: ['./customer-factoring-sidebar.component.scss']
})
export class CustomerFactoringSidebarComponent {
  @ViewChild('sideNav') sidenav: MatSidenav;
  selectedMenu:any = 'New Transaction';
  isSubmenu:boolean = false;
  isSubmenuProfile:boolean = false;
  isOpen:boolean = false;
  isClose:boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  dataSource: any = [
    {
      src: '/assets/images/factoring/sidebar-Dashboard.svg',  
    },
    {
      src: '/assets/images/factoring/sidabar-Active trans.svg',
    },
    {
      src: '/assets/images/factoring/sidebar-All trns.svg',
    },   
    {
      src: '/assets/images/factoring/sidebar-New trns.svg',  
    },
    {
      src: '/assets/images/factoring/sidebar-Previous.svg', 
    },
    {
      src: '/assets/images/factoring/sideba-Saved.svg', 
    },
  ];
  
  goTo(paramText:string) {
    this.selectedMenu = paramText;
    
    if(paramText == 'NewRequest') {
      this.isSubmenu = false;
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('cust/new-request');
    }    
    else if(paramText == 'ActiveTran'){
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('cust/active-tran');
    }
    else if(paramText == 'HisTran'){
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('cust/history-tran');
    }
  }

  open() {
    this.isSubmenu = !this.isSubmenu;
  }
  openProfile() {
    this.isSubmenuProfile = !this.isSubmenuProfile;
  }
  openSidebar() {
    this.isOpen =  !this.isOpen;
    this.isClose = !this.isClose;
  }
  closeSidebar() {
    this.isOpen = false;
    this.isClose = true;
  }
}
