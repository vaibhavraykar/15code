import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent {
  form!: FormControl;
  
  constructor(
    public dialogRef: MatDialogRef<CommonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {message :string;},
    private fb: FormBuilder
  ) {}

  ngOnInit() { 
    this.form = new FormControl('', [Validators.required]);
  }

  close() {
    this.dialogRef.close({"response":false});
  }

  submit() {
    if (this.form.value != '') {
      this.dialogRef.close({"response":true,"comment":this.form.value});
    }
    console.log(this.form.value, 'value');
  }

}
