import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllMaterialModule } from 'src/app/material-module';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  imports: [AllMaterialModule],
})
export class PrivacyPolicyComponent {
  @ViewChild('renderPage', { static: true }) renderPage: ElementRef;
  policy: any;
  constructor(
    private apiService: ApiService,
    private dialog: MatDialogRef<PrivacyPolicyComponent>,
    @Inject(MAT_DIALOG_DATA)private data :any
  ) {


  }
  ngOnInit(){
    this.policy = this.data;
    this.renderPage.nativeElement.innerHTML = this.policy;
  }

  close() {
    this.dialog.close();
  }
}
