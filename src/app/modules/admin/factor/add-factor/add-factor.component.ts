import { Component ,Inject} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { FactorService } from '../../services/factor/factor.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-factor',
  templateUrl: './add-factor.component.html',
  styleUrls: ['./add-factor.component.scss']
})
export class AddFactorComponent {
  public manageSubFormArray: FormGroup;
  public manageForm:FormGroup;
  countries:any=[];
  constructor( public dialogRef:MatDialogRef<AddFactorComponent>,private formBuilder: FormBuilder,private apiService:ApiService,private factorService:FactorService,
    private dialog: MatDialog,private adminService:AdminService){
    this.adminService.getAllCountryCode().subscribe((res:any)=>{
      this.countries = res.data[0].countryList;
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
      mobileNo: [''],
      email: [''],
      userType:['PASSCODE_USER']
    }));
    this.manageSubFormArray = this.formBuilder.group({
      details: this.formBuilder.array(items),
    });
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobileNo: [''],
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
    if(additionDetailsList.length >= 1){this.manageSubFormArray.get('details').setValue(additionDetailsList);}
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
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message:res['message'],
            status:res['success']
          },
        });
        this.close();
        this.factorService.callGetApi.next(true);
      })
    }

  }
  close(){
    this.dialogRef.close();
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
