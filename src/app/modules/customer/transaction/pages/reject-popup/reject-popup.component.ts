import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BankUnderwriterService } from 'src/app/modules/bank-underwriter/services/bank-underwriter.service';
import { RejectSuccessComponent } from '../reject-success/reject-success.component';
import { TransactionService } from '../../services/transaction.service';


@Component({
  selector: 'app-reject-popup',
  templateUrl: './reject-popup.component.html',
  styleUrls: ['./reject-popup.component.scss'],
})
export class RejectPopupComponent implements OnInit {
  form: FormGroup;
  options: string[] = [
    'Bank not acceptable',
    'Bank has rejected the transaction due to non-fulfillment of documentary requirements',
    'Others',
  ];
  filteredOptions: any[];

  constructor(
    private dialog:MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private ts: TransactionService,
    public dialogRef: MatDialogRef<RejectPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.options;
    this.form = new FormGroup({
      reason: new FormControl('', [Validators.required]),
    });
  }

  close(res) {
    this.dialogRef.close(res);
  }

  yes() {
    if (this.form.valid) {
      let payload={
        ...this.data,
        'comments':this.form.controls['reason'].value
      }
      this.ts.rejectQuotation(payload).subscribe((res: any) => {
        if (res.success) {
          this.dialogRef.close();
          // this.location.back();
          this.dialog.open(RejectSuccessComponent, { disableClose: true });

        }
      });
    }
  }
  no() {
    this.dialogRef.close();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  checkAutocomplteExists(e: any, formName: string) {
    console.log(e.target.value, formName);
    let formValue = this.form.controls[formName].value;
    console.log(formValue);
    if (
      formName == 'reason'
    ) {
      let isExists = this.options.find((ele: any) => {
        console.log(ele.toLowerCase() === formValue?.toLowerCase());
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if (isExists) {
        console.log(
          this.options.find(
            (ele: any) => ele.toLowerCase() === formValue?.toLowerCase()
          )
        );
        this.form.controls[formName].setValue(
          this.options.find(
            (ele: any) => ele.toLowerCase() === formValue?.toLowerCase()
          )
        );
        this.form.controls[formName].setErrors(null);
      } else {
        this.form.controls[formName].setErrors({ required: true });
      }
    }
  }

  reasonChange(e: any) {
    if (e.target.value === '') {
      this.filteredOptions = this.options;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.filteredOptions= this.options.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }
}
