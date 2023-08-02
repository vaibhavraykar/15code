import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { SubscriptionMgmtServices } from '../services/subscription-services.services';
import { GrantRequestsServices } from '../../grant-requests/services/grant-requests-services.services';

@Component({
  selector: 'app-view-subscription',
  templateUrl: './view-subscription.component.html',
  styleUrls: ['./view-subscription.component.scss']
})
export class ViewSubscriptionComponent {
  routelocation:any
  subsId:any;
  idDetails:any;
  makerDate: any;
  checkerDate: any;
  productCountries=[];
  dialogRef: MatDialogRef<any, any>;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(
    private location:Location,
    private route:ActivatedRoute,
    private subsMgmtService: SubscriptionMgmtServices,
    private dialog: MatDialog,
    private grantRequestServices : GrantRequestsServices
    ){
    this.routelocation= this.location
  }
  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.subsId = params['id'];
      console.log('id',this.subsId);
      this.viewDetails();
    })
  }

  viewDetails(){
    this.subsMgmtService.getProductById(this.subsId).subscribe((res:any)=>{
      if(res['success'] == true){
        this.idDetails=res['data'][0];
        const makerepochTime = this.idDetails?.makerApprovalDate;
        const mDate = new Date(makerepochTime);
        this.makerDate = mDate.toUTCString();
        const checkerepochTime = this.idDetails?.checkerApprovalDate;
        const cDate = new Date(checkerepochTime);
        this.checkerDate = cDate.toUTCString();
        this.productCountries = res['data'][0].productCountries;
        var p: any = '';
        if (this.productCountries) {
          for (let i = 0; i < this.productCountries.length; i++) {
            if (i === 0) {
              p = this.productCountries[i].country;
            } else {
              p = p + ',' + this.productCountries[i].country;
            }
          }
          this.productCountries = p;
          console.log(p);
        }
      }
      else{
        const popup = this.dialog.open(GeneralPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
          message:res['message'],
          status:res['success']
          },
          disableClose:true
        });
      }
    })
  }
  changeStatus(id:any, status:any) {
    console.log(id);
    let data = {
      id: id,
      status: status
    }
    let message;
    if (this.idDetails.status == 'ACTIVE') {
      message = 'Are you sure you want to assign change the status from Active to Inactive?';
    } else if (this.idDetails.status == 'INACTIVE') {
      message = 'Are you sure you want to assign change the status from Inactive to Active?';
    }
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: message
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.subsMgmtService.updateProductStatus(data).subscribe((res: any) => {
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
            disableClose:true
          });
          if (res['success'] == true) {
            this.viewDetails();
          }
        })
      }
    });
  }

  viewCountry() {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '250px',
      disableClose:true
    });
  }
  
  back(): void {
    this.grantRequestServices.setSelectedTab(6);
    this.location.back()
  
  } 
  close(){
    this.dialogRef.close();
  }
}
