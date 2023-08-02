import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-selling-quote-accepted',
  templateUrl: './selling-quote-accepted.component.html',
  styleUrls: ['./selling-quote-accepted.component.scss']
})
export class SellingQuoteAcceptedComponent implements OnInit{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SellingQuoteAcceptedComponent>,
    private router:Router
  ){

  }
  quatationId:any;
  ngOnInit(): void {

   this.quatationId =this.data.quotationId[0]


  }
  submit(){
    this.dialogRef.close(true);
    this.router.navigateByUrl('/bank-underwriter/active-secondary-transaction')
  }
}
