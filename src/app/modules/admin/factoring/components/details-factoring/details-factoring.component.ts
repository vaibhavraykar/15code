import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { AdminService } from '../../../services/admin.service';
import { Location } from '@angular/common'
import { FactoringService } from '../../services/factoring.service';


@Component({
  selector: 'app-details-factoring',
  templateUrl: './details-factoring.component.html',
  styleUrls: ['./details-factoring.component.scss']
})
export class DetailsFactoringComponent implements OnInit {
  transactId: any;
  viewData: any = [];
  assigner?: any;
  date?: any;
  result?: any;
  dialogRef: MatDialogRef<any, any>;
  clickData: any;
  secondData: any;
  commentValue: string;
  data: any[] = [];
  totalCount: any;
  facTxnId: number;
  userAction: string;
  eligibleTransactionId: number;
  factorPricingDto: {
    platformFee: number;
  };
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;


  displayColumns: string[] = [
    'S. No.',
    'Factor Id',
    'Factor Name',
    'Factor Country',
    'Pricing',
    'Actions'
  ]
  dataSource: any = new MatTableDataSource<any>();
  newData:any;

  constructor(private route: ActivatedRoute, private adminService: AdminService,
    private factorService: FactoringService,
    private location: Location, private dialog: MatDialog) {


  }
  ngOnInit() {
    this.transactId = this.route.snapshot.paramMap.get('id');
    this.viewTransaction(this.transactId);

  }

  viewTransaction(id: any) {


    this.adminService.getFactoringById(id).subscribe((res: any) => {
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
  comment(id: any, userAction: any, eligibleid: any, advancedRate: any, interestRate: any, factoringCommision: any) {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '470px',
      height: '310px',
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
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '310px',
        data: {
          title: 'isConfirm',
          full_data: data,
        },
      });
      popup.afterClosed().subscribe(dialogResult => {
        let result = dialogResult;
        if (dialogResult) {
          this.factorService.sendMailWithFee(data).subscribe((res: any) => {
            const popup = this.dialog.open(CommonPopupComponent, {
              width: '500px',
              height: '350px',
              data: {
                title: 'isAllGood',
                message: res['message'],
                status: res['success']
              },
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

  isSendButtonEnabled(id: number, element: any, viewData: any): boolean {

    if (
      element &&
      element.masterEntity &&
      viewData &&
      viewData.sendEmailToMasterEntity
    ) {
      return element.masterEntity.id !== viewData.sendEmailToMasterEntity.id;
    }
    console.log(element.masterEntity.id !== viewData.sendEmailToMasterEntity.id);
    return false;
  }

  isNumberKey(evt)
  {
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.viewData);
    // this.tableDataSource.paginator = this.paginator;
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

    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '310px',
      data: {
        title: 'isConfirm',
        full_data: data,
      },
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.factorService.sendMailWithoutFee(data).subscribe((res: any) => {
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
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

  back(): void {
    this.location.back()
  }
  closeComment() {
    this.dialogRef.close();
  }
}
