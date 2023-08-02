import { Component, ViewChild, TemplateRef} from '@angular/core';
import { ProductManagementService } from '../../services/productManagement/productManagement.service';
import { Location } from '@angular/common';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent {
  
  id:any;
  viewData:any;
  productCountries=[];
  dialogRef: MatDialogRef<any, any>;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(private ProductService:ProductManagementService,private router: Router, private route: ActivatedRoute, private location:Location,private dialog: MatDialog,){
    this.ProductService.productId.subscribe((res:any)=>{
      if(res){
        this.id=res;
      }
    })
    this.id=this.route.snapshot.paramMap.get('id');

  }
  ngOnInit(){
    console.log(this.id);
    this.viewDetails();
  }
  viewDetails(){
    this.ProductService.getProductById(this.id).subscribe((res:any)=>{
      if(res['success'] == true){
        this.viewData=res['data'][0];
        console.log('data',this.viewData);
        this.productCountries = res['data'][0].productCountries;
        var p: any = '';
        if (this.productCountries) {
          for (let i = 0; i < this.productCountries.length; i++) {
            if (i === 0) {
              p = this.productCountries[i].country;
            } else {
              p = p + ',' + this.productCountries[i].country;
            }
          }
          this.productCountries = p;
          console.log(p);
        }
      }
      else{
        const popup = this.dialog.open(CommonPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
          message:res['message'],
          status:res['success']
          },
        });
      }
    })
  }

  viewCountry() {
    this.dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height: '250px',
    });
  }
  
  back(): void {
    this.location.back()
  
  } 
  close(){
    this.dialogRef.close();
  }
}
