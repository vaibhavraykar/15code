import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserManagementServices } from '../services/user-mgmt-services.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  routelocation: any
  personalForm!: FormGroup;
  countries: any = [];
  rolelist: any = [];
  countryCodeList: any = [];
  rolesNewList: any;
  showError: any;
  newnamecountry: any;
  selectallCountry: boolean;
  isAllselected: boolean;
  onlyall: any;
  form!: FormGroup;
  roleForm: FormGroup
  selectedRoles:any;
  filteredCountryCodes:any;
  filteredCountries: any[] = [];
  filteredRows: any[] = [];
  constructor(
    private location: Location, private route: ActivatedRoute,
    private fb: FormBuilder, private userMgmtService: UserManagementServices, private dialog: MatDialog, private router: Router
  ) {
    this.routelocation = this.location;
    this.personalForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      mobileNo: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(15)]],
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
    this.userMgmtService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.filteredCountries = this.countries;
      this.countryCodeList = this.countries.map(x => x.countryCode);
      this.filteredCountryCodes = this.countryCodeList;
      localStorage.setItem('countryCode', JSON.stringify(this.countryCodeList));
    });
    this.userMgmtService.getAllRole().subscribe((res: any) => {
      this.rolelist = res;
      this.filteredRows = this.rolelist;
    });
    this.createForm();
    this.rolesForm();
  }

  createForm() {
    this.form = new FormGroup({
      newBankListControl: new FormControl([], [Validators.required]),
    });
  }


  rolesForm() {
    this.roleForm = new FormGroup({
      newRoleNameList: new FormControl([], [Validators.required]),
    });
  }


  selectAll(e) {
    // for testing
    this.selectallCountry = e;
    console.log(e);
    this.isAllselected = e;
    var onlyAll = ['ALL'];
    // e ? (this.newnamecountry = (onlyAll.concat(this.countries.map(x => x.countryName))), this.onlyall = ['ALL']) : this.newnamecountry = [];
    e ? this.personalForm.get('countryList').setValue(['ALL']) : this.personalForm.get('countryList').setValue([]);
    // let countryNameValue = this.form.get('newBankListControl').setValue(this.newnamecountry);
    // this.personalForm.get('countryList').setValue(countryNameValue);
    console.log('line 80', this.personalForm.value);
  }
  phoneInputHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  countryCodeValueChange(event: any) {
    const searchText = event.target.value;
    this.filteredCountryCodes = this.countryCodeList.filter(item =>
      item.toString().includes(searchText)
    );
  }
  countryValueChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    const selectedCountries = this.personalForm.controls['countryList'].value;

    this.filteredCountries = this.countries;

    if (searchText) {
      this.filteredCountries = this.filteredCountries.filter(item =>
      item.countryName.toLowerCase().includes(searchText) || selectedCountries.includes(item.countryName)
      );
    }
  }
  
  onCountrySelection(event: MatSelectChange) {
    this.personalForm.get('countryList').setValue(event.value);
    this.filteredCountries = this.countries;
  }

  roleValueChange(event: any) {
    const searchRoleText = event.target.value.toLowerCase();
    const selectedRole = this.personalForm.controls['roles'].value;

    this.filteredRows = this.rolelist;

    if (searchRoleText) {
      this.filteredRows = this.filteredRows.filter(item =>
      item.name.toLowerCase().includes(searchRoleText) || selectedRole.includes(item)
      );
    }
  }
  
  onRoleSelection(event: MatSelectChange) {
    this.personalForm.get('roles').setValue(event.value);
    this.filteredRows = this.rolelist;
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
    // this.personalForm.get('countryList').setValue(this.form.get('newBankListControl').value);
    this.selectedRoles = this.personalForm.get('roles').value;
    let roleNameList = this.selectedRoles.map(role => role.name);
    let newName = [];
    roleNameList.forEach(e => {
        if (e) {
          let data = {
            name: e
          }
          newName.push(data);
        }
        console.log(newName, 'newName');

      })
    let roleIdList = this.selectedRoles.map(role => role.id);
    // this.roleForm.get('newRoleNameList').setValue(newName); // Update newRoleNameList with the selected roles
    this.personalForm.get('role').setValue(roleIdList);
    // this.personalForm.get('roles').setValue(this.roleForm.get('newRoleNameList').value);
    this.personalForm.get('roles').setValue(newName);
    if (this.personalForm.status == 'VALID') {
      this.showError = false;
      this.selectallCountry ? (this.personalForm.get('countryList').setValue(['ALL'])) : '';
      // console.log(roleFinalList);
      console.log(this.personalForm.value);
      this.addUser();
    } else {
      this.showError = true;

    }
  }
  addUser() {
    if (this.personalForm.status == 'VALID') {
      this.showError = false;
      this.userMgmtService.createAdminUser(this.personalForm.value).subscribe((res: any) => {
        console.log(res);
        const popup = this.dialog.open(GeneralPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
          disableClose:true
        });
        if (res['success'] == true) {
          this.router.navigateByUrl('adminv2/user-management/user-list');
        } else {
          this.personalForm.get('roles').setValue(this.selectedRoles);
        }
      }, (error) => {
        this.personalForm.get('roles').setValue(this.selectedRoles);
      });
    } else {
      this.personalForm.get('roles').setValue(this.selectedRoles);
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
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  cancelForm(): void {
    this.router.navigateByUrl('adminv2/user-management/user-list');
  }

  onCatRemoved(cat: string) {
    const categories = this.personalForm.controls['countryList'].value as string[];
    this.removeFirst(categories, cat);
    this.personalForm.controls['countryList'].setValue(categories); // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }


  onRoleRemoved(cat: string) {
    const categories = this.personalForm.controls['roles'].value as string[];
    this.removeOther(categories, cat);
    this.personalForm.controls['roles'].setValue(categories); // To trigger change detection
  }
  private removeOther<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

}

