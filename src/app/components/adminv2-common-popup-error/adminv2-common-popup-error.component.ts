import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-common-popup-error',
  templateUrl: './adminv2-common-popup-error.component.html',
  styleUrls: ['./adminv2-common-popup-error.component.scss'],
})
export class AdminV2CommonPopupErrorComponent {
  isError: boolean = false;
  isInfo: boolean = false;
  isErrorMsg: boolean = false;
  isSuccess: boolean = false;
  isCongrats: boolean = false;
  signupSuccess: boolean = false;
  kycSuccess: boolean = false;
  updatePwdSuccess: boolean = false;
  kycRejected: boolean = false;
  changePwdSuccess = false
  emailID: any;
  transactData: any = [];
  comment: any;
  message: any = '';
  form!: FormControl;
  isAllGood: boolean = false;
  finalmessage: any;
  finalStatus: any;
  isConfirm: boolean = false;
  errors: any = [];

  constructor(
    public dialogRef: MatDialogRef<AdminV2CommonPopupErrorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      full_data: any;
      message: string;
      email: string;
      status: string;
      errorList: any;
    },
    private adminService: AdminService,
    private router: Router,
    public dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.data.title === 'isError') {
      this.isError = true;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.changePwdSuccess=false
      this.kycRejected = false;
    } else if (this.data.title === 'isInfo') {
      this.isInfo = true;
      this.isError = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.transactData = this.data.full_data;
      this.kycRejected = false;
      this.changePwdSuccess=false
      console.log(this.data.full_data);
    } else if (this.data.title === 'isErrorMsg') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = true;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.kycRejected = false;
      this.message = this.data.message;
      this.errors = this.data.errorList;
      this.changePwdSuccess=false
    } else if (this.data.title === 'isSuccess') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = true;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.kycRejected = false;
      this.changePwdSuccess=false
    } else if (this.data.title === 'isCongrats') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = true;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.kycRejected = false;
      this.changePwdSuccess=false
    } else if (this.data.title === 'signupCongrats') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = true;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.emailID = this.data.email;
      this.kycRejected = false;
    } else if (this.data.title === 'kycSuccess') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = true;
      this.updatePwdSuccess = false;
      this.kycRejected = false;
      this.changePwdSuccess=false
    } else if (this.data.title === 'updatePwdSuccess') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = true;
      this.emailID = this.data.email;
      this.changePwdSuccess=false
      this.kycRejected = false;
    }else if (this.data.title === 'changePassword') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.emailID = this.data.email;
      this.kycRejected = false;
      this.changePwdSuccess=true
    }  else if (this.data.title == 'kycRejected') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.updatePwdSuccess = false;
      this.kycRejected = true;
      this.changePwdSuccess=false
      this.message = this.data.message;
    } else if (this.data.title === 'isAllGood') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.isAllGood = true;
      this.updatePwdSuccess = false;
      this.finalmessage = this.data.message;
      this.finalStatus = this.data.status;
      this.changePwdSuccess=false
    } else if (this.data.title === 'isConfirm') {
      this.isError = false;
      this.isInfo = false;
      this.isErrorMsg = false;
      this.isSuccess = false;
      this.isCongrats = false;
      this.signupSuccess = false;
      this.kycSuccess = false;
      this.isAllGood = false;
      this.isConfirm = true;
      this.updatePwdSuccess = false;
      this.finalmessage = this.data.message;
      this.finalStatus = this.data.status;
      this.changePwdSuccess=false
    }
    this.form = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]);
  }

  updateComment() {
    this.data.full_data['comment'] = this.form.value;
    if (this.form.value != '') {
      this.adminService
        .updateComment(this.data.full_data)
        .subscribe((res: any) => {
          console.log(res, 'res');
          this.dialogRef.close();
          const popup = this.dialog.open(AdminV2CommonPopupErrorComponent, {
            width: '500px',
            height: '300px',
            data: {
              title: 'isSuccess',
            },
            disableClose:true
          });

          setTimeout(() => {
            popup.close();
          }, 1000);

          this.router.navigateByUrl('/admin/factoring/transaction-details');
        });
    }
  }

  getErrorMessage() {
    return this.form.hasError('required')
      ? 'You must enter a value'
      : this.form.hasError('form')
      ? 'Not a valid form'
      : '';
  }

  public errorHandling = (error: string) => {
    return this.form.hasError(error);
  };

  preview() {
    this.dialogRef.close();
    this.router.navigateByUrl('factoring/transaction-preview');
  }

  proceed() {
    this.dialogRef.close();
    this.router.navigateByUrl('');
    localStorage.clear()
  }
  yes() {
    this.dialogRef.close(true);
  }
  no() {
    this.dialogRef.close(false);
  }
  proceedDialog() {
    this.dialogRef.close();
  }
  close(){
    localStorage.clear();
    this.dialogRef.close();
  }
}
