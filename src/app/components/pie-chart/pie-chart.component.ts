import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  public pieChartOptions: any;

  public pieChartData: ChartData<'pie', number[], string | string[]>;

  ngOnInit(): void {
    this.pieChartOptions = {
      layout: {
        padding: 10,
      },
      offset: 10,
      hoverOffset: 30,
      responsive: false,
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
          position: 'top',
        },
        datalabels: {
          anchor: 'end',
          align: 'start',
          color: ' #ffffff',
          formatter: (value, ctx) => {
            if (ctx.chart.data.labels) {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          },
        },
      },
    };

    this.pieChartData = {
      labels: this.chartData?.data || [],
      datasets: [
        {
          data: this.chartData?.data || [],
          backgroundColor: this.chartData?.backgroundColor || [],
          borderWidth: 0,
        },

      ],
    };
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() chartData!: any;
  @Output() pieChartEmitter:any= new EventEmitter();

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  chartClicked(_e:any){
    this.pieChartEmitter.emit(_e.active[0])
  }
}
