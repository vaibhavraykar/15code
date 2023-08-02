import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';

@Component({
  selector: 'app-secondary-select-bank',
  templateUrl: './secondary-select-bank.component.html',
  styleUrls: ['./secondary-select-bank.component.scss'],
})
export class SecondarySelectBankComponent implements OnInit, OnChanges {
  form!: FormGroup;
  @Input() state: any = {};
  @Output() BankHandler: EventEmitter<any> = new EventEmitter();
  constructor(private transactionService: TransactionService) {}
  partnersBankList = [];
  ngOnInit(): void {
    this.createForm();
    this.fetchBank();
    this.setFormValue(this.state);
  }
  ngOnChanges(changes: any): void {
    const { partnerBankList } = changes['state'].currentValue;
    setTimeout(()=>{
      if (this.form) {
        this.setFormValue(changes['state'].currentValue);
      }
    },1000)
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

  fetchBank() {
    this.transactionService.getPartnerBankList().subscribe({
      next: (res: any) => {
        try {
          this.partnersBankList = res?.data.map((item: any) => {
            return {
              firstName: item.firstName,
              country:item.country,
              email:item?.email,
              id: item.id,
            };
          });
        } catch (e) {
          this.partnersBankList = [];
        }
      },
    });
  }

  submit() {
    if (this.form.value.selectBankName?.length > 0) {
      this.BankHandler.emit(this.form.value);
    }
  }
  selectAllOptions(e: any) {
    console.log(this.partnersBankList);
    let selected = [];
    for (let item of this.partnersBankList) {
      selected.push(item.id);
    }
    if (e.checked) {
      this.form.setValue({ selectBankName: selected });
    } else {
      this.form.setValue({ selectBankName: [] });
    }
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
