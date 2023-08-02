import { Component, Inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent {

  comment:any;

  constructor(
    private adminService:AdminService,
    private router:Router,
    private dialogRef:DialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }


  commentHandler(event:any){
    this.comment=event;
  }

  addComment(){
    this.data['comment']=this.comment;
    this.adminService.updateComment(this.data).subscribe((res:any)=>{
      console.log(res);
      this.dialogRef.close();
      this.router.navigateByUrl('/admin/factoring/transaction-details');
    })
  }
}
