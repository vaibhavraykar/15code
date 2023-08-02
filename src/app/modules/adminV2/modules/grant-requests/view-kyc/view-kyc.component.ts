import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GrantRequestsServices } from '../services/grant-requests-services.services';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';

@Component({
  selector: 'app-view-kyc',
  templateUrl: './view-kyc.component.html',
  styleUrls: ['./view-kyc.component.scss']
})
export class ViewKycComponent {
  loginuserName: any;
  routelocation: any
  userId: any;
  viewData: any;
  highestIdDocument: any;
  highestDocPersonal: any;
  personalComment: any = '';
  businessComment: any = '';
  showAcceptRejectPersonal: boolean = true;
  showAcceptRejectBusiness: boolean = true;
  kycApprove: boolean = false;
  openPanelState = false;
  secondPanelOpenState = false;
  makerDate: any;
  bsnsmakerDate: any;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private grantRequestServices: GrantRequestsServices,
    private dialog: MatDialog
  ) {
    this.routelocation = this.location
  }


  ngOnInit(): void {
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.userId = params['id'];
      console.log('id', this.userId);
      this.getkycCustomerList();
    })
  }

  getkycCustomerList() {
    this.grantRequestServices.getDetailsById(this.userId).subscribe((res: any) => {
      console.log(res.data[0])
      this.viewData = res?.data[0];
      const makerepochTime = this.viewData?.kycDetails?.[1]?.documentList[0]?.makerApprovalDate;
      const mDate = new Date(makerepochTime);
      this.makerDate = mDate.toUTCString();
      const bsnsmakerepochTime = this.viewData?.kycDetails?.[0]?.documentList[0]?.makerApprovalDate;
      const bmDate = new Date(bsnsmakerepochTime);
      this.bsnsmakerDate = bmDate.toUTCString();
      this.viewData.kycDetails[0].documentList.sort((a, b) => b.id - a.id);
      this.viewData.kycDetails[1].documentList.sort((a, b) => b.id - a.id);
      this.highestIdDocument = this.viewData.kycDetails[0].documentList[0]; //for business
      this.highestDocPersonal = this.viewData.kycDetails[1].documentList[0];
    })
  }

  viewDocument(data,type){
    if (type === 'jpeg' || type === 'png' || type === 'jpg') {
      const img = new Image();
      img.src = data;
      img.onload = () => {
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        const popup = this.dialog.open(GeneralPopupComponent, {
          width: width + 'px',
          // height: height + 'px',
          data: {
            title: 'viewDocument',
            imgUrl: data,
          },
          disableClose: true,
        });

      };

    } else {
        window.open(data);
    }
  }

  kycPersonalApproval(id: any, status: any, approvedType: any, documentType: any, kycId: any) {
    const data = {
      id: id,
      status: status,
      comment: this.personalComment,
      approvedType: approvedType,
      documentType: documentType,
      kycId: kycId,
    }
    if (this.personalComment) {
      this.submitKYC(data);
    }
  }

  kycBusinessApproval(id: any, status: any, approvedType: any, documentType: any, kycId: any) {
    const data = {
      id: id,
      comment: this.businessComment,
      status: status,
      approvedType: approvedType,
      documentType: documentType,
      kycId: kycId,
    }
    if (this.businessComment) {
      this.submitKYC(data);
    }
  }

  submitKYC(data) {
    let message
    if(data.status =='ACTIVE'){
    message = 'Are you sure you want to approve the KYC ?';
    } else if(data.status =='REJECTED'){
    message = 'Are you sure you want to reject the KYC ?';
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
      if (dialogResult) {
        this.grantRequestServices.updateKYCStatusBusiness(data).subscribe((res: any) => {
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
            this.getkycCustomerList();
          }
        })
      }
    })
  }
  
  comment(kycName) {
    if (kycName == 'PERSONAL') {
      if (this.personalComment) {
        this.showAcceptRejectPersonal = false;
      } else {
        this.showAcceptRejectPersonal = true;
      }
    } else if(kycName == 'BUSINESS') {
      if (this.businessComment) {
        this.showAcceptRejectBusiness = false;
      } else {
        this.showAcceptRejectBusiness = true;
      }
    }
  }
  textOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (
      (charCode >= 33 && charCode <= 59) || 
      charCode === 61 || 
      (charCode >= 63 && charCode <= 90) || 
      charCode === 92 || 
      charCode === 95 || 
      (charCode >= 97 && charCode <= 122) || 
      charCode === 124 
    ) {
      return true;
    }
    return false;
  }
  goBack() {
    this.grantRequestServices.setSelectedTab(1); // Set the index of app-grant-kyc tab
    this.location.back(); 
  }
}
