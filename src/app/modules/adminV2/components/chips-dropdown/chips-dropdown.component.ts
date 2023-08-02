import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chips-dropdown',
  templateUrl: './chips-dropdown.component.html',
  styleUrls: ['./chips-dropdown.component.scss']
})
export class ChipsDropdownComponent {
  form!: FormGroup;
  partnersBankList= [
    {
      id: 1,
      firstName: 'All'
    },
    {
      id: 2,
      firstName: 'Afghanistan'
    }, 
    {
      id: 3,
      firstName: 'Algeria'
    }, 
    {
      id: 4,
      firstName: 'Albania'
    }, 
    {
      id: 5,
      firstName: 'Andorra'
    }, 
    { 
      id: 6,
      firstName: 'Bangladesh'
    },
  ];
  state: any;

  ngOnInit(): void {
    this.createForm();
   
    this.setFormValue(this.state);
  }

  ngOnChanges(changes: any): void {
    const { partnerBankList } = changes['state'].currentValue;
    if (this.form) {
      this.setFormValue(changes['state'].currentValue);
    }
  }
  setFormValue(data: any) {
    const { partnerBankList } = data;
    console.log(partnerBankList);
    this.form.setValue({ selectBankName: partnerBankList });
  }
  createForm() {
    this.form = new FormGroup({
      selectBankName: new FormControl('', [Validators.required]),
    });
  }

  getbankName(name){
    let bankName=''
    bankName=  this.partnersBankList.find((e)=>e.id === name)?.firstName
    return bankName
  }
  onToppingRemoved(topping: string) {
    const toppings = this.form.controls['selectBankName'].value as string[];
    this.removeFirst(toppings, topping);
    this.form.controls['selectBankName'].setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
