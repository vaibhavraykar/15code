import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() chartData: any
  myChart: any
  data: any;
  options: any;
  ngOnInit(): void {
    this.createBarChart(this.chartData);
  }
  createBarChart(chartData: any) {
    const ctx: any = document.getElementById('barChart');
    const legendExtraSpace = {
      id: 'legendExtraSpace',
      afterInit(c, a, op) {
        const fitValue = c.legend.fit
        c.legend.fit = function fit() {
          console.log(c)
          fitValue.bind(c.legend)()
          let width = this.width // += 100;
          let clickeffect = this.legendHitBoxes[0].width// +=100
          let clickeffect2 = this.legendHitBoxes[1].width //+=100
          return [width, clickeffect, clickeffect2]
        }
      }
    }
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData?.label || '', // Add your labels here
        datasets: [{
          label: 'Transaction quote',
          data: chartData?.quote || [], // Add your data values here
          backgroundColor: [chartData?.quote_color], // Add your bar colors here
          borderWidth: 0
        },
        {
          label: 'Transaction available',
          data: chartData?.available || [], // Add your data values here
          backgroundColor: [chartData?.available_color], // Add your bar colors here
          borderWidth: 0
        }]
      },
      options: {
        responsive: false,

        plugins: {
          tooltip: {
            enabled: false,
            external: this.customTooltip
          },
          legend: {

            display: false,
            position: 'right', // Place legends on the right side
            align: 'start',
            labels: {
              textAlign: 'right'
            },

          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },

      },
      // plugins:[legendExtraSpace]
    });

  }
  customTooltip(context: any) {
    // Tooltip Element
    let tooltipEl: any = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = '<table style="height: 80px;width: 160px"></table>';
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    const tooltipModel = context.tooltip;
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
      return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
      const titleLines = tooltipModel.title || [];
      const bodyLines = tooltipModel.body.map(getBody);

      let innerHtml = '<thead>';

      titleLines.forEach(function (title) {
        innerHtml += `<tr><th style="font-family: Roboto, 'Lato', sans-serif; font-size: 14px; font-weight: 500;color: rgb(66, 66, 66);margin-bottom: 10px;" >${title.toUpperCase()} </th></tr>`;
      });
      innerHtml += '</thead><tbody>';

      bodyLines.forEach(function (body, i) {
        const colors = tooltipModel.labelColors[i];
        const text = body[0].split(':')
        innerHtml += `<tr><td><div style="color: rgb(117, 117, 117); font-weight:300;   font-family: Roboto, 'Lato', sans-serif;font-size: 14px;">${text[0]}</div>
               <div style="font-family: Roboto, 'Lato', sans-serif;font-size: 24px;color:${colors.backgroundColor};">${text[1]}</div></td></tr>`;
      });
      innerHtml += '</tbody>';

      let tableRoot = tooltipEl.querySelector('table');
      tableRoot.innerHTML = innerHtml;
    }

    const position = context.chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = 1;
    tooltipEl.style.background = 'white';
    tooltipEl.style.padding = '10px';
    tooltipEl.style.border = '1px solid grey';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.zIndex = '99';

  };
}
