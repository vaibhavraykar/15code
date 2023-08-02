import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { NewTransactionComponent } from 'src/app/modules/bank-underwriter/components/new-transaction/new-transaction.component';
//
@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss'],
})
export class FilterPopupComponent implements OnInit {
  selectedMenu: any = 'additional_user';
  isbeneficiaryCountry=false
  companies: any;
  additionalUsers: any = [];
  selectedSubsidiary: any;
  selectedUser: any = '';
  fromPage = '';
  transactionStatus = [
    'ACTIVE',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED',
  ];
  constructor(
    public dialogRef: MatDialogRef<FilterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    if(this.data?.user){
      this.selectedUser=this.data?.user
     }else{
      this.selectedUser=''
     }
     if(this.data?.from){
      this.fromPage = this.data?.from;
     }
     else{
      this.fromPage=''
     }
    let { additionalEmails } = JSON.parse(
      localStorage.getItem('userDetails') || '{}'
    );
    if(localStorage.getItem('userType')==='"MASTER_USER"'){
      this.additionalUsers = additionalEmails;
    }else{
      this.additionalUsers =[];
    }
      if(this.data.from==='newReqeuest'){
        this.isbeneficiaryCountry=this.data.isFilterByBeneCountry
      }

  }
  close() {
    {
      this.dialogRef.close( {user:this.selectedUser});
    }
  }
  checkedTheUser(item: any) {
    if (this.selectedUser === item.id) {
      this.selectedUser = '';
    } else {
      this.selectedUser = item.id;
    }
  }
  selectionChange(e,t:any){

    if(e.checked){
      if(t==='issuanceCountry'){
        this.isbeneficiaryCountry=false
      }else{
        this.isbeneficiaryCountry=true
      }
    }else{
      if(t==='issuanceCountry'){
        this.isbeneficiaryCountry=true
      }else{
        this.isbeneficiaryCountry=false
      }
    }
  }
  submit(){
    this.dialogRef.close( {
      isFilterByBeneCountry:this.isbeneficiaryCountry
    });
  }
}
