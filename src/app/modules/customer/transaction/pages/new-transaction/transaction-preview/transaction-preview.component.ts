import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServicesService } from 'src/app/modules/customer/services/customer-services.service';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionCommentComponent } from '../transaction-comment/transaction-comment.component';

@Component({
  selector: 'app-transaction-preview',
  templateUrl: './transaction-preview.component.html',
  styleUrls: ['./transaction-preview.component.scss']
})
export class TransactionPreviewComponent {
  panelOpenState = false;
  secondPanelOpenState=false;
  transactionId:any;
  transactionDetails:any;
  groupCompanies:any;
  userDetails:any;
  subscriber:any;
  productName:any;
  
  productsTypes:any[] =[
    { name:'Confirmation',value:'CONFIRMATION'},
    { name:'Discounting',value:'DISCOUNTING'},
    { name:'Confirmation & Discounting',value:'CONFIRMANDDISCOUNT'},
    { name:'Refinancing',value:'REFINANCE'},
    { name:'Bankers Acceptance',value:'BANKER'},
    { name:'Bank Guarantee',value:'BANKGUARANTEE'},
    { name:'Avalisation',value:'BILLAVALISATION'}
  ]

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private transactionService:TransactionService,
    private customerService:CustomerServicesService,
    private dialog:MatDialog,
  ) {}

  ngOnInit() {
    this.userDetails =JSON.parse(localStorage.getItem('userInfo'));
    this.subscriber = this.userDetails.subscriberType;
    this.groupCompanies=JSON.parse(localStorage.getItem('groupCompany'));
    // this.customerService.getGroupCompanySubsidiary().subscribe((res:any)=>{
    //   this.groupCompanies=res.data[0];
    // })
    this.route.queryParams.subscribe(param=>{
      this.transactionId=param['transactionId'];
    });
    this.transactionService.getTransactionByID(this.transactionId).subscribe((res:any)=>{
      console.log(res);
      this.transactionDetails=res.data[0];
      this.findProductName(this.transactionDetails?.requirementType)
      console.log(this.transactionDetails);
    })
    
  }

  findProductName(name:any) {
    console.log(name)
    let product = this.productsTypes.find((item:any)=>
      item.value===name
    )
    console.log(product)
    this.productName= product.name.toUpperCase();
  }

  getGroupCompany(id:any){
    let companyName = this.groupCompanies?.businessDetails.find((item:any)=>item.id==id)
    return companyName?.companyName;
  }

  editTransaction(){
    console.log('Clicked Edit',this.transactionId);
    this.router.navigateByUrl(`/customer/transactions/new?transactionId=${this.transactionId}`);
    // this.router.navigateByUrl('/customer/transactions/new');
  }

  openFile(){
    window.open(this.transactionDetails.invoiceUpload,'_blank');
  }

  cancelTransaction(){
    var data={
      "transactionId":this.transactionId,
      "quotationId":"",
      "comments":""
    }
    this.dialog.open(TransactionCommentComponent,{
      width: '500px',
      height: '350px',
      data:{
        'id':this.transactionId
      }
    });
  }

  saveTransaction(){
    if(this.transactionDetails.status!='ACTIVE'){
      let data={
        "transactionId":this.transactionId,
    }
      this.transactionService.transactionSave(data).subscribe((res:any)=>{
        if(res.success){
          console.log(res);
          this.router.navigateByUrl('/customer/transactions/new/success');
        }
      })
    }
    else{
      
      this.router.navigateByUrl('/customer/transactions/new/success');
    }
  }

  openMaturityDateFile(){
    window.open(this.transactionDetails.refinanceLcUpload,'_blank');
  }

  convertBoolean(e){
    // console.log(e)
    if(e?.toLowerCase() == true || e?.toLowerCase() == 'true' ||e?.toLowerCase() == 'yes' ){
      return 'Yes'
    }else{
      return 'No'
    }
  }
  
}
