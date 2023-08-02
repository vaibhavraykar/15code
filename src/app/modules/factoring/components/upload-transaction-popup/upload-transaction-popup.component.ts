import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-upload-transaction-popup',
  templateUrl: './upload-transaction-popup.component.html',
  styleUrls: ['./upload-transaction-popup.component.scss'],
})
export class UploadTransactionPopupComponent {
  constructor(
    public dialog1: MatDialog,
    private router: Router,
    private factoringService: FactoringService,
    private apiService: ApiService,
    public dialog: MatDialogRef<UploadTransactionPopupComponent>
  ) {}

  uploadTransaction(file: any) {
  
    let formdata = new FormData();

    formdata.append('file', file, file.name);
    const promise = this.factoringService.uploadTransaction(formdata);
    
    promise
      .then((res: any) => {
        console.log(res, 'res');
        const popup = this.dialog1.open(CommonPopupComponent, {
          width: '500px',
          // height: '300px',
          data: {
            title: 'isCongrats',
          },
        });
        //this.router.navigateByUrl('factoring/transaction-preview');
        this.dialog.close();
      })
      .catch((err: any) => {
        console.log(err);
        if (err.status && err.status == 200) {
         this.router.navigateByUrl('factoring/transaction-preview');
          this.dialog.close();
        }
      });

      
     
     // this.router.navigateByUrl('factoring/transaction-preview');
  }
}
