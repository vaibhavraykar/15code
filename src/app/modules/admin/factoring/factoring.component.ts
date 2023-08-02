import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factoring',
  templateUrl: './factoring.component.html',
  styleUrls: ['./factoring.component.scss']
})
export class FactoringComponent {
  @ViewChild('sideNav') sidenav: MatSidenav;
  selectedMenu:any = 'New Transaction';
  isSubmenu:boolean = false;
  isSubmenuProfile:boolean = false;
  isOpen:boolean = false;
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
    
    if(paramText == 'Dashboard') {
      this.isSubmenu = false;
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/factoring/dashboard');
    } else if(paramText == 'New Transaction') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/factoring/new-transact');
    } 
    else if(paramText == 'Transactions') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/factoring/transaction');
    } 
    else if(paramText == 'Transaction Preview') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/factoring/transaction-preview');
    }
    else if(paramText == 'Transaction Details') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/factoring/transaction-details');
    } 
    else if(paramText == 'User List') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/user-list');
    }
     else if(paramText == 'Accept Reject User') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/accept-reject-user');
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
  }
  closeSidebar() {
    this.isOpen = false;
  }
}
