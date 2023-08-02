import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CorporateTransactionService } from '../services/corporate-transaction.service';
import { FormControl, Validators } from '@angular/forms';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';


@Component({
  selector: 'app-corporate-transaction-view',
  templateUrl: './corporate-transaction-view.component.html',
  styleUrls: ['./corporate-transaction-view.component.scss']
})
export class CorporateTransactionViewComponent{
  userId:any;
  data:any=[];
  routelocation:any;
  panelOpenState:boolean;
  @ViewChild('messageDialog') messageDialog: TemplateRef<any>;
  messageList:any=[];
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any, any>;
  form!: FormControl;
  step: Number;


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
    this.corpoService.getFactoringById(this.userId).subscribe((res:any)=>{
      this.data = res;
      console.log('details of customer',this.data);
      this.messageList = this.data['comment'];
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
  this.data['comment']=data;
  if(this.form.value != '') {
    this.corpoService.updateComment(this.data).subscribe((res:any)=>{
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
}
