import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-secondary-applicant-beneficiary',
  templateUrl: './secondary-applicant-beneficiary.component.html',
  styleUrls: ['./secondary-applicant-beneficiary.component.scss'],
})
export class SecondaryApplicantBeneficiaryComponent
  implements OnInit, OnChanges
{
  @Input() state: any;
  form!: FormGroup;
  countryList = [];
  editForm:any = false;
  applicantCountryList = new Observable<string[]>();
  beneficiaryCountryList = new Observable<string[]>();
  beneficiarybankCountryList = new Observable<string[]>();
  @Output() applicantBenificaryHandler: EventEmitter<any> = new EventEmitter();
  errors = {
    applicableLaw: false,
    otherApplicableLaw: false,
  };
  constructor(private apiService: ApiService) {}
  ngOnChanges(changes: SimpleChanges): void {
    const {
      applicantCountry,
      applicantName,
      beneCountry,
      beneName,
      obligorBank,
      obligorCountry,
    } = changes['state'].currentValue;
    setTimeout(()=>{
      if (this.form) {
        this.setFormValue(changes['state'].currentValue);
      }
    },1000)
  }

  ngOnInit(): void {
    this.createForm();
    this.fetchApis();
  }

  fetchApis() {
    this.apiService.getAllCountryCode().subscribe({
      next: (response: any) => {
        try {
          this.countryList = response.data[0].countryNames
            .map((item) => item.replace('\n', ''))
            .sort();
          this.matAutocompleteCountryObservers();
        } catch (e) {
          this.countryList = [];
        }
      },
      error: (error: any) => {
        this.countryList = [];
      },
    });
  }

  setFormValue(data: any) {
    const {
      applicantCountry,
      applicantName,
      beneCountry,
      beneName,
      obligorBank,
      obligorCountry,
      applicableLaw,
      otherLaw,
    } = data;
    this.form.setValue({
      applicantCountryName: applicantCountry,
      applicantName: applicantName,
      beneficiaryCountryName: beneCountry,
      beneficiaryName: beneName,
      beneficiaryBankCountry: obligorCountry,
      beneficiaryBankName: obligorBank,
      applicableLaw: applicableLaw,
      comments: '',
      otherApplicableLaw: otherLaw,
    });
    if (obligorCountry) {
      this.editForm = true;
    } else {
      this.editForm = false;
    }
  }
  createForm() {
    this.form = new FormGroup({
      applicantCountryName: new FormControl('', [Validators.required]),
      applicantName: new FormControl('', [Validators.required,Validators.maxLength(25)]),
      beneficiaryCountryName: new FormControl('', [Validators.required]),
      beneficiaryName: new FormControl('', [Validators.required,Validators.maxLength(25)]),
      beneficiaryBankCountry: new FormControl('', [Validators.required]),
      beneficiaryBankName: new FormControl('', [Validators.required,Validators.maxLength(25)]),
      applicableLaw: new FormControl('', [Validators.required]),
      comments: new FormControl('', []),
      otherApplicableLaw: new FormControl('', []),
    });
  }
  matAutocompleteCountryObservers() {
    this.applicantCountryList = this.form.controls[
      'applicantCountryName'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filter(state) : this.countryList.slice()))
    );
    this.beneficiaryCountryList = this.form.controls[
      'beneficiaryCountryName'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filter(state) : this.countryList.slice()))
    );
    this.beneficiarybankCountryList = this.form.controls[
      'beneficiaryBankCountry'
    ].valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filter(state) : this.countryList.slice()))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countryList.filter((country) =>
      this._normalizeValue(country).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  submit() {
    if (!this.form.value.applicableLaw) {
      this.errors.applicableLaw = true;
    } else {
      this.errors.applicableLaw = false;
    }

    if (
      this.form.value.applicableLaw === 'Other' &&
      !(this.form.value.otherApplicableLaw.length > 0)
    ) {
      this.form.controls['otherApplicableLaw'].setErrors({ require: true });
    } else {
      this.form.controls['otherApplicableLaw'].setErrors(null);
    }

    if (this.form.valid) {
      this.applicantBenificaryHandler.emit(this.form.value);
    }
  }

  checkCountryExistsPorts(e: any, formName: any) {
    if (
      formName === 'applicantCountryName' ||
      formName === 'beneficiaryCountryName' ||
      formName === 'beneficiaryBankCountry'
    ) {
      let formValue = this.form.controls[formName].value;
      let isExists = this.countryList.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.form.controls[formName].setErrors({ required: true });
      } else {
        this.form.controls[formName].setErrors(null);
      }
    }
  }
}
