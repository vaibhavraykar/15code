import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GrantService } from '../../services/grant/grant.service';

@Component({
  selector: 'app-view-kyc',
  templateUrl: './view-kyc.component.html',
  styleUrls: ['./view-kyc.component.scss']
})
export class ViewKycComponent {
  [x: string]: any;
  dialogRef: MatDialogRef<any, any>;
  clickData: any;
  commentValue: string;
  loginuserName: any;
  userid: any;
  viewData: any;
  highestIdDocument: any;
  highestDocPersonal: any;
  openPanelState=false;
  secondPanelOpenState=false;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;


  constructor(private grantService: GrantService, private router: Router,
    private route: ActivatedRoute, private location: Location,
    private dialog: MatDialog,) {

  }
  ngOnInit() {
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
    this.userid = this.route.snapshot.paramMap.get('id');
    console.log(this.userid);
    this.viewDetails();
  }
  viewDetails() {
    this.grantService.getDetailsById(this.userid).subscribe((res: any) => {
      if (res['success'] == true) {
        this.viewData = res['data'][0];
        this.viewData.kycDetails[0].documentList.sort((a, b) => b.id - a.id);
        this.viewData.kycDetails[1].documentList.sort((a, b) => b.id - a.id);
        this.highestIdDocument = this.viewData.kycDetails[0].documentList[0]; //for business
        this.highestDocPersonal = this.viewData.kycDetails[1].documentList[0];
        console.log('view', this.viewData);
        console.log('business', this.highestIdDocument);
        console.log('personal', this.highestDocPersonal);
      }
      else {
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: res['message'],
            status: res['success']
          },
        });
      }
    })
  }
  comment(id: any, status: any, approvedType: any, documentType: any, kycId: any) {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '350px',
    });
    this.clickData = {
      id, status, approvedType, documentType, kycId
    };
    console.log('comment', this.clickData);
  }
  commentbusiness(id: any, status: any, approvedType: any, documentType: any, kycId: any) {
    this.commentValue = '';
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '350px',
    });
    this.clickData = {
      id, status, approvedType, documentType, kycId
    };
    console.log('comment', this.clickData);
  }

  submitComment() {
    console.log(this.commentValue);
    let data = {
      id: this.clickData.id,
      comment: this.commentValue,
      status: this.clickData.status,
      approvedType: this.clickData.approvedType,
      documentType: this.clickData.documentType,
      kycId: this.clickData.kycId
    }
    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '310px',
      data: {
        title: 'isConfirm',
        full_data: data,
      },
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
    console.log('confirm status', data);
    // popup.afterClosed().subscribe(dialogResult => {
    //   let result = dialogResult;
      // if (dialogResult) {
        this.grantService.updateKYCStatusBusiness(data).subscribe((res: any) => {
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
          });
          if (res['success'] == true) {
            this.dialogRef.close();
            this.viewDetails();
          }
        })
      }
    });
  }
  closeComment() {
    this.dialogRef.close();
  }
  openLink() {
    const url = this.highestDocPersonal.url;
    const windowWidth = 800;
    const windowHeight = 600;
    const windowLeft = (window.screen.width - windowWidth) / 2;
    const windowTop = (window.screen.height - windowHeight) / 2;
    const popupWindow = window.open(url, 'PopupWindow', `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`);
  }
  openPopup() {
    const url = this.highestIdDocument.url;
    const windowWidth = 800;
    const windowHeight = 600;
    const windowLeft = (window.screen.width - windowWidth) / 2;
    const windowTop = (window.screen.height - windowHeight) / 2;
    const popupWindow = window.open(url, 'PopupWindow', `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`);
  }


  back(): void {
    this.location.back()
  }
}
