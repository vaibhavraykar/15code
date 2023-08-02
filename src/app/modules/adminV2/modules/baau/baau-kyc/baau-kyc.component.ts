import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-baau-kyc',
  templateUrl: './baau-kyc.component.html',
  styleUrls: ['./baau-kyc.component.scss']
})
export class BaauKycComponent {

  routelocation: any;
  panelOpenState: boolean;
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
  masterRatingList:any=[];
  agencyList:any=[];
  masterRatingDropdown:boolean=false;
  selectedAgency:any;
  selectedMasterRating:any;
  myRights:any;
  makerDate: any;
  checkerDate: any;
  bsnsmakerDate: any;
  bsnscheckerDate: any;
  constructor(private customerService: CustomerService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
    private router: Router, private fb: FormBuilder) {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.routelocation = this.location
    this.userId = this.route.snapshot.paramMap.get('id');
    this.financial = fb.group({
      userId: [''],
      customerTurnover: ['', [Validators.required]],
      importVolume: ['', [Validators.required]],
      exportVolume: ['', [Validators.required]],
      estimatedYearlyLcVolume: ['', [Validators.required]],
      banksUsedCurrentlyForLcIssuance: ['', [Validators.required]],
    })
  }
  ngOnInit() {
    this.getbankData();
    this.sourceList();
    this.getAgencyList();
  }
  getbankData() {
    this.customerService.getCustomerById(this.userId).subscribe((res: any) => {
      this.data = res.data[0];
      const makerepochTime = this.data?.kycDetails?.[1]?.documentList[0]?.makerApprovalDate;
        const mDate = new Date(makerepochTime);
        this.makerDate = mDate.toUTCString();
        const checkerepochTime = this.data?.kycDetails?.[1]?.documentList[0]?.checkerApprovalDate;
        const cDate = new Date(checkerepochTime);
        this.checkerDate = cDate.toUTCString();
        const bsnsmakerepochTime = this.data?.kycDetails?.[0]?.documentList[0]?.makerApprovalDate;
        const bmDate = new Date(bsnsmakerepochTime);
        this.bsnsmakerDate = bmDate.toUTCString();
        const bsnscheckerepochTime = this.data?.kycDetails?.[0]?.documentList[0]?.checkerApprovalDate;
        const bcDate = new Date(bsnscheckerepochTime);
        this.bsnscheckerDate = bcDate.toUTCString();
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
            newObs.push(e.id)
          } else {
            newObs.push(undefined);
          }
        })
        this.newBankList = newObs;
        this.financial.patchValue({
          customerTurnover: this.data.businessDetails.customerTurnover,
          importVolume: this.data.businessDetails.importVolume,
          exportVolume: this.data.businessDetails.exportVolume,
          estimatedYearlyLcVolume: this.data.businessDetails.estimatedYearlyLcVolume,
          banksUsedCurrentlyForLcIssuance: this.data.businessDetails.banksUsedCurrentlyForLcIssuance,
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
      if (this.data.kycDetails) {
        this.data.kycDetails[0].documentList = this.data.kycDetails[0].documentList.sort((a, b) => b.id - a.id);
        this.data.kycDetails[1].documentList = this.data.kycDetails[1].documentList.sort((a, b) => b.id - a.id);
      }
      if( this.data.businessDetails.ratingAgency){
        this.selectedAgency = this.data.businessDetails.ratingAgency;
        this.getMasterRatingList(this.selectedAgency);
        this.selectedMasterRating = this.data.businessDetails.rating;
      }
      this.getRmList();
    });
  }
  getRm(event) {
    this.selectedRm = event.value;
  }
  getRmList() {
    const country = this.data.personalDetails.country;
    const data = {
      countryName: country[0].toUpperCase() + country.slice(1).toLowerCase(),
      subscriberType: this.data.personalDetails.subscriberType
    }
    this.customerService.getAllRmList(data).subscribe((res: any) => {
      this.rmList = res.data[0];
    })
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
    if (this.selectedSource == 'OTHERS ' || this.selectedSource == 'SA DESK') {
      if (this.personalComment && this.otherSource && this.selectedRm && this.selectedSource) {
        const data = {
          id: id,
          comment: this.personalComment,
          status: status,
          approvedType: "MAKER",
          documentType: kycName,
          sourceList: this.selectedSource == 'OTHERS ' ? 'OTHERS' : this.selectedSource,
          otherSource: this.otherSource,
          rmId: this.selectedRm,
          kycId: kycId
        }
        // console.log('with OTHERS',data)
        this.kyc(data);
      }
    } else {
      if (this.personalComment && this.selectedRm && this.selectedSource) {
        const data = {
          id: id,
          comment: this.personalComment,
          status: status,
          approvedType: "MAKER",
          documentType: kycName,
          sourceList: this.selectedSource,
          rmId: this.selectedRm,
          kycId: kycId
        }
        // console.log('without OTHERS',data)
        this.kyc(data);
      }
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
            this.getbankData();
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
 getAgencyList(){
  this.customerService.getAgencyList().subscribe((res:any)=>{
    this.agencyList = res;
  })
 }
 getMasterRatingList(val){
  const data ={
    agency:val
  }
  this.customerService.getMasterRatingList(data).subscribe((res:any)=>{
    this.masterRatingList = res;
  })
 }
 onselectAgency(val){
  if(val.value){
    this.selectedMasterRating = '';
    this.getMasterRatingList(val.value);
    this.masterRatingDropdown = true;
  }
 }
  saveRating(id){
    if(this.selectedMasterRating && this.selectedAgency){
      const data = {
        userId:id,
        rating:this.selectedMasterRating,
        ratingAgency:this.selectedAgency
      }
      this.customerService.updateRating(data).subscribe((res:any)=>{
        // console.log(res);
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
          this.getbankData();
        }
      })
    }
  }
}
