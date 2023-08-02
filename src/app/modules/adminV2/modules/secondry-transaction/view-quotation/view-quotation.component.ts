import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SecondaryTransactionServices } from '../services/sec-transaction-services.services';

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrls: ['./view-quotation.component.scss']
})
export class ViewQuotationComponent {
  routelocation:any
  quotationId:any;
  idDetails:any;
  countryList = [];
  roleInfo: any = [];
  calculatedValue: number;
  dialogRef: MatDialogRef<any, any>;
  constructor(
    private location:Location,
    private route:ActivatedRoute,
    private dialog: MatDialog,
    private secTransServices: SecondaryTransactionServices,
    ){
    this.routelocation= this.location
  }



  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.quotationId = params['id'];
      console.log('id',this.quotationId);
      this.getQuoteList();
    })
    this.secTransServices.getCalculatedValue().subscribe((value) => {
      this.calculatedValue = value;
    });
    console.log('line 61',this.calculatedValue);
    
  }

  getQuoteList(){
    this.secTransServices.getQuoteById(this.quotationId).subscribe((res:any)=>{
      // if(res['success'] == true){
        console.log(res?.data[0]);
        this.idDetails=res?.data[0];
    // }else{
    //   const popup = this.dialog.open(GeneralPopupComponent, {
    //     width: '500px',
    //     height: '350px',
    //     data: {
    //       title: 'isAllGood',
    //     message:res['message'],
    //     status:res['success']
    //     },
    //   });
    // }
    })
    
  }

  back(): void {
    this.location.back()
  } 
}
