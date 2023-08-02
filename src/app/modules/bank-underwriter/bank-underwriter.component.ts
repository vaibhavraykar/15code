import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-bank-underwriter',
  templateUrl: './bank-underwriter.component.html',
  styleUrls: ['./bank-underwriter.component.scss']
})
export class BankUnderwriterComponent {
  @ViewChild('sideNav') sidenav: MatSidenav;
  selectedMenu: any = 'Dashboard';
  isOpen: boolean = false;
  //
  panelOpenState = false;
  //

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  goTo(paramText: string) {
    this.selectedMenu = paramText;
    if (paramText == 'Dashboard') {
      if (this.checkAutomatedBank()) {
        this.sharedService.openRestrictPopup();
        this.isOpen = false;
      } else {
        this.router.navigateByUrl('/bank-underwriter/dashboard');
      }
    } else if (paramText == 'New Transaction') {
      this.router.navigateByUrl('/bank-underwriter/new-transaction');
      this.isOpen = false;
    }
    else if (paramText == 'Transaction Available') {
      this.router.navigateByUrl('/bank-underwriter/transaction-available');
      this.isOpen = false;
    }
    else if (paramText == 'All Transaction') {
      this.router.navigateByUrl('/bank-underwriter/all-transaction');
      this.isOpen = false;
    }
    else if (paramText === 'Transaction Details') {
      if (this.checkAutomatedBank()) {
        this.sharedService.openRestrictPopup();
        this.isOpen = false;
      } else {
        this.router.navigateByUrl('/bank-underwriter/new-secondary-transaction');
        this.isOpen = false;
      }
    }
    else if (paramText === 'Active Transaction') {
      this.router.navigateByUrl('/bank-underwriter/active-transaction');
      this.isOpen = false;
    } else if (paramText === 'Saved Transactions') {
      this.router.navigateByUrl('/bank-underwriter/save-transaction');
      this.isOpen = false;
    } else if (paramText === 'Transaction History') {
      this.router.navigateByUrl('/bank-underwriter/transaction-history');
      this.isOpen = false;
    }
    else if (paramText === 'Selling New Transaction') {
      if (this.checkAutomatedBank()) {
        this.sharedService.openRestrictPopup();
        this.isOpen = false;
      } else {
        this.router.navigateByUrl('/bank-underwriter/new-secondary-transaction');
        this.isOpen = false;
      }

    } else if (paramText === 'Selling Active Transaction') {
      if (this.checkAutomatedBank()) {
        this.sharedService.openRestrictPopup();
        this.isOpen = false;
      } else {
        this.router.navigateByUrl('/bank-underwriter/active-secondary-transaction');
        this.isOpen = false;
      }

    }
    else if (paramText === 'Selling Transaction Details') {
      if (this.checkAutomatedBank()) {
        this.sharedService.openRestrictPopup();
        this.isOpen = false;
      } else {
        sessionStorage.setItem('filter', JSON.stringify(['ACCEPTED']))
        this.router.navigateByUrl('/bank-underwriter/secondary-transaction-details');
        this.isOpen = false;
      }
    }
    else if (paramText === 'Selling Saved Transaction') {
      if (this.checkAutomatedBank()) {
        this.sharedService.openRestrictPopup();
        this.isOpen = false;
      } else {
        this.router.navigateByUrl('/bank-underwriter/secondary-saved-transaction');
        this.isOpen = false;
      }
    }
    else if (paramText === 'Buying New Request') {
      this.router.navigateByUrl('/bank-underwriter/secondary-new-transaction-qoute');
      this.isOpen = false;
    }
    else if (paramText === 'Buying Active Transaction') {
      this.router.navigateByUrl('/bank-underwriter/active-transaction-qoute');
      this.isOpen = false;
    }
    else if (paramText === 'Buying Transaction Details') {
      sessionStorage.setItem('filter', JSON.stringify(['ACCEPTED']))
      this.router.navigateByUrl('/bank-underwriter/transaction-detail-qoute');
      this.isOpen = false;
    }
    else if (paramText === 'Buying Saved Transaction') {

      this.router.navigateByUrl('/bank-underwriter/saved-transaction-qoute');
      this.isOpen = false;
    }
  }
  openSideBar() {
    this.isOpen = true;
  }

  openSidebar() {
    this.isOpen = !this.isOpen;
  }
  closeSidebar() {
    this.isOpen = false;
  }


  checkAutomatedBank() {
    let user = localStorage.getItem('bankType')||''
    if (user == "SECONDARY_AUTOMATED") {
      return true
    } else if(user == "AUTOMATED"){
      return true
    } else {
      return false
    }
  }
}
