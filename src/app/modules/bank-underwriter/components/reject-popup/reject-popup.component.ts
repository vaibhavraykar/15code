import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RejectSuccessComponent } from '../reject-success/reject-success.component';

@Component({
  selector: 'app-reject-popup',
  templateUrl: './reject-popup.component.html',
  styleUrls: ['./reject-popup.component.scss'],
})
export class RejectPopupComponent implements OnInit {
  form: FormGroup;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private bankService: BankUnderwriterService,
    public dialogRef: MatDialogRef<RejectPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      reason: new FormControl('', [Validators.required]),
    });
  }

  close(res) {
    this.dialogRef.close(res);
  }

  yes() {
    console.log(this.data);
    if (this.form.valid) {
      let payload = {
        transactionId: this.data.transactionId,
        quotationId: this.data.quotationId,
        comments: this.form.controls['reason'].value,
      };
      this.bankService.rejectQuotation(payload).subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.dialogRef.close();
          // this.location.back();
          this.dialog.open(RejectSuccessComponent,{disableClose:true});
      
        }
      });
    }
  }
  no() {
    this.dialogRef.close();
  }
}
