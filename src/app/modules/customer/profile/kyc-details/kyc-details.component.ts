import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomerServicesService } from "../../services/customer-services.service";
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from "@angular/material/dialog";
import { CommonPopupComponent } from "src/app/components/common-popup/common-popup.component";
import { Router } from "@angular/router";
import { AuthService } from "src/app/modules/auth/services/auth.service";

@Component({
	selector: "app-kyc-details",
	templateUrl: "./kyc-details.component.html",
	styleUrls: ["./kyc-details.component.scss"],
})
export class KycDetailsComponent implements OnInit{

	countryOptions: any;
	personalDocumentOptions:any;
	businessDocumentOptions:any;
	businessCountryOptions:any;
	personalCountryOptions:any;
	countries:any=[];
	documentTypes:any=[];
	kycForm!:FormGroup;
	businessFileName:any='';
	personalFileName:any='';
	onBoardingStatus:any;
	showUploadError:boolean=false;
	kycDetails:any;
	personalKycDetails:any;
	businessKycDetails:any;
	peronalStatus:any;
	businessStatus:any;
	errorMessage:string;

	constructor(private fb:FormBuilder,
		private customerService:CustomerServicesService,
		private authService:AuthService,
		private apiService:ApiService,
		private dialog:MatDialog,
		private router:Router,

	){}
  isbusinessKycRejected=false;
  ispersonalKycRejected=false;
	ngOnInit():void{
		this.onBoardingStatus =localStorage.getItem('onBoardingStatus');
		console.log(localStorage.getItem('onBoardingStatus'));
		this.kycDetails = JSON.parse(localStorage.getItem('kycDetails'));
		console.log(this.kycDetails);
		if(this.kycDetails){
			this.personalKycDetails = this.kycDetails?.find(item=>item.documentType==="PERSONAL");
			console.log(this.personalKycDetails);
			this.peronalStatus = this.personalKycDetails?.documentList[0]?.status;
			console.log(this.peronalStatus);
			this.businessKycDetails = this.kycDetails?.find(item=>item.documentType==="BUSINESS");
			console.log(this.businessKycDetails);
			this.businessStatus = this.businessKycDetails?.documentList[0]?.status;
			console.log(this.businessStatus);
		}
		if(this.onBoardingStatus=='PERSONAL_KYC_REJECTED'||this.onBoardingStatus=='BUSINESS_KYC_REJECTED'){
			const popupRejected=this.dialog.open(CommonPopupComponent,{
				width: '500px',
						// height: '300px',
						data: {
						title: 'kycRejected',
						message:this.onBoardingStatus=='PERSONAL_KYC_REJECTED'?'Personal KYC Rejected':"Business KYC Rejected"
						},
						disableClose: true
					  });


		}

		this.apiService.getAllCountryCode().subscribe((res:any)=>{
			console.log(res);
			this.countries=res.data[0].countryList;
			this.countryOptions = this.countries;
			this.businessCountryOptions = this.countries;
			this.personalCountryOptions = this.countries;
		  })
		this.customerService.getDocumentTypes().subscribe((res:any)=>{
			this.documentTypes=res.data[0];
			this.personalDocumentOptions=this.documentTypes.personalKycDocumentTypeInfo;
			this.businessDocumentOptions=this.documentTypes.businessKycDocumentTypeInfo;
		})

		this.kycForm = this.fb.group({
			businessKycCountry: new FormControl(this.businessKycDetails?.documentList[0]?this.businessKycDetails?.documentList[0].country:'', [Validators.required]),
			businessKycDocument: new FormControl(this.businessKycDetails?.documentList[0]?this.businessKycDetails?.documentList[0].documentName:'', [Validators.required]),
			businessKycFile: new FormControl('', [Validators.required]),
			businessKycFileType: new FormControl(this.businessKycDetails?.documentList[0]?this.businessKycDetails?.documentList[0].documentType:'', [Validators.required]),

			personalKycCountry: new FormControl(this.personalKycDetails?.documentList[0]?this.personalKycDetails?.documentList[0]?.country:'', [Validators.required]),
			personalKycDocument: new FormControl(this.personalKycDetails?.documentList[0]?this.personalKycDetails?.documentList[0]?.documentName:'', [Validators.required]),
			personalKycFile: new FormControl('', [Validators.required]),
			personalKycFileType: new FormControl(this.personalKycDetails?.documentList[0]?this.personalKycDetails?.documentList[0]?.documentType:'', [Validators.required]),
		})
		if(this.businessStatus&&this.businessStatus!='REJECTED'){
      this.isbusinessKycRejected=true
			this.kycForm.controls['businessKycCountry'].disable();
			this.kycForm.controls['businessKycDocument'].disable();
			this.kycForm.controls['businessKycFile'].disable();
			this.kycForm.controls['businessKycFileType'].disable();
		}
		if(this.peronalStatus&&this.peronalStatus!='REJECTED'){
      this.ispersonalKycRejected=true
			this.kycForm.controls['personalKycCountry'].disable();
			this.kycForm.controls['personalKycDocument'].disable();
			this.kycForm.controls['personalKycFile'].disable();
			this.kycForm.controls['personalKycFileType'].disable();
		}
	}

	businessCountryChange(e: any) {
		this.showUploadError=false;
		if (e.target.value === '') {
		  this.businessCountryOptions = this.countries;
		} else {
		  console.log(e);
		  const filterValue3 = e.target.value.toLowerCase();

		  this.businessCountryOptions = this.countries.filter((option:any) =>
			option.countryName.toLowerCase().includes(filterValue3)
		  );
		}
	  }

	  businessDocumentChange(e: any) {
		this.showUploadError=false;
		if (e.target.value === '') {
		  this.businessDocumentOptions = this.documentTypes.businessKycDocumentTypeInfo;
		} else {
		  console.log(e);
		  const filterValue3 = e.target.value.toLowerCase();

		  this.businessDocumentOptions = this.documentTypes.businessKycDocumentTypeInfo.filter((option:any) =>
			option.value.toLowerCase().includes(filterValue3)
		  );
		}
	  }

	  personalCountryChange(e: any) {
		this.showUploadError=false;
		if (e.target.value === '') {
		  this.personalCountryOptions = this.countries;
		} else {
		  console.log(e);
		  const filterValue3 = e.target.value.toLowerCase();

		  this.personalCountryOptions = this.countries.filter((option:any) =>
			option.countryName.toLowerCase().includes(filterValue3)
		  );
		}
	  }

	  personalDocumentChange(e: any) {
		this.showUploadError=false;
		if (e.target.value === '') {
		  this.personalDocumentOptions = this.documentTypes.personalKycDocumentTypeInfo;
		} else {
		  console.log(e);
		  const filterValue3 = e.target.value.toLowerCase();

		  this.personalDocumentOptions = this.documentTypes.personalKycDocumentTypeInfo.filter((option:any) =>
			option.value.toLowerCase().includes(filterValue3)
		  );
		}
	  }

	uploadBussinessKYCDoc(file: any) {
		console.log(file);
		console.log(file.name)

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff','.tif'];
    const fileExtension = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      this.kycForm.controls['businessKycFileType'].setErrors(null)
      this.businessFileName=file.name;

      if(file){
        this.showUploadError=false;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
        let base64 = reader?.result;
        this.kycForm.controls['businessKycFile'].setValue(`${file.name}|${base64}`)
        };
        let type = file.type.split('/');
        this.kycForm.controls['businessKycFileType'].setValue(type[1]);
      }
    } else {
      this.kycForm.controls['businessKycFileType'].setErrors({invalid:true})
      console.error("Error: Invalid file extension. Only .jpg, .jpeg, .png, .pdf, and .tiff files are allowed.");
    }


	}

	uploadPersonalKYCDoc(file: any) {
		console.log(file);

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff'];
    const fileExtension = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      this.kycForm.controls['personalKycFileType'].setErrors(null)
      this.personalFileName=file.name;

      if(file){
        this.showUploadError=false;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
        let base64 = reader?.result;
        this.kycForm.controls['personalKycFile'].setValue(`${file.name}|${base64}`)
        };
        let type = file.type.split('/');
        this.kycForm.controls['personalKycFileType'].setValue(type[1]);
      }
    } else {
      this.kycForm.controls['personalKycFileType'].setErrors({invalid:true})
      console.error("Error: Invalid file extension. Only .jpg, .jpeg, .png, .pdf, and .tiff files are allowed.");
    }

	}

	deleteBusinessFile(){
		console.log("clicked");
		this.kycForm.controls['businessKycFile'].setValue('');
		this.businessFileName='';
		this.kycForm.controls['businessKycFileType'].setValue('');
	}

	deletePersonalFile(){
		console.log("clicked");
		this.kycForm.controls['personalKycFile'].setValue('');
		this.personalFileName='';
		this.kycForm.controls['personalKycFileType'].setValue('');
	}

	submit(){
  //   if(this.isbusinessKycRejected && this.ispersonalKycRejected){
  //     this.router.navigateByUrl('/customer/profile/kyc-success')
  //     return
  //   }
	// 	if(this.kycForm.valid){
	// 		this.showUploadError=false;
	// 		let data = {
	// 			"kycDetails": [
	// 				{
	// 					"documentType": "PERSONAL",
	// 					"documentList": [
	// 						{
	// 							"userAction":this.peronalStatus==="REJECTED"?"EDIT":"NEW",
	// 							"documentName": this.kycForm.controls['personalKycDocument'].value,
	// 							"title": "Personal",
	// 							"country": this.kycForm.controls['personalKycCountry'].value,
	// 							"encodedFileContent": this.personalKycDetails&&this.peronalStatus!=="REJECTED"?this.personalKycDetails?.documentList[0]?.url :this.kycForm.controls['personalKycFile'].value,
	// 							"documentType": this.kycForm.controls['personalKycFileType'].value
	// 						}
	// 					]
	// 				},
	// 				{
	// 					"documentType": "BUSINESS",
	// 					"documentList": [
	// 						{
	// 							"userAction":this.businessStatus==="REJECTED"?"EDIT":"NEW",
	// 							"documentName": this.kycForm.controls['businessKycDocument'].value,
	// 							"title": "Business",
	// 							"country": this.kycForm.controls['businessKycCountry'].value,
	// 							"encodedFileContent": this.businessKycDetails&&this.businessStatus!=="REJECTED"?this.businessKycDetails?.documentList[0]?.url :this.kycForm.controls['businessKycFile'].value,
	// 							"documentType": this.kycForm.controls['businessKycFileType'].value
	// 						}
	// 					]
	// 				}
	// 			]
	// 		}
	// 		this.customerService.saveAllKYCDetails(data).subscribe((res : any) => {
	// 			console.log(res)
	// 			if(res.success){
	// 				localStorage.setItem('onBoardingStatus', 'KYC_SUBMITTED');
	// 				const popup = this.dialog.open(CommonPopupComponent, {
	// 					width: '500px',
	// 					// height: '300px',
	// 					data: {
	// 					  title: 'kycSuccess',
	// 					},
	// 					disableClose: true
	// 				  });

	// 				  popup.afterClosed().subscribe(result => {
	// 					localStorage.setItem('onBoardingStatus','KYC_SUBMITTED')
	// 					this.router.navigateByUrl('/customer/profile/kyc-success')
	// 				  });
	// 			}
	// 		})
	// 	}
	// 	else{
	// 		if (
  //       this.kycForm.controls['personalKycDocument'].valid &&
  //       this.kycForm.controls['personalKycCountry'].valid &&
  //       this.kycForm.controls['businessKycDocument'].valid &&
  //       this.kycForm.controls['businessKycCountry'].valid
  //     ){
	// 	this.showUploadError=true;
	// 	this.errorMessage = 'Please upload the documents.';
	//   }
	//   else{
  //       this.showUploadError = true;
	// 	this.errorMessage = 'Please complete the form.';
	// 	}
	// }
  if (this.isbusinessKycRejected && this.ispersonalKycRejected) {
    this.router.navigateByUrl('/customer/profile/kyc-success');
    return;
  }

  if (this.kycForm.valid) {
    this.showUploadError = false;
    let data = {
      "kycDetails": []
    };

    if (!this.kycForm.controls['personalKycDocument'].disabled) {
      data.kycDetails.push({
        "documentType": "PERSONAL",
        "documentList": [
          {
            "userAction": this.peronalStatus === "REJECTED" ? "EDIT" : "NEW",
            "documentName": this.kycForm.controls['personalKycDocument'].value,
            "title": "Personal",
            "country": this.kycForm.controls['personalKycCountry'].value,
            "encodedFileContent": this.personalKycDetails && this.peronalStatus !== "REJECTED" ? this.personalKycDetails?.documentList[0]?.url : this.kycForm.controls['personalKycFile'].value,
            "documentType": this.kycForm.controls['personalKycFileType'].value
          }
        ]
      });
    }

    if (!this.kycForm.controls['businessKycDocument'].disabled) {
      data.kycDetails.push({
        "documentType": "BUSINESS",
        "documentList": [
          {
            "userAction": this.businessStatus === "REJECTED" ? "EDIT" : "NEW",
            "documentName": this.kycForm.controls['businessKycDocument'].value,
            "title": "Business",
            "country": this.kycForm.controls['businessKycCountry'].value,
            "encodedFileContent": this.businessKycDetails && this.businessStatus !== "REJECTED" ? this.businessKycDetails?.documentList[0]?.url : this.kycForm.controls['businessKycFile'].value,
            "documentType": this.kycForm.controls['businessKycFileType'].value
          }
        ]
      });
    }

    if (data.kycDetails.length > 0) {
      this.customerService.saveAllKYCDetails(data).subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          localStorage.setItem('onBoardingStatus', 'KYC_SUBMITTED');
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            // height: '300px',
            data: {
              title: 'kycSuccess',
            },
            disableClose: true
          });

          popup.afterClosed().subscribe(result => {
            localStorage.setItem('onBoardingStatus', 'KYC_SUBMITTED');
            this.router.navigateByUrl('/customer/profile/kyc-success');
          });
        }
      });
    }
  } else {
    if (
      this.kycForm.controls['personalKycDocument'].valid &&
      this.kycForm.controls['personalKycCountry'].valid &&
      this.kycForm.controls['businessKycDocument'].valid &&
      this.kycForm.controls['businessKycCountry'].valid
    ) {
      this.showUploadError = true;
      this.errorMessage = 'Please upload the documents.';
    } else {
      this.showUploadError = true;
      this.errorMessage = 'Please complete the form.';
    }
  }
	}


	checkAutocomplete(e:any,formName:string){
		let formValue = this.kycForm.controls[formName].value;
		console.log(formValue,formName)
		if(
		  formName=="personalKycCountry" ||
		  formName == "businessKycCountry"
		  ) {
			let isExists = this.countries.find((ele: any) => {
			  console.log(ele.countryName.toLowerCase() === formValue?.toLowerCase())
			  return ele.countryName.toLowerCase() === formValue?.toLowerCase();
			});
			console.log(isExists);
			if(isExists){
			  console.log(this.countries.find((ele: any) =>ele.countryName.toLowerCase() === formValue?.toLowerCase()));
			  this.kycForm.controls[formName].setValue(this.countries.find((ele: any) =>ele.countryName.toLowerCase() === formValue?.toLowerCase()).countryName);
			}
			else{
			  this.kycForm.controls[formName].setErrors({ required: true });
			}
		}

		if(formName == 'personalKycDocument'){
			let isExists = this.documentTypes.personalKycDocumentTypeInfo.find((ele:any)=>{
				console.log(ele.value.toLowerCase() === formValue?.toLowerCase());
				return ele.value.toLowerCase() === formValue?.toLowerCase();
			})
			console.log(isExists);
			if(isExists){
				this.kycForm.controls[formName].setValue(this.documentTypes.personalKycDocumentTypeInfo.find((ele:any)=>ele.value.toLowerCase() === formValue?.toLowerCase()).value)
			}
			else{
				this.kycForm.controls[formName].setErrors({required:true});
			}
		}

		if(formName == 'businessKycDocument'){
			let isExists = this.documentTypes.businessKycDocumentTypeInfo.find((ele:any)=>{
				console.log(ele.value.toLowerCase());
				return ele.value.toLowerCase() === formValue?.toLowerCase();
			})
			console.log(isExists);
			if(isExists){
				this.kycForm.controls[formName].setValue(this.documentTypes.businessKycDocumentTypeInfo.find((ele:any)=>ele.value.toLowerCase() === formValue?.toLowerCase()).value)
			}
			else{
				this.kycForm.controls[formName].setErrors({required:true});
			}
		}

	  }


}
