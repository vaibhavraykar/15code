import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerServicesService } from '../../services/customer-services.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {
  @ViewChild('renderPage', { static: true }) renderPage: ElementRef;
  tnc: any;
  constructor(
    private cs: CustomerServicesService,
    private dialogRef: MatDialogRef<TncComponent>
  ) {}

  ngOnInit(): void {
    this.cs.getTerms().subscribe((res: any) => {
      console.log(res);
      this.tnc = res.data[0]['termsAndCondition'];
      this.renderPage.nativeElement.innerHTML = this.tnc;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
