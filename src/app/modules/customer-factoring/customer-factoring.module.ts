import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthFacadeService } from 'src/app/modules/auth/state/auth.facade.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { NguCarouselModule } from '@ngu/carousel';
import { ComponentsModule } from 'src/app/components/components.module';
import { CustomerFactoringRoutingModule } from './customer-factoring.routing.module';
import { CustomerSendOtpComponent } from './customer-send-otp/customer-send-otp.component';
import { AllMaterialModule } from 'src/app/material-module';
import { CustomerFactoringSidebarComponent } from './customer-factoring-sidebar/customer-factoring-sidebar.component';
import { NewRequestFactoringComponent } from './new-request-factoring/new-request-factoring.component';
import { RouterModule } from '@angular/router';
import { ActiveTranFactoringComponent } from './active-tran-factoring/active-tran-factoring.component';
import { HisTranFactoringComponent } from './his-tran-factoring/his-tran-factoring.component';
import {MatIconModule} from '@angular/material/icon';
import { ViewTranFactoringComponent } from './view-tran-factoring/view-tran-factoring.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { AmountpipePipe } from 'src/app/pipe/amountPipe.pipe';


@NgModule({
  declarations: [
    CustomerSendOtpComponent,
    CustomerFactoringSidebarComponent,
    NewRequestFactoringComponent,
    ActiveTranFactoringComponent,
    HisTranFactoringComponent,
    ViewTranFactoringComponent,
    HeaderBarComponent,
    AmountpipePipe,
  ],
  imports: [
    CommonModule,
    NgOtpInputModule,
    AllMaterialModule,
    ComponentsModule,
    NgOtpInputModule,
    CustomerFactoringRoutingModule,
    RouterModule,
   
  ],
  exports:[
    CustomerSendOtpComponent,
    CustomerFactoringSidebarComponent,
    NewRequestFactoringComponent,
    ActiveTranFactoringComponent,
    HisTranFactoringComponent,
    ViewTranFactoringComponent,
    HeaderBarComponent,
    AmountpipePipe

  ]
})
export class CustomerFactoringModule { }
