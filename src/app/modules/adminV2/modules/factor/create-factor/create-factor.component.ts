import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FactorService } from '../services/factor.service';
import { AutomatedBaauService } from '../../automated-baau/services/automated-baau.service';

@Component({
  selector: 'app-create-factor',
  templateUrl: './create-factor.component.html',
  styleUrls: ['./create-factor.component.scss']
})
export class CreateFactorComponent{

  routelocation: any;
  public manageSubFormArray: FormGroup;
  public manageForm:FormGroup;
  countries:any=[];
  filteredCountries:any;

  constructor(private route: ActivatedRoute, private factorService: FactorService, private location: Location,
    private formBuilder: FormBuilder, private dialog: MatDialog,private router:Router,private auService:AutomatedBaauService) {
    this.routelocation = this.location;
    this.auService.getAllCountryCode().subscribe((res:any)=>{
      this.countries = res.data[0].countryList;
      this.filteredCountries = this.countries;
    });
    this.manageForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobileNo: ['',[Validators.required]],
      email: ['', [Validators.required,Validators.pattern('^[^ ]+@[^ ]+\.[a-z]{2,6}$')]],
      userType:['MASTER_USER']
    });
    const items = [];
    items.push(this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: ['',[Validators.required]],
      email: [''],
      userType:['PASSCODE_USER']
    }));
    this.manageSubFormArray = this.formBuilder.group({
      details: this.formBuilder.array(items),
    });

  }
  countryValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    console.log(searchText);
    this.filteredCountries = this.countries.filter(item =>
      item.countryName.toLowerCase().includes(searchText)
    );
    console.log(this.filteredCountries);
  }
  
  createItem(): FormGroup {
    return this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: ['',[Validators.required]],
      email: [''],
      userType:['PASSCODE_USER']

    });
  }
  additionalUser() {
    const details = this.manageSubFormArray.get('details') as FormArray;
    //  let items = this.manageSubForm.get('details') as FormArray;
    if (details.length < 10) {
      details.push(this.createItem());
    }
  }
  submit(){
    let additionDetailsList:any = this.manageSubFormArray.controls['details'];
    additionDetailsList = additionDetailsList.value;
    if(additionDetailsList.length >= 1){
      additionDetailsList.forEach((element,index) => {
        if(element.firstName == '' && element.lastName == '' && element.email == '' && element.mobileNo == ''){
          additionDetailsList.splice(index,1);
        }
      });
    }
    if(additionDetailsList.length >= 1){
      this.manageSubFormArray.get('details').setValue(additionDetailsList);
      if(this.manageForm.status == 'VALID' && this.manageSubFormArray.status == 'VALID'){
        let mainArray = [];
        const manageForm = {
          firstName: this.manageForm.controls['firstName'].value,
          lastName: this.manageForm.controls['lastName'].value,
          mobileNo: this.manageForm.controls['mobileNo'].value,
          email:this.manageForm.controls['email'].value,
          userType:'MASTER_USER'
        }
        mainArray.push(manageForm);
        const data = additionDetailsList;
        data.forEach(element => {
          mainArray.push(element);
        });
        let finalData = {
          country:this.manageForm.controls['country'].value,
          companyName:this.manageForm.controls['companyName'].value,
          userList:mainArray
        }
        console.log(finalData);
        this.factorService.createFactor(finalData).subscribe(res=>{
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message:res['message'],
              status:res['success']
            },
            disableClose:true
          });
          this.router.navigate(['adminv2/factor']);
        })
      }
    }else{
      if(this.manageForm.status == 'VALID'){
        let mainArray = [];
        const manageForm = {
          firstName: this.manageForm.controls['firstName'].value,
          lastName: this.manageForm.controls['lastName'].value,
          mobileNo: this.manageForm.controls['mobileNo'].value,
          email:this.manageForm.controls['email'].value,
          userType:'MASTER_USER'
        }
        mainArray.push(manageForm);
        const data = additionDetailsList;
        data.forEach(element => {
          mainArray.push(element);
        });
        let finalData = {
          country:this.manageForm.controls['country'].value,
          companyName:this.manageForm.controls['companyName'].value,
          userList:mainArray
        }
        console.log(finalData);
        this.factorService.createFactor(finalData).subscribe(res=>{
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message:res['message'],
              status:res['success']
            },
            disableClose:true
          });
          this.router.navigate(['adminv2/factor']);
        })
      }
    }


  }
  deleteUser(i) {
    console.log(i);
    const details = this.manageSubFormArray.get('details') as FormArray;
    if(i>=1){
      details.removeAt(i);
    }
  }
  textOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (
      (charCode >= 33 && charCode <= 59) || 
      charCode === 61 || 
      (charCode >= 63 && charCode <= 90) || 
      charCode === 92 || 
      charCode === 95 || 
      (charCode >= 97 && charCode <= 122) || 
      charCode === 124 
    ) {
      return true;
    }
    return false;
  }
    isNumberKey(evt)
{
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
cancelForm(){
  this.router.navigate(['adminv2/factor']);
}
}
