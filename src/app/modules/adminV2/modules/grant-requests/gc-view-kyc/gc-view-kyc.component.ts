import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GrantRequestsServices } from '../services/grant-requests-services.services';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';

@Component({
  selector: 'app-gc-view-kyc',
  templateUrl: './gc-view-kyc.component.html',
  styleUrls: ['./gc-view-kyc.component.scss']
})
export class GCViewKycComponent {
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
    // this.grantRequestServices.gcKycData.subscribe(res=>{
      this.viewData = JSON.parse(localStorage.getItem('gcKycData'));
      this.viewData.kycDetails[0].documentList.sort((a, b) => b.id - a.id);
      this.viewData.kycDetails[1].documentList.sort((a, b) => b.id - a.id);
      this.highestIdDocument = this.viewData.kycDetails[0].documentList[0]; //for business
      this.highestDocPersonal = this.viewData.kycDetails[1].documentList[0];
    // })
  }


  viewDocument(data,type){
    if (type === 'jpeg' || type === 'png' || type === 'jpg' || type.startsWith('image/')) {
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

    }else if (type === 'pdf') {
      const embed = document.createElement('embed');
      embed.src = data;
      embed.width = '100%';
      embed.height = '100%';
      const newTab = window.open('', '_blank');
      newTab.document.write(embed.outerHTML);
      newTab.document.close();
    }
    else {
      window.open(data);
    }
  }

  kycBusinessApproval(id: any, status: any, approvedType: any, documentType: any, kycId: any,mid: any) {
    const data = {
      id: id,
      comment: this.businessComment,
      status: status,
      approvedType: approvedType,
      documentType: documentType,
      kycId: kycId,
      mid:mid
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
        this.grantRequestServices.updateGCKYCStatusBusiness(data).subscribe((res: any) => {
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
            this.grantRequestServices.setSelectedTab(7);
            this.router.navigateByUrl(`/adminv2/grant-requests/approval`);
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
    this.grantRequestServices.setSelectedTab(7); // Set the index of app-grant-kyc tab
    this.location.back(); 
  }
}
