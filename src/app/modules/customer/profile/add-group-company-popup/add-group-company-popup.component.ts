import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CustomerServicesService } from '../../services/customer-services.service';
@Component({
  selector: 'app-add-group-company-popup',
  templateUrl: './add-group-company-popup.component.html',
  styleUrls: ['./add-group-company-popup.component.scss'],
})
export class AddGroupCompanyPopupComponent implements OnInit {
  viewType ='renew'
  countryList: any = [];
  addGroupcompanyForm!: FormGroup;
  businessFileName: any = '';
  selectedCountryList = new Observable<string[]>();
  kycCountryList = new Observable<string[]>();
  NO_SPECIAL_CHAR = new RegExp(/^[a-zA-Z0-9-]+$/);
  document$= new Observable<any>();
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public cs: CustomerServicesService,
    public dialogRef: MatDialogRef<AddGroupCompanyPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog
  ) {}
  ngOnInit(): void {
    console.log(this.data)
      this.viewType = this.data.viewType
    this.formControl();
    this.apiService.getAllCountryCode().subscribe({
      next: (response: any) => {
        try {
          this.countryList = response.data[0].countryNames
            .map((item) => item.replace('\n', ''))
            .sort();
          this.matAutocompleteCountryObservers(0);
          this.matAutocompleteCountryObservers2(0);
        } catch (e) {
          this.countryList = [];
        }
      },
      error: (error: any) => {
        this.countryList = [];
      },
    });
    this.document$= this.cs.getDocumentTypes().pipe(map((res:any)=>{
      return res.data[0].businessKycDocumentTypeInfo
     }))

  }
  formControl() {
    this.addGroupcompanyForm = this.fb.group({
      addGroupcompanyformArrayName: this.fb.array([this.newAddcompany()]),
    });
  }
  newAddcompany(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      registrationType: ['', Validators.required],
      CountryName: ['', Validators.required],
      stateName: ['', Validators.required],
      cityName: ['', Validators.required],
      addresss: ['', Validators.required],
      zipcode: [
        '',
        [Validators.required, Validators.pattern(this.NO_SPECIAL_CHAR)],
      ],
      telephoneNumber: ['', [Validators.required, Validators.minLength(7)]],
      KYCCountryName: ['', [Validators.required]],
      validDocument: ['', [Validators.required]],
      chooseFile: ['', [Validators.required]],
    });
  }

  // uploadTransaction(file: any) {
  //   console.log(file);
  //   console.log(file.name);

  //   const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff'];
  //   const fileExtension = file.name
  //     .substr(file.name.lastIndexOf('.'))
  //     .toLowerCase();

  //   if (allowedExtensions.includes(fileExtension)) {
  //     this.addGroupcompanyForm.controls['businessKycFileType'].setErrors(null);
  //     this.businessFileName = file.name;

  //     if (file) {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = (e) => {
  //         let base64 = reader?.result;
  //         this.addGroupcompanyForm.controls['businessKycFile'].setValue(
  //           `${file.name}|${base64}`
  //         );
  //       };
  //       let type = file.type.split('/');
  //       this.addGroupcompanyForm.controls['businessKycFileType'].setValue(
  //         type[1]
  //       );
  //     }
  //   } else {
  //     this.addGroupcompanyForm.controls['businessKycFileType'].setErrors({
  //       invalid: true,
  //     });
  //     console.error(
  //       'Error: Invalid file extension. Only .jpg, .jpeg, .png, .pdf, and .tiff files are allowed.'
  //     );
  //   }
  // }
  deleteBusinessFile(i: any) {
    // console.log('clicked');
    this.addGroupcompanyForm.controls['businessKycFile'].setValue('');
    this.businessFileName = '';
    this.addGroupcompanyForm.controls['businessKycFileType'].setValue('');
  }
  uploadTransaction(file: any, index) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff'];
    const fileExtension = file.name
      .substr(file.name.lastIndexOf('.'))
      .toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      this.convertFileToBase64(file)
        .then((encodedContent: string) => {
          const fileData = {
            fileType: file.type,
            fileBase64: encodedContent, // Extract the base64 content after the comma
            fileName: file.name,
          };
          this.addGroupcompanyForm
            .get(`addGroupcompanyformArrayName.${index}.chooseFile`)
            .setValue(fileData);
          // console.log(
          //   this.addGroupcompanyForm.get(
          //     `addGroupcompanyformArrayName.${index}.chooseFile`
          //   )
          // );
        })
        .catch((error) => {
          // console.error('Error converting file:', error);
        });
    } else {
      this.dialog.open(AddGroupCompanyPopupComponent, {
        data: { viewType:'uploardFailed'},
        autoFocus:false
      })
      this.addGroupcompanyForm
        .get(`addGroupcompanyformArrayName.${index}.chooseFile`)
        .setErrors({ invalid: true });
    }
    // if(file.type){

    // }
  }

  fileErrorCheck(index:any){

    // console.log(this.addGroupcompanyForm);
    return this.addGroupcompanyForm.get(
      `addGroupcompanyformArrayName.${index}.chooseFile`
    );
  }
  additionaladdGroupcompany(): FormArray {
    return this.addGroupcompanyForm.get(
      'addGroupcompanyformArrayName'
    ) as FormArray;
  }

  addMoreCompany() {
    this.addGroupcompanyForm.markAllAsTouched();
    this.additionaladdGroupcompany().push(this.newAddcompany());
  }
  deleteAddCompany(index: number) {
    this.additionaladdGroupcompany().removeAt(index);
  }
  matAutocompleteCountryObservers(index: number) {
    const control = this.additionaladdGroupcompany()
      .at(index)
      .get('CountryName');
    this.selectedCountryList = control.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filter(state) : this.countryList.slice()))
    );
  }
  matAutocompleteCountryObservers2(index: number) {
    const control = this.additionaladdGroupcompany()
      .at(index)
      .get('KYCCountryName');
    this.kycCountryList = control.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filter(state) : this.countryList.slice()))
    );
  }
  selectedCountry() {}
  invite() {
    this.addGroupcompanyForm.markAllAsTouched();
    // console.log(this.addGroupcompanyForm.valid);
    // console.log(this.addGroupcompanyForm);

    if(this.addGroupcompanyForm.valid){
      let payload = this.getFormData();
      this.cs.createGroupCompany(payload).subscribe((res: any) => {
        // console.log(res);
        if (res.success) {
          this.viewType ='success'

        }
      });
      // console.log(payload);
    }
  }

  getFormData() {
    let data: any = [];
    this.additionaladdGroupcompany().controls.forEach(
      (control: any, index: any) => {
        // console.log(control.controls);
        data.push({
          groupCompanyDetails: {
            registrationType: control.controls.registrationType.value,
            companyName: control.controls.companyName.value,
            // emplyeeDetails: [
            //   {
            //     firstName: control.controls.registerType.value,
            //     lastName: control.controls.registerType.value,
            //     designation: control.controls.registerType.value,
            //   },
            // ],
            addressDetails: {
              registeredCountry: control.controls.CountryName.value.toUpperCase(),
              province: control.controls.stateName.value,
              city: control.controls.cityName.value,
              address1: control.controls.addresss.value,
              // address2: control.controls.registerType.value,
              // address3: control.controls.registerType.value,
              pincode: control.controls.zipcode.value,
              telephone: control.controls.telephoneNumber.value,
            },
          },
          kycDocumentList: [
            {
              userAction: 'NEW',
              documentName: control.controls.validDocument.value,
              title: control.controls.chooseFile.value.fileName,
              country: control.controls.KYCCountryName.value.toUpperCase(),
              encodedFileContent: control.controls.chooseFile.value.fileBase64,
              documentType: control.controls.chooseFile.value.fileType,
            },
          ],
        });
      }
    );

    // console.log(data);
    return data;
  }

  isFieldInvalid(fieldName: string, index: number): boolean {
    const control =
      this.additionaladdGroupcompany().controls[index].get(fieldName);
    return control.invalid && control.touched;
  }

  selectedregistrationType(e) {
    // console.log(e);
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
  close() {
    this.dialogRef.close();
  }
  convertFileToBase64(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const fileContent = base64String.split(',')[1]; // Extract the base64 content after the comma
        resolve(file.name + ' |' + base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  telephoneHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // console.log(false);
      return false;
    }
    // console.log(true);
    return true;
  }

  telechecker(e: any, index: any) {
    // console.log(this.additionaladdGroupcompany().controls);
    let formValue = this.addGroupcompanyForm.get(
      `addGroupcompanyformArrayName.${index}.telephoneNumber`
    ).value;
    // console.log(formValue);
    // let formValue = this.addGroupcompanyForm.controls['telephoneNumber'][index].value;
    // console.log(formValue)
    if (formValue.length >= 7 && Number(formValue) == 0) {
      this.addGroupcompanyForm
        .get(`addGroupcompanyformArrayName.${index}.telephoneNumber`)
        .setValue('');
    }
  }

  pasteHandler(e: ClipboardEvent) {
    // console.log(e.clipboardData.getData('text'))
    const data = e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

    // console.log(`${data === ''} || ${re.test(data)}`);

    if (data === '' || re.test(data)) {
      // console.log(true);
      return true;
    }

    // console.log(false);
    return false;
  }

  checkCountry(e: any, formName: any, index: any) {
    if (formName === 'CountryName' ||formName === 'KYCCountryName') {
      let formValue: any = this.addGroupcompanyForm.get(
        `addGroupcompanyformArrayName.${index}.${formName}`
      ).value;
      let isExists = this.countryList.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.addGroupcompanyForm
          .get(`addGroupcompanyformArrayName.${index}.${formName}`)
          .setErrors({ invalid: true });
      } else {
        this.addGroupcompanyForm
          .get(`addGroupcompanyformArrayName.${index}.${formName}`)
          .setErrors(null);
      }
    }
  }
}
