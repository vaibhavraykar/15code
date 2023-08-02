import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddVasPopupComponent } from '../add-vas-popup/add-vas-popup.component';
import { TransactionDetailsPopupComponent } from '../transaction-details-popup/transaction-details-popup.component';
import { Router } from '@angular/router';
const moment = _moment;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit ,AfterViewInit{
  chartDataCountrywise: any = null;
  chartDataProductwise: any = null;
  lineChartData: any = null;
  years: any = [];
  noData: boolean = false;
  noDataQuotes: boolean = false;
  noActive: boolean = false;
  noChart: boolean = false;
  noTransaction: boolean = false;
  transactions: any[] = [{
    name: 'Rejected Transactions',
    value: 0,
  },
  {
    name: 'Accepted Transactions',
    value: 0,
  },
  {
    name: 'Expired Transactions',
    value: 0,
  },
  {
    name: 'Total Transactions',
    value: 0,
  },];
  displayedColumns: string[] = ['col-1', 'col-2'];
  dashboardData = {
    activeTransactions: 0,
    avgDaysOfReceivingQuotes: 0,
    lifeTimeSavings: 0,
    noOfBankQuoted: 0,
    quotesReceived: 0,
  };
  transBurification = {
    acceptTransactions: 0,
    expiredTransactions: 0,
    rejectTransactions: 0,
    totalTransactions: 0,
  };
  countrywiseProduct: any = {};
  productwiseProduct: any = {};
  today = new Date();
  selectedyear = this.today.getFullYear();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  range2 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private router: Router
  ) {
    console.log(this.dashboardData.noOfBankQuoted, 'chart');
    console.log(this.dashboardData.avgDaysOfReceivingQuotes, 'chart');


    console.log(this.dashboardData.noOfBankQuoted, 'data');
  }
  ngAfterViewInit(): void {
    document.querySelector('mat-sidenav-content').scroll(0,0)
  }
  userDetails: any = {};
  ngOnInit(): void {


    this.getUserData();
    this.fetchTransQuote();
    this.fetchTransactionBifurcationFor();
    this.fetchProductAndCountywise();
    this.fetchlc_sum();
  }
  convertToDateFormat(inputDate: any) {
    if (!inputDate) {
      return '';
    }
    return moment(inputDate).format('DD/MM/YYYY');
  }

  fetchTransQuote() {
    this.dashboardService.getTransAndQuotes().subscribe({
      next: ({ data }: any) => {
        this.dashboardData = data[0];
        if (
          !(this.dashboardData?.noOfBankQuoted) ||
          this.dashboardData?.noOfBankQuoted == 0
        ) {
          this.noData = true;
        }
        if(this.dashboardData?.avgDaysOfReceivingQuotes == 0) {
          this.noDataQuotes = true;
        }
      },

    });

  }
  fetchTransactionBifurcationFor() {

    const { start, end } = this.getDateFromTo(this.range.value);
    this.dashboardService
      .getTransactionBifurcationFor({
        fromDate: start,
        toDate: end,
      })
      .subscribe({
        next: ({ data }: any) => {

          this.transBurification = data[0];

          this.transactions = [
            {
              name: 'Rejected Transactions',
              value: this.transBurification.rejectTransactions,
            },
            {
              name: 'Accepted Transactions',
              value: this.transBurification.acceptTransactions,
            },
            {
              name: 'Expired Transactions',
              value: this.transBurification.expiredTransactions,
            },
            {
              name: 'Total Transactions',
              value: this.transBurification.totalTransactions,
            },
          ];
          console.log(this.transactions, 'sssss');
        },
      });
  }
  fetchProductAndCountywise() {
    const { start, end } =  this.getDateFromTo(this.range2.value);
    this.dashboardService
      .getProductAndCountywise({
        fromDate: start,
        toDate: end,
      })
      .subscribe({
        next: ({ data }: any) => {
          this.chartDataCountrywise = null;
          this.countrywiseProduct = data[0].compositeCountryWiseTransactions;
          this.productwiseProduct = data[0].compositeProductWiseTransactions;
          this.chartDataCountrywise = this.convertToCountryChartData(
            this.countrywiseProduct
          );
          this.chartDataProductwise = this.convertToproductChartData(
            this.productwiseProduct
          );
          console.log(this.chartDataProductwise);
          if (
            this.chartDataCountrywise == null ||
            this.chartDataCountrywise?.data?.length == 0
          ) {
            this.noChart = true;
          }
          if (
            this.chartDataProductwise == null ||
            this.chartDataProductwise?.data?.length == 0
          ) {
            this.noTransaction = true;
          }
        },
      });
  }

  getDateFromTo(dateRange: any) {
    const { start, end } = dateRange;
    if (!start && !end) {
      return {
        start: '',
        end: '',
      };
    }
    return {
      start: new Date(start)?.getTime(),
      end: new Date(end)?.getTime(),
    };
  }
  bifurcationDateChanage(_e: any) {
    const { start, end } = this.range.value;
    if (!start && !end) {
      return;
    }
    this.fetchTransactionBifurcationFor();
  }

  productAndCountryWiseDateChanage(_e: any) {
    const { start, end } = this.range2.value;
    if (!start && !end) {
      return;
    }
    this.fetchProductAndCountywise();
  }

  convertToCountryChartData(apiResponse) {
    const totalCount = apiResponse?.totalTransactionCount||0;
    const countryWiseTransactions = apiResponse?.countryWiseTransactions||[];
    const data = countryWiseTransactions.map((item) => item.transCount);
    const labels = countryWiseTransactions.map((item) => item.country);
    if (
      totalCount >
      countryWiseTransactions.reduce((acc, item) => acc + item.transCount, 0)
    ) {
      labels.push('OTHERS');
      data.push(
        totalCount -
        countryWiseTransactions.reduce(
          (acc, item) => acc + item.transCount,
          0
        )
      );
    }
    const chartData = {
      totalCount,
      labels,
      data,
      backgroundColor: ['#e26e52', '#628de3', '#E3A567'],
    };

    return chartData;
  }

  convertToproductChartData(apiResponse) {
    const totalCount = apiResponse?.totalTransactionCount||0;
    const productWiseTransactions = apiResponse?.productwiseTransactions||[];
    const data = productWiseTransactions.map((item) => item.transCount);
    const labels = productWiseTransactions.map((item) => item.requirementType);
    const chartData = {
      totalCount,
      labels,
      data,
      backgroundColor: [
        '#628de3',
        '#e26e52',
        '#e3a567',
        '#99ce83',
        '#AA8DF2',
        '#F2A388',
        '#6ED5E6',
        '#91C3FF',
        '#FFB9FF',
      ],
    };
    return chartData;
  }
  fetchlc_sum() {
    this.lineChartData = null;
    this.dashboardService.getlc_sum(this.selectedyear).subscribe({
      next: ({ data }: any) => {
        this.lineChartData = this.createlineChartData(
          data[0].cumulativeTransAmtVsTransCounts
        );
        console.log(this.lineChartData);
      },
    });
  }
  createlineChartData(response: any) {
    const apiResponse = response;
    // Create empty data array with length of 12
    const data = new Array(12).fill(0);
    const data2 = new Array(12).fill(0);
    // Loop through API response data and add values to corresponding indexes in data array
    apiResponse.forEach((item) => {
      const monthIndex = new Date(
        Date.parse(`1 ${item.month} 2000`)
      ).getMonth(); // Get month index (0-11) based on month string
      data[monthIndex] = item.transCount;
      data2[monthIndex] = item.lcSum;
    });
    // Update lineChart object with new data array
    let lineChart = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      data: [
        {
          label: 'Transaction count',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Cumulative Transaction count',
          data: data2,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 0,
          pointRadius: 5,
        },
      ],
    };
    return lineChart;
  }

  getUserData() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  }
  addVas() {
    this.dialog.open(AddVasPopupComponent);
  }
  openTransactionDetails() {
    this.dialog.open(TransactionDetailsPopupComponent);
  }
  gotoActiveTransaction() {
    this.router.navigateByUrl('/customer/transactions/active-transaction');
  }
  gotoAllTransaction() {
    this.router.navigateByUrl('/customer/transactions/all-transaction?from=dashboard', { state: { from: 'tile', "isFindQuoteReceivedTransactions": true } });
  }

  countryWiseChartEmitter(e: any) {
    if(e==undefined){
      return
    }
    let data;
    let selectedCountry = this.chartDataCountrywise.labels[e.index]
    if (selectedCountry === 'Others') {
      data = {
        from: 'countryPie',
        "country": selectedCountry,
        "nonIncludedCountries": [
          this.chartDataCountrywise.labels[0],
          this.chartDataCountrywise.labels[1]
        ]
      }
    } else {
      data = {
        from: 'countryPie',
        "country": selectedCountry
      }
    }

    this.router.navigateByUrl(`/customer/transactions/all-transaction?from=dashboard`, { state: data });
  }

  productWiseChartEmitter(e) {
    if(e==undefined){
      return
    }
    let data = {
      from:'productPie',
      "requirementType": this.chartDataProductwise.labels[e.index].key
    }
    this.router.navigateByUrl(`/customer/transactions/all-transaction?from=dashboard`, { state: data });

  }
  isPostPaid(){
let user =  JSON.parse(localStorage.getItem('postpaidPaymentInfo')||'{}')
if(Object.keys(user)?.length>0){
  return true
}else{ return false}

  }
}
