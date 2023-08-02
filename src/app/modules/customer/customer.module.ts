import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerRoutingModule } from 'src/app/modules/customer/customer.routing.module';
import { AllMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PaypalComponent } from './paypal/paypal.component';
import { PaypalCancelComponent } from './paypal-cancel/paypal-cancel.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [  
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    PaypalComponent,
    PaypalCancelComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ComponentsModule,
    AllMaterialModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    NotificationComponent
  ]
})

export class CustomerModule { }
