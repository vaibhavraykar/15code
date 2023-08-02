import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-baau-addUser-kyc',
  templateUrl: './baau-addUser-kyc.component.html',
  styleUrls: ['./baau-addUser-kyc.component.scss']
})
export class BaauAddUserKycComponent {

  routelocation: any;
  panelOpenState: Number;
  userId: any;
  data: any = [];
  kycApprove: boolean = false;
  personalComment: any = '';
  showAcceptRejectPersonal: boolean = true;
  myRights: any;
  orderType: any;
  businesspanelOpenState: boolean;

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
    private router: Router, private fb: FormBuilder) {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.routelocation = this.location
    this.userId = this.route.snapshot.paramMap.get('id');
    this.orderType = localStorage.getItem('userClickName');
    // this.customerService.userClickName.subscribe(res=>{
    //   this.orderType = res;
    // })
  }
  ngOnInit() {
    this.getbankData();
  }
  getbankData() {
    const data = {
      id: this.userId,
      status: this.orderType
    }
    this.customerService.getUserKycDetailsForbaau(data).subscribe((res: any) => {
      this.data = res.data;
      // Business document list
      for (let i = 0; i < this.data.length; i++) {
        const kycDetails = this.data?.[i]?.kycDetails;
        if (kycDetails?.length == 1) {
          if (kycDetails?.[0].documentType == 'BUSINESS') {
            kycDetails?.splice(0, 0, undefined);
          }
        } else if (kycDetails?.length != 1) {
          const businessIndex = kycDetails.findIndex(item => item.documentType === 'BUSINESS');
          const personalIndex = kycDetails.findIndex(item => item.documentType === 'PERSONAL');

          if (businessIndex !== -1 && personalIndex !== -1) {
            // Swap positions in the array
            [kycDetails[0], kycDetails[1]] = [kycDetails[1], kycDetails[0]];
          }
        }
        //for latest record
        if (kycDetails?.[0]) {
          kycDetails[0].documentList = kycDetails?.[0]?.documentList?.sort((a, b) => b.id - a.id);
        }
        if (kycDetails?.[1]) {
          kycDetails[1].documentList = kycDetails?.[1]?.documentList?.sort((a, b) => b.id - a.id);
        }
        console.log(kycDetails);
      }
    });
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
  kycPersonalAction(id, kycName, status, kycId) {
    if (this.personalComment) {
      const data = {
        id: id,
        comment: this.personalComment,
        status: status,
        approvedType: "MAKER",
        documentType: kycName,
        kycId: kycId
      }
      // console.log('without OTHERS',data)
      this.kyc(data);
    }
  }
  kyc(data) {
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: 'Are you sure you want to proceed with the action ?'
      },
      disableClose: true
    });
    popup.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.customerService.makerKycAction(data).subscribe((res => {
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
            disableClose: true
          });
          if (res['success'] == true) {
            this.getbankData();
          }
        }))
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
    }
  }
  phoneInputHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  expand(index) {
    this.personalComment = '';
  }
}
