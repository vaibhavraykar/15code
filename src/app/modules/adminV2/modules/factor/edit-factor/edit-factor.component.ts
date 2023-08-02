import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FactorService } from '../services/factor.service';
import { AutomatedBaauService } from '../../automated-baau/services/automated-baau.service';

@Component({
  selector: 'app-edit-factor',
  templateUrl: './edit-factor.component.html',
  styleUrls: ['./edit-factor.component.scss']
})
export class EditFactorComponent{

  public manageSubFormArray: FormGroup;
  public manageForm:FormGroup;
  countries:any=[];
  userList:any=[];
  masterUserList:any=[];
  additionalUserList:any=[];
  formArray: FormArray = new FormArray([]);
  finalDeletedList:any=[];
  finalAddList:any=[];
  finalEditedList:any=[];
  data:any;
  routelocation:any;
  constructor(private formBuilder: FormBuilder,private factorService:FactorService,
    private dialog: MatDialog,private auService:AutomatedBaauService,private router : Router, private location: Location){
      this.routelocation = this.location
    this.auService.getAllCountryCode().subscribe((res:any)=>{
      this.countries = res.data[0].countryList;
    });

    this.manageForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      companyName: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobileNo: ['',[Validators.required]],
      email: ['',],
      userType:['MASTER_USER']
    });
    const items = [];
    items.push(this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: [''],
      email: [''],
      userType:['PASSCODE_USER'],
      userAction:['NEW'],
    }));
    this.manageSubFormArray = this.formBuilder.group({
      details: this.formBuilder.array(items),
    });
    this.factorService.viewFactorData.subscribe(res=>{
      this.data=res;
      this.editForm();
    })
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: [''],
      email: [''],
      userType:['PASSCODE_USER'],
      userAction:['NEW'],

    });
  }
  additionalUser() {
    const details = this.manageSubFormArray.get('details') as FormArray;
    if (details.length < 10) {
      details.push(this.createItem());
    }
  }
  editForm(){
    this.userList = this.data['userList'];
    if(this.userList){
      this.userList.map(x=>{
        if(x.userType == 'MASTER_USER'){
          this.masterUserList.push(x);
        }if(x.userType != 'MASTER_USER'){
          this.additionalUserList.push(x);
        }
      });
    }
    this.manageForm.patchValue({
      country:this.data.country,
      companyName: this.data.companyName,
      firstName: this.masterUserList[0].firstName,
      lastName: this.masterUserList[0].lastName,
      mobileNo: this.masterUserList[0].mobileNo,
      email: this.masterUserList[0].email,
    });
    this.manageForm.controls['email'].disable();
    this.manageForm.controls['companyName'].disable();
    this.formArray = this.manageSubFormArray.get('details') as FormArray;
    this.additionalUserList.forEach(element => {
      this.formArray.push(this.formBuilder.group({
        firstName:element.firstName,
        lastName:element.lastName,
        mobileNo:element.mobileNo,
        email:element.email,
        id:element.id,
        userType:element.userType
      }));
    });
    this.formArray.removeAt(0);
    if(this.manageSubFormArray.controls['details']){
      console.log(this.manageSubFormArray.controls['details'], ' details')
        for(let i = 0; i<= this.formArray.length - 1;i++){
       
        this.formArray.controls[i].get('email').disable();
        }
    }
  }
  submit(){
   console.log(this.manageSubFormArray.controls['details'].value, ' bvule of form')
    this.masterUserList.forEach(element => {
      element.userAction = 'EDIT'
    });
    // for deleted and edited list
  const newArray =  this.manageSubFormArray.get('details') as FormArray;
  const newemail = [];
  const setData = [];
for(let i = 0; i<= newArray.length - 1;i++){
    newemail.push(this.formArray.controls[i].get('email').value);
    if(!this.formArray.controls[i].get('userAction')){
      var newobj ={
        firstName:this.formArray.controls[i].get('firstName').value,
          lastName:this.formArray.controls[i].get('lastName').value,
          mobileNo:this.formArray.controls[i].get('mobileNo').value,
          email:this.formArray.controls[i].get('email').value,
          id:this.formArray.controls[i].get('id').value,
          userType:this.formArray.controls[i].get('userType').value
      }
    }
    setData.push(newobj);
  }
    let newDeletedEditAddList = [];
    
    // entries with same id but deleted
this.additionalUserList.filter(x => newemail.findIndex(lu => lu == x.email) === -1).map((p,index)=>{
    let newData = {...p}
    if(newData){
      newData.userAction = 'DELETE';
      newDeletedEditAddList.push(newData);
    }
})
    // entries with same id but edited
this.additionalUserList.filter(x => newemail.findIndex(lu => lu == x.email) != -1).map((p,index)=>{
  let newData = {...p}
  if(newData){
    newData.userAction = 'EDIT';
    newDeletedEditAddList.push(newData);
  }

})
const deleteStatusList = [];
newDeletedEditAddList.map((x,i)=>{
  let newobj = {...x};
  console.log(newobj, ' newobj');
  if(newobj){
    if(newobj.status){
      delete newobj.status;
      console.log(newobj);
      deleteStatusList.push(newobj);
    }
  }
})
newDeletedEditAddList = deleteStatusList;

newDeletedEditAddList.forEach(el => {
  setData.forEach(element => {
    if(element){
      if(element.id == el.id){
        el.firstName=element.firstName,
        el.lastName=element.lastName,
        el.mobileNo=element.mobileNo,
        el.email=element.email,
        el.userType=element.userType
      }
    }
  });
})

    // for new added user
    this.manageSubFormArray.controls['details'].value.forEach(element => {
        if(element.userAction == 'NEW'){
            newDeletedEditAddList.push(element);
        }
    });

    // END for new added user
    if(this.manageForm.status == 'VALID' && this.manageSubFormArray.status == 'VALID'){
            const manageForm = {
                firstName: this.manageForm.controls['firstName'].value,
                lastName: this.manageForm.controls['lastName'].value,
                mobileNo: this.manageForm.controls['mobileNo'].value,
                email:this.manageForm.controls['email'].value,
                id:this.masterUserList[0].id,
                userType:'MASTER_USER',
                userAction:'EDIT'
              } 
              newDeletedEditAddList.push(manageForm);
    if(this.manageForm.status == 'VALID' && this.manageSubFormArray.status == 'VALID'){
      const finalData = {
        country:this.manageForm.controls['country'].value,
        companyName:this.manageForm.controls['companyName'].value,
        id:this.data.id,
        userList:newDeletedEditAddList
      }
      console.log(finalData,'final');
      this.factorService.updateFactor(finalData).subscribe(res=>{
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

  deleteUser(i,item) {
    if(item.value){
        if(item.value.userAction){
            item.value.userAction = 'DELETE';
        }else{
            item.addControl('userAction', new FormControl('DELETE', Validators.required));
        }
    }
    this.finalDeletedList.push(item.value);
    console.log(this.finalDeletedList);
    const details = this.manageSubFormArray.get('details') as FormArray;
    if(i>=0){
      details.removeAt(i);
    }
}

   textOnly(event): boolean {
     const charCode = (event.which) ? event.which : event.keyCode;
     if ((charCode > 64 || charCode > 91) || charCode == 32) {
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
}
