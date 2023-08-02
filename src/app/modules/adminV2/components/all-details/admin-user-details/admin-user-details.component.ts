import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-user-details',
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.scss']
})
export class AdminUserDetailsComponent implements OnInit {
  @Input() transactionDetails: any;
  panelOpenState: boolean;
  secondPanelOpenState: boolean;

  ngOnInit(): void {}
  
}
