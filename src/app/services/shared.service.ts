import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { RestrictPopupComponent } from '../components/restrict-popup/restrict-popup.component';
// import {}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  dialogPopup:any=null

  constructor(private dialog:Dialog) { }

openRestrictPopup(){
  if(!this.dialogPopup){
    this.dialogPopup= this.dialog.open(RestrictPopupComponent)
  }
}
closeRestrictPopup(){
  if(this.dialogPopup){
    this.dialogPopup.close()
    this.dialogPopup=null
  }
}
}
