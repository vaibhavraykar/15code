import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: 'app-secondary-pricing',
  templateUrl: './secondary-pricing.component.html',
  styleUrls: ['./secondary-pricing.component.scss'],
})
export class SecondaryPricingComponent implements OnInit, OnChanges {
  @Input() state: any = {};
  @Output() pricingHandler: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    setTimeout(()=>{
      if (this.form) {
        this.setFormValue(changes['state'].currentValue);
      }
    },1000)
  }
  ngOnInit(): void {
    this.createForm();
  }

  setFormValue(data: any) {
    const {
      commissionScheme,
      minParticipationAmt,
      retentionAmt,
      offeredPrice,
      otherCondition,
      benchmark,
    } = data;

    this.form.setValue({
      commissionScheme: commissionScheme,
      minParticipationAmt: this.formatAmount(minParticipationAmt),
      retentionAmt: this.formatAmount(retentionAmt),
      offeredPrice: offeredPrice,
      otherCondition: otherCondition,
      benchmark: benchmark,
    });
  }
  createForm() {
    this.form = new FormGroup({
      commissionScheme: new FormControl('Front Ended', [Validators.required]),
      minParticipationAmt: new FormControl('', [
        Validators.required,
        this.amountValidator,
      ]),
      retentionAmt: new FormControl('', [
        Validators.required,
        this.amountValidator,
      ]),
      offeredPrice: new FormControl('', []),
      otherCondition: new FormControl('', []),
      benchmark: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
    });
  }
  checkLimit(e: any) {
    if (this.form.controls['otherCondition'].value.length >= 10000) {
      return false;
    } else {
      return true;
    }
  }
  submit() {
    if (this.state.secTransactionType !== 'FUNDED') {
      let benchmarkForm = this.form.controls['benchmark'];
      benchmarkForm.setValue('');
      benchmarkForm.setErrors(null);
    }
    if (this.form.valid) {
      this.form.controls['minParticipationAmt'].setValue(
        this.parseAmount({target:{value:this.form.controls['minParticipationAmt'].value}})
      );
      this.form.controls['retentionAmt'].setValue(
        this.parseAmount({
          target: { value: this.form.controls['retentionAmt'].value },
        })
      );
      this.pricingHandler.emit(this.form.value);
    }
  }
  restrictKeys(event: any) {
    return (
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      event.keyCode == 8 ||
      event.keyCode == 190 ||
      event.keyCode == 110 ||
      event.keyCode == 9 ||
      event.keyCode == 37 ||
      event.keyCode == 39
    );
  }
  checkLcValue(event: any, controlName: string) {
    
    let lcValue = Number(this.state?.lCValue);
    let targetNum = Number(event.target.value.replace(/,/g, ''));
    console.log(targetNum)
    if (this.form.controls[controlName].valid) {
      if (!(lcValue >= targetNum)) {
        this.form.controls[controlName].setErrors({ bigger: true });
      } else {
        this.form.controls[controlName].setErrors(null);
      }
    }
    console.log(this.form.controls[controlName].valid);
  }

  amountValidator(control: FormControl) {
    const value = control.value.replace(/,/g, '');
    console.log(value);
    const isValid =
      /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
      
    return isValid ? null : { invalid: true };
  }

  formatAmount(value: string) {
    const number = +value?.toString().replace(/[^0-9.]/g, '');
    return isNaN(number)
      ? ''
      : number > 0
      ? number.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })
      : '';
  }

  parseAmount(e: any) {
    console.log(e);
    let target = e.target.value || '';
    return target.replace(/,/g, '');
  }

  onBlur(event:any,formName: any) {
    const value = this.parseAmount({
      target: { value: this.form.controls[formName].value },
    });
    this.form.controls[formName].setValue(this.formatAmount(value));
    console.log(this.form.controls[formName]);
    // this.focusOutEvent.emit(value);
    // this.validField.emit(true);
    this.checkLcValue(event, formName);
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window['clipboardData'];
    const pastedText = clipboardData.getData('text');
    const formattedText = this.formatAmount(pastedText);
    document.execCommand('insertText', false, formattedText);
  }

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      '.',
    ];
    const key = event.key;
    const isValidKey = !isNaN(key as any) || allowedKeys.includes(key);
    if (!isValidKey) {
      event.preventDefault();
    }
  }
}
