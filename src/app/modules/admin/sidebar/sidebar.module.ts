import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AllMaterialModule } from 'src/app/material-module';
import { SidebarComponent } from 'src/app/modules/admin/sidebar/sidebar.component';
import { HeaderBarComponent } from '../factoring/components/header-bar/header-bar.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SidebarComponent,
    HeaderBarComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    AllMaterialModule,
    MatIconModule

  ],
  exports: [
    SidebarComponent,

  ]
})
export class SidebarModule { }
