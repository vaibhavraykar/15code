import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomerServicesService } from 'src/app/modules/customer/services/customer-services.service';

@Component({
  selector: 'app-applicant-beneficiary',
  templateUrl: './applicant-beneficiary.component.html',
  styleUrls: ['./applicant-beneficiary.component.scss']
})
export class ApplicantBeneficiaryComponent implements OnInit,OnChanges{

  @Input() product:any;
  @Input() subscriberType:any;
  @Input() edit: any='';
  @Input() applicantBeneficiaryDataInput:any;
  @Output() userType:EventEmitter<any>= new EventEmitter;
  @Output() finsihedApplicantDetails : EventEmitter<any>= new EventEmitter;
  @Output() applicantBeneficiaryData : EventEmitter<any>= new EventEmitter;
  @Output() applicantFormValidity : EventEmitter <any> = new EventEmitter;

  emailValidation = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  subsidiaryID:any;
  userDetails:any;

  applicantGroupcompanyOptions:any;
  beneficiaryGroupcompanyOptions:any;
  applicantCountryOptions:any;
  beneficiaryCountryOptions:any;
  beneficiarybankCountryOptions:any;
  issuingbankCountryOptions:any;

  countries:any=[];
  groupCompanies:any=[];
  data:any;
  selectedType:string="Applicant";
  applicantBenificiaryFormValid:boolean= false;

  form!:FormGroup;


  constructor(
    private apiService:ApiService,
    private customerService:CustomerServicesService,
  ){}

  ngOnInit(): void {
    console.log(this.applicantBeneficiaryDataInput);
    console.log(JSON.parse(localStorage.getItem('groupCompany')));
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    this.applicantGroupcompanyOptions = this.groupCompanies?.businessDetails;
    this.beneficiaryGroupcompanyOptions = this.groupCompanies?.businessDetails;
    this.subsidiaryID=this.groupCompanies?.businessDetails[0].id;
    if(this.applicantBeneficiaryDataInput){
      this.selelctType({value:this.applicantBeneficiaryDataInput.userType?this.applicantBeneficiaryDataInput.userType:this.selectedType});
    }
    // console.log(JSON.parse(localStorage.getItem('userDetails')))
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.apiService.getAllCountryCode().subscribe((res:any)=>{
      // console.log(res.data[0].countryNames);
      this.countries=res.data[0].countryNames.map(item=>{
        if(item.includes('\n')){
          // console.log(item);
          item=item.replace('\n','');
          return item
        }
        else{
          return item
        }
      });
      // console.log(this.countries);
      this.applicantCountryOptions = this.countries;
      this.beneficiaryCountryOptions = this.countries;
      this.beneficiarybankCountryOptions = this.countries;
      this.issuingbankCountryOptions = this.countries;
    });
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    //   console.log(this.groupCompanies);
    //   this.applicantGroupcompanyOptions = this.groupCompanies.businessDetails;
    //   this.beneficiaryGroupcompanyOptions = this.groupCompanies.businessDetails;
    //   console.log(this.groupCompanies.businessDetails[0].id);
    //   this.subsidiaryID=this.groupCompanies.businessDetails[0].id;
    //   console.log(this.subsidiaryID);
    // })
    // console.log(this.product);
    if(this.product){
      console.log(this.product)
      if(this.product=='BILLAVALISATION'){
        console.log(this.product)
        this.selectedType=='Beneficiary';
        this.userType.emit(this.selectedType.toUpperCase())
      }
      else{
        this.userType.emit(this.selectedType.toUpperCase())
      }
      this.createForm();
    }
  }

  ngOnChanges(e:SimpleChanges): void {
    // console.log(e)
    if(e){
      this.product=e['product'].currentValue;
      console.log(e,'Changes in prduct')
      this.createForm();
    }
  }

  createForm(){
    if(this.product!='BILLAVALISATION'&&this.selectedType=='Applicant' && this.subscriberType!='BANK'){
      console.log("Entering general Form Creation")
      console.log(this.groupCompanies?.businessDetails);
      this.form= new FormGroup({
        selecteduserType:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.userType:this.selectedType,[Validators.required]),
        // Applicant Details
        applicantCountryName: new FormControl(this.userDetails?this.userDetails?.country:'',[Validators.required]),
        // applicantGroupCompany:new FormControl(this.groupCompanies?.businessDetails?this.groupCompanies?.businessDetails[0]?.companyName:'',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]+')]),
        applicantGroupCompany:new FormControl(this.applicantBeneficiaryDataInput?this.getGroupCompanyFromID(this.applicantBeneficiaryDataInput.subsidaryId):(this.groupCompanies?.businessDetails?this.groupCompanies?.businessDetails[0]?.companyName:''),[Validators.required]),
        // Beneficiary Details
        beneficiaryCountryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneCountry:'',[Validators.required]),
        beneficiaryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneName:'',[Validators.required,Validators.maxLength(25)]),
        beneficiaryContactPerson:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneContactPerson:'',[Validators.required,Validators.maxLength(25)]),
        beneficiaryContactPersonEmail:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneContactPersonEmail:'',[Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        // Beneficiary Bank Details
        beneficiaryBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneSwiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        beneficiaryBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankCountry:'',[Validators.required]),
        beneficiaryBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankName:'',[Validators.required,Validators.maxLength(25)]),
        // Issuing Bank Details
        issuingBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.swiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        issuingBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceCountry:'',[Validators.required]),
        issuingBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceBank:'',[Validators.required,Validators.maxLength(25)]),
        issuingBankBranch:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceBranch:'',[Validators.required,Validators.pattern('[a-zA-Z() ]+')])

      })
    }
    else if(this.product!='BILLAVALISATION'&&this.selectedType!='Applicant' && this.subscriberType!='BANK'){
      console.log("Entering general Form Beneficiary Creation")
      console.log(this.groupCompanies?.businessDetails);
      this.form= new FormGroup({
        selecteduserType:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.userType:this.selectedType,[Validators.required]),
        // Applicant Details
        applicantCountryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantCountry:'',[Validators.required]),
        applicantName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantName:'',[Validators.required,Validators.maxLength(25)]),
        applicantContactPerson:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantContactPerson:'',[Validators.required,Validators.maxLength(25)]),
        applicantContactPersonEmail:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantContactPersonEmail:'',[Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        // Beneficiary Details
        beneficiaryCountryName: new FormControl(this.userDetails?this.userDetails?.country:'',[Validators.required]),
        // beneficiaryGroupCompany:new FormControl(this.groupCompanies?.businessDetails?this.groupCompanies?.businessDetails[0].companyName:'',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]+')]),
        beneficiaryGroupCompany:new FormControl(this.applicantBeneficiaryDataInput?this.getGroupCompanyFromID(this.applicantBeneficiaryDataInput.subsidaryId):(this.groupCompanies?.businessDetails?this.groupCompanies?.businessDetails[0].companyName:''),[Validators.required]),
        // Beneficiary Bank Details
        beneficiaryBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneSwiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        beneficiaryBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankCountry:'',[Validators.required]),
        beneficiaryBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankName:'',[Validators.required,Validators.maxLength(25)]),
        // Issuing Bank Details
        issuingBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.swiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        issuingBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceCountry:'',[Validators.required]),
        issuingBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceBank:'',[Validators.required,Validators.maxLength(25)]),
        issuingBankBranch:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceBranch:'',[Validators.required])

      })
    }
    else if(this.subscriberType=='BANK'){
      this.form= new FormGroup({
        selecteduserType:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.userType:this.selectedType,[]),
        // Applicant Details
        applicantCountryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantCountry:'',[Validators.required]),
        applicantName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantName:'',[Validators.required,Validators.maxLength(25)]),
        applicantContactPerson:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantContactPerson:'',[Validators.required,Validators.maxLength(25)]),
        applicantContactPersonEmail:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantContactPersonEmail:'',[Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        // Beneficiary Details
        beneficiaryCountryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneCountry:'',[Validators.required]),
        beneficiaryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneName:'',[Validators.required,Validators.maxLength(25)]),
        beneficiaryContactPerson:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneContactPerson:'',[Validators.required,Validators.maxLength(25)]),
        beneficiaryContactPersonEmail:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneContactPersonEmail:'',[Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        // Beneficiary Bank Details
        beneficiaryBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneSwiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        beneficiaryBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankCountry:'',[Validators.required]),
        beneficiaryBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankName:'',[Validators.required,Validators.maxLength(25)]),
        // Issuing Bank Details
        issuingBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.swiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        issuingBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceCountry:'',[Validators.required]),
        issuingBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceBank:'',[Validators.required,Validators.maxLength(25)]),
        issuingBankBranch:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceBranch:'',[Validators.required])

      })
    }
    else{
      console.log("Entering avalisation Form Creation")
      this.form= new FormGroup({
        selecteduserType:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.userType:'Beneficiary',[Validators.required]),
        // Applicant Details
        applicantCountryName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantCountry:'',[Validators.required]),
        applicantName: new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantName:'',[Validators.required,Validators.maxLength(25)]),
        applicantContactPerson:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantContactPerson:'',[Validators.required]),
        applicantContactPersonEmail:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantContactPersonEmail:'',[Validators.required, Validators.pattern(this.emailValidation), NoWhitespaceValidator()]),
        // Beneficiary Details
        beneficiaryCountryName: new FormControl(this.userDetails?this.userDetails?.country:'',[Validators.required]),
        // beneficiaryGroupCompany:new FormControl(this.groupCompanies?.businessDetails?this.groupCompanies?.businessDetails[0].companyName:'',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]+')]),
        beneficiaryGroupCompany:new FormControl(this.applicantBeneficiaryDataInput?this.getGroupCompanyFromID(this.applicantBeneficiaryDataInput.subsidaryId):(this.groupCompanies?.businessDetails?this.groupCompanies?.businessDetails[0].companyName:''),[Validators.required]),
        // Beneficiary Bank Details
        beneficiaryBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneSwiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        beneficiaryBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankCountry:'',[Validators.required]),
        beneficiaryBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.beneBankName:'',[Validators.required,Validators.maxLength(25)]),
        // Issuing Bank Details
        issuingBankSwiftCode:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.swiftCode:'',[Validators.required,Validators.pattern('[0-9a-zA-Z]+'),Validators.minLength(8),Validators.maxLength(11)]),
        issuingBankCountry:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.lCIssuanceCountry:'',[Validators.required]),
        // Avalising Bank Details
        issuingBankName:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantCountry:'',[Validators.required]),
        issuingBankBranch:new FormControl(this.applicantBeneficiaryDataInput?this.applicantBeneficiaryDataInput.applicantCountry:'',[Validators.required])

      })
    }
    if(this.edit==='edit'){
      this.form.controls['issuingBankCountry'].disable();
    }
  }

  // Get Group Company From subsidaryId
  getGroupCompanyFromID(id:any){
    let company = this.groupCompanies?.businessDetails?.find((item:any)=>item.id==id);
    return company?.companyName;
  }

  // Saves User Type - Applicant/Beneficiary and creates Form
  selelctType(e:any){
    console.log(e)
    this.selectedType=e.value;
      this.createForm();
    this.form.controls['selecteduserType'].setValue(this.selectedType);
      this.userType.emit(this.selectedType?.toUpperCase())
      if(this.selectedType==='Applicant'){
        this.form.patchValue({
          'beneficiaryCountryName':'',
          'beneficiaryName':'',
          'beneficiaryContactPerson':'',
          'beneficiaryContactPersonEmail':'',
          'applicantGroupCompany':''
        });
      }
      else{
        this.form.patchValue({
          'applicantCountryName':'',
          'applicantName':'',
          'applicantContactPerson':'',
          'applicantContactPersonEmail':'',
          'beneficiaryGroupCompany':''
        });
      }
  }

  // Function for Applicant Country Autocomplete
  applicantCountryChange(e:any){
    if (e.target.value === '') {
      this.applicantCountryOptions = this.countries;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.applicantCountryOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  // Function for group Country Autocomplete
  applicantGroupCompanyChange(e:any){
    if (e.target.value === '') {
      this.applicantGroupcompanyOptions = this.groupCompanies.businessDetails;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.applicantGroupcompanyOptions = this.groupCompanies.businessDetails.filter((option) =>
        option.companyName.toLowerCase().includes(filterValue1)
      );
    }
  }

  applicantGroupCompanySelected(e:any){
    console.log(this.groupCompanies.businessDetails)
    console.log(e.option.value)
    this.subsidiaryID=this.groupCompanies.businessDetails.find((item:any)=>
      item.companyName.toLowerCase()==e.option.value.toLowerCase()
    )?.id
    console.log(this.subsidiaryID);
  }

  // Funciton for beneficiary group company Autocomplete
  beneficiaryGroupCompanyChange(e:any){
    if (e.target.value === '') {
      this.beneficiaryGroupcompanyOptions = this.groupCompanies.businessDetails;
    } else {
      // console.log(e);
      const filterValue1 = e.target.value.toLowerCase();

      this.beneficiaryGroupcompanyOptions = this.groupCompanies.businessDetails.filter((option) =>
        option.companyName.toLowerCase().includes(filterValue1)
      );
    }
  }

  // Funciton to get the id from the selected Group Company
  beneficiaryGroupCompanySelected(e:any){
    console.log(e.option.value);
    this.subsidiaryID=this.groupCompanies.businessDetails.find((item:any)=>
      e.option.value.toLowerCase()===item.companyName.toLowerCase()
      )?.id;
      console.log(this.subsidiaryID);
  }

  // Function for Beneficiary Country Autocomplete
  beneficiaryCountryChange(e:any){
    if (e.target.value === '') {
      this.beneficiaryCountryOptions = this.countries;
    } else {
      const filterValue1 = e.target.value.toLowerCase();

      this.beneficiaryCountryOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  // Function for Beneficiary Bank Country Autocomplete
  beneficiarybankCountryChange(e:any){
    if (e.target.value === '') {
      this.beneficiarybankCountryOptions = this.countries;
    } else {
      const filterValue1 = e.target.value.toLowerCase();

      this.beneficiarybankCountryOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }

  // Function for Issuibg Bank Country Autocomplete
  issuingbankCountryChange(e:any){
    if (e.target.value === '') {
      this.issuingbankCountryOptions = this.countries;
    } else {
      const filterValue1 = e.target.value.toLowerCase();

      this.issuingbankCountryOptions = this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue1)
      );
    }
  }


  proceed(){
    console.log(this.form,'----')
    this.applicantFormValidity.emit(this.form.valid);

    this.applicantBenificiaryFormValid = this.form.valid;
    console.log(this.form.controls)
    console.log(this.form.controls['selecteduserType'].value);
    // if(this.form.valid){
      if(this.product!='BILLAVALISATION'&&this.selectedType=='Applicant' && this.subscriberType!='BANK'){
        console.log("Entering Applicant type")
        this.data={
          "selector":this.product,
          "requirementType":this.product,
          "userType":this.form.controls['selecteduserType'].value,
          // Applicant Details
          // "applicantContactPerson":null,
          "applicantName":this.form.value.applicantGroupCompany,
          // "applicantContactPersonEmail":null,
          "applicantCountry":this.form.controls['applicantCountryName'].value,
          // Group Company Details
          "subsidaryId":this.subsidiaryID,
          // Beneficiary Details
          "beneCountry":this.form.controls['beneficiaryCountryName'].value,
          "beneName":this.form.controls['beneficiaryName'].value,
          "beneContactPerson":this.form.controls['beneficiaryContactPerson'].value,
          "beneContactPersonEmail":this.form.controls['beneficiaryContactPersonEmail'].value,
          // Benficiary Bank Details
          "beneSwiftCode":this.form.controls['beneficiaryBankSwiftCode'].value,
          "beneBankCountry":this.form.controls['beneficiaryBankCountry'].value,
          "beneBankName":this.form.controls['beneficiaryBankName'].value,
          // Issuing Details
          "swiftCode":this.form.controls['issuingBankSwiftCode'].value,
          "lCIssuanceCountry":this.form.controls['issuingBankCountry'].value,
          "lCIssuanceBank":this.form.controls['issuingBankName'].value,
          "lCIssuanceBranch":this.form.controls['issuingBankBranch'].value,
        }
      }
      else if(this.product!='BILLAVALISATION'&&this.selectedType!='Applicant' && this.subscriberType!='BANK'){
        console.log("Entering beneficiary type")
        this.data={
          "selector":this.product,
          "requirementType":this.product,
          "userType":this.selectedType,
          // Applicant Details
          "applicantCountry":this.form.controls['applicantCountryName'].value,
          "applicantName":this.form.controls['applicantName'].value,
          "applicantContactPerson":this.form.controls['applicantContactPerson'].value,
          "applicantContactPersonEmail":this.form.controls['applicantContactPersonEmail'].value,
          // Group Company Details
          "subsidaryId":this.subsidiaryID,
          // Beneficiary Details
          "beneCountry":this.form.controls['beneficiaryCountryName'].value,
          "beneName":this.form.value.beneficiaryGroupCompany,
          // "beneContactPerson":null,
          // "beneContactPersonEmail":null,
          // Benficiary Bank Details
          "beneSwiftCode":this.form.controls['beneficiaryBankSwiftCode'].value,
          "beneBankCountry":this.form.controls['beneficiaryBankCountry'].value,
          "beneBankName":this.form.controls['beneficiaryBankName'].value,
          // Issuing Details
          "swiftCode":this.form.controls['issuingBankSwiftCode'].value,
          "lCIssuanceCountry":this.form.controls['issuingBankCountry'].value,
          "lCIssuanceBank":this.form.controls['issuingBankName'].value,
          "lCIssuanceBranch":this.form.controls['issuingBankBranch'].value,
        }
      }
      else if(this.subscriberType=='BANK'){
        console.log("Entering Bank type")
        this.data={
          "selector":this.product,
          "requirementType":this.product,
          "userType":this.selectedType,
          // Applicant Details
          "applicantCountry":this.form.controls['applicantCountryName'].value,
          "applicantName":this.form.controls['applicantName'].value,
          "applicantContactPerson":this.form.controls['applicantContactPerson'].value,
          "applicantContactPersonEmail":this.form.controls['applicantContactPersonEmail'].value,
          // Beneficiary Details
          "beneCountry":this.form.controls['beneficiaryCountryName'].value,
          "beneName":this.form.controls['beneficiaryName'].value,
          "beneContactPerson":this.form.controls['beneficiaryContactPerson'].value,
          "beneContactPersonEmail":this.form.controls['beneficiaryContactPersonEmail'].value,
          // Benficiary Bank Details
          "beneSwiftCode":this.form.controls['beneficiaryBankSwiftCode'].value,
          "beneBankCountry":this.form.controls['beneficiaryBankCountry'].value,
          "beneBankName":this.form.controls['beneficiaryBankName'].value,
          // Issuing Details
          "swiftCode":this.form.controls['issuingBankSwiftCode'].value,
          "lCIssuanceCountry":this.form.controls['issuingBankCountry'].value,
          "lCIssuanceBank":this.form.controls['issuingBankName'].value,
          "lCIssuanceBranch":this.form.controls['issuingBankBranch'].value,
        }
      }
      else{
        console.log("Entering avaliding type")
        this.data={
          "selector":this.product,
          "requirementType":this.product,
          "userType":'Beneficiary',
          // Applicant Details
          "applicantCountry":this.form.controls['applicantCountryName'].value,
          "applicantName":this.form.controls['applicantName'].value,
          "applicantContactPerson":this.form.controls['applicantContactPerson'].value,
          "applicantContactPersonEmail":this.form.controls['applicantContactPersonEmail'].value,
          "beneName":this.form.value.beneficiaryGroupCompany,
          // Group Company Details
          "subsidaryId":this.subsidiaryID,
          // Beneficiary Details
          "beneCountry":this.form.controls['beneficiaryCountryName'].value,
          // Benficiary Bank Details
          "beneSwiftCode":this.form.controls['beneficiaryBankSwiftCode'].value,
          "beneBankCountry":this.form.controls['beneficiaryBankCountry'].value,
          "beneBankName":this.form.controls['beneficiaryBankName'].value,
          // Issuing Details
          "swiftCode":this.form.controls['issuingBankSwiftCode'].value,
          "lCIssuanceCountry":this.form.controls['issuingBankCountry'].value,
          "lCIssuanceBank":this.form.controls['issuingBankName'].value,
          "lCIssuanceBranch":this.form.controls['issuingBankBranch'].value,
        }
      }
      console.log(this.data)
      this.applicantBeneficiaryData.emit(this.data);
      this.finsihedApplicantDetails.emit(true);
    // }
  }

  checkAutocomplteExists(e:any,formName:any) {
    console.log(e.target.value,formName);
    let formValue = this.form.controls[formName].value;
    console.log(formValue);
    if(
      formName=='applicantCountryName' ||
      formName=='beneficiaryCountryName' ||
      formName=='beneficiaryBankCountry' ||
      formName=='issuingBankCountry'
      ) {
      let isExists = this.countries.find((ele: any) => {
        console.log(ele.toLowerCase() === formValue?.toLowerCase())
        return ele.toLowerCase() === formValue?.toLowerCase();
      });
      if(isExists){
        console.log(this.countries.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase()));
        this.form.controls[formName].setValue(this.countries.find((ele: any) =>ele.toLowerCase() === formValue?.toLowerCase()));
        this.form.controls[formName].setErrors(null);
      }
      else{
        this.form.controls[formName].setErrors({ required: true });
      }
    }
    if(formName=='applicantGroupCompany') {
      let isExists = this.groupCompanies.businessDetails.find((ele: any) => {
        console.log(ele.companyName.toLowerCase() === formValue?.toLowerCase())
        return ele.companyName.toLowerCase() === formValue?.toLowerCase();
      });
      if(isExists){
        console.log(this.groupCompanies.businessDetails.find((ele: any) =>ele.companyName.toLowerCase() === formValue?.toLowerCase()));
        this.form.controls[formName].setValue(this.groupCompanies.businessDetails.find((ele: any) =>ele.companyName.toLowerCase() === formValue?.toLowerCase()).companyName);
        this.applicantGroupCompanySelected({option:{value:this.groupCompanies.businessDetails.find((ele: any) =>ele.companyName.toLowerCase() === formValue?.toLowerCase()).companyName}})
        this.form.controls[formName].setErrors(null);
      }
      else{
        this.form.controls[formName].setErrors({ required: true });
      }
    }
    if(formName=='beneficiaryGroupCompany') {
      let isExists = this.groupCompanies.businessDetails.find((ele: any) => {
        console.log(ele.companyName.toLowerCase() === formValue?.toLowerCase())
        return ele.companyName.toLowerCase() === formValue?.toLowerCase();
      });
      if(isExists){
        console.log(this.groupCompanies.businessDetails.find((ele: any) =>ele.companyName.toLowerCase() === formValue?.toLowerCase()));
        this.form.controls[formName].setValue(this.groupCompanies.businessDetails.find((ele: any) =>ele.companyName.toLowerCase() === formValue?.toLowerCase()).companyName);
        this.beneficiaryGroupCompanySelected({option:{value:this.groupCompanies.businessDetails.find((ele: any) =>ele.companyName.toLowerCase() === formValue?.toLowerCase()).companyName}})
        this.form.controls[formName].setErrors(null);
      }
      else{
        this.form.controls[formName].setErrors({ required: true });
      }
    }
  }

}


export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): any => {
      window.setTimeout(() => {
          if (control.value && control.value != '') {
              let trimedvalue = control.value.replace(/\s/g, '');
              control.setValue(trimedvalue);
          }
      }, 10);
  };
}
