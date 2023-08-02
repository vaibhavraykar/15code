import { Component ,OnInit, Input,	Output, EventEmitter,} from '@angular/core';
import { FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  @Input() isCreditCard: boolean = false;
  @Input() required?: boolean;
  @Input() options: any[] ;
  @Input() isEditMode : boolean;
  @Input() title : any;
  @Input() name : any;
  @Output() selection: EventEmitter<any> = new EventEmitter();
  
  selectedOption:any;
  defaultSelected='select'

  selected = new FormControl('', [Validators.required]);
  
  

  changeOptions(event:any) {
    if (event.value != 'select') {
      this.selection.emit(event.value.toString());
      return true;
    }
    else {
      return false;
    }
  }

  public errorHandling = (error: string) => {
    return this.selected.hasError(error);
  };

  selectOption(e:any){
    console.log(e.value);
    this.selectedOption=e.value;
    this.selection.emit(this.selectedOption.toString());
  }
  inputClickhandler(event:any){
  }

}
