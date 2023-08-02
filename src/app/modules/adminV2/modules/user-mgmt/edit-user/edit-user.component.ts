import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { UserManagementServices } from '../services/user-mgmt-services.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  routelocation: any
  empId: any;
  viewData?: any;
  personalForm!: FormGroup;
  firstName: FormControl;
  countries: any = [];
  countryCodeList: any = [];
  rolelist: any = [];
  editedList1: any;
  selectallCountry: boolean;
  newnamecountry: any;
  isAllselected: boolean;
  onlyall: any;
  form!: FormGroup;
  roleForm: FormGroup
  filteredCountryCodes:any;
  filteredCountries: any[] = [];
  filteredRows: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private location: Location, public adminService: AdminService,
    private fb: FormBuilder, private dialog: MatDialog, private userMgmtService: UserManagementServices) {
    this.userMgmtService.editAdminUserId.subscribe((res: any) => {
      if (res) {
        this.empId = res;
      }
    });
    this.adminService.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;
      this.filteredCountries = this.countries;
      this.countryCodeList = this.countries.map(x => x.countryCode);
      this.filteredCountryCodes = this.countryCodeList;
    });
    this.adminService.getAllRole().subscribe((res: any) => {
      this.rolelist = res;
      this.filteredRows = this.rolelist;

    });
    this.routelocation = this.location;
    this.viewUser();
    this.personalForm = fb.group({
      // empId: ['',Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      mobileNo: ['', [Validators.required]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      reportingManager: [''],
      countryList: ['', Validators.required],
      roles: ['', Validators.required],
      subscriberType: ['ADMIN'],
      role: [''],
      countryExt: [],
      status: ['PENDING'],
      id: [''],
      makerApprovalDate: [],
      makerApprovedBy: [],
      userId: [],

    });

  }
  ngOnInit() {

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
    const selectedRoles = this.personalForm.controls['roles'].value;

    this.filteredRows = this.rolelist;

    if (searchRoleText) {
      this.filteredRows = this.filteredRows.filter(item =>
        item.name.toLowerCase().includes(searchRoleText) || selectedRoles.includes(item.name)
      );
    } else {
      this.filteredRows = this.rolelist.filter(item => selectedRoles.includes(item.name));
    }
  }
  
  onRoleSelection(event: MatSelectChange) {
    this.personalForm.get('roles').setValue(event.value);
    this.filteredRows = this.rolelist;
  }
  viewUser() {
    this.userMgmtService.getUserById(this.empId).subscribe((res: any) => {
      this.viewData = res['data'][0];
      let rolenamelist = this.viewData.roles.map(x => x.name);
      this.personalForm.get('id').setValue(this.viewData.id);
      this.personalForm.get('makerApprovalDate').setValue(this.viewData.makerApprovalDate);
      this.personalForm.get('makerApprovedBy').setValue(this.viewData.makerApprovedBy);
      this.personalForm.get('roles').setValue(rolenamelist);
      // if(this.viewData.checkerApprovalDate){
      //   this.personalForm.get('checkerApprovalDate').setValue(this.viewData.checkerApprovalDate);
      // }
      // if(this.viewData.checkerApprovedBy){
      //   this.personalForm.get('checkerApprovedBy').setValue(this.viewData.checkerApprovedBy);
      // }
      this.personalForm.get('userId').setValue(this.viewData.userId);
      this.personalForm.patchValue({
        firstName: this.viewData.firstName,
        lastName: this.viewData.lastName,
        email: this.viewData.email,
        mobileNo: this.viewData.mobileNo,
        department: this.viewData.department,
        designation: this.viewData.designation,
        reportingManager: this.viewData.reportingManager,
        countryList: this.viewData.countryList,
        roles: rolenamelist,
        subscriberType: 'ADMIN',
        countryExt: this.viewData.countryExt,
      }
      );
      this.personalForm.controls['email'].disable();
      if (this.viewData.countryList == 'ALL') {
        var onlyAll = ['ALL'];
        this.isAllselected = true;
        // this.viewData.countryList ? (this.newnamecountry = onlyAll.concat(this.countries.map(x => x.countryName)), this.onlyall = ['ALL']) : this.newnamecountry = [];
        this.personalForm.get('countryList').setValue(onlyAll)
      }else{
        this.personalForm.get('countryList').setValue(this.viewData.countryList)
      }
      console.log(this.personalForm.value);
    })
  }
  selectAll(e) {
    // for testing
    this.selectallCountry = e;
    console.log(e);
    var onlyAll = ['ALL'];
    this.isAllselected = e;
    // e ? (this.newnamecountry = onlyAll.concat(this.countries.map(x => x.countryName)), this.onlyall = ['ALL']) : this.newnamecountry = [];
    e ? this.personalForm.get('countryList').setValue(['ALL']) : this.personalForm.get('countryList').setValue([]);
    // let countryNameValue = this.form.get('newBankListControl').setValue(this.newnamecountry);
    // this.personalForm.get('countryList').setValue(countryNameValue);
    console.log(this.personalForm.value, 'this.personalForm');
    console.log(this.newnamecountry, 'this.newnamecountry');
  }
  submitEditUser() {
    // this.personalForm.get('countryList').setValue(this.form.get('newBankListControl').value);
    console.log('line 128', this.form.value);
    console.log('line 128', this.roleForm.value);
    console.log('line 80', this.personalForm.value);
    var editedList = this.personalForm.controls['roles'].value;
    this.editedList1 = this.personalForm.controls['roles'].value;
    //  let finalRoleList = this.rolelist.map(x => editedList.filter((a => a == x.name).length > 1 ? 'null' : Unique.push(x)))
    let selectedRoles = this.roleForm.get('newRoleNameList').value;
    let roleNameList = selectedRoles.map(role => role.name);
    let roleName = [];
    let roleId = [];
    this.rolelist.forEach(e => {
      if (e) {
        editedList.forEach(el => {
          if (el) {
            console.log(el, 'el');
            if (el == e.name) {
              roleName.push(e.id);
            }
          }
        })
      }
    })
    editedList.forEach(e => {
      if (e) {
        let data = {
          name: e
        }
        roleId.push(data);
      }
    })
    // let roleIdList = selectedRoles.map(role => role.id);
    this.roleForm.get('newRoleNameList').setValue(roleName); // Update newRoleNameList with the selected roles
    this.personalForm.get('role').setValue(roleId);
    this.personalForm.get('roles').setValue(this.roleForm.get('newRoleNameList').value);
    this.personalForm.get('role').setValue(roleName);
    this.personalForm.get('roles').setValue(roleId);
    const selectedCountryCode = this.personalForm.get('countryExt').value;
    this.personalForm.get('countryExt').setValue(selectedCountryCode.toString());
    this.selectallCountry ? (this.personalForm.get('countryList').setValue(['ALL'])) : '';
    this.personalForm.controls['email'].enable();
    this.personalForm.get('email').setValue(this.viewData.email);
    console.log(this.personalForm, 'edit form data');
    this.editUser();
  }
  editUser() {
    if(this.personalForm.status == 'VALID'){
      this.userMgmtService.updateAdminUserById(this.personalForm.value).subscribe((res:any)=>{
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
        // popup.afterClosed().subscribe(dialogResult => {
        //   this.router.navigateByUrl('admin/dsb/user-list');

        // });
        if(res['success'] == true){
          this.router.navigateByUrl('adminv2/user-management/user-list');
        }else{
          this.personalForm.get('roles').setValue(this.editedList1);
        }
      }, (error) => {
        this.personalForm.get('roles').setValue(this.editedList1);
      })
    } else {
      this.personalForm.get('roles').setValue(this.editedList1);
    }
  }
  back(): void {
    this.location.back()
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
