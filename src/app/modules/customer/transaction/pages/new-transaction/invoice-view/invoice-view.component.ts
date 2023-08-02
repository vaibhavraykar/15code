import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit{
  fileName:any;
  filePath:string;
  constructor(
    public dialogRef: MatDialogRef<InvoiceViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{name:string,path:any},
  ) {}

  ngOnInit(){
    this.fileName = this.data?.name;
    this.filePath = this.data?.path;
  }

  viewFile(event:any){
    const byteArray = new Uint8Array(
          window
            .atob(this.filePath.split(';base64,')[1])
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        const file = new Blob([byteArray], { type: this.filePath.split(';base64,')[0].split(':')[1] });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
  }

  close() {
    this.dialogRef.close();
  }
}
