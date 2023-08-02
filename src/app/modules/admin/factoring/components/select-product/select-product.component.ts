import { Component, EventEmitter, Output } from '@angular/core';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss']
})
export class SelectProductComponent {
  @Output() next : EventEmitter<any>= new EventEmitter;
  @Output() selectedProduct:EventEmitter<any>= new EventEmitter;
  imagePath = '/assets/images/factoring/confirmation.svg'
  selected:any=[];

  constructor(private factoringService:FactoringService){}

  proceed(selection:any){
    console.log(selection)
    this.next.emit(true);
    this.selectedProduct.emit(selection[0]);
  }

  selectedCard(event:any){
    this.selected.push(event);
  }
}
