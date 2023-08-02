import { Location } from '@angular/common';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DiscountManagementServices } from '../services/discount-mgmt-services.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { GrantRequestsServices } from '../../grant-requests/services/grant-requests-services.services';

@Component({
  selector: 'app-view-coupon',
  templateUrl: './view-coupon.component.html',
  styleUrls: ['./view-coupon.component.scss']
})
export class ViewCouponComponent {
  routelocation:any
  couponId:any;
  idDetails:any;
  makerDate: any;
  checkerDate: any;
  dialogRef: MatDialogRef<any, any>;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  countryList: any;
  constructor(
    private location:Location,
    private route:ActivatedRoute,
    private discountMgmtService: DiscountManagementServices,
    private grantRequestServices: GrantRequestsServices,
    private dialog: MatDialog
    ){
    this.routelocation= this.location
  }


  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.couponId = params['id'];
      console.log('id',this.couponId);
      this.getCouponList();
    })
  }

  getCouponList(){
    this.discountMgmtService.getDiscountById(this.couponId).subscribe((res:any)=>{
      console.log(res.data[0])
      this.idDetails=res?.data[0];
      const makerepochTime = this.idDetails?.makerApprovalDate;
      const mDate = new Date(makerepochTime);
      this.makerDate = mDate.toUTCString();
      const checkerepochTime = this.idDetails?.checkerApprovalDate;
      const cDate = new Date(checkerepochTime);
      this.checkerDate = cDate.toUTCString();
      this.countryList = res['data'][0].product?.productCountries.map(x => x.country);
      console.log('countryData',this.countryList);
      var p: any = '';
      if (this.countryList) {
        for (let i = 0; i < this.countryList.length; i++) {
          if (i === 0) {
            p = this.countryList[i];
          } else {
            p = p + ',' + ' ' + this.countryList[i];
          }
        }
        this.countryList = p;
        console.log(this.countryList.length);
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
      message = 'Are you sure you want to assign change the coupon status from Active to Inactive?';
    } else if (this.idDetails.status == 'INACTIVE') {
      message = 'Are you sure you want to assign change the coupon status from Inactive to Active?';
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
        this.discountMgmtService.updateCouponStatus(data).subscribe((res: any) => {
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
            this.getCouponList();
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
close(){
  this.dialogRef.close();
}
back() {
  this.grantRequestServices.setSelectedTab(4);
  this.location.back(); 
}
}
