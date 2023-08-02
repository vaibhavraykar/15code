import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedTabIndex: number = 0;
  constructor(private router: Router) {

   }
  ngOnInit(): void {
    this.detctRouter()
  }



  onTabChange(event: any): void {
    const selectedTabIndex = event.index;
    let route: string;

    switch (selectedTabIndex) {
      case 0:
        route = '/adminv2/dashboard/status';
        break;
      case 1:
        route = '/adminv2/dashboard/actions-needed';
        break;
      case 2:
        route = '/adminv2/dashboard/revenue-analysis';
        break;
      case 3:
        route = '/adminv2/dashboard/transaction-analysis';
        break;
      case 4:
        route = '/adminv2/dashboard/user-analysis';
        break;
      default:
        break;
    }
    this.router.navigateByUrl(route);
  }
  private getTabIndexFromUrl(url: string): number {
    switch (url) {
      case '/adminv2/dashboard/status':
        return 0;
      case '/adminv2/dashboard/actions-needed':
        return 1;
      case '/adminv2/dashboard/revenue-analysis':
        return 2;
      case '/adminv2/dashboard/transaction-analysis':
        return 3;
      case '/adminv2/dashboard/user-analysis':
        return 4;
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
