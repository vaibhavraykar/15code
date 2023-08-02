import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { AdminService } from '../../services/admin.service';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  personalForm!: FormGroup;
  countries: any = [];
  rolelist: any = [];
  countryCodeList: any = [];
  rolesNewList: any;
  showError: any;
  newnamecountry: any;
  selectallCountry:boolean;
  isAllselected: boolean;
  onlyall: any;

  constructor(
    private fb: FormBuilder, private apiService: ApiService, public adminService: AdminService,
    private dialog: MatDialog, private userService: UserManagementService,
    private router: Router, private location: Location) {
    this.personalForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      mobileNo: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      reportingManager: [''],
      countryList: ['', Validators.required],
      roles: ['', Validators.required],
      subscriberType: ['ADMIN'],
      role: [''],
      countryExt: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.adminService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.countryCodeList = this.countries.map(x => x.countryCode);
      localStorage.setItem('countryCode', JSON.stringify(this.countryCodeList));
    });
    this.adminService.getAllRole().subscribe((res: any) => {
      this.rolelist = res;
    });


  }

  selectAll(e){
    // for testing 
    this.selectallCountry=e;
    console.log(e);
    this.isAllselected = e;
    var onlyAll =['ALL'];
    e ? (this.newnamecountry  = (onlyAll.concat(this.countries.map(x => x.countryName))), this.onlyall =['ALL']): this.newnamecountry= [];
    console.log(this.personalForm.value, 'this.personalForm');
    console.log(this.newnamecountry, 'this.newnamecountry');
  }
  phoneInputHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  textOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if ((charCode > 64 || charCode > 91) || charCode == 32) {

      return true;

    }

    return false;

  }

  landlineHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    console.log(charCode);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      console.log(false);
      return false;
    }
    console.log(true);
    return true;
  }

  pasteHandler(e: ClipboardEvent) {
    console.log(e.clipboardData.getData('text'))
    const data = e.clipboardData.getData('text');
    const re = /^[0-9\b]+$/;

    console.log(`${data === ''} || ${re.test(data)}`)

    if (data === '' || re.test(data)) {
      console.log(true)
      return true
    }

    console.log(false)
    return false;
  }
  //add user
  submitAddUser() {
    console.log(this.personalForm.value, 'this.personalForm');
    if (this.personalForm.status == 'VALID') {
      this.showError = false;
      let roleFinalList = [];
      let roleList = this.personalForm.controls['roles'].value;
      this.rolesNewList = this.personalForm.controls['roles'].value;
      console.log(roleList, 'roleList')
      let rolenamelist = roleList.map(x => x.name);
      let roleidlist = roleList.map(x => x.id);
      console.log(rolenamelist, 'rolenamelist');
      console.log(roleidlist, 'roleidlist');
      let newName = [];
      rolenamelist.forEach(e => {
        if (e) {
          let data = {
            name: e
          }
          newName.push(data);
        }
        console.log(newName, 'newName');

      })
      this.personalForm.get('roles').setValue(newName);
      this.personalForm.get('role').setValue(roleidlist);
      this.selectallCountry ? (this.personalForm.get('countryList').setValue(['ALL'])):'';
      console.log(roleFinalList);
      console.log(this.personalForm.value);
      // let newFrom:any= [];
      // newFrom = this.personalForm.value;
      // console.log(newFrom, 'newFrom')
      // let newObs = [];
      // newFrom.map((product,index)=>{
      //   let newObject = {...product}
      //   if(newObject){
      //     newObject.roles = newName;
      //     newObs.push(newObject);
      //   }
      // })
      // newFrom = newObs
      // console.log(newFrom, 'newFrom')
      this.addUser();
    } else {
      this.showError = true;

    }
  }
  addUser() {
    if (this.personalForm.status == 'VALID') {
      this.showError = false;
      this.userService.createAdminUser(this.personalForm.value).subscribe((res: any) => {
        console.log(res);
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
        });
        if (res['success'] == true) {
          this.router.navigateByUrl('admin/dsb/user-list');
        } else {
          this.personalForm.get('roles').setValue(this.rolesNewList);
        }
      }, (error) => {
        this.personalForm.get('roles').setValue(this.rolesNewList);
      });
    }else {
      this.personalForm.get('roles').setValue(this.rolesNewList);
    }
  }
  back(): void {
    this.location.back()
  }
  MobileValidation(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
