import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { AdminService } from '../../services/admin.service';
import { UserManagementService } from '../../services/userManagement/userManagement.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EdituserComponent {

  empId: any;
  viewData?: any;
  personalForm!: FormGroup;
  firstName: FormControl;
  countries:any=[];
  countryCodeList:any=[];
  rolelist:any=[];
  editedList1:any;
  selectallCountry:boolean;
  newnamecountry: any;
  isAllselected: boolean;
  onlyall: any;


  constructor(private route: ActivatedRoute, private router: Router, public adminService: AdminService, private fb: FormBuilder,
    private apiService:ApiService,private dialog: MatDialog,private userService:UserManagementService) {
    this.userService.editAdminUserId.subscribe((res: any) => {
      if (res) {
        this.empId = res;
      }
    });
    this.adminService.getAllCountryCode().subscribe((res:any)=>{
      this.countries = res.data[0].countryList;
      this.countryCodeList = this.countries.map(x => x.countryCode);
    });
    this.adminService.getAllRole().subscribe((res:any)=>{
      this.rolelist = res;
    });

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
      status:['PENDING'],
      id:[''],
      makerApprovalDate:[],
      makerApprovedBy:[],
      userId:[],

    });

  }
  ngOnInit() {

  }
  viewUser() {
    this.userService.getAdminUserById(this.empId).subscribe((res: any) => {
      this.viewData = res['data'][0];
      let rolenamelist = this.viewData.roles.map(x => x.name);
      this.personalForm.get('id').setValue(this.viewData.id);
      this.personalForm.get('makerApprovalDate').setValue(this.viewData.makerApprovalDate);
      this.personalForm.get('makerApprovedBy').setValue(this.viewData.makerApprovedBy);
      // if(this.viewData.checkerApprovalDate){
      //   this.personalForm.get('checkerApprovalDate').setValue(this.viewData.checkerApprovalDate);
      // }
      // if(this.viewData.checkerApprovedBy){
      //   this.personalForm.get('checkerApprovedBy').setValue(this.viewData.checkerApprovedBy);
      // }
      this.personalForm.get('userId').setValue(this.viewData.userId);
      this.personalForm.patchValue({
        firstName: this.viewData.firstName,
        lastName:this.viewData.lastName,
        email: this.viewData.email,
        mobileNo: this.viewData.mobileNo,
        department: this.viewData.department,
        designation:this.viewData.designation,
        reportingManager: this.viewData.reportingManager,
        countryList: this.viewData.countryList,
        roles: rolenamelist,
        subscriberType: 'ADMIN',
        countryExt:this.viewData.countryExt,
      }
      );
      if(this.viewData.countryList == 'ALL'){
        var onlyAll =['ALL'];
        this.isAllselected = true;
        this.viewData.countryList ? (this.newnamecountry  = onlyAll.concat(this.countries.map(x => x.countryName)),this.onlyall =['ALL']): this.newnamecountry= [];
        this.personalForm.patchValue({countryList: this.newnamecountry})
      }
      console.log(this.personalForm.value);
    })
  }
  selectAll(e){
    // for testing 
    this.selectallCountry=e;
    console.log(e);
    var onlyAll =['ALL'];
    this.isAllselected = e;
    e ? (this.newnamecountry  = onlyAll.concat(this.countries.map(x => x.countryName)),this.onlyall =['ALL']): this.newnamecountry= [];
    console.log(this.personalForm.value, 'this.personalForm');
    console.log(this.newnamecountry, 'this.newnamecountry');
  }
  submitEditUser() {
    var editedList = this.personalForm.controls['roles'].value;
   this.editedList1 = this.personalForm.controls['roles'].value;
  //  let finalRoleList = this.rolelist.map(x => editedList.filter((a => a == x.name).length > 1 ? 'null' : Unique.push(x)))
 let roleName = [];
 let roleId = [];
  this.rolelist.forEach(e => {
    if(e){
      editedList.forEach(el => {
        if(el){
        console.log(el, 'el');
        if(el == e.name){
          roleName.push(e.id);
        }
        }
      })
    }
  })
    editedList.forEach(e =>{
    if(e){
      let data = {  
                name: e
                 }
                 roleId.push(data);
    }
  })
  this.personalForm.get('role').setValue(roleName);
  this.personalForm.get('roles').setValue(roleId);
  this.selectallCountry ? (this.personalForm.get('countryList').setValue(['ALL'])):'';


  console.log(this.personalForm,'edit form data');
  this.editUser();
  }
  editUser() {
    if(this.personalForm.status == 'VALID'){
      this.userService.updateAdminUserById(this.personalForm.value).subscribe((res:any)=>{
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message:res['message'],
            status:res['success']
          },
        });
        // popup.afterClosed().subscribe(dialogResult => {
        //   this.router.navigateByUrl('admin/dsb/user-list');

        // });
        if(res['success'] == true){
          this.router.navigateByUrl('admin/dsb/user-list');
        }else{
          this.personalForm.get('roles').setValue(this.editedList1);
        }
      },(error) => {
        this.personalForm.get('roles').setValue(this.editedList1);
      })
    }else{
      this.personalForm.get('roles').setValue(this.editedList1);
    }
  }
  back() {
    this.router.navigateByUrl('admin/dsb/user-list');
  }
  phoneInputHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;
    if(charCode>31 && (charCode<48 || charCode>57)){
      return false;
    }
    return true;
  }

  landlineHandler(e:any){
    const charCode = e.which?e.which:e.keyCode;
    console.log(charCode);
    if(charCode>31 && (charCode<48 || charCode>57)){
      console.log(false);
      return false;
    }
    console.log(true);
    return true;
  }

  pasteHandler(e:ClipboardEvent){
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
}
