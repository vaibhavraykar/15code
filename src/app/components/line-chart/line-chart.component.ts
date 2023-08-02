import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() chartData!: any;
  data: any;
  options: any;

  ngOnInit(): void {
    console.log(this.chartData,'nonit')
    this.data = {
      labels: this.chartData.labels,
      datasets: [
        {
          label: '',
          data: this.chartData.data,
          backgroundColor: this.chartData.backgroundColor,
          borderWidth: 1,
        },
      ],
    };

    this.options = {
      responsive: false,
      maintainAspectRatio: false,

      // hoverOffset: 20,
    };

    var myChart = new Chart('lineChart', {
      type: 'line',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

          datasets: [{
              label: this.chartData.data[0].label,
              data: this.chartData.data[0].data,
              backgroundColor: 'rgba(235, 114, 3, 0.2)',
              borderColor: 'rgba(235, 114, 3, 1)',
              borderWidth: 2,
              pointRadius: 1,
              pointBorderColor: 'rgba(235, 114, 3, 1)',

          },
          {
              label:this.chartData.data[1].label,
              data: this.chartData.data[1].data,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 0,
              pointRadius: 3,
          }]
      },
      options: {

          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                  display: false
              },
             grid:{
              display:false
             }
          },
         x: {
          ticks:{
            color: '#0032A0',
            font:{
              size:9
            }
          },
           grid:{
            display:false
           }
        }
          },
          plugins: {
            legend: {
              display: false,
              position: 'right',
            },


          },
      }
    });
  }
}
