import {Component,OnInit,TemplateRef,ViewChild,} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../customers/services/customer.service';
import { FormControl, Validators } from '@angular/forms';
import { CorporateTransactionService } from '../services/corporate-transaction.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
@Component({
  selector: 'app-corporate-transaction-table',
  templateUrl: './corporate-transaction-table.component.html',
  styleUrls: ['./corporate-transaction-table.component.scss'],
})
export class CorporateTransactionTableComponent extends TableComponent implements OnInit {

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  form!: FormControl;
  dialogRef: MatDialogRef<any, any>;
  mainData:any;
  selectFactorList:any;
  newvaule: any[];
  factorEntityOldSelectedList: any[];
  finalFilteredIdList: any = [];
  factorEntity = [];

  constructor(_liveAnnouncer: LiveAnnouncer, router: Router, apiService: ApiService, dialog: MatDialog,
    private customerService: CustomerService,private corpoService: CorporateTransactionService) {
    super(_liveAnnouncer, router, apiService, dialog);
    this.form = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
     
    ]);
    this.getSelectFactorList();
    this.corpoService.factorEntity.subscribe(res=>{
      this.factorEntity=res;
    })
  }

  override applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableStructure.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getSelectFactorList() {
    this.corpoService.getFactorList().subscribe((res: any) => {
      this.selectFactorList = res.data;
    })
  }
  viewDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/corporate-transaction/view/${element.Action.id}`);
  }
  messagePop(element?: any){
    this.mainData = element['Action'].data;
    this.dialogRef =  this.dialog.open(this.callAPIDialog,{
      disableClose:true
    });
  }
  updateComment(){
    let data = [{
      message:this.form.value
    }]
    console.log('main',this.mainData);
    this.mainData['comment'] = data;
    if(this.form.value != '') {
      this.corpoService.updateComment(this.mainData).subscribe((res:any)=>{
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
        this.combinedEmitter.emit({
          eventName: 'msgAdded',
          event: true
        })
      })
    }
  }
  transactionStatusChange(status, id) {
    let data = {
      id: id,
      factorStatus: status
    }
    const popup = this.dialog.open(GeneralPopupComponent, {
      width: '600px',
      height: '240px',
      data: {
        title: 'isConfirm',
        full_data: data,
        message: 'Are you sure you want to update the status ?'
      },
      disableClose:true
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (result==true) {
        this.corpoService.updateTranStatus(data).subscribe((res: any) => {
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '370px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
            disableClose:true
          });
          this.combinedEmitter.emit({
            eventName: 'msgAdded',
            event: true
          })
        })
      }else{
        this.combinedEmitter.emit({
          eventName: 'msgAdded',
          event: true
        })
      }
    });
  }
  selectedFactor(e, index) {
    console.log(e, 'selector1')
    this.newvaule = [];
    this.finalFilteredIdList = [];
    this.newvaule = e;
    let factorEntityOldSelectedList = this.factorEntity[index];
    if (this.factorEntity[index] != undefined) {
      this.newvaule = this.newvaule.filter(val => !factorEntityOldSelectedList.includes(val));
    }
    this.selectFactorList.forEach(element => {
      this.newvaule.forEach(e => {
        if (element.companyName == e) {
          this.finalFilteredIdList.push(element.id);
        }
      })
    });
  }
  send(id, e, i, factorList) {
    this.newvaule = e;
    this.finalFilteredIdList = [];
    if (factorList != undefined) {
      factorList = factorList.map(x => x.companyName);
    }
    if (factorList != undefined) {
      this.newvaule = this.newvaule.filter(x => factorList.findIndex(lu => lu === x) === -1), 'new vaule';
    }
    this.selectFactorList.forEach(element => {
      this.newvaule.forEach(e => {
        if (element.companyName == e) {
          this.finalFilteredIdList.push(element.id);
        }
      })
      console.log(this.finalFilteredIdList, 'finalFilteredIdList');
    });
    let data = {
      factoringTransactionId: id,
      masterEntityId: this.finalFilteredIdList
    }
    console.log(data);
    if (this.finalFilteredIdList.length > 0) {
      this.corpoService.sendemail(data).subscribe(res => {
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
        this.getSelectFactorList();
        this.combinedEmitter.emit({
          eventName: 'msgAdded',
          event: true
        })
      })
    }
  }
  viewFactorDetails(element?: any) {
    this.router.navigateByUrl(`/adminv2/corporate-transaction/factor-view/${element.Action.id}`);
  }
  transactionType(_e) {
    this.customerService.selectedTransactionType.next(this.tableStructure.transaction.selectedTransactionType);
    this.transactionTypeChangeHandler.emit(_e.value);
    this.combinedEmitter.emit({
      eventName: 'transactionType',
      event: _e.value,
    });
  }
}
