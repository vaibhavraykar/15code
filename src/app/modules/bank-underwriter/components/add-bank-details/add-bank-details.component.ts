import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AddBankDetailsPopupComponent } from '../../popup/add-bank-details-popup/add-bank-details-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CloseTransactionPopupComponent } from '../../popup/close-transaction/close-transaction-popup/close-transaction-popup.component';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { MatTableDataSource } from '@angular/material/table';

export interface addBankElement{
  'Sr. No.' : string;
  'Date' : string;
  'Bank Name' : string;
  'Country' : string;
}
@Component({
  selector: 'app-add-bank-details',
  templateUrl: './add-bank-details.component.html',
  styleUrls: ['./add-bank-details.component.scss']
})
export class AddBankDetailsComponent implements OnInit {
  payload={

  }
  searchInput:any
  // newDataSource: any = [];
  displayColumns = [
    'Sr. No.',
    'Date',
    'Bank Name',
    'Country',
    'Action',
  ];
  newDataSource:any=[];
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  last: any;
  constructor (
    private dialog : MatDialog,
    private bs :BankUnderwriterService,
    private ts :TransactionService,

  ){}
  ngOnInit(): void {
     this.searchInput = new FormControl('');
     this.fetchData()
  }
  search(e: any) {}
  convertDate(epochTime: any) {
    const date = new Date(epochTime); // Multiply by 1000 to convert from seconds to milliseconds

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month starts from 0, so add 1
    const year = date.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
  fetchData(){
    let bankDataSource = []
    let  page=this.page.index;
    let size=this.page.size;
    this.bs.getBank(`page=${page}&size=${size}`).subscribe((res:any)=>{
      console.log(res)
      res.data.map((ele,index)=>{
        bankDataSource.push(
          {
            'Sr. No.' : index+1,
            'Date' :this.convertDate(ele?.createdOnEpoch)|| 0,
            'Bank Name' : ele?.bankName,
            'Country' : ele?.country,
            'id':ele?.id
          }
        )
      })
      this.page.totalElements=res.totalElements;
      this.page.totalPages = res.totalPages
      this.newDataSource = new MatTableDataSource(bankDataSource)
      console.log(bankDataSource?.length)
    });

    // this.ts.getPartnerBankList().subscribe({
    //   next:(res:any)=>{
    //     console.log(res)
    //     let {data} = res
    //     let arr = data?.map((_e:any)=>{
    //       return {

    //       }
    //     })
    //   }
    // })
  }
  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) < this.page?.totalElements
        ? this.page.size * (this.page.index + 1)
        : this.page?.totalElements;
    if (this.page.index == 0) {
      if (this.page.size >= this.page.totalElements) {
        return `1 - ${this.page.totalElements}`;
      } else {
        return `1 - ${this.page.size}`;
      }
    } else {
      return `${this.page.index * this.page.size + 1} - ${this.last} `;
    }
  }
  pagePrevious() {
    this.page.index = this.page.index - 1;

    this.fetchData();
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.fetchData();
  }
  edit(id){
    this.dialog.open( AddBankDetailsPopupComponent, { data: { viewType: 'edit' , id:id} }).afterClosed().subscribe((res)=>{
      this.fetchData()
    });

  }
  details(id){
    this.dialog.open( AddBankDetailsPopupComponent, { data: { viewType: 'details', id:id } });

  }
  addbank(){
   const dia= this.dialog.open( AddBankDetailsPopupComponent,{ data: { viewType: 'default' } })
    dia.afterClosed().subscribe((res)=>{

      this.fetchData()
    });
  }
  downloadBank(){
    this.bs.downloadBankCSV().subscribe({
      next:(res)=>{
        this.saveFile(res, 'partnerbanks.csv')
      }
    })
  }
convertToCSV(apiResponse) {
    let lines = apiResponse.split('\n');
    let csv = '';

    lines.forEach(function(line) {
      let values = line.split(',');
      let formattedLine = '';

      values.forEach(function(value, index) {
        if (index === values.length - 1) {
          formattedLine += value.trim();
        } else {
          formattedLine += value.trim() + ',';
        }
      });

      csv += formattedLine + '\n';
    });

    return csv;
  }
  async saveFile(res: any, name: any) {
    let link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(this.convertToCSV(res))}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // this.notifyService.showSuccess('Success',`${name} download successfully`)
  }
}
