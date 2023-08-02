import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FactoringService } from '../../services/factoring.service';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
import { AdminService } from '../../../services/admin.service';



const moment = _moment;

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.scss']
})
export class EditTransactionComponent implements OnInit{

  
  country = [
    {name: 'India', value : '1'},
    {name: 'Bhutan', value : '2'}
  ];
  bcountry = [
    {name: 'India', value : '1'},
    {name: 'Bhutan', value : '2'}
  ];
  product = [
    {name: 'Product1', value : '1'},
    {name: 'Product2', value : '2'}
  ];
  service = [
    {name: 'Service1', value : '1'},
    {name: 'Service2', value : '2'}
  ];
  port = [
    {name: 'Port1', value : '1'},
    {name: 'Port2', value : '2'}
  ];
  discharge =  [
    {name: 'Port of Discharge1', value : '1'},
    {name: 'Port of Discharge2', value : '2'}
  ];
  
  charges = [
    {name: 'ASSIGNER', value : '1'},
    {name: 'SELF', value : '2'}
  ];
  assigner = [
    {name: 'Assigner', value : '1'},
    {name: 'Self', value : '2'}
  ];
  debtor = [
    {name: 'Debtor', value : '1'},
    {name: 'Self', value : '2'}
  ];

  updatedData:any={};
  assigners:FormControl;
  debtors:FormControl
  date:FormControl;
  dueDate:FormControl;
  validityDate:FormControl;
  countryOrigin:FormControl;
  countryDischarge:FormControl;
  goods:FormControl;
  radioOption:any;
  transactId?:any;
  countries:any=[];
  all_goods:any=[];
  group_companies:any=[];
  viewData?:any;
  selectedUser?:any;
  chargesOn:any;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private apiService:ApiService,
    private factoringService:FactoringService,
    private adminService :AdminService
  ){}

  ngOnInit(){
    this.transactId=this.route.snapshot.paramMap.get('id');
    console.log(this.transactId);
    this.editTransaction(this.transactId);

    this.adminService.getAllCountryCode().subscribe((res:any)=>{
      this.countries = res.data[0].countryList;
      console.log(this.countries);
    });
    this.adminService.getAllGoods().subscribe((res:any)=>{
      this.all_goods = res.data[0];
      console.log(this.all_goods);
    });
    // this.factoringService.getCompany().subscribe((res:any)=>{
      // console.log(res);
      // this.group_companies=res;
      console.log(this.group_companies);
    // });

    this.date = new FormControl('',[]);
    this.dueDate = new FormControl('',[]);
    this.countryOrigin=new FormControl('',[]);
    this.countryDischarge=new FormControl('',[]);
    this.validityDate=new FormControl('',[]);
    this.goods=new FormControl('',[]);
    this.chargesOn = new FormControl('',[]);
    this.assigners = new FormControl('',[]);
    this.debtors = new FormControl('',[]);
  }

  editTransaction(id:any){
    // this.factoringService.getTransactionById(id).subscribe((res:any)=>{
      // this.viewData=res;
      console.log(this.viewData);
      this.selectedUser=this.viewData.factoringUserType;

      this.date.setValue(this.viewData.date);
      this.dueDate.setValue(this.viewData.dueDate);
      this.validityDate.setValue(this.viewData.transactionValidityDate);
      this.countryOrigin.setValue(this.viewData.countryOrigin);
      this.countryDischarge.setValue(this.viewData.countryDischarge);
      this.goods.setValue(this.viewData.underlingGoods);
      this.chargesOn.setValue(this.viewData.chargesOn);
      this.assigners.setValue(this.viewData.assignor);
      this.debtors.setValue(this.viewData.assignorToDebtor);

      this.updatedData=this.viewData;
    // });
  }

  updatedInvoice(event:any){
    console.log(event);
    if(this.viewData.invoiceNumber!=event){
      this.updatedData.invoiceNumber=event;
    }
    console.log(this.updatedData);
  }

  updateDate(event:any){
    var date=moment(event.value).format('YYYY-MM-DD');
    if(this.viewData.date!=date){
      this.updatedData.date=date;
    }
  }

  updateDueDate(event:any){
    var date=moment(event.value).format('YYYY-MM-DD');
    if(this.viewData.dueDate!=date){
      this.updatedData.dueDate=date;
    }
  }

  updateValidityDate(event:any){
    var date=moment(event.value).format('YYYY-MM-DD');
    if(this.viewData.validityDate!=date){
      this.updatedData.validityDate=date;
    }
  }

  updatedTenor(event:any){
    if(this.viewData.tenor!=event){
      this.updatedData.tenor=event;
    }
  }

  updatedGracePeriod(event:any){
    if(this.viewData.gracePeriod!=event){
      this.updatedData.gracePeriod=event;
    }
  }

  updatedDebtor(event:any){
    if(this.viewData.assignorToDebtor!=event){
      this.updatedData.assignorToDebtor=event;  
    }
  }

  updatedAssigner(event:any){
    if(this.viewData.assignor!=event){
      this.updatedData.assignor=event;
    }
  }

  assignerChange(event:any){
    if(this.viewData.factoringUserType=='ASSIGNOR'&&this.viewData.assignor!=event.value){
      this.updatedData.assignor=event.value;
    }
    else if(this.viewData.factoringUserType=='DEBTOR'){
      this.updatedData.assignor=event.value;
    }
  }

  debtorChange(event:any){
    if(this.viewData.factoringUserType=='DEBTOR'&&this.viewData.debtor!=event.value){
      this.updatedData.assignorToDebtor=event.value;
    }
    else if(this.viewData.factoringUserType=='ASSIGNOR'){
      this.updatedData.assignorToDebtor=event.value;
    }
  }
  
  onRadioSelection(event:any){
    if(this.viewData.factoringUserType!=event.value){
      this.updatedData.factoringUserType=event.value;
    }
  }

  toggleESG(event:any){
    if(this.viewData.isESGCompliant!=event.checked){
      this.updatedData.isESGCompliant=event.checked;
    }
  }

  chargesChange(event:any){
    if(this.viewData.chargesOn!=event.value){
      this.updatedData.chargesOn=event.value;
    }
  }

  goodsChange(event:any){
    if(this.viewData.underlyingGoods!=event.value){
      this.updatedData.underlyingGoods=event.value;
    }
  }

  countryOriginChange(event:any){
    if(this.viewData.countryOrigin!=event.value){
      this.updatedData.countryOrigin=event.value;
    }
  }

  countryDischargeChange(event:any){
    if(this.viewData.countryDischarge!=event.value){
      this.updatedData.countryDischarge=event.value;
    }
  }

  updatedAmount(event:any){
    if(this.viewData.amount!=event.value){
      this.updatedData.amount=event.value;
    }
  }

  save(){
    console.log(this.updatedData);
    this.updatedData.id=parseInt(this.transactId);
    // this.factoringService.createTransaction(this.updatedData).subscribe((res:any)=>{
      this.router.navigateByUrl('admin/factoring/transaction-preview');
    // });
  }
}

