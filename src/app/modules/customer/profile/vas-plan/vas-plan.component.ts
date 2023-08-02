import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerServicesService } from '../../services/customer-services.service';
import { PostpaidTransactionPopupComponent } from '../postpaid-transaction-popup/postpaid-transaction-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vas-plan',
  templateUrl: './vas-plan.component.html',
  styleUrls: ['./vas-plan.component.scss']
})
export class VASPlanComponent implements OnInit{

  @Input() vasPlans:any;
  @Input() vasPlansEdit:any;
  @Output() vasSelected:EventEmitter<any>=new EventEmitter;
  @Input() subscriptionPlanCurrency:string;
  @Input() postpaidValue:boolean;

  selectedVasPlans:any=[];
  count:number=0;

  constructor(
    private dialog: MatDialog,
    private customerService:CustomerServicesService,
  ){}
  

  ngOnInit():void{
    console.log(this.vasPlans);
    if(this.vasPlansEdit){
      console.log(this.vasPlansEdit,"editi");
      this.vasPlansEdit.forEach(ele=>{
        this.selectedVasPlans.push(ele.productId)
        this.count += this.vasPlans.find(item=>item.productId==ele.productId)?.price;
    console.log(this.selectedVasPlans);
      })
    }
    console.log(this.selectedVasPlans);
  }

  addVAS(index:any){
    if(!this.selectedVasPlans.includes(this.vasPlans[index].productId)){
      this.selectedVasPlans.push(this.vasPlans[index].productId);
      console.log(this.selectedVasPlans);
      this.count=this.count+this.vasPlans[index].price;
    }
    else{
      var at = this.selectedVasPlans.indexOf(this.vasPlans[index].productId)
      console.log(at)
      this.selectedVasPlans.splice(at,1);
      this.count=this.count-this.vasPlans[index].price;
      console.log(this.selectedVasPlans);
    }
  }

  buy(){
    this.vasSelected.emit(this.selectedVasPlans);
  }
}
