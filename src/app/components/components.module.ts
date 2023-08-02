import { LineChartComponent } from './line-chart/line-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { InputtextComponent } from './inputtext/inputtext.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AllMaterialModule } from '../material-module';
import { TableComponent } from './table/table.component';
import { CardsComponent } from './cards/cards.component';
import { TabComponent } from './tab/tab.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { AccordionComponent } from './accordion/accordion.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ForgetPassPopupComponent } from './forget-pass-popup/forget-pass-popup.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { RestrictPopupComponent } from './restrict-popup/restrict-popup.component';
import { AdminV2CommonPopupErrorComponent } from './adminv2-common-popup-error/adminv2-common-popup-error.component';



@NgModule({
  declarations: [
    ButtonComponent,
    InputtextComponent,
    DropdownComponent,
    TableComponent,
    CardsComponent,
    TabComponent,
    PieChartComponent,
    LineChartComponent,
    AccordionComponent,
    CommonPopupComponent,
    AdminV2CommonPopupErrorComponent,
    FileUploadComponent,
    ForgetPassPopupComponent,
    SpinnerComponent,
    BarChartComponent,
    RestrictPopupComponent
  ],
  imports: [
    CommonModule,
    AllMaterialModule,
    NgChartsModule
  ],
  exports:[
    InputtextComponent,
    DropdownComponent,
    ButtonComponent,
    TableComponent,
    CardsComponent,
    TabComponent,
    PieChartComponent,
    LineChartComponent,
    AccordionComponent,
    FileUploadComponent,
    SpinnerComponent,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent,
    RestrictPopupComponent
  ]
})
export class ComponentsModule { }
