import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  dataSource: any = [
    {
      src: '/assets/images/icons/sidemenu1.png',
    },
    {
      src: '/assets/images/icons/sidemenu2.png',
    },
    {
      src: '/assets/images/icons/sidemenu3.png',   
    },
    {
      src: '/assets/images/icons/sidemenu4.png',   
    },
    {
      src: '/assets/images/icons/sidemenu5.png',   
    },
    {
      src: '/assets/images/icons/sidemenu6.png',   
    },
  ];
}
