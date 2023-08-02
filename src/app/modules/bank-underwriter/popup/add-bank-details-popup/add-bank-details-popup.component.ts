import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubmitBankDetailsComponent } from '../submit-bank-details/submit-bank-details.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-add-bank-details-popup',
  templateUrl: './add-bank-details-popup.component.html',
  styleUrls: ['./add-bank-details-popup.component.scss'],
})
export class AddBankDetailsPopupComponent implements OnInit {
  addbankform!: FormGroup;
  addAdditionalInformationform!: FormGroup;
  viewForm!: FormGroup;
  editForm!: FormGroup;
  editAdditionalInformationform!: FormGroup;
  viewType = 'default';
  countryOptions: any;
  countryArray: any;
  bankCountryList = new Observable<string[]>();
  showDeleteButton: boolean = false;
  additionalDetails: any[] = [];
  countryExt: any;
  orginalCopy:any={}
  emailValidation = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { viewType: string; id: any },
    private dialogRef: MatDialogRef<AddBankDetailsPopupComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private bs: BankUnderwriterService,
    private apiService: ApiService
  ) {
    this.additionalDetails.push({});
  }
  ngOnInit(): void {
    // console.log(this.data)
    this.viewType = this.data.viewType;
    this.formControl();
    this.fetchApis();
  }
  formControl() {
    // if (this.viewType === 'default' || this.viewType === 'edit' || this.viewType === 'details') {
    this.addbankforms();
    this.addAdditionalInformationforms();
    if (this.viewType === 'edit') {
      this.fillFormData(this.data.id);
    } else if (this.viewType === 'details') {
      this.fillFormData2(this.data.id);
      this.disableFormControls();
    } else {

    }
    // }
    //  else if (this.viewType === 'details') {
    //   this.formdetails(this.data.id);
    // }
  }
  disableFormControls() {
    this.addbankform.disable(); // Disable the entire form
    // console.log( this.addAdditionalInformationform,"sssssssssssssssssssss")
  }



  fetchApis() {
    this.apiService.getAllCountryCode().subscribe({
      next: (response: any) => {
        try {
          this.countryArray = response.data[0].countryList;
          this.countryOptions = response.data[0].countryNames.map((item) =>
            item.replace('\n', '')
          )?.sort();
          this.matAutocompleteCountryObservers();
        } catch (e) {
          this.countryOptions = [];
        }
      },
      error: (error: any) => {
        this.countryOptions = [];
      },
    });
  }

  formdetails(id: any) {
    this.viewForm = new FormGroup({
      BankName: new FormControl(''),
      CountryName: new FormControl(''),
      SwiftCode: new FormControl(''),
      MRPA: new FormControl(''),
      additionalBankDetails: this.fb.array(
        [

        ])
    });
    this.bs.getBankById(`${id}`).subscribe((res: any) => {
      // console.log(res);
      if (res.success) {
        this.viewForm.controls['BankName']?.setValue(res.data[0]?.bankName);
        this.viewForm.controls['CountryName']?.setValue(res.data[0]?.country);
        this.viewForm.controls['SwiftCode']?.setValue(res.data[0]?.swiftCode);
        this.viewForm.controls['MRPA']?.setValue(res.data[0]?.mrpa || false);
        // this.viewForm.controls['additionalBankDetails'].setValue()
        // this.addAdditionalInformationform = this.fb.group({
        //   additionaladdBankdetails: this.fb.array([
        //     {
        //       FirstName:'sdfs',
        //       EmailId: 'sdf'
        //     },
        //   ]),
        // });

      }
    });
  }
  addbankforms() {
    this.addbankform = new FormGroup({
      BankName: new FormControl('', [Validators.required,Validators.maxLength(25)]),
      CountryName: new FormControl('', [Validators.required]),
      MRPA: new FormControl(true, [Validators.required]),
      SwiftCode: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9a-zA-Z]+'),
        Validators.minLength(8),
        Validators.maxLength(11),
      ]),
    });
  }
  addAdditionalInformationforms() {
    this.addAdditionalInformationform = this.fb.group({
      additionaladdBankdetails: this.fb.array([
        this.newAdditionaladdBankdetails(),
      ]),
    });
  }

  fillFormData(id: any) {
    console.log(id)
    this.bs.getBankById(`${id}`).subscribe((res: any) => {
      if (res.success) {
        this.addbankform.controls['BankName']?.setValue(res.data[0]?.bankName);
        this.addbankform.controls['CountryName']?.setValue(res.data[0]?.country);
        this.addbankform.controls['SwiftCode']?.setValue(res.data[0]?.swiftCode);
        this.addbankform.controls['MRPA']?.setValue(res.data[0]?.mrpa || false);


        let formArr = this.addAdditionalInformationform.controls['additionaladdBankdetails'] as FormArray
        formArr.controls =
          res.data[0].userList.filter((E) => E.status !== 'DISABLED').map((E) => {
            return  this.fb.group({ keyName: E.firstName, valueName: E.email })
          })
        formArr.setValue(res.data[0].userList.filter((E) => E.status !== 'DISABLED').map((E) => {
          return { keyName: E.firstName, valueName: E.email }
        }))
        this.orginalCopy=res.data[0]


        console.log(this.addAdditionalInformationform.controls['additionaladdBankdetails'])
      }
    })
  }
  fillFormData2(id: any) {
    console.log(id)
    this.bs.getBankById(`${id}`).subscribe((res: any) => {
      if (res.success) {
        this.addbankform.controls['BankName']?.setValue(res.data[0]?.bankName);
        this.addbankform.controls['CountryName']?.setValue(res.data[0]?.country);
        this.addbankform.controls['SwiftCode']?.setValue(res.data[0]?.swiftCode);
        this.addbankform.controls['MRPA']?.setValue(res.data[0]?.mrpa || false);
        console.log(this.addAdditionalInformationform.controls['additionaladdBankdetails'])
        let formArr = this.addAdditionalInformationform.controls['additionaladdBankdetails'] as FormArray
        formArr.controls = res.data[0].userList.filter((E) => E.status !== 'DISABLED').map((E) => {
          return this.fb.group({ keyName: E.firstName, valueName: E.email })
        })
        formArr.disable()
      }
    })
  }

  addbank() {
    if (this.addbankform.valid && this.addAdditionalInformationform.valid) {
      let data = {
        mrpa: this.addbankform.controls['MRPA'].value,
        bankName: this.addbankform.controls['BankName'].value,
        country: this.addbankform.controls['CountryName'].value,
        bankType: 'SECONDARY_AUTOMATED',
        countryExt: `+${this.countryExt}`,
        swiftCode: this.addbankform.controls['SwiftCode'].value,
        userList: this.getUserDetails(),
      };
      console.log(data);

      this.bs.addBank(data).subscribe((res: any) => {
        if (res.success) {
          const dia = this.dialog.open(SubmitBankDetailsComponent)
          dia.afterClosed().subscribe(() => { this.dialogRef.close(); });
        }
      });
    }
  }
  getUserDetails() {
    let details = [];
    this.addAdditionalInformationform.controls[
      'additionaladdBankdetails'
    ].value.map((ele: any, index: any) => {
      details.push({
        firstName: ele?.keyName,
        email: ele?.valueName,
        userType: 'MASTER_USER',
        "userAction": "NEW"
      });
    });
    return details;
  }
  close() {
    this.dialogRef.close();
  }
  matAutocompleteCountryObservers() {
    this.bankCountryList = this.addbankform.controls[
      'CountryName'
    ].valueChanges.pipe(
      startWith(''),
      map((state) =>
        state ? this._filter(state) : this.countryOptions.slice()
      )
    );
  }
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countryOptions.filter((country) =>
      this._normalizeValue(country).includes(filterValue)
    );
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  // addAddtionalDetails(){
  //   this.additionalDetails.push({});
  //   this.showDeleteButton = true;
  // }
  // deleteAddtionalDetails(index: number) {
  //   this.additionalDetails.splice(index, 1);

  //   if (this.additionalDetails.length === 0) {
  //     this.showDeleteButton = false;
  //   }
  // }

  //
  additionaladdBankdetails(): FormArray {
    return this.addAdditionalInformationform.get(
      'additionaladdBankdetails'
    ) as FormArray;
  }
  newAdditionaladdBankdetails(): FormGroup {
    return this.fb.group({
      keyName: ['', [Validators.required ,Validators.maxLength(25)]],
      valueName: ['', [Validators.required, Validators.pattern(this.emailValidation)]],
    });
  }
  addAdditionaladdBankdetails() {
    this.additionaladdBankdetails().push(this.newAdditionaladdBankdetails());
  }
  removeAdditionaladdBankdetails(index: number) {
    this.additionaladdBankdetails().removeAt(index);
  }

  selectedCountry() {
    console.log('e', this.countryArray);
    let countrySel = this.addbankform.controls['CountryName'].value;
    this.countryExt = this.countryArray.find(
      (ele) => ele.countryName.toLowerCase() === countrySel.toLowerCase()
    )?.countryCode;
    console.log(this.countryExt);
  }

  checkCountryExistsPorts(e: any, formName: any) {
    if (formName === 'CountryName') {
      let formValue = this.addbankform.controls[formName].value;
      let isExists = this.countryOptions.find((ele: any) => {
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (!isExists) {
        this.addbankform.controls[formName].setErrors({ required: true });
      } else {
        this.addbankform.controls[formName].setErrors(null);
      }
    }
  }
  editBank() {
    if (this.addbankform.valid && this.addAdditionalInformationform.valid) {
      let data = {
        id:this.data.id,
        mrpa: this.addbankform.controls['MRPA'].value,
        bankName: this.addbankform.controls['BankName'].value,
        country: this.addbankform.controls['CountryName'].value,
        bankType: 'SECONDARY_AUTOMATED',
        countryExt: this.countryExt?`+${this.countryExt}`:this.orginalCopy.countryExt,
        swiftCode: this.addbankform.controls['SwiftCode'].value,
        userList:this.addAdditionalInformationform.controls['additionaladdBankdetails']['controls'].map((e)=>{
          return {
            firstName: e.value?.keyName,
            email: e.value?.valueName,
            userType: 'MASTER_USER',
            "userAction": "NEW"
          }
        }),
        "rmUserId": 0,
      };
      console.log(JSON.stringify(data.userList))
     console.log(JSON.stringify(this.orginalCopy.userList))
     const updatedUsers = this.orginalCopy.userList.map(originalUser => {
      const newUser = data.userList.find(newUser => newUser.firstName === originalUser.firstName && newUser.email === originalUser.email);

      if (newUser) {
        return { ...originalUser, userAction: "EDIT" };
      } else {
        return { ...originalUser, userAction: "DELETE" };
      }
    });

    data.userList.forEach(newUser => {
      const userExists = this.orginalCopy.userList.some(originalUser => originalUser.firstName === newUser.firstName && originalUser.email === newUser.email);

      if (!userExists) {
        updatedUsers.push({ ...newUser, userAction: "NEW" });
      }
    });
    const updatedUsersWithoutStatus = updatedUsers.map(({ status, ...user }) => user);

       data.userList=updatedUsersWithoutStatus
    console.log(data)

      this.bs.updateBank(data).subscribe((res: any) => {
        if (res.success) {
          const dia = this.dialog.open(SubmitBankDetailsComponent,{data:'update'})
          dia.afterClosed().subscribe(() => { this.dialogRef.close(); });
        }
      });
    }
  }
}
