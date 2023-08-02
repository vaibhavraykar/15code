import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';

@Component({
  selector: 'app-customer-kyc',
  templateUrl: './customer-kyc.component.html',
  styleUrls: ['./customer-kyc.component.scss']
})
export class CustomerKycComponent {

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
  makerDate: any;
  checkerDate: any;
  bsnsmakerDate: any;
  bsnscheckerDate: any;
  constructor(private customerService: CustomerService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
    private router: Router, private fb: FormBuilder) {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.routelocation = this.location
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getCustomerData();
    this.financial = fb.group({
      userId: [''],
      customerTurnover: ['', [Validators.required]],
      importVolume: ['', [Validators.required]],
      exportVolume: ['', [Validators.required]],
      estimatedYearlyLcVolume: ['', [Validators.required]],
      banksUsedCurrentlyForLcIssuance: ['', [Validators.required]],
      // preferredBanks: ['', [Validators.required]],
      // otherPreferredBank:['']
    })
  }
  ngOnInit() {
    this.sourceList();
    this.getpreferredBankList();
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      newBankListControl: new FormControl([], [Validators.required]),
    });
  }
  getCustomerData() {
    this.customerService.getCustomerById(this.userId).subscribe((res: any) => {
      if (res) {
        this.data = res.data[0];
        console.log(this.data);
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
            this.getCustomerData();
          }
        }))
      }})
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
  saveFinancialForCustomer(id) {
    this.financial.get('userId').setValue(id);
    // if (this.editedBankList) {
    //   this.financial.get('preferredBanks').setValue(this.editedBankList)
    // }
    console.log(this.financial, 'financial group');
    if (this.financial.status == 'VALID') {
      this.customerService.updateFinancial(this.financial.value).subscribe((res: any) => {
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
      })
    }
  }
  saveFinancialForBank(id) {
    this.financial.get('userId').setValue(id);
   const newIdList=[];
    this.preferredBankList.forEach(element => {
      this.form.controls['newBankListControl'].value.forEach(ele => {
        if(element.bankName == ele){
          newIdList.push(element.id);
        }
        });
    });
    if (newIdList.length>0) {
      const data = {
        userId: id,
        preferredBanks: newIdList
      }
      this.customerService.updateFinancial(data).subscribe((res: any) => {
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
      })
    }
  }
  resetForm() {
    this.financial.reset();
  }
  upload(event) {
    this.fileuploaded = true;
    const selectedFiles = event.target.files;
    // console.log(selectedFiles);
    const file: File | null = selectedFiles.item(0);
    this.currentFile = file;
    // console.log(this.currentFile)
    const formdata = new FormData();
    this.myfilename = this.currentFile.name;
    formdata.append('file', this.currentFile, this.currentFile.name);
    this.formData = formdata
  }
  uploadPreferredFile(id) {
    this.customerService.uploadPreferredBankFile(id, this.formData).subscribe((res: any) => {
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
        this.fileuploaded = false;
        this.attachment.nativeElement.value = '';
      }
    })
  }
  getpreferredBankList() {
    this.customerService.getPreferredBankList().subscribe((res: any) => {
      this.preferredBankList = res.data;
    })
  }
  selectAll(e) {
    // for testing
    this.selectallCountry = e;
    // console.log(e);
    var onlyAll = ['All'];
    e ? (this.newBankList = onlyAll.concat(this.preferredBankList.map(x => x.id))) : this.newBankList = [];
    this.editedBankList = this.newBankList ? (this.newBankList.slice(1)) : this.newBankList;
  }
  downloadSample() {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.excelfileName);
  }
  removeSelectedFile() {
    this.fileuploaded = false;
    this.attachment.nativeElement.value = '';
  }
  //  For testing chips
  onCatRemoved(cat: string) {
    const categories = this.form.controls['newBankListControl'].value as string[];
    this.removeFirst(categories, cat);
    this.form.controls['newBankListControl'].setValue(categories); // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  numberonly(event): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const decimalCount = inputValue.split('.').length - 1;
    if (charCode === 46 && decimalCount === 0) {
        return true;
    }

    if (charCode >= 48 && charCode <= 57) {
        return true;
    }
    return false;
  }
}
