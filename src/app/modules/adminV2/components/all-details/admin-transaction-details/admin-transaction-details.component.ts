import { Component ,Input } from '@angular/core';

@Component({
  selector: 'app-admin-transaction-details',
  templateUrl: './admin-transaction-details.component.html',
  styleUrls: ['./admin-transaction-details.component.scss']
})
export class AdminTransactionDetailsComponent {
  @Input() transactionDetails: any;
  panelOpenState: boolean;
  secondPanelOpenState: boolean;
  productName:any;

  productsTypes: any[] = [
    { name: 'Confirmation', value: 'CONFIRMATION' },
    { name: 'Discounting', value: 'DISCOUNTING' },
    { name: 'Confirmation & Discounting', value: 'CONFIRMANDDISCOUNT' },
    { name: 'Refinancing', value: 'REFINANCE' },
    { name: 'Bankers Acceptance', value: 'BANKER' },
    { name: 'Bank Guarantee', value: 'BANKGUARANTEE' },
    { name: 'Avalisation', value: 'BILLAVALISATION' },
  ];

  findProductName(name: any) {
    if(this.transactionDetails){
      let product = this.productsTypes.find((item: any) => item.value === name);
      return product.name.toUpperCase();
    }
  }

  openInvoice() {
    window.open(this.transactionDetails.invoiceUpload, '_blank');
  }

  convertBoolean(e:any){
    if(this.transactionDetails){
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
