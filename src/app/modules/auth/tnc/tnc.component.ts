import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllMaterialModule } from 'src/app/material-module';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss'],
  imports: [AllMaterialModule],
})
export class TncComponent {
  @ViewChild('renderPage', { static: true }) renderPage: ElementRef;
  tnc: any;
  constructor(
    private apiService: ApiService,
    private dialog: MatDialogRef<TncComponent>,
    @Inject(MAT_DIALOG_DATA)private data :any
  ) {

    // this.apiService.fetchTnc().subscribe((res: any) => {
    //   this.tnc = res.data[0]['termsAndCondition'];
    //   this.renderPage.nativeElement.innerHTML = this.tnc;
    // });
  }
  ngOnInit(){
    this.tnc =this.data;
    this.renderPage.nativeElement.innerHTML = this.tnc;
  }
  close() {
    this.dialog.close();
  }
}
