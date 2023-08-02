import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-general-popup',
  templateUrl: './general-popup.component.html',
  styleUrls: ['./general-popup.component.scss']
})
export class GeneralPopupComponent{
  form!: FormControl;
  finalmessage: any;
  finalStatus: any;
  isAllGood: boolean = false;
  isConfirm: boolean = false;
  viewDocument:boolean = false;
  changePassword:boolean = false;
  imgUrl: SafeResourceUrl | string;
  constructor(
    public dialogRef: MatDialogRef<GeneralPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
       message :string;
       full_data: any;
       title: string;
       status: string;
       imgUrl:string;
      
      },
    private fb: FormBuilder, public router :Router,private sanitizer: DomSanitizer
  ) {}

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
 
  ngOnInit() {
    if (this.data.title === 'isAllGood') {
      this.isAllGood = true;
      this.finalmessage = this.data.message;
      this.finalStatus = this.data.status;
    } else if (this.data.title === 'isConfirm') {
      this.isAllGood = false;
      this.isConfirm = true;
      console.log(this.data.full_data);
    } else if(this.data.title === 'viewDocument'){
      this.viewDocument = true;
      this.imgUrl = this.sanitizeUrl(this.data.imgUrl);
      console.log('img',this.imgUrl);
    }else if(this.data.title === 'changePassword'){
      this.changePassword = true;
    }
    this.form = new FormControl('', [Validators.required]);
  }

  yes() {
    this.dialogRef.close(true);
  }
  no() {
    this.dialogRef.close(false);
  }
  close() {
    this.dialogRef.close(false);
  }
  gotoLoginPage(){
    this.dialogRef.close();
    this.router.navigateByUrl('');
    localStorage.clear()
  }
}
