import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AddDetailsService } from '../../../../components/all-details/services/add-details.service';
@Component({
  selector: 'app-baau-tran-view',
  templateUrl: './baau-tran-view.component.html',
  styleUrls: ['./baau-tran-view.component.scss']
})
export class BaauTranViewComponent implements OnInit {

  transactionId: any;
  transactionDetails: any;
  requirement = "Banker's Acceptance";
  todaysDate: any;
  routelocation: any;
  panelOpenState: boolean;
  secondPanelOpenState: boolean;
  productsTypes: any[] = [
    { name: 'Confirmation', value: 'CONFIRMATION' },
    { name: 'Discounting', value: 'DISCOUNTING' },
    { name: 'Confirmation & Discounting', value: 'CONFIRMANDDISCOUNT' },
    { name: 'Refinancing', value: 'REFINANCE' },
    { name: 'Bankers Acceptance', value: 'BANKER' },
    { name: 'Bank Guarantee', value: 'BANKGUARANTEE' },
    { name: 'Avalisation', value: 'BILLAVALISATION' },
  ];
  constructor(private route: ActivatedRoute, private as: AddDetailsService, private location: Location,) {
    this.routelocation = this.location
  }
  ngOnInit() {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    this.viewDetails();
    var str = new Date().setSeconds(0, 0);
    this.todaysDate = new Date(str).toISOString();
  }
  viewDetails() {
    this.as.getTransactionById(this.transactionId).subscribe((res: any) => {
      if (res['success'] == true) {
        this.transactionDetails = res['data'][0];
      }
    })
  }
  back(): void {
    this.location.back()
  }
  findProductName(name: any) {
    if (this.transactionDetails) {
      let product = this.productsTypes.find((item: any) => item.value === name);
      return product.name.toUpperCase();
    }
  }
  openInvoice() {
    window.open(this.transactionDetails.invoiceUpload, '_blank');
  }

  convertBoolean(e: any) {
    if (this.transactionDetails) {
      if (
        e === true ||
        e.toLowerCase() === 'yes' ||
        e.toLowerCase() === 'true'
      ) {
        return 'Yes';
      } else {
        return 'No';
      }
    }
    return 'No'
  }

}
