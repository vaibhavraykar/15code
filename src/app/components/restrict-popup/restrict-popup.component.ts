import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-restrict-popup',
  templateUrl: './restrict-popup.component.html',
  styleUrls: ['./restrict-popup.component.scss'],
})
export class RestrictPopupComponent implements OnInit {
  heading: any = '';
  showThankYouMessage:boolean = false;
  closeButtonText: any = '';

  constructor(
    public dialogRef: MatDialogRef<RestrictPopupComponent>,
    public sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.heading='You cannot access this service';
  }

  availService(){
    this.heading='Thank You';
    this.showThankYouMessage = true;
  }

  close() {
    this.sharedService.closeRestrictPopup();
  }
}
