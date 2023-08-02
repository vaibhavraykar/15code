import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  year:any;
  displayColumns:string[]=['Symbol', 'Bid', 'Ask', 'Last', 'Open', 'High', 'Low', 'Chg', 'Chg1', 'Time'];
  dataSource:any[]=[
    {Symbol:'EUR/USD', Bid: 1.0031, Ask: 1.0033, Last: 1.0032, Open: 1.0059, High: 1.0062, Low: 1.0006, Chg: -0.0028, Chg1: '-0.28%', Time: '06:20:23'},
    {Symbol:'EUR/USD', Bid: 1.0031, Ask: 1.0033, Last: 1.0032, Open: 1.0059, High: 1.0062, Low: 1.0006, Chg: -0.0028, Chg1: '-0.28%', Time: '06:20:23'},
    {Symbol:'EUR/USD', Bid: 1.0031, Ask: 1.0033, Last: 1.0032, Open: 1.0059, High: 1.0062, Low: 1.0006, Chg: -0.0028, Chg1: '-0.28%', Time: '06:20:23'},
    {Symbol:'EUR/USD', Bid: 1.0031, Ask: 1.0033, Last: 1.0032, Open: 1.0059, High: 1.0062, Low: 1.0006, Chg: -0.0028, Chg1: '-0.28%', Time: '06:20:23'},
    {Symbol:'EUR/USD', Bid: 1.0031, Ask: 1.0033, Last: 1.0032, Open: 1.0059, High: 1.0062, Low: 1.0006, Chg: -0.0028, Chg1: '-0.28%', Time: '06:20:23'},
    {Symbol:'EUR/USD', Bid: 1.0031, Ask: 1.0033, Last: 1.0032, Open: 1.0059, High: 1.0062, Low: 1.0006, Chg: -0.0028, Chg1: '-0.28%', Time: '06:20:23'},
  ];
  row1: any = [
    {
      leftText: '$2,000',
      rightText: 'lifetime savings',
      rightSubtext: 'Sub text goes here'
    },
    {
      leftText: '10',
      rightText: 'Total no. of banks quoted on transactions',
      rightSubtext: ''
    },
    {
      leftText: '1.5 Days',
      rightText: 'Average time for receiving a Quote',
      rightSubtext: ''
    },
  ];

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  campaignTwo = new FormGroup({
    start: new FormControl(new Date(year, month, 15)),
    end: new FormControl(new Date(year, month, 19)),
  });

  transaction: any = [
    {
      type: 'Rejected transactions',
      value: '0',
    },
    {
      type: 'Accepted transactions',
      value: '0',
    },
    {
      type: 'Expired transactions',
      value: '0',
    },
    {
      type: 'Banks transactions',
      value: '0',
    },
  ];

  chartData= {
    labels: ['India', 'Bangladesh'],
    data: [1, 4],
    backgroundColor: ['#e26e52', '#628de3'],
  };

  chartData2= {
    labels: ['Confirmation', 'Refinancing', 'Discounting', 'Bankers acceptance'],
    data: [2, 1, 1, 1],
    backgroundColor: ['#628de3', '#e26e52', '#E3A567', '#99CE83'],
  };

  lineChart= {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [{
      label: 'Data Set 1',
      data: [1 ,1 ,1 , 8, 10],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
        label: 'Data Set 2',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 0,
        pointRadius: 5,
    }]
  }
  getData: string[];
  getBg: string[];
  getTransaction: string[];
  getTransactBg: string[];

  ngOnInit(): void {

    this.getData = this.chartData.labels;
    this.getBg = this.chartData.backgroundColor;
    this.getTransaction = this.chartData2.labels;
    this.getTransactBg = this.chartData2.backgroundColor;
    console.log(this.getData,'getdata');

  }


}
