import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sec-bank-details',
  templateUrl: './sec-bank-details.component.html',
  styleUrls: ['./sec-bank-details.component.scss']
})
export class SecBankDetailsComponent implements OnInit{
  @Input() transactionDetails: any;
  panelOpenState: boolean;
  secondPanelOpenState: boolean;

  ngOnInit(): void {}
}
