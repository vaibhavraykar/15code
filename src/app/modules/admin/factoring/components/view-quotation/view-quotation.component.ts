import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FactoringService } from '../../services/factoring.service';


@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrls: ['./view-quotation.component.scss']
})
export class ViewQuotationComponent {
  quotationId:any;
  viewData:any;
  roleInfo: any = [];

  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private factorService: FactoringService){
  }

  ngOnInit(){
    this.quotationId=this.route.snapshot.paramMap.get('id');
    console.log(this.quotationId);
    this.viewDetails();
  }

  viewDetails(){
    this.factorService.getQuoteById(this.quotationId).subscribe((res:any)=>{
      if(res['success'] == true){
        this.viewData=res['data'][0];
    }else{
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
        message:res['message'],
        status:res['success']
        },
      });
    }
  })
  }
  back(): void {
    this.location.back()
  } 

}
