import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-update-popup',
  templateUrl: './profile-update-popup.component.html',
  styleUrls: ['./profile-update-popup.component.scss'],
})
export class ProfileUpdatePopupComponent {
  
  from:any=''

  constructor(
    public dialogRef: MatDialogRef<ProfileUpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    ) {}

  ngOnInit() {
    this.from = this.data?.from;
  }

  close() {
    this.dialogRef.close();
  }

}
