import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CorporateTransactionService } from '../services/corporate-transaction.service';
import { FormControl, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-corporate-transaction-factor-view',
  templateUrl: './corporate-transaction-factor-view.component.html',
  styleUrls: ['./corporate-transaction-factor-view.component.scss']
})
export class CorporateTransactionFactorViewComponent{
  userId:any;
  viewData:any=[];
  routelocation:any;
  panelOpenState:boolean;
  @ViewChild('messageDialog') messageDialog: TemplateRef<any>;
  messageList:any=[];
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;
  form!: FormControl;
  step: Number;
  date?: any;
  newData:any;
  displayColumns: string[] = [
    'S. No.',
    'Factor Id',
    'Factor Name',
    'Factor Country',
    'Pricing',
    'Actions'
  ]
  dataSource: any = new MatTableDataSource<any>();
  totalCount: any;
  clickData:any;
  commentValue: string;


constructor(private route:ActivatedRoute,private router:Router,private location:Location,
  private dialog: MatDialog,private corpoService: CorporateTransactionService){
    this.routelocation=this.location;
}
ngOnInit(){
  this.userId=this.route.snapshot.paramMap.get('id');
  this.viewTransaction();
  this.form = new FormControl('', [
    Validators.required,
    Validators.maxLength(255),
   
  ]);
}
  viewTransaction(){
    this.corpoService.getFactoringById(this.userId).subscribe((res: any) => {
      this.viewData = res;
      this.date = new Date(this.viewData.transactionValidityDate);
      let newDataListFinal = [];
      if(this.viewData.eligibleFactoringTransactionDto && this.viewData.sendEmailToMasterEnity){
        this.viewData.eligibleFactoringTransactionDto.forEach(ele => {
          try{
            this.viewData.sendEmailToMasterEnity.forEach((element,i) => {
              if(ele.masterEntity.id !== element.id){
                this.newData = {...ele}
                this.newData.buttonDisable = false;
              }else{
                this.newData = {...ele}
                this.newData.buttonDisable = true;
                throw 'break'
                // newDataListFinal.push(this.newData);
              }
            })
          }catch{
          }
          newDataListFinal.push(this.newData);
          console.log(newDataListFinal);
        });
      }else{
        this.viewData.eligibleFactoringTransactionDto.forEach((ele,i) => {
          this.newData = {...ele}
          this.newData.buttonDisable = false;
          newDataListFinal.push(this.newData);
        })
      }
      this.viewData.eligibleFactoringTransactionDto = newDataListFinal;
      console.log(this.viewData);
      this.dataSource = new MatTableDataSource<any>(this.viewData.eligibleFactoringTransactionDto);
      this.totalCount= this.viewData.eligibleFactoringTransactionDto.filter(item => item.price).length;
      console.log('Total Count:', this.totalCount);
    })
  }
openViewMessage(){
  this.dialog.open(this.messageDialog,{
    disableClose:true
  });
}
back(): void {
  this.location.back()
} 
addComment(){
  this.dialogRef = this.dialog.open(this.callAPIDialog,{
    disableClose:true
  });
}
public errorHandling = (error: string) => {
  return this.form.hasError(error);
};
updateComment(){
  let data = [{
    message:this.form.value
  }]
  this.viewData['comment']=data;
  if(this.form.value != '') {
    this.corpoService.updateComment(this.viewData).subscribe((res:any)=>{
      console.log(res, 'res');
      this.form.reset();
      this.dialogRef.close();
      const popup = this.dialog.open(GeneralPopupComponent, {
        width: '500px',
        height: '370px',
        data: {
          title: 'isAllGood',
          status: true,
          message:'Message Added Successfully!'
        },
        disableClose:true
      });
      this.viewTransaction();
      // this.router.navigateByUrl('/admin/factoring/transaction-details');
    })
  }
}
sendMail(id: any, userAction: any,advanceRate: any, interestRate: any, factoringCommision: any) {
  let data = {
    facTxnId: id,
    userAction: userAction,
    factorPricingDto: {
      advanceRate: advanceRate ,
      interestRate: interestRate,
      factoringCommission: factoringCommision
    }
  }
  console.log('without fee', data);

  const popup = this.dialog.open(GeneralPopupComponent, {
    width: '600px',
    height: '240px',
    data: {
      title: 'isConfirm',
      full_data: data,
      message:'Are you sure you want to proceed with the action ?'
    },
    disableClose:true
  });
  popup.afterClosed().subscribe(dialogResult => {
    let result = dialogResult;
    if (dialogResult) {
      this.corpoService.sendMailWithoutFee(data).subscribe((res: any) => {
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
          this.viewData = [];
          this.newData = '';
          this.viewData = res.data[0];
    this.date = new Date(this.viewData.transactionValidityDate);
  let newDataListFinal = [];
  if(this.viewData.eligibleFactoringTransactionDto && this.viewData.sendEmailToMasterEnity){
    this.viewData.eligibleFactoringTransactionDto.forEach(ele => {
      try{
        this.viewData.sendEmailToMasterEnity.forEach((element,i) => {
          if(ele.masterEntity.id !== element.id){
            this.newData = {...ele}
            this.newData.buttonDisable = false;
          }else{
            this.newData = {...ele}
            this.newData.buttonDisable = true;
            throw 'break'
          }
        })
      }catch{
      }
      newDataListFinal.push(this.newData);
      console.log(newDataListFinal);
    });
  }else{
    this.viewData.eligibleFactoringTransactionDto.forEach((ele,i) => {
      this.newData = {...ele}
      this.newData.buttonDisable = false;
      newDataListFinal.push(this.newData);
    })
  }
  this.viewData.eligibleFactoringTransactionDto = newDataListFinal;
  console.log(this.viewData);
  this.dataSource = new MatTableDataSource<any>(this.viewData.eligibleFactoringTransactionDto);
  this.totalCount= this.viewData.eligibleFactoringTransactionDto.filter(item => item.price).length;
        }
      })
    }
  });
}
comment(id: any, userAction: any, eligibleid: any, advancedRate: any, interestRate: any, factoringCommision: any) {
  this.dialogRef = this.dialog.open(this.callAPIDialog, {
    disableClose:true
  });
  this.clickData = {
    id, userAction, eligibleid, advancedRate, interestRate, factoringCommision
  };
  console.log('comment', this.clickData);
}
submitAddedValue() {
  if(this.commentValue){
    console.log(this.commentValue);
    let data = {
      facTxnId: this.clickData.id,
      userAction: this.clickData.userAction,
      eligibleTransactionId: this.clickData.eligibleid,
      factorPricingDto: {
        advanceRate: this.clickData.advancedRate,
        interestRate: this.clickData.interestRate,
        factoringCommission: this.clickData.factoringCommision,
        platformFee: this.commentValue
      }
    }
    console.log('data', data);
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message:'Are you sure you want to proceed with the action ?'
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.corpoService.sendMailWithFee(data).subscribe((res: any) => {
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
            this.viewData = [];
            this.newData = '';
            this.viewData = res.data[0];
      this.date = new Date(this.viewData.transactionValidityDate);
    let newDataListFinal = [];
    if(this.viewData.eligibleFactoringTransactionDto && this.viewData.sendEmailToMasterEnity){
      this.viewData.eligibleFactoringTransactionDto.forEach(ele => {
        try{
          this.viewData.sendEmailToMasterEnity.forEach((element,i) => {
            if(ele.masterEntity.id !== element.id){
              this.newData = {...ele}
              this.newData.buttonDisable = false;
            }else{
              this.newData = {...ele}
              this.newData.buttonDisable = true;
              throw 'break'
            }
          })
        }catch{
        }
        newDataListFinal.push(this.newData);
        console.log(newDataListFinal);
      });
    }else{
      this.viewData.eligibleFactoringTransactionDto.forEach((ele,i) => {
        this.newData = {...ele}
        this.newData.buttonDisable = false;
        newDataListFinal.push(this.newData);
      })
    }
    this.viewData.eligibleFactoringTransactionDto = newDataListFinal;
    console.log(this.viewData);
    this.dataSource = new MatTableDataSource<any>(this.viewData.eligibleFactoringTransactionDto);
    this.totalCount= this.viewData.eligibleFactoringTransactionDto.filter(item => item.price).length;
          }
        })
      }
    });
    this.closeComment();
  }
}
closeComment() {
  this.dialogRef.close();
}
}
