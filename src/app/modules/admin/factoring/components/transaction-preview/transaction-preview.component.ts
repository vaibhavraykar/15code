import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactoringService } from '../../services/factoring.service';

@Component({
  selector: 'app-transaction-preview',
  templateUrl: './transaction-preview.component.html',
  styleUrls: ['./transaction-preview.component.scss']
})
export class TransactionPreviewComponent implements OnInit{
  constructor( private router:Router,
    private factoringService:FactoringService) { }

  dataSource:any[]=[];
  data:any[]=[];
  selected?:any[];
  allID:any=[];
  displayedColumns = [
    ['Transaction Number 1','Debtor Name 1','Amount1','Invoice No.1'],
    ['Transaction Number 2','Debtor Name 2','Amount2','Invoice No.2'],
    ['Transaction Number 3','Debtor Name 3','Amount3','Invoice No.3'],
    ['Transaction Number 4','Debtor Name 4','Amount4','Invoice No.4']
  ];
  assigner:any;

  displayColumns:string[]=['Transaction ID','Product Type','User Type','Status','Amount','Invoice Number','Date','Tenour','Due Date','Charges On','Grace Period','Country Of Origin','Country Of Discharge','Validity Date','ESG Compliant','Underlining Goods','Assigner','Assigner To Debtor'];

  ngOnInit(){
    // this.factoringService.getListByStatus({status:"PENDING","page":0,"size":5,}).subscribe((res:any)=>{
    //   this.data=res.content;

    //   this.dataSource=[];
    //   for(let i=0;i<this.data.length;i++){
    //     this.allID.push(this.data[i].id);
    //     var date=new Date(this.data[i].transactionValidityDate)

    //     this.dataSource.push(
    //       {
    //         'Transaction ID':this.data[i].id,
    //         'Product Type':this.data[i].factoringProductType,
    //         'User Type':this.data[i].factoringUserType,
    //         'Status':this.data[i].status,
    //         'Amount':this.data[i].amount,
    //         'Invoice Number':this.data[i].invoiceNumber,
    //         'Date':this.data[i].date,
    //         'Tenour':this.data[i].Tenor,
    //         'Due Date':this.data[i].dueDate,
    //         'Charges On':this.data[i].chargesOn,
    //         'Grace Period':this.data[i].gracePeriod,
    //         'Country Of Origin':this.data[i].countryOrigin,
    //         'Country Of Discharge':this.data[i].countryDischarge,
    //         'Validity Date':date,
    //         'ESG Compliant':this.data[i].isESGCompliant,
    //         'Underlining Goods':this.data[i].underlingGoods,
    //         'Assigner':this.data[i].assigner,
    //         'Assigner To Debtor':this.data[i].assignerToDebtor,



    //       }
    //     )
    //   }

      console.log('ALLID',this.allID)

    // })
  }

  selectedTransactions(event:any){
    this.selected=event;
    console.log(this.selected);
  }

  confirm() {
    if(this.selected){
      // this.factoringService.update(this.selected).subscribe((res:any)=>{
      //   console.log(res);
        this.router.navigateByUrl('/factoring/success');
      // })
      return
    }

    console.log('ALL ID FINAL',this.allID)
      // this.factoringService.update(this.allID).subscribe((res:any)=>{
      //   console.log(res);
        this.router.navigateByUrl('/factoring/success');
      // })

  }

  // selectedTransaction(event:any){
  //   console.log(event);
  //   let id=event;
  //   this.router.navigate(['/factoring/view-transaction',id])
  // }


}
