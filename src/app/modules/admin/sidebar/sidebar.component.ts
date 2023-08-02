import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @ViewChild('sideNav') sidenav: MatSidenav;
  selectedMenu:any = 'New Transaction';
  isSubmenu:boolean = false;
  isSubmenuProfile:boolean = false;
  isOpen:boolean = false;
  isClose:boolean = true;
  myRights:any;
  myRole:any;
  constructor(private router: Router,private adminservice : AdminService) { 
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
  }

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
    localStorage.removeItem('selectedSubscriberType');
    if(paramText == 'Dashboard') {
      this.isSubmenu = false;
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/dashboard');
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
    else if(paramText == 'Transaction List') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/factoring/transaction-list');
    }
    else if(paramText == 'User List') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/user-list');
    }
     else if(paramText == 'Accept Reject User') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/accept-reject-user');
    }
    else if(paramText == 'Discount Coupons') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/discount-coupons');
    }
    else if(paramText == 'Accept Reject Coupons') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/accept-reject-coupons');
    }      
    else if(paramText == 'Product List') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/product-list');
    }
    else if(paramText == 'Accept Reject Product') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/accept-reject-product');
    }
    else if(paramText == 'Assign Grant RM') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/assign-grant-rm');
    }  
     else if(paramText == 'Customers'){
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/customer-list');
    }
      else if(paramText == 'baau'){
      this.router.navigateByUrl('admin/dsb/baau-list');
    } 
    else if(paramText == 'Grant Transaction') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/grant');
    }
    else if(paramText == 'Grant Payment') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/grant-payment');
    }
    else if(paramText == 'Grant KYC') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/grant-kyc');
    }
    else if(paramText == 'Referrer') {
      this.isSubmenuProfile = false;
      this.router.navigateByUrl('admin/dsb/referer-list');
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
