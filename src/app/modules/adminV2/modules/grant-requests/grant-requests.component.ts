import { Component, OnInit } from '@angular/core';
import { GrantPaymentComponent } from './grant-payment/grant-payment.component';
import { GrantKycComponent } from './grant-kyc/grant-kyc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GrantRequestsServices } from './services/grant-requests-services.services';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { filter, map } from 'rxjs';

// import { AcceptRejectUserComponent } from '../user-mgmt/approve-reject-user/approve-reject-user.component';
@Component({
  selector: 'app-grant-requests',
  templateUrl: './grant-requests.component.html',
  styleUrls: ['./grant-requests.component.scss']
})
export class GrantRequestsComponent implements OnInit {
  routelocation: any;
  tableStructure: any;
  selectedTabIndex: number = 0;
  myRights:any;

  constructor(private router: Router, private grantRequestServices: GrantRequestsServices) {
  }

  ngOnInit() {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.grantRequestServices.selectedTab$.subscribe(index => {
      this.selectedTabIndex = index;
    });
    this.detctRouter()
  }

  onTabSelected(index: number): void {
    this.grantRequestServices.setSelectedTabIndex(index);
    let route: string;

    switch (this.selectedTabIndex) {
      case 0:
        route = '/adminv2/grant-requests/users';
        break;
      case 1:
        route = '/adminv2/grant-requests/kyc';
        break;
      case 2:
        route = '/adminv2/grant-requests/payment';
        break;
      case 3:
        route = '/adminv2/grant-requests/transaction';
        break;
      case 4:
        route = '/adminv2/grant-requests/coupons';
        break;
      case 5:
        route = '/adminv2/grant-requests/grant-rm';
        break;
      case 6:
        route = '/adminv2/grant-requests/subscription';
        break;
      case 7:
        route = '/adminv2/grant-requests/groupCompany-kyc';
        break;
        case 8:
          route = '/adminv2/grant-requests/bulktransaction';
          break;
      default:
        break;
    }
    this.router.navigateByUrl(route);
  }

  private getTabIndexFromUrl(url: string): number {
    switch (url) {
      case '/adminv2/grant-requests/users':
        return 0;
      case '/adminv2/grant-requests/kyc':
        return 1;
      case '/adminv2/grant-requests/payment':
        return 2;
      case '/adminv2/grant-requests/transaction':
        return 3;
      case '/adminv2/grant-requests/coupons':
        return 4;
        case '/adminv2/grant-requests/grant-rm':
        return 5;
        case '/adminv2/grant-requests/subscription':
        return 6;
        case '/adminv2/grant-requests/groupCompany-kyc':
        return 7;
        case '/adminv2/grant-requests/bulktransaction':
        return 8;
      default:
        return 0;
    }
  }

  detctRouter(){
    this.router.events
    .pipe(map(({ routerEvent }: any) => {
      return routerEvent
    }))
    .subscribe((event: any) => {
      try {
        this.selectedTabIndex = this.getTabIndexFromUrl(event.url);
      } catch (error) {

      }
    });
  }
}
