import { Component,Input } from '@angular/core';
import { Location } from '@angular/common';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FactoringService } from '../../services/factoring.service';


@Component({
  selector: 'app-view-trans-list',
  templateUrl: './view-trans-list.component.html',
  styleUrls: ['./view-trans-list.component.scss']
})
export class ViewTransListComponent {
  
  
  transactionId:any;
  viewData:any;
  @Input() transDetails: boolean;
  @Input() customerDetails: boolean;

  constructor(private factorService: FactoringService,private router: Router,
     private route: ActivatedRoute, private location:Location,private dialog: MatDialog,){
    // this.factorService.transId.subscribe((res:any)=>{
    //   if(res){
    //     this.transactionId=res;
    //   }
    // })
  }
  ngOnInit(){
    this.transactionId=this.route.snapshot.paramMap.get('id');
    console.log(this.transactionId);
    this.viewDetails();
  }
  viewDetails(){
    this.factorService.transactionId(this.transactionId).subscribe((res:any)=>{
      if(res['success'] == true){
        this.viewData=res['data'][0];
        console.log('line 39',this.viewData);
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
  openLink() {
    const url = this.viewData.invoiceUpload;
    const windowWidth = 800;
    const windowHeight = 600;
    const windowLeft = (window.screen.width - windowWidth) / 2;
    const windowTop = (window.screen.height - windowHeight) / 2;
    const popupWindow = window.open(url, 'PopupWindow', `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`);
  }
  onChangeRadio(e){
    if(e.value == 'transaction'){
      this.transDetails = true;
      this.customerDetails = false;
    }else{
      this.customerDetails = true;
      this.transDetails = false;
    }
  }
  back(): void {
    this.location.back()
  } 

}
