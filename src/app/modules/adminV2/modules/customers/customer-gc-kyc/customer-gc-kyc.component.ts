import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';

@Component({
  selector: 'app-customer-gc-kyc',
  templateUrl: './customer-gc-kyc.component.html',
  styleUrls: ['./customer-gc-kyc.component.scss']
})
export class CustomerGCKycComponent {

  routelocation: any;
  panelOpenState: Number;
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
  form : FormGroup;
  myRights:any;
  orderType:any;
  step: Number;
  isOpened:boolean;
  stepFinancial:Number;
  constructor(private customerService: CustomerService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
    private router: Router, private fb: FormBuilder) {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    this.routelocation = this.location
    this.userId = this.route.snapshot.paramMap.get('id');
    this.orderType = localStorage.getItem('clickGroupCompany');
    // this.customerService.clickGroupCompany.subscribe(res => {
    //   this.orderType = res;
    // })
    this.getCustomerData();
    this.financial = fb.group({
      userId: [''],
      mid:[''],
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
    this.createForm();
    this.getpreferredBankList();
  }
  createForm() {
    this.form = new FormGroup({
      newBankListControl: new FormControl([]),
    });
  }
  getCustomerData() {
    this.data=[];
    const finaldata={
      id:this.userId,
      status:this.orderType
    }
    this.customerService.getGcKyc(finaldata).subscribe((res: any) => {
      if (res) {
        this.data = res.data;
        // Business document list
        if (this.data?.kycDetails?.[0]) {
          this.data.kycDetails[0].documentList = this.data?.kycDetails?.[0]?.documentList?.sort((a, b) => b.id - a.id);
        }
        if (this.data?.kycDetails?.[1]) {
          this.data.kycDetails[1].documentList = this.data?.kycDetails?.[1]?.documentList?.sort((a, b) => b.id - a.id);
        }
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
  kycBusinessAction(id, kycName, status, kycId,mid) {
    const data = {
      id: id,
      comment: this.businessComment,
      status: status,
      approvedType: "MAKER",
      documentType: kycName,
      kycId: kycId,
      mid:mid
    }
    console.log(data);
    if (this.businessComment) {
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
        this.customerService.makerGCKycAction(data).subscribe((res => {
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
            this.businessComment='';
            setTimeout(() => {
              if(this.data == undefined){
                this.router.navigateByUrl('adminv2/customer/list');
              }
            }, 2000);
          }
        }))
      }})
  }
  comment(kycName) {
      if (this.businessComment) {
        this.showAcceptRejectBusiness = false;
      } else {
        this.showAcceptRejectBusiness = true;
      }
  }
  phoneInputHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  saveFinancialForCustomer(id,mid) {
    this.financial.get('userId').setValue(id);
    this.financial.get('mid').setValue(mid);
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
          this.resetForm();
        }
      })
    }
  }
  saveFinancialForBank(id,mid) {
    this.financial.get('userId').setValue(id);
    this.financial.get('mid').setValue(mid);
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
        preferredBanks: newIdList,
        mid:mid
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
          this.resetForm();
        }
      })
    }
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
    this.customerService.uploadPreferredBankFileForGc(id, this.formData).subscribe((res: any) => {
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
  resetForm() {
    this.financial.reset();
  }
  expand(index){
    this.form.controls['newBankListControl'].setValue([]);
    this.businessComment='';
    // this.resetForm();
    for(let i = 0; i<= this.data.length ; i++){
      this.newBankList = this.data[index].businessDetails.preferredBanks;
      const newObs = []
      this.newBankList.forEach((e) => {
        if (e) {
          newObs.push(e.bankName)
        } else {
          newObs.push(undefined);
        }
      })
      this.form.controls['newBankListControl'].setValue(newObs);
      if(this.data[index].businessDetails.customerTurnover){
        this.financial.patchValue({
          customerTurnover: this.data[index].businessDetails.customerTurnover,
          importVolume: this.data[index].businessDetails.importVolume,
          exportVolume: this.data[index].businessDetails.exportVolume,
          estimatedYearlyLcVolume: this.data[index].businessDetails.estimatedYearlyLcVolume,
          banksUsedCurrentlyForLcIssuance: this.data[index].businessDetails.banksUsedCurrentlyForLcIssuance,
        })
      }
    }
    console.log(this.financial);
  }
}
