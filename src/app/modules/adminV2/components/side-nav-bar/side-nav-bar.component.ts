import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ComponentService } from '../component.service';
import { CustomerService } from '../../modules/customers/services/customer.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent {
  selectedMenu = 'Dashboard';
  isOpen = false;
  panelOpenState = false;
  userpanelOpenState = false;
  dispanelOpenState = false;
  grantpanelOpenState = false;
  baauPanelOpenState = false;
  internalTranpanelOpenState = false;
  myRights:any;
  myRole:any;
  isOpenToggle: boolean = false;
  screenWidth: any;
  isMobile: boolean = false;
  constructor(private router: Router, public cs: ComponentService,private customerService:CustomerService) {
    this.cs.sidebarValue$.subscribe((res: any) => {
      this.isOpen = res;
      console.log(this.isOpen,'this.isOpen')
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.selectedMenu = this.getSelectedMenu(url);
        this.panelOpenState = this.isPanelOpenState(url);
        this.userpanelOpenState = url.includes('/adminv2/user-management');
        this.dispanelOpenState = url.includes('/adminv2/discount-management');
        this.baauPanelOpenState = this.isbaauPanelOpenState(url);
        this.internalTranpanelOpenState = this.isinternalTranpanelOpenState(url);
      }
    });
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
  }
  @HostListener('window:resize', ['$event'])

  onWindowResize() {
    this.screenWidth = window.innerWidth;
  }

  ngDoCheck(): void {
    if (this.screenWidth <= 767) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  getSelectedMenu(url: string): string {
    if (url.includes('/adminv2/dashboard')) {
      return 'Dashboard';
    } else if (url.includes('/adminv2/primary-transaction')) {
      this.panelOpenState = true;
      this.internalTranpanelOpenState = true;
      return 'Primary';
    } else if (url.includes('/adminv2/secondary-transaction/sec-transaction-list')) {
      this.panelOpenState = true;
      return 'Secondary';
    } 
    else if (url.includes('/adminv2/customer/list')) {
      return 'Customer';
    }
    
    else if (url.includes('/adminv2/baau/list')) {
      this.baauPanelOpenState = true;
      return 'BAAU';
    } else if (url.includes('/adminv2/discount-management/discount-coupons')) {
      return 'Coupons';
    } else if (url.includes('/adminv2/user-management/user-list')) {
      return 'User';
    } else if (url.includes('/adminv2/grant-requests')) {
      return 'payments';
    }else if(url.includes('/adminv2/referrer/list')){
      return 'Referrer'
    }else if(url.includes('/adminv2/automated-baau/list')){
      this.baauPanelOpenState = true;
      return 'Automated'
    } else if (url.includes('/adminv2/corporate-transaction')) {
      this.panelOpenState = true;
      this.internalTranpanelOpenState = true;
      return 'Corporate';
    } else if(url.includes('/adminv2/rm/rm-list')){
      return 'rm'
    }else if(url.includes('/adminv2/subscription-management/subscription-list')){
      return 'Subscription'
    } else if(url.includes('/adminv2/factor')){
      return 'factor';
    } else if(url.includes('/adminv2/report')){
      return 'report';
    }
    else if(url.includes('/adminv2/bulk-upload')){
      return 'bulkupload';
    }

    return '';
  }

  isPanelOpenState(url: string): boolean {
    return url.includes('/adminv2/primary-transaction') ||
      url.includes('/adminv2/secondary-transaction') ||
      url.includes('/adminv2/corporate-transaction')
  }
  isbaauPanelOpenState(url: string): boolean{
    return url.includes('/adminv2/automated-baau/list') || 
    url.includes('/adminv2/baau/list')
  }
  isinternalTranpanelOpenState(url:string): boolean{
    return url.includes('/adminv2/primary-transaction') ||
    url.includes('/adminv2/corporate-transaction')
  }

  goTo(paramText: string) {
    this.customerService.selectedTransactionType.next('');
    this.customerService.selectedUserTypeForTable.next('');
    this.selectedMenu = paramText;
    if (paramText === 'Dashboard') {
      this.router.navigateByUrl('/adminv2/dashboard');
    } else if (paramText === 'Primary') {
      this.panelOpenState = true;
      this.internalTranpanelOpenState = true;
      this.router.navigateByUrl('/adminv2/primary-transaction');
    } else if (paramText === 'Secondary') {
      this.panelOpenState = true;
      this.router.navigateByUrl('/adminv2/secondary-transaction/sec-transaction-list');
    } else if (paramText === 'Customer') {
      this.router.navigateByUrl('/adminv2/customer/list');
    } else if (paramText === 'BAAU') {
      this.baauPanelOpenState = true;
      this.router.navigateByUrl('/adminv2/baau/list');
    } else if (paramText === 'Coupons') {
      this.router.navigateByUrl('/adminv2/discount-management/discount-coupons');
    } else if (paramText === 'User') {
      this.router.navigateByUrl('/adminv2/user-management/user-list');
    } else if (paramText === 'payments') {
      this.router.navigateByUrl('/adminv2/grant-requests');
    }else if(paramText === 'Referrer'){
      this.router.navigateByUrl('/adminv2/referrer/list');
    }else if(paramText === 'Automated'){
      this.baauPanelOpenState = true;
      this.router.navigateByUrl('/adminv2/automated-baau/list');
    }else if(paramText === 'Corporate'){
      this.internalTranpanelOpenState = true;
      this.panelOpenState = true;
      this.router.navigateByUrl('/adminv2/corporate-transaction');
    }else if(paramText === 'rm'){
      this.router.navigateByUrl('/adminv2/rm/rm-list');
    }else if(paramText === 'Subscription'){
      this.router.navigateByUrl('/adminv2/subscription-management/subscription-list');
    }else if(paramText === 'factor'){
      this.router.navigateByUrl('/adminv2/factor');
    }else if(paramText === 'report'){
      this.router.navigateByUrl('/adminv2/report');
    }
    else if(paramText === 'bulkupload'){
      this.router.navigateByUrl('/adminv2/bulk-upload');
    }
  }
}
