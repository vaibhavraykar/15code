import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute,Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { FactoringService } from '../../services/factoring.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Location } from '@angular/common'
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit{
  transactId:any;
  viewData:any=[];
  assigner?:any;
  date?:any;
  result?:any;

  displayedColumns = [
    ['Applicant & beneficiary details'],
  ];  
  panelOpenState = false;

  messageList:any=[];
  @ViewChild('messageDialog') messageDialog: TemplateRef<any>;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  form!: FormControl;
  dialogRef: MatDialogRef<any, any>;


  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private adminService:AdminService,
    private factoringService:FactoringService,
    public dialog: MatDialog,
    private location:Location,
  ){}

  ngOnInit(){
    this.transactId=this.route.snapshot.paramMap.get('id');
    console.log(this.transactId);

    this.viewTransaction(this.transactId);
    this.form = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
     
    ]);
    
  }

  viewTransaction(id:any){


  this.adminService.getFactoringById(id).subscribe((res:any)=>{
    this.viewData=res;
    this.date=new Date(this.viewData.transactionValidityDate);
    console.log(this.viewData);
    this.messageList = this.viewData['comment'];
  })    

     
     
  }

  addComment(){
    // const dialogRef = this.dialog.open(AddCommentComponent,{data:this.viewData});
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
    this.dialogRef = this.dialog.open(this.callAPIDialog,{
      width: '500px',
      height: '350px',
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
      this.adminService.updateComment(this.viewData).subscribe((res:any)=>{
        console.log(res, 'res');
        this.form.reset();
        this.dialogRef.close();
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '300px',
          data: {
            title: 'isSuccess',
          },
        });
       
        setTimeout(() => {
          popup.close();
        }, 1000);
        this.viewTransaction(this.transactId);

        // this.router.navigateByUrl('/admin/factoring/transaction-details');
      })
    }
  }
  closeComment(){
    this.form.reset();
    this.dialogRef.close();
  }
  back(): void {
    this.location.back()
  } 
  openViewMessage(){
    this.dialog.open(this.messageDialog,{
      width: '600px',
      height: '450px',
      disableClose:true
    });
  }
  // editTransaction(id:any){
  //   this.router.navigate(['admin/factoring/edit-transaction',id])
  // }
}
