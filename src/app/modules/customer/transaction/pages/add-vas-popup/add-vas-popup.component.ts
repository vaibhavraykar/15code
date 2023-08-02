import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-add-vas-popup',
  templateUrl: './add-vas-popup.component.html',
  styleUrls: ['./add-vas-popup.component.scss']
})
export class AddVasPopupComponent implements OnInit {
  toppings = new FormControl('');
  toppingList: any=[]
  constructor(
    private ds:DashboardService,
    public dialogRef: MatDialogRef<AddVasPopupComponent>
  ) {}
  ngOnInit(): void {
this.ds.fetchAvailableVasplan().subscribe({
  next:({data}:any)=>{
    this.toppingList=data[0]
  }
})
  }

  close() {
    this.dialogRef.close();
  }

  submitVas(){
    let payload ={
      "products": []
  }
  let val:any =  this.toppings.value||[]
  payload.products = val.map((_e:any)=>{
    return {
      productId:_e
    }
  })
  this.ds.submitUserIntrestedVas(payload).subscribe({
    next:(res:any)=>{
      this.close();
    }
  })
  }
}

