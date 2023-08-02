import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() selectedProduct: EventEmitter<any> = new EventEmitter();
  @Output() disableEmitter: EventEmitter<any> = new EventEmitter();
  imagePath = '/assets/images/factoring/confirmation.svg';
  selected: any = [];
  disable: boolean;

  constructor(private factoringService: FactoringService) {}

  ngOnInit(): void {
    this.disable = true;
  }

  proceed(selection: any) {
    if (this.disable == false) {
      console.log(selection);
      this.selectedProduct.emit(this.selected[0]);
      this.next.emit('TRANSACTION DETAILS');
    }
  }

  selectedCard(event: any) {
    if (!this.selected.includes(event)) {
      this.selected.push(event);
      this.disable = false;
      this.disableEmitter.emit(this.selected.length > 0);
      console.log(this.selected);
    } else {
      let index = this.selected.findIndex((ele: any) => ele == event);
      this.selected.splice(index, 1);
      console.log(this.selected);
    }

    // this.selectedProduct.emit(this.selected[0]);
  }
}
