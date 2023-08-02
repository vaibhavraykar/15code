import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMaterialModule } from 'src/app/material-module';
import { HeaderComponent } from './header/header.component';
import { AdminTransactionDetailsComponent } from './all-details/admin-transaction-details/admin-transaction-details.component';
import { AdminUserDetailsComponent } from './all-details/admin-user-details/admin-user-details.component';
import { AllDetailsComponent } from './all-details/all-details.component';
import { ChipsDropdownComponent } from './chips-dropdown/chips-dropdown.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { GeneralPopupComponent } from './general-popup/general-popup.component';
import { TableComponent } from './table/table.component';
import { RouterModule } from '@angular/router';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { DatepickerComponent } from './datepicker/datepicker.component';




@NgModule({
  declarations: [
    HeaderComponent,
    TableComponent,
    AllDetailsComponent,
    AdminTransactionDetailsComponent,
    AdminUserDetailsComponent,
    CommonPopupComponent,
    GeneralPopupComponent,
    ChipsDropdownComponent,
    FileUploadComponent,
    SideNavBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AllMaterialModule,
  ], exports: [
    HeaderComponent,
    TableComponent,
    AllDetailsComponent,
    AdminTransactionDetailsComponent,
    AdminUserDetailsComponent,
    CommonPopupComponent,
    GeneralPopupComponent,
    ChipsDropdownComponent,
    FileUploadComponent,
    SideNavBarComponent,
  ]
})
export class ComponentModule { }
