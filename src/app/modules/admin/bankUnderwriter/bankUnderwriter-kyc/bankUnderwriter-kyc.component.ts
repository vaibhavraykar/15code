import { Component ,OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer/customer.service';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-bankUnderwriter-kyc',
  templateUrl: './bankUnderwriter-kyc.component.html',
  styleUrls: ['./bankUnderwriter-kyc.component.scss']
})
export class BankUnderwriterKycComponent implements OnInit{

  userId:any;
  data:any=[];
  rmList:any=[];
  openPanelState=false;
  secondPanelOpenState=false;
  thirdPanelOpenState=false;
  personalComment:any='';
  businessComment:any='';
  sourceComment:any;
  showSourceComment:boolean=false;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;
  imgData: any;
  showAcceptRejectPersonal:boolean=true;
  showAcceptRejectBusiness:boolean=true;
  financial:FormGroup;
  allSourceList:any=[];
  otherSource:any;
  selectedRm:any;
  selectedSource:any;
  preferredBankList:any=[];
  selectallCountry:boolean;
  newBankList: any;
  editedBankList:any;
  currentFile?: File;
  formData=new FormData();
  myRights:any;
  kycApprove:boolean=false;
  masterRatingList:any=[];
  agencyList:any=[];
  masterRatingDropdown:boolean=false;
  selectedAgency:any;
  selectedMasterRating:any;
  constructor(private route:ActivatedRoute,private router:Router,private location:Location,
    private dialog: MatDialog,private customerService:CustomerService, private fb: FormBuilder){
      this.financial= fb.group({
        userId:[''],
        customerTurnover:['',[Validators.required]],
        importVolume:['',[Validators.required]],
        exportVolume:['',[Validators.required]],
        estimatedYearlyLcVolume:['',[Validators.required]],
        banksUsedCurrentlyForLcIssuance:['',[Validators.required]],
        preferredBanks:['',[Validators.required]],
        // otherPreferredBank:['']
      })
  }
  ngOnInit(){
    this.userId=this.route.snapshot.paramMap.get('id');
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    if(this.myRights.includes('KYC_APPROVE')){
      this.kycApprove =  true;
    }else{  
        this.kycApprove = false ;
    }
    this.getUnderwriterData();
    this.sourceList();
    this.getAgencyList();
  }

  getUnderwriterData(){
    this.customerService.getCustomerById(this.userId).subscribe((res:any)=>{
      this.data = res.data[0];
      if(this.data.businessDetails.sourceList)
      {
        this.selectedSource=this.data.businessDetails?.sourceList;
      }
      if(this.data.businessDetails.rmUser){
        this.selectedRm=this.data.businessDetails.rmUser.firstName + this.data.businessDetails.rmUser.firstName;
      }
      if(this.data.businessDetails.preferredBanks){
        this.newBankList = this.data.businessDetails.preferredBanks;
        const newObs = []
        this.newBankList.forEach((e) => {
          if (e) 
          {
            newObs.push(e.id)
          }else{
            newObs.push(undefined);
          }
        })
        this.newBankList = newObs;
        this.financial.patchValue({
        customerTurnover:this.data.businessDetails.customerTurnover,
        importVolume:this.data.businessDetails.importVolume,
        exportVolume:this.data.businessDetails.exportVolume,
        estimatedYearlyLcVolume:this.data.businessDetails.estimatedYearlyLcVolume,
        banksUsedCurrentlyForLcIssuance:this.data.businessDetails.banksUsedCurrentlyForLcIssuance,
        // preferredBanks:this.newBankList,
        })
      }
      if( this.data.businessDetails.ratingAgency){
        this.selectedAgency = this.data.businessDetails.ratingAgency;
        this.getMasterRatingList(this.selectedAgency);
        this.selectedMasterRating = this.data.businessDetails.rating;
      }
      this.getRmList();
    });
  }
  getRmList(){
    const country = this.data.personalDetails.country;
    const data={
      countryName: country[0].toUpperCase() + country.slice(1).toLowerCase(),
      subscriberType:this.data.personalDetails.subscriberType
    }
    this.customerService.getAllRmList(data).subscribe((res:any)=>{
      this.rmList=res.data[0];
    })
  }
  getSource(event){
    this.selectedSource = event.value.sourceName;
    this.otherSource='';
    this.personalComment='';
    if(this.selectedSource == 'OTHERS ' || this.selectedSource == 'SA DESK'){
      this.showSourceComment = true;
    }else{
      this.showSourceComment = false;
    }
  }
  back(): void {
    this.location.back()
  } 
  comment(kycName){
    if(kycName == 'PERSONAL'){
      if(this.personalComment){
        this.showAcceptRejectPersonal = false;
      }else{
        this.showAcceptRejectPersonal = true;
      }
    }else{
      if(this.businessComment){
        this.showAcceptRejectBusiness = false;
      }else{
        this.showAcceptRejectBusiness = true;
      }
    }
  }
  kycBusinessAction(id,kycName,status,kycId){
    const data={
    id: id,
    comment: this.businessComment,
    status: status,
    approvedType: "MAKER",
    documentType: kycName,
    kycId:kycId
    }
    if(this.businessComment){
      this.kyc(data);
    }
  }
  kycPersonalAction(id,kycName,status,kycId){
    if(this.selectedSource == 'OTHERS ' || this.selectedSource == 'SA DESK'){
      if(this.personalComment && this.otherSource && this.selectedRm && this.selectedSource){
        const data={
          id: id,
          comment: this.personalComment,
          status: status,
          approvedType: "MAKER",
          documentType: kycName,
          sourceList: this.selectedSource == 'OTHERS ' ? 'OTHERS' : this.selectedSource,
          otherSource: this.otherSource,
          rmId:this.selectedRm,
          kycId:kycId
        }
        // console.log('with OTHERS',data)
        this.kyc(data);
    }
    }else{
      if(this.personalComment && this.selectedRm && this.selectedSource){
        const data={
          id: id,
          comment: this.personalComment,
          status: status,
          approvedType: "MAKER",
          documentType: kycName,
          sourceList: this.selectedSource,
          rmId:this.selectedRm,
          kycId:kycId
        }
        // console.log('without OTHERS',data)
        this.kyc(data);
      }
    }
  }
  kyc(data){
    this.customerService.makerKycAction(data).subscribe((res=>{
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
        this.getUnderwriterData();
      }
    }))
  }
  viewDocument(data){
    // this.imgData = data;
    // this.dialogRef = this.dialog.open(this.callAPIDialog,{
    //   width: '500px',
    //   height: '400px',
    // });
    window.open(data)
  }
  closeComment(){
    this.dialogRef.close();
  }
  upload(event){    
    const selectedFiles = event.target.files;
    // console.log(selectedFiles);
    const file: File | null = selectedFiles.item(0);
    this.currentFile = file;
    // console.log(this.currentFile)
    const formdata = new FormData();
    formdata.append('file', this.currentFile, this.currentFile.name);
    this.formData=formdata
 }

 sourceList(){
  this.customerService.getSourceList().subscribe((res:any)=>{
    this.allSourceList = res.data;
  })
 }
 getRm(event){
 this.selectedRm=event.value;
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
          this.getUnderwriterData(); 
        }
      })
    }
  }
  resetForm(){
    this.financial.reset();
  }
  phoneInputHandler(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  selectAll(e){
    // for testing 
    this.selectallCountry=e;
    // console.log(e);
    var onlyAll =['All'];
    e ? (this.newBankList  = onlyAll.concat(this.preferredBankList.map(x => x.id))): this.newBankList= [];
    this.editedBankList = this.newBankList ? (this.newBankList.slice(1)): this.newBankList; 
  }
}