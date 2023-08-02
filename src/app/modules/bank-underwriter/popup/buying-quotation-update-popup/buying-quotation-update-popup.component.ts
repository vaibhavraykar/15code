import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-buying-quotation-update-popup',
  templateUrl: './buying-quotation-update-popup.component.html',
  styleUrls: ['./buying-quotation-update-popup.component.scss']
})
export class BuyingQuotationUpdatePopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { viewType: string;},
    private dialogRef: MatDialogRef<BuyingQuotationUpdatePopupComponent>,
  ){
    
  }
  viewType:any;
  ngOnInit(): void {
   this.setViewType()
  }

  setViewType(){
    console.log(this.data,"ssssssssssssssssss")
    if(this.data.viewType === 'accepted_preview'){

      this.viewType ='default'
    }else{
      this.viewType ='placeNewQuote'
    }
  }
  submit(){
    this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
