import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { BulkUploadTranscationComponent } from './bulk-upload-transcation/bulk-upload-transcation.component';


const routes: Routes = [

  { path: '',
    component:BulkUploadTranscationComponent
   },
  
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class BulkRoutingModule { }
