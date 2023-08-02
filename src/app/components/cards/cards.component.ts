import { Component,EventEmitter,Input, Output } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {

  @Input() imagePath:string;
  @Input() name:string;
  @Output() selection: EventEmitter<any>=new EventEmitter
  clicked:boolean = false;

  selectedCard(e:any){
    this.clicked=!this.clicked;
    this.selection.emit(e);
  }
}
