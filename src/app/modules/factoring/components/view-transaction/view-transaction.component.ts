import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FactoringService } from '../../services/factoring.service';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';

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
  @ViewChild('messageDialog') messageDialog: TemplateRef<any>;
  panelOpenState = false;
  messageList:any=[];


  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private factoringService:FactoringService,
    private location:Location,
    public dialog: MatDialog,
  ){}

  ngOnInit(){
    this.transactId=this.route.snapshot.paramMap.get('id');
    console.log(this.transactId);

    this.viewTransaction(this.transactId);
  }

  viewTransaction(id:any){
    this.factoringService.getTransactionById(id).subscribe((res:any)=>{
      this.viewData=res;
      this.date=new Date(this.viewData.transactionValidityDate);
      console.log(this.viewData);
      this.messageList = this.viewData['comment'];

    });
    
  }

  back(): void {
    this.location.back()
  } 
  editTransaction(id:any){
    this.router.navigate(['/factoring/edit-transaction',id])
  }
  openViewMessage(){
    this.dialog.open(this.messageDialog,{
      width: '600px',
      height: '450px',
      disableClose:true
    });
  }
}
