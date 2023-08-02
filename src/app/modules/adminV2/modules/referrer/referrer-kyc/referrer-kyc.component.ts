import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-referrer-kyc',
  templateUrl: './referrer-kyc.component.html',
  styleUrls: ['./referrer-kyc.component.scss']
})
export class ReferrerKycComponent {

  routelocation: any;
  panelOpenState: boolean;
  financialpanelOpenState: boolean;
  businesspanelOpenState: boolean;
  bankpanelOpenState: boolean;
  userId: any;
  data: any = [];
  selectedRm: any;
  selectedSource: any;
  preferredBankList: any = [];
  selectallCountry: boolean;
  newBankList: any;
  editedBankList: any;
  currentFile?: File;
  formData = new FormData();
  excelfileName = 'ExcelSheet.csv';
  kycApprove: boolean = false;
  @ViewChild('UploadFileInput') attachment: any;
  fileuploaded: boolean;
  rmList: any = [];
  sourceComment: any;
  showSourceComment: boolean = false;
  otherSource: any;
  personalComment: any = '';
  businessComment: any = '';
  financial: FormGroup;
  showAcceptRejectPersonal: boolean = true;
  showAcceptRejectBusiness: boolean = true;
  allSourceList: any = [];
  myfilename: string;
  form!: FormGroup;
  myRights:any;
  constructor(private customerService: CustomerService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
    private router: Router, private fb: FormBuilder) {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.routelocation = this.location
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getCustomerData();
  }
  ngOnInit() {
    this.sourceList();
  }
  getCustomerData() {
    this.customerService.getCustomerById(this.userId).subscribe((res: any) => {
      if (res) {
        this.data = res.data[0];
        if (this.data.businessDetails.sourceList) {
          this.selectedSource = this.data.businessDetails?.sourceList;
        }
        if (this.data.businessDetails.rmUser) {
          this.selectedRm = this.data.businessDetails.rmUser.id;
        }
        if (this.data.businessDetails.preferredBanks) {
          this.newBankList = this.data.businessDetails.preferredBanks;
          const newObs = []
          this.newBankList.forEach((e) => {
            if (e) {
              newObs.push(e.bankName)
            } else {
              newObs.push(undefined);
            }
          })
          this.form.setValue({newBankListControl : newObs});
          this.financial.patchValue({
            customerTurnover: this.data.businessDetails.customerTurnover,
            importVolume: this.data.businessDetails.importVolume,
            exportVolume: this.data.businessDetails.exportVolume,
            estimatedYearlyLcVolume: this.data.businessDetails.estimatedYearlyLcVolume,
            banksUsedCurrentlyForLcIssuance: this.data.businessDetails.banksUsedCurrentlyForLcIssuance,
            // preferredBanks:this.newBankList,
          })
        }
        const kycDetails = this.data?.kycDetails;
        //in case only one kyc is there
        // 0 index = Business
        if (kycDetails?.length == 1) {
          if (kycDetails?.[0].documentType == 'BUSINESS') {
            kycDetails?.splice(1, 0, undefined); //add undefined on 0 index if only business kyc is there 
          }else{
            kycDetails?.splice(0, 0, undefined); //add undefined on 1 index if only personal kyc is there
          }
        }
        // for latest record
        if (this.data?.kycDetails?.[0]) {
          this.data.kycDetails[0].documentList = this.data?.kycDetails?.[0]?.documentList?.sort((a, b) => b.id - a.id);
        }
        if (this.data?.kycDetails?.[1]) {
          this.data.kycDetails[1].documentList = this.data?.kycDetails?.[1]?.documentList?.sort((a, b) => b.id - a.id);
        }
        this.getRmList();
      }
    });
  }
  getRm(event) {
    this.selectedRm = event.value;
  }
  getRmList() {
    if(this.data?.personalDetails?.country){
      const country = this.data?.personalDetails?.country;
      const data = {
        countryName: country?.[0].toUpperCase() + country.slice(1).toLowerCase(),
        subscriberType: this.data.personalDetails.subscriberType
      }
      this.customerService.getAllRmList(data).subscribe((res: any) => {
        this.rmList = res.data[0];
      })
    }
  }
  getSource(event) {
    this.selectedSource = event.value.sourceName;
    this.otherSource = '';
    this.personalComment = '';
    if (this.selectedSource == 'OTHERS ' || this.selectedSource == 'SA DESK') {
      this.showSourceComment = true;
    } else {
      this.showSourceComment = false;
    }
  }
  sourceList() {
    this.customerService.getSourceList().subscribe((res: any) => {
      this.allSourceList = res.data;
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
  kycBusinessAction(id, kycName, status, kycId) {
    const data = {
      id: id,
      comment: this.businessComment,
      status: status,
      approvedType: "MAKER",
      documentType: kycName,
      kycId: kycId
    }
    if (this.businessComment) {
      this.kyc(data);
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
      disableClose:true
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
            disableClose:true
          });
          if (res['success'] == true) {
            this.getCustomerData();
          }
        }))
      }})
  }
  comment(kycName) {
    if (kycName == 'PERSONAL') {
      if (this.personalComment) {
        this.showAcceptRejectPersonal = false;
      } else {
        this.showAcceptRejectPersonal = true;
      }
    } else {
      if (this.businessComment) {
        this.showAcceptRejectBusiness = false;
      } else {
        this.showAcceptRejectBusiness = true;
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

}
