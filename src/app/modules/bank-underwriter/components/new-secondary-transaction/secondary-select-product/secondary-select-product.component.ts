import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-secondary-select-product",
  templateUrl: "./secondary-select-product.component.html",
  styleUrls: ["./secondary-select-product.component.scss"],
})
export class SecondarySelectProductComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() state: any = {};
  @Input() edit :any ='';
  @Output() selectedProductHandler: EventEmitter<any> = new EventEmitter();
  userInfo: any;
  errors = {
    product: false,
  };

  ngOnInit(): void {}
  cardsProduct: any[] = [
    {
      name: "Confirmation",
      imageUrl: "/assets/images/customer/confirmation.svg",
      value:'CONFIRMATION' 
    },
    {
      name: "Discounting",
      imageUrl: "/assets/images/customer/discounting.svg",
      value:'DISCOUNTING'
    },
    {
      name: "Confirmation & Discounting",
      imageUrl: "/assets/images/customer/confirmation & discounting.svg",
      value:'CONFIRMANDDISCOUNT'
    },
    {
      name: "Refinancing",
      imageUrl: "/assets/images/customer/Refinancing.svg",
      value:'REFINANCE'
    },
    {
      name: "Bankers Acceptance",
      imageUrl: "/assets/images/customer/Bankers acceptance.svg",
      value:'BANKER'
    },
    {
      name: "Bank Guarantee",
      imageUrl: "/assets/images/customer/bank gurantee.svg",
      value:'BANKGUARANTEE'
    },
    {
      name: "Avalisation",
      imageUrl: "/assets/images/bank_underwriter/avalisation.png",
      value:'BILLAVALISATION'
    },
    {
      name: "Trade Loan",
      imageUrl: "/assets/images/bank_underwriter/trade Loan.png",
      value:'TRADELOAN'
    },
  ];

  selectedProduct: string = "";
  secTransactionType = "FUNDED";
  participationBasis = "DISCLOSED";

  ngOnChanges(changes: SimpleChanges): void {
    const { requirementType, secTransactionType, participationBasis } =
      changes["state"].currentValue;
    this.selectedProduct = requirementType;
    this.secTransactionType = secTransactionType;
    this.participationBasis = participationBasis;
  }
  selectedProductType(event: any) {}
  proceed() {
    if (!this.selectedProduct) {
      this.errors.product = true;
      return;
    }
    this.errors.product = false;
    this.selectedProductHandler.emit({
      product: this.selectedProduct,
      secTransactionType: this.secTransactionType,
      participationBasis: this.participationBasis,
    });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  reset() {
    this.selectedProduct = "";
    this.errors.product = false;
  }
}
