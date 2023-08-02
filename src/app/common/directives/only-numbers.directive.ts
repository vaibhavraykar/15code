import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor(private el : ElementRef) { }

  
  @HostListener("input", ['$event'])
  onInputChange(event : any){
    const initialValue = this.el.nativeElement.value;

    if(initialValue.length === 1){
      this.el.nativeElement.value = initialValue.replace(/[^6-9]*/g,'');
    }
    else{
      this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g,'');
    }
  if(initialValue !== this.el.nativeElement.value){
    event.stopPropagation();
  }
  }

}
