import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  AfterContentInit,
} from '@angular/core';
import {
  FormControlName,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { tap } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

export function amouontValidator(minAmt: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value < 0.1;
    return forbidden ? { amtLess: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-inputtext',
  templateUrl: './inputtext.component.html',
  styleUrls: ['./inputtext.component.scss'],
})
export class InputtextComponent implements OnInit, OnChanges,AfterContentInit {
  @Input() revamp?: boolean=false;
  @Input() type: string;
  @Input() name?: any;
  @Input() placeHolder?: string;
  @Input() required?: boolean;
  @Input() value?: string;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() keypress?:string;
  @ViewChild('ipElement', { static: false }) ipEl: any;
  @Output() focusOutEvent: EventEmitter<any> = new EventEmitter();
  @Output() updateOutEvent: EventEmitter<any> = new EventEmitter();
  @Output() validField: EventEmitter<any> = new EventEmitter();

  firstname = new FormControl('', [Validators.required, Validators.email]);
  form!: FormControl;
  form2!: FormControl;
  realTime: boolean = true; // for instant error messages
  getId: boolean = false;
  countryCodeLength:any;

  matcher = this.realTime ? new MyErrorStateMatcher() : null;

  emailValidation = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  constructor(private fb: FormBuilder) {}
  ngAfterContentInit(): void {

  }

  ngOnChanges(event: any) {
    if (event.value) {
      if (!event.value.firstChange) {
        this.formValue(event?.value?.currentValue);
      }
    }
  }
  ngOnInit() {
    this.getForm();
    if (this.value) {
      console.log(this.value)
      this.formValue(this.value);
    }
    if (this.name == 'User ID') {
      this.getId = true;
    }

  }

  public errorHandling = (error: string) => {
    return this.form.hasError(error);
  };

  formValue(value: any) {
    console.log(value)
    this.form.setValue(value);
    if(this.name=='Mobile Number' && this.type=='text'){
      this.countryCodeLength=this.value.length;
      console.log(this.countryCodeLength);
      this.form.setValidators([Validators.required,Validators.minLength(this.countryCodeLength+7)])
    }
  }

  numberValidation(event:any):boolean{
    if(this.keypress=='number'){
      const charCode = event.which?event.which:event.keyCode;
      console.log(charCode)
      if(charCode>31 && (charCode<48 || charCode>57)){
        console.log(false);
        return false;
      }
      console.log(true);
      return true;
    }
    else if(this.keypress=='minLC'){
        const charCode = event.which?event.which:event.keyCode;
      console.log(charCode);
      console.log(`${charCode>31}  ${charCode<48} || ${charCode>57}))`)
      if((charCode>31 && (charCode<48 || charCode>57)&&charCode!=46  && charCode ==101)){
        return false;
      }
      else if(charCode==43||charCode==45){
        return false;
      }
      return true;
    }
    else{

    return true
    }
  }
  numberNopaste(e:any){
    if(this.keypress=='number'|| this.keypress=='minLC'){
      console.log(e.clipboardData.getData('text'))
    const data=e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

      console.log(`${data === ''} || ${re.test(data)}`)

    if (data === '' || re.test(data)) {
      console.log(true)
      return true
    }

    console.log(false)
    return false;
    }
    else{
      return true;
    }
  }


  getForm() {
    console.log(this.name);
    if (this.type == 'email') {
      this.form = new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailValidation),
        NoWhitespaceValidator(),
      ]);
    }
    if (this.type === 'text' && this.name === 'User ID/ Email') {
      this.form = new FormControl('', [Validators.required]);
    } else if (this.type == 'name') {
      this.form = new FormControl('', [Validators.required]);
    } else if (this.type == 'password') {
      this.form = new FormControl('', [
        Validators.required,
        NoWhitespaceValidator(),
      ]);
    } else if (this.type == 'text' && this.name == 'User ID') {
      this.form = new FormControl('', [
        Validators.required,
        // Validators.maxLength(8),
        Validators.pattern('[a-zA-Z0-9]+'),
        NoWhitespaceValidator(),
      ]);
    } else if (this.type == 'text' && this.name == 'Invoice Number') {
      this.form = new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]);
    } else if (this.type == 'text' && this.name == 'Amount') {
      this.form = new FormControl('', [
        Validators.required,
        amouontValidator(0.1),
      ]);
    }else if (this.type == 'text' && this.name == 'Company Name') {
      this.form = new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]+'),
      ]);
    }
    else if (this.type == 'text' && this.name=='Mobile Number') {
      let length=this.countryCodeLength?this.countryCodeLength+7:7;
      console.log(length)
      this.form = new FormControl('', [
        Validators.required,
        Validators.minLength(length)
      ]);
    }  else if (this.type == 'text' && this.name.includes('Address')) {
      this.form = new FormControl('', [Validators.required]);
    } else if (this.type == 'text' && this.name.includes('First Name')) {
      this.form = new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]);
    } else if (this.type == 'text' && this.name.includes('Last Name')) {
      this.form = new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]);
    } else if (this.type == 'text' && (this.name=='Debtor/Buyer'||this.name=='Assignor/Seller')) {
      this.form = new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]);
    } else if (this.type == 'text') {
      this.form = new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z][a-zA-Z ]+'),
      ]);
    } else if (this.type == 'number' && this.name == 'Mobile Number') {
      this.form = new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{7,}$'),
      ]);
    } else if (this.type == 'number' && this.name == 'Landline Number') {
      this.form = new FormControl('', [Validators.minLength(7)]);
    } else if (this.type == 'number' && this.name.includes('Pin code')) {
      this.form = new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
      ]);
    } else if (this.type == 'number') {
      this.form = new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+'),
      ]);
    }
 if(this.revamp){
  this.form2 = new FormControl('', [
    Validators.required, this.amountValidator
  ]);

 }
  }

  getErrorMessage() {
    return this.form.hasError('required')
      ? 'You must enter a value'
      : this.form.hasError('form')
      ? 'Not a valid form'
      : '';
  }

  private highlight(color: string) {
    if (this.ipEl) {
      this.ipEl.nativeElement.style.borderColor = color;
    }
  }

  public focusOutFunction(event) {
    // const inputValue = parseFloat(inputField.value);
    // if (inputValue <= 0.1) {
    //      inputField.value = "";
    // }
    let inputValue = parseFloat(event.target.value);

    if (this.form.valid) {
      let value = event.target.value.trimStart().trimEnd();
      const required = event.target.required;

      this.focusOutEvent.emit(value);
      this.validField.emit(true);
    }
  }

  ngDestroy() {
    this.form = null;
    this.form2 = null;
  }

  updatedValue(event: any) {
    this.formValue(event.target.value);
    this.focusOutEvent.emit(this.form.value);
    if(this.form.valid){
      this.validField.emit(true);
    }
  }

//revamp amount validator
amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
  return isValid ? null : { invalidAmount: true };
}

formatAmount(value: string) {
  const number = +value.replace(/[^0-9.]/g, '');
  return isNaN(number) ? '' :number>0? number.toLocaleString('en-US',{
    maximumFractionDigits:2,
  }):'';
}

parseAmount(e: any) {
  console.log(e)
  let target=e.target.value||''
  return target.replace(/,/g, '');
}

onBlur() {
  const value = this.parseAmount({target:{value:this.form2.value}});
  this.form2.setValue(this.formatAmount(value));
  this.focusOutEvent.emit(value);
  this.validField.emit(true);
}

onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window['clipboardData'];
  const pastedText = clipboardData.getData('text');
  const formattedText = this.formatAmount(pastedText);
  document.execCommand('insertText', false, formattedText);
}

onKeyDown(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End','.'];
  const key = event.key;
  const isValidKey = !isNaN(key as any) || allowedKeys.includes(key);
  if (!isValidKey) {
    event.preventDefault();
  }
}








}
export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): any => {
    window.setTimeout(() => {
      if (control.value && control.value != '') {
        let trimedvalue = control.value.replace(/\s/g, '');
        control.setValue(trimedvalue);
      }
    }, 10);
  };
}



/*
Amount always greater than 0.1
when paste should validate
no special character or alphabetic value should be go
number keypress using number pad also should work ]
. can be used
      this.focusOutEvent.emit(value);
      this.validField.emit(true);
*/
