import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
@Component({
  selector: 'app-secondary-transaction-preview',
  templateUrl: './secondary-transaction-preview.component.html',
  styleUrls: ['./secondary-transaction-preview.component.scss'],
})
export class SecondaryTransactionPreviewComponent implements OnInit {
  panelOpenState = false;
  secondPanelOpenState = false;
  transactionDetails: any;
  partnerBankList:any
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private transactionService: TransactionService,
    private location:Location
  ) {
    const navigation: any = this.router.getCurrentNavigation();
    this.transactionDetails = navigation?.extras?.state || {};
  }
  ngOnInit(): void {
    const { transactionId, data } = this.transactionDetails;
    if (!transactionId) {
      this.router.navigateByUrl('/bank-underwriter/new-secondary-transaction');
    }
    this.transactionService.getPartnerBankList().subscribe({
      next:(res:any)=>{
      this.partnerBankList = res?.data
      }
    })
  }
  editTransaction(tabId:number) {
    this.router.navigateByUrl(`/bank-underwriter/new-secondary-transaction/edit?id=${this.transactionDetails.transactionId}`,{state:{tabIndex:tabId}})
  }
  cancelTransaction() {
    const { transactionId, data } = this.transactionDetails;
    this.transactionService
      .cancelSecondryTransaction({
        transactionId: transactionId,
        quotationId: '',
      })
      .subscribe({
        next: (res) => {
        this.router.navigateByUrl('/bank-underwriter/new-secondary-transaction')

        },
      });
  }
  saveTransaction() {}
  getGroupCompany() {}
  openFile() {}

  joinPartnerBank(arr: any = []) {
    let newArr = [];
    for(let item of arr){
   let bank  =  this.partnerBankList?.find((ele:any)=>ele.id == item)
   if(bank){
    newArr.push(bank.firstName)
   }
    }
    return newArr?.join(',') || '';
  }
  submit() {
    console.clear()
    console.log(this.transactionDetails.type)
    if (this.transactionDetails.type === 'edit') {
      if(this.transactionDetails.from==='draft'){
        console.log("from === draft")
        this.transactionService
        .saveSecondryTransaction({
          transactionId: this.transactionDetails.transactionId,
        })
        .subscribe({
          next: (res: any) => {
            const { success } = res;
            if (success) {
              this.router.navigateByUrl('/bank-underwriter/secondary-success');
            }
          },
        });
      }else{
        console.log('from !== draft');
        // this.transactionService
        // .editSecondryTransaction({
        //   ...this.transactionDetails.data,
        // })
        // .subscribe({
        //   next: (res: any) => {
        //     const { success } = res;
        //     if (success) {
              this.router.navigateByUrl('/bank-underwriter/secondary-success',{state:{from:'selling_edit'}});
        //     }
        //   },
        // });
      }

    }
    else if(this.transactionDetails.type === 'clone'){
      this.transactionService
      .saveSecondryTransaction({
        transactionId: this.transactionDetails.transactionId,
      })
      .subscribe({
        next: (res: any) => {
          const { success } = res;
          if (success) {
            this.router.navigateByUrl('/bank-underwriter/secondary-success',{state:{from:'selling_clone'}});
          }
        },
      });
    } else {
        console.log('from !== edit');
      this.transactionService
        .saveSecondryTransaction({
          transactionId: this.transactionDetails.transactionId,
        })
        .subscribe({
          next: (res: any) => {
            const { success } = res;
            if (success) {
              this.router.navigateByUrl('/bank-underwriter/secondary-success',{state:{from:'selling_new'}});
            }
          },
        });
    }
  }
  getValue(val){
    let text = Number(val)
    if(isNaN(text)){
      return val
    }else{
      return  text?.toLocaleString('en')||''
    }
  }
}
