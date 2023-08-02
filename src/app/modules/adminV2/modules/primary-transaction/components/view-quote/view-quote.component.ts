import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PrimaryTransactionServicesService } from '../../services/primary-transaction-services.service';
import { GeneralPopupComponent } from 'src/app/modules/adminV2/components/general-popup/general-popup.component';

@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss']
})
export class ViewQuoteComponent {
  routelocation:any
  quotationId:any;
  idDetails:any;
  countryList = [];
  roleInfo: any = [];
  dialogRef: MatDialogRef<any, any>;
  constructor(
    private location:Location,
    private route:ActivatedRoute,
    private dialog: MatDialog,
    private primaryTransactionService: PrimaryTransactionServicesService,
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
  }

  getQuoteList(){
    this.primaryTransactionService.getQuoteById(this.quotationId).subscribe((res:any)=>{
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
