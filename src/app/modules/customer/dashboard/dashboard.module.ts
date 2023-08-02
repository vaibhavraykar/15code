import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from 'src/app/modules/customer/dashboard/dashboard.routing.module';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
  ]
})
export class DashboardModule { }
