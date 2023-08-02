import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent {
  @Input() selectedProductInput: any;
  @Input() edit: any='';
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() selectedProduct: EventEmitter<any> = new EventEmitter();
  @Output() disableEmitter: EventEmitter<any> = new EventEmitter();

  cardsProduct: any[] = [
    {
      name: 'Confirmation',
      imageUrl: '/assets/images/customer/confirmation.svg',
      value: 'CONFIRMATION',
    },
    {
      name: 'Discounting',
      imageUrl: '/assets/images/customer/discounting.svg',
      value: 'DISCOUNTING',
    },
    {
      name: 'Confirmation & Discounting',
      imageUrl: '/assets/images/customer/confirmation & discounting.svg',
      value: 'CONFIRMANDDISCOUNT',
    },
    {
      name: 'Refinancing',
      imageUrl: '/assets/images/customer/Refinancing.svg',
      value: 'REFINANCE',
    },
    {
      name: 'Bankers Acceptance',
      imageUrl: '/assets/images/customer/Bankers acceptance.svg',
      value: 'BANKER',
    },
    {
      name: 'Bank Guarantee',
      imageUrl: '/assets/images/customer/bank gurantee.svg',
      value: 'BANKGUARANTEE',
    },
    {
      name: 'Avalisation',
      imageUrl: '/assets/images/customer/bank gurantee.svg',
      value: 'BILLAVALISATION',
    },
  ];

  selected: any;
  disableButton: boolean = true;

  ngOnInit() {
    console.log(this.selectedProductInput);
    console.log(
      this.cardsProduct.find(
        (item) => item.value.toUpperCase() == this.selectedProductInput
      )
    );
    this.selected = this.cardsProduct.find(
      (item) => item.value.toUpperCase() == this.selectedProductInput
    )?.value;
    console.log(this.selected);
    if (this.selectedProductInput) {
      this.disableButton = false;
    }
  }

  // Product Select Handler
  selectedProductType(name: any) {
    if(this.edit!=='edit'){
      if (this.selected === name) {
        this.selected = '';
        this.disableEmitter.emit(false);
        this.disableButton = true;
      } else {
        this.selected = name;
        this.selectedProduct.emit(this.selected.toUpperCase());
        this.disableEmitter.emit(true);
        this.disableButton = false;
      }
    }
  }

  // Funciton to proceed to the next tab
  proceed(selected: any) {
    if (!this.disableButton) {
      this.next.emit(true);
      this.selectedProduct.emit(selected.toUpperCase());
      this.disableEmitter.emit(true);
    }
  }
}
