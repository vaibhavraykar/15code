import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AllMaterialModule } from 'src/app/material-module';
import { RouterModule } from '@angular/router';
import { SelectRoleComponent } from './select-role.component';


@NgModule({
  declarations: [
    SelectRoleComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    AllMaterialModule,
    MatIconModule

  ],
  exports: [

  ]
})
export class SelectRoleModule { }
