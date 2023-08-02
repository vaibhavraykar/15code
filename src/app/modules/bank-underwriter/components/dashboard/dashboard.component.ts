import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { CloseTransactionPopupComponent } from '../../popup/close-transaction/close-transaction-popup/close-transaction-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
export interface dashboardTable {
  Date: string;
  'Transaction ID': number;
  Requirement: string;
  Country: string;
  Amount: string;
  Currency: string;
  Status: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('barChart') barChart: any
  show = true
  selectedLegend = 'none';
  countries = [];
  products = [];
  selectedCountry = '';
  selectedProduct = '';
  chartData: any = null;
  displayColumns = [
    'Date',
    'Transaction ID',
    'Requirement',
    'Country',
    'Amount',
    'Currency',
    'Transaction Status',
  ];
  newDataSource: any = [];
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  last: any;
  dashboardData = {
    newRequest: 0,
    quoteAcceptanceAwaited: 0,
    quotesLost: 0,
    transactionClosed: 0,
  };
  productsTypes:any[] =[
    { name:'Confirmation',value:'CONFIRMATION'},
    { name:'Discounting',value:'DISCOUNTING'},
    { name:'Confirmation & Discounting',value:'CONFIRMANDDISCOUNT'},
    { name:'Refinancing',value:'REFINANCE'},
    { name:'Bankers Acceptance',value:'BANKER'},
    { name:'Bank Guarantee',value:'BANKGUARANTEE'},
    { name:'Avalisation',value:'BILLAVALISATION'}
  ]
  selected: any;
  constructor(
    private dashboardService: DashboardService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) { }
  ngOnInit(): void {
    document.querySelector('mat-sidenav-content').scrollTop=0
    if (this.checkAutomatedBank()) {
      this.show = false
      this.sharedService.openRestrictPopup()
      return
    }
    let userData = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let chartPayload = {
      product: '',
      country: userData?.country,
    };
    this.fetchAllCountries();
    this.fetchBauStatus();
    this.fetchProductAndCountry(chartPayload);
    this.fetchAcceptedTabel();
    this.selected = 'Open';
  }
  fetchAllCountries() {
    this.apiService.getAllCountryCode().subscribe({
      next: ({ data }: any) => {
        this.countries = data[0].countryNames;
      },
    });
  }
  fetchBauStatus() {
    this.dashboardService.getBauStatus().subscribe((res: any) => {
      let response = res;
      this.dashboardData = response.data[0];
    });
  }
  fetchProductAndCountry(payload: any) {
    this.chartData = null;
    this.dashboardService.getProductAndCounty(payload).subscribe({
      next: ({ data }: any) => {
        let response = data[0].countryWiseTransactions[0];

        let resp = {
          label: [response?.country.toUpperCase()],
          quote: [response?.quotedTransactions],
          quote_color: 'rgb(219, 68, 55)',
          available_color: 'rgb(66, 133, 244)',
          available: [response?.activeTransactions],
        };
        this.chartData = resp;
        this.products = data[0].productList;


      },
    });
  }
  fetchAcceptedTabel() {
    this.dashboardService.getAcceptedTransaction(this.page.index).subscribe({
      next: (res: any) => {
        const { data, totalRecords, totalPage, page, size } = res;
        this.page = {
          ...page,
          size: size || 5,
          totalPages: totalPage,
          totalItems: totalRecords,
          totalElements: totalRecords,
          index: this.page.index,
        };

        let mappedArray = data?.map((item: any) => {

          return {
            Date: item?.acceptedOn,
            'Transaction ID': item?.transactionId,
            Requirement: this.findProductName(item?.requirementType),
            Country: item?.lCIssuanceCountry?.toUpperCase(),
            Amount: item?.lCValue?.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            Currency: item?.lCCurrency,
            Status: item?.transactionStatus,
          };
        });
        this.newDataSource = new MatTableDataSource(mappedArray);
      },
    });
  }
  findProductName(name:any){
    let product = this.productsTypes.find(
      (item: any) => item.value.toLowerCase() === name.toLowerCase()
    );
    return product.name.toUpperCase();
  }
  pagePrevious() {
    this.page.index = this.page.index - 1;
    this.fetchAcceptedTabel();
    // this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.fetchAcceptedTabel();
  }
  changeCountry() {
    let chartPayload = {
      product: this.selectedProduct,
      country: this.selectedCountry,
    };
    this.fetchProductAndCountry(chartPayload);
  }
  changeProduct() {
    let chartPayload = {
      product: this.selectedProduct,
      country: this.selectedCountry,
    };
    this.fetchProductAndCountry(chartPayload);
  }
  convertDate(epochTime: any) {
    const date = new Date(epochTime); // Multiply by 1000 to convert from seconds to milliseconds

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month starts from 0, so add 1
    const year = date.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) < this.page?.totalElements
        ? this.page.size * (this.page.index + 1)
        : this.page?.totalElements;
    if (this.page.index == 0) {
      if (this.page.size >= this.page.totalElements) {
        return `1 - ${this.page.totalElements}`;
      } else {
        return `1 - ${this.page.size}`;
      }
    } else {
      return `${this.page.index * this.page.size + 1} - ${this.last} `;
    }
  }
  selectLegend(type: any) {

    this.barChart.myChart.data.datasets[1].backgroundColor = ['yellow']

    if (type == 'available') {
      if (this.selectedLegend == 'available') {
        this.selectedLegend = 'none';
        this.barChart.myChart.data.datasets[0].backgroundColor = ['rgb(219, 68, 55)']
        this.barChart.myChart.data.datasets[1].backgroundColor = ['rgb(66, 133, 244)']
      } else {
        this.selectedLegend = 'available';
        this.barChart.myChart.data.datasets[0].backgroundColor = ['rgb(219, 68, 55)']
        this.barChart.myChart.data.datasets[1].backgroundColor = ['rgba(198, 218, 252 )']
      }
    }
    if (type == 'quote') {
      if (this.selectedLegend == 'quote') {
        this.selectedLegend = 'none';
        this.barChart.myChart.data.datasets[0].backgroundColor = ['rgb(219, 68, 55)']
        this.barChart.myChart.data.datasets[1].backgroundColor = ['rgba(66, 133, 244)']
      } else {
        this.selectedLegend = 'quote';
        this.barChart.myChart.data.datasets[0].backgroundColor = ['rgb(244, 199, 195)']
        this.barChart.myChart.data.datasets[1].backgroundColor = ['rgba(66, 133, 244)']
      }
    }
    this.barChart.myChart.update()
  }
  closeQuotation(e: any, transactionId: any) {
    if (e.value == 'Close') {
      const popup = this.dialog.open(CloseTransactionPopupComponent, {
        data: {
          transactionId: transactionId,
        },
      });

      popup.afterClosed().subscribe((res: any) => {
        this.selected = 'Open';
        this.fetchAcceptedTabel();
      });
    }
  }

  updateChart(type) { }
  checkAutomatedBank() {
    let user = localStorage.getItem('bankType') || ''
    if (user == "SECONDARY_AUTOMATED") {
      return true
    } else {
      return false
    }
  }
}
